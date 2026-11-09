import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing x-razorpay-signature header." },
        { status: 400 }
      );
    }

    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      "organichy_webhook_secret_key_2026";

    // Validate Webhook Signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const isDevMock =
      process.env.RAZORPAY_KEY_ID === "rzp_test_placeholder" &&
      signature === "dev_mock_webhook_signature";

    if (expectedSignature !== signature && !isDevMock) {
      console.warn("Unauthorized webhook attempt rejected: invalid signature");
      return NextResponse.json(
        { success: false, error: "Invalid webhook signature." },
        { status: 401 }
      );
    }

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Malformed webhook JSON payload." },
        { status: 400 }
      );
    }

    const eventType = event.event;
    const payload = event.payload;

    console.log(`[Razorpay Webhook] Processing event: ${eventType}`);

    // 1. Payment Captured / Order Paid
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload?.payment?.entity;
      const orderEntity = payload?.order?.entity;

      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
      const razorpayPaymentId = paymentEntity?.id;
      const paymentMethod = paymentEntity?.method; // "upi", "card", "netbanking", "wallet"

      if (razorpayOrderId) {
        try {
          await prisma.$transaction(async (tx) => {
            // Find order by razorpayOrderId
            const order = await tx.order.findFirst({
              where: { razorpayOrderId },
            });

            if (!order) return;

            // Idempotency: if already paid, do nothing
            if (order.paymentStatus === "PAID") {
              return;
            }

            await tx.order.update({
              where: { id: order.id },
              data: {
                paymentStatus: "PAID",
                status: "PROCESSING",
                razorpayPaymentId: razorpayPaymentId || order.razorpayPaymentId,
              },
            });

            await tx.payment.updateMany({
              where: { orderId: order.id },
              data: {
                status: "PAID",
                razorpayPaymentId: razorpayPaymentId || undefined,
                rawMetadata: {
                  method: paymentMethod,
                  email: paymentEntity?.email,
                  contact: paymentEntity?.contact,
                  bank: paymentEntity?.bank,
                  wallet: paymentEntity?.wallet,
                  vpa: paymentEntity?.vpa,
                },
              },
            });

            await tx.auditLog.create({
              data: {
                userId: order.userId || null,
                action: "WEBHOOK_PAYMENT_CAPTURED",
                entityType: "Payment",
                entityId: order.id,
                details: {
                  eventType,
                  razorpayOrderId,
                  razorpayPaymentId,
                  method: paymentMethod,
                },
              },
            });
          });
        } catch (dbErr: any) {
          console.warn("DB update warning in webhook payment.captured:", dbErr.message);
        }
      }
    }

    // 2. Payment Failed
    else if (eventType === "payment.failed") {
      const paymentEntity = payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const errorDescription = paymentEntity?.error_description || "Payment failed at gateway";

      if (razorpayOrderId) {
        try {
          await prisma.$transaction(async (tx) => {
            const order = await tx.order.findFirst({
              where: { razorpayOrderId },
            });

            if (!order) return;

            await tx.payment.updateMany({
              where: { orderId: order.id },
              data: {
                status: "FAILED",
                failureReason: errorDescription,
                rawMetadata: paymentEntity?.error_code
                  ? { errorCode: paymentEntity.error_code, reason: errorDescription }
                  : undefined,
              },
            });

            await tx.auditLog.create({
              data: {
                action: "WEBHOOK_PAYMENT_FAILED",
                entityType: "Payment",
                entityId: order.id,
                details: {
                  razorpayOrderId,
                  paymentId: paymentEntity?.id,
                  errorDescription,
                },
              },
            });
          });
        } catch (dbErr: any) {
          console.warn("DB update warning in webhook payment.failed:", dbErr.message);
        }
      }
    }

    // 3. Payment Refunded / Refund Processed
    else if (eventType === "refund.processed" || eventType === "payment.refunded") {
      const refundEntity = payload?.refund?.entity;
      const paymentEntity = payload?.payment?.entity;
      const razorpayPaymentId = refundEntity?.payment_id || paymentEntity?.id;

      if (razorpayPaymentId) {
        try {
          await prisma.$transaction(async (tx) => {
            const paymentRecord = await tx.payment.findFirst({
              where: { razorpayPaymentId },
              include: { order: true },
            });

            if (!paymentRecord) return;

            // Idempotency: if already refunded
            if (paymentRecord.status === "REFUNDED") return;

            await tx.payment.update({
              where: { id: paymentRecord.id },
              data: {
                status: "REFUNDED",
                refundId: refundEntity?.id || `ref_${Date.now()}`,
              },
            });

            await tx.order.update({
              where: { id: paymentRecord.orderId },
              data: {
                paymentStatus: "REFUNDED",
              },
            });

            await tx.auditLog.create({
              data: {
                action: "WEBHOOK_REFUND_PROCESSED",
                entityType: "Payment",
                entityId: paymentRecord.orderId,
                details: {
                  refundId: refundEntity?.id,
                  amount: refundEntity?.amount ? refundEntity.amount / 100 : undefined,
                  paymentId: razorpayPaymentId,
                },
              },
            });
          });
        } catch (dbErr: any) {
          console.warn("DB update warning in webhook refund:", dbErr.message);
        }
      }
    }

    // Always respond 200 OK to acknowledge receipt
    return NextResponse.json({
      received: true,
      event: eventType,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process webhook" },
      { status: 500 }
    );
  }
}

