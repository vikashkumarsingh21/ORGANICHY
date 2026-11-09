import { NextRequest, NextResponse } from "next/server";
import { CatalogService } from "@/lib/catalogService";
import { validateCheckoutInput } from "@/lib/validations";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`checkout_order:${ip}`, 15, 60);
    if (!rate.success) {
      return rateLimitExceededResponse(rate.resetSeconds);
    }

    const body = await req.json();
    const validation = validateCheckoutInput(body);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Checkout validation failed",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      customerNotes,
      couponCode,
      guestEmail,
      guestPhone,
      guestName,
    } = validation.data;

    // Check if COD is disabled by admin
    if (paymentMethod === "COD") {
      try {
        const settings = await prisma.websiteSettings.findUnique({
          where: { id: "default_settings" },
        });
        if (settings && !settings.isCodEnabled) {
          return NextResponse.json(
            {
              success: false,
              error: "Cash on Delivery is currently disabled by store administration. Please pay online with Razorpay/UPI.",
            },
            { status: 400 }
          );
        }
      } catch (e) {}
    }

    // Check session
    const session = await getSessionUser(req);

    // Recompute order totals server-side
    const calculated = await CatalogService.calculateOrder(
      items,
      couponCode,
      paymentMethod
    );

    let razorpayOrderId: string | undefined = undefined;

    // If Razorpay chosen, create gateway order
    if (paymentMethod === "RAZORPAY") {
      try {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (keyId && keySecret && keyId !== "rzp_test_placeholder") {
          const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
          });

          const rzpOrder = await razorpay.orders.create({
            amount: Math.round(calculated.grandTotal * 100), // in paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            notes: {
              customerEmail: session?.email || guestEmail || "",
              customerName: session?.name || guestName || shippingAddress.fullName,
            },
          });

          razorpayOrderId = rzpOrder.id;
        } else {
          // Dev mock order ID for testing when placeholder keys are used
          razorpayOrderId = `order_dev_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        }
      } catch (rzpErr: any) {
        console.warn("Razorpay API init warning (using mock gateway):", rzpErr.message);
        razorpayOrderId = `order_mock_${Date.now()}`;
      }
    }

    // Persist to Database with transactional integrity
    const order = await CatalogService.createDatabaseOrder({
      calculated,
      shippingAddress,
      billingAddress,
      paymentMethod,
      customerNotes,
      userId: session?.userId,
      guestEmail,
      guestPhone,
      guestName,
      razorpayOrderId,
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        grandTotal: calculated.grandTotal,
        paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        shippingAddress,
        items: calculated.items,
        razorpayOrderId,
        razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
      },
    });
  } catch (error: any) {
    console.error("API POST /api/checkout/order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process order" },
      { status: 500 }
    );
  }
}

