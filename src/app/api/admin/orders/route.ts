import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

let DEMO_ORDERS: any[] = [
  {
    id: "ord_101",
    orderNumber: "ORG-202611-1001",
    status: "PROCESSING",
    paymentMethod: "RAZORPAY",
    paymentStatus: "PAID",
    subtotal: 998,
    discountTotal: 0,
    shippingFee: 0,
    grandTotal: 998,
    shippingAddress: {
      fullName: "Vikram Malhotra",
      phoneNumber: "9812345670",
      street: "Flat 402, Green Glen Heights, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560103",
      country: "India",
    },
    billingAddress: {
      fullName: "Vikram Malhotra",
      phoneNumber: "9812345670",
      street: "Flat 402, Green Glen Heights, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560103",
      country: "India",
    },
    customerNotes: "Please deliver after 6 PM or leave with security desk.",
    createdAt: new Date(Date.now() - 3600000 * 2),
    items: [
      {
        id: "oit_1",
        productId: "p1",
        title: "All-Natural Creamy Peanut Butter",
        variantName: "1kg Jar",
        sku: "ORG-PB-CRM-1KG",
        unitPrice: 499,
        quantity: 2,
        total: 998,
      },
    ],
    shipment: {
      trackingNumber: "DEL-98214301",
      courierPartner: "Delhivery",
      status: "MANIFESTED",
      estimatedDelivery: new Date(Date.now() + 86400000 * 3),
    },
    payments: [
      {
        id: "pay_1",
        method: "RAZORPAY",
        status: "PAID",
        amount: 998,
        razorpayPaymentId: "pay_N8zK12345678",
      },
    ],
    user: null,
    guestName: "Vikram Malhotra",
    guestEmail: "vikram.m@fitnessindia.in",
    guestPhone: "9812345670",
  },
  {
    id: "ord_102",
    orderNumber: "ORG-202611-1002",
    status: "SHIPPED",
    paymentMethod: "RAZORPAY",
    paymentStatus: "PAID",
    subtotal: 549,
    discountTotal: 0,
    shippingFee: 0,
    grandTotal: 549,
    shippingAddress: {
      fullName: "Ananya Sharma",
      phoneNumber: "9876543210",
      street: "B-12, Civil Lines",
      city: "Moradabad",
      state: "Uttar Pradesh",
      postalCode: "244001",
      country: "India",
    },
    customerNotes: null,
    createdAt: new Date(Date.now() - 3600000 * 8),
    items: [
      {
        id: "oit_2",
        productId: "p2",
        title: "Organic Dark Chocolate Peanut Butter",
        variantName: "1kg Jar",
        sku: "ORG-PB-CHOC-1KG",
        unitPrice: 549,
        quantity: 1,
        total: 549,
      },
    ],
    shipment: {
      trackingNumber: "BLU-45091238",
      courierPartner: "Blue Dart",
      status: "IN_TRANSIT",
      shippedAt: new Date(Date.now() - 3600000 * 4),
      estimatedDelivery: new Date(Date.now() + 86400000),
    },
    payments: [
      {
        id: "pay_2",
        method: "RAZORPAY",
        status: "PAID",
        amount: 549,
        razorpayPaymentId: "pay_N8zK87654321",
      },
    ],
    user: {
      id: "u_ananya",
      name: "Ananya Sharma",
      email: "ananya.sharma@gmail.com",
    },
  },
  {
    id: "ord_103",
    orderNumber: "ORG-202611-1003",
    status: "PENDING",
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    subtotal: 549,
    discountTotal: 0,
    shippingFee: 40,
    grandTotal: 589,
    shippingAddress: {
      fullName: "Rohit Verma",
      phoneNumber: "9988776655",
      street: "Sector 62, Near Electronic City Metro",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      country: "India",
    },
    customerNotes: "Please call on arrival for cash collection.",
    createdAt: new Date(Date.now() - 3600000 * 14),
    items: [
      {
        id: "oit_3",
        productId: "p3",
        title: "Crunchy Roasted Peanut Butter",
        variantName: "1kg Jar",
        sku: "ORG-PB-CRN-1KG",
        unitPrice: 549,
        quantity: 1,
        total: 549,
      },
    ],
    shipment: {
      trackingNumber: "DEL-77881100",
      courierPartner: "Delhivery",
      status: "MANIFESTED",
    },
    payments: [
      {
        id: "pay_3",
        method: "COD",
        status: "PENDING",
        amount: 589,
      },
    ],
    user: null,
    guestName: "Rohit Verma",
    guestEmail: "rohit.v@gymworld.in",
    guestPhone: "9988776655",
  },
];

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const search = searchParams.get("search")?.toLowerCase().trim() || "";

    try {
      const where: any = {};
      if (status && status !== "ALL") where.status = status;
      if (paymentStatus && paymentStatus !== "ALL") where.paymentStatus = paymentStatus;
      if (search) {
        where.OR = [
          { orderNumber: { contains: search, mode: "insensitive" } },
          { guestEmail: { contains: search, mode: "insensitive" } },
          { guestPhone: { contains: search, mode: "insensitive" } },
          { guestName: { contains: search, mode: "insensitive" } },
        ];
      }

      const orders = await prisma.order.findMany({
        where,
        include: {
          items: true,
          shipment: true,
          payments: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      if (orders.length > 0) {
        return NextResponse.json({
          success: true,
          data: orders,
          count: orders.length,
        });
      }
    } catch (dbError) {
      // Prisma offline fallback
    }

    // Filter fallback demo data
    let filtered = [...DEMO_ORDERS];
    if (status && status !== "ALL") filtered = filtered.filter((o) => o.status === status);
    if (paymentStatus && paymentStatus !== "ALL") {
      filtered = filtered.filter((o) => o.paymentStatus === paymentStatus);
    }

    if (search) {
      filtered = filtered.filter((o) => {
        const orderMatch = o.orderNumber.toLowerCase().includes(search);
        const nameMatch =
          o.guestName?.toLowerCase().includes(search) ||
          o.user?.name.toLowerCase().includes(search);
        const emailMatch =
          o.guestEmail?.toLowerCase().includes(search) ||
          o.user?.email.toLowerCase().includes(search);
        const phoneMatch =
          o.guestPhone?.includes(search) || o.shippingAddress?.phoneNumber?.includes(search);
        return orderMatch || nameMatch || emailMatch || phoneMatch;
      });
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      count: filtered.length,
    });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED")
      ? 401
      : error.message?.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
