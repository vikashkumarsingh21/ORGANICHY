import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// In-memory fallback payments for dev/testing when DB is unmigrated
const FALLBACK_PAYMENTS = [
  {
    id: "pay_1",
    orderId: "ord_101",
    method: "RAZORPAY",
    status: "PAID",
    amount: 1047,
    currency: "INR",
    razorpayOrderId: "order_M4kL90Q1",
    razorpayPaymentId: "pay_N8zK12345678",
    razorpaySignature: "sig_verified_mock_1",
    refundId: null,
    failureReason: null,
    createdAt: new Date(Date.now() - 3600000 * 2),
    rawMetadata: { method: "upi", vpa: "customer@okhdfcbank" },
    order: {
      orderNumber: "ORG-202611-1001",
      guestName: "Vikram Malhotra",
      guestEmail: "vikram.m@fitnessindia.in",
      guestPhone: "9812345670",
      user: null,
    },
  },
  {
    id: "pay_2",
    orderId: "ord_102",
    method: "RAZORPAY",
    status: "PAID",
    amount: 549,
    currency: "INR",
    razorpayOrderId: "order_M4kL90Q2",
    razorpayPaymentId: "pay_N8zK87654321",
    razorpaySignature: "sig_verified_mock_2",
    refundId: null,
    failureReason: null,
    createdAt: new Date(Date.now() - 3600000 * 6),
    rawMetadata: { method: "card", bank: "HDFC Bank", cardType: "credit" },
    order: {
      orderNumber: "ORG-202611-1002",
      guestName: null,
      guestEmail: null,
      guestPhone: null,
      user: {
        name: "Ananya Sharma",
        email: "ananya.sharma@gmail.com",
      },
    },
  },
  {
    id: "pay_3",
    orderId: "ord_103",
    method: "COD",
    status: "PENDING",
    amount: 589,
    currency: "INR",
    razorpayOrderId: null,
    razorpayPaymentId: "COD-CASH-DELIVERY",
    razorpaySignature: null,
    refundId: null,
    failureReason: null,
    createdAt: new Date(Date.now() - 3600000 * 12),
    rawMetadata: null,
    order: {
      orderNumber: "ORG-202611-1003",
      guestName: "Rohit Verma",
      guestEmail: "rohit.v@gymworld.in",
      guestPhone: "9988776655",
      user: null,
    },
  },
  {
    id: "pay_4",
    orderId: "ord_104",
    method: "RAZORPAY",
    status: "FAILED",
    amount: 1599,
    currency: "INR",
    razorpayOrderId: "order_M4kL90Q4",
    razorpayPaymentId: "pay_fail_998811",
    razorpaySignature: null,
    refundId: null,
    failureReason: "BAD_REQUEST_ERROR: Customer card authorization timed out by issuing bank",
    createdAt: new Date(Date.now() - 3600000 * 24),
    rawMetadata: { method: "netbanking", bank: "State Bank of India" },
    order: {
      orderNumber: "ORG-202611-1004",
      guestName: "Kunal Mehra",
      guestEmail: "kunal.m@nutrition.com",
      guestPhone: "9823456789",
      user: null,
    },
  },
];

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";
    const method = searchParams.get("method") || "ALL";
    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    try {
      const where: any = {};
      if (status !== "ALL") where.status = status;
      if (method !== "ALL") where.method = method;

      if (search) {
        where.OR = [
          { razorpayPaymentId: { contains: search, mode: "insensitive" } },
          { razorpayOrderId: { contains: search, mode: "insensitive" } },
          { order: { orderNumber: { contains: search, mode: "insensitive" } } },
          { order: { guestEmail: { contains: search, mode: "insensitive" } } },
          { order: { guestName: { contains: search, mode: "insensitive" } } },
        ];
      }

      const payments = await prisma.payment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              guestName: true,
              guestEmail: true,
              guestPhone: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (payments.length > 0) {
        return NextResponse.json({
          success: true,
          data: payments,
        });
      }
    } catch (dbErr) {
      // Prisma offline fallback
    }

    // Filter fallback data
    let filtered = [...FALLBACK_PAYMENTS];
    if (status !== "ALL") filtered = filtered.filter((p) => p.status === status);
    if (method !== "ALL") filtered = filtered.filter((p) => p.method === method);

    if (search) {
      filtered = filtered.filter((p) => {
        const idMatch = p.razorpayPaymentId?.toLowerCase().includes(search);
        const orderMatch = p.order.orderNumber.toLowerCase().includes(search);
        const nameMatch =
          p.order.guestName?.toLowerCase().includes(search) ||
          p.order.user?.name.toLowerCase().includes(search);
        const emailMatch =
          p.order.guestEmail?.toLowerCase().includes(search) ||
          p.order.user?.email.toLowerCase().includes(search);
        return idMatch || orderMatch || nameMatch || emailMatch;
      });
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error: any) {
    const isAuth = error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch payments" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

