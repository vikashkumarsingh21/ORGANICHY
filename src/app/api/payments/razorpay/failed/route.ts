import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, razorpayOrderId, errorCode, errorDescription } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required orderId" },
        { status: 400 }
      );
    }

    try {
      await prisma.$transaction(async (tx) => {
        // Update payment record with failure reason
        await tx.payment.updateMany({
          where: { orderId },
          data: {
            status: "FAILED",
            failureReason: `${errorCode || "PAYMENT_FAILED"}: ${errorDescription || "Customer payment failed or was declined"}`,
          },
        });

        // Record audit log
        await tx.auditLog.create({
          data: {
            action: "PAYMENT_FAILED",
            entityType: "Payment",
            entityId: orderId,
            details: {
              razorpayOrderId,
              errorCode,
              errorDescription,
              failedAt: new Date().toISOString(),
            },
          },
        });
      });
    } catch (dbErr: any) {
      console.warn("DB update warning in payment failure handler:", dbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Payment failure recorded. Customer may re-attempt payment.",
    });
  } catch (error: any) {
    console.error("API POST /api/payments/razorpay/failed error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to log payment failure" },
      { status: 500 }
    );
  }
}

