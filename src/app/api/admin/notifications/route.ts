import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

let DEMO_NOTIFICATIONS = [
  {
    id: "notif_1",
    type: "ORDER",
    title: "New High-Value Order Received",
    message: "Order #ORG-202611-1003 placed by Rohan Gupta for ₹1,497 (3 Jars). Ready for kitchen roasting.",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    linkUrl: "/admin/orders",
  },
  {
    id: "notif_2",
    type: "INVENTORY",
    title: "Low Stock Alert: Dark Chocolate 1kg",
    message: "Current stock has dropped to 9 units (Threshold: 15). Batch replenishment recommended at Moradabad kitchen.",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    linkUrl: "/admin/inventory",
  },
  {
    id: "notif_3",
    type: "PAYMENT",
    title: "Razorpay Webhook Verified",
    message: "Payment captured successfully for order #ORG-202611-1001 (₹998) via UPI.",
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    linkUrl: "/admin/payments",
  },
  {
    id: "notif_4",
    type: "SHIPPING",
    title: "Delhivery AWB Assigned",
    message: "Shipment manifested for Order #ORG-202611-1002 (AWB: DEL-98214302).",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    linkUrl: "/admin/orders",
  },
];

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    return NextResponse.json({
      success: true,
      data: DEMO_NOTIFICATIONS,
      unreadCount: DEMO_NOTIFICATIONS.filter((n) => !n.isRead).length,
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

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const { id, markAllRead } = body;

    if (markAllRead) {
      DEMO_NOTIFICATIONS.forEach((n) => (n.isRead = true));
    } else if (id) {
      const n = DEMO_NOTIFICATIONS.find((item) => item.id === id);
      if (n) n.isRead = true;
    }

    return NextResponse.json({ success: true, message: "Notifications updated." });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED")
      ? 401
      : error.message?.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const { title, message, type, linkUrl } = body;

    const newNotif = {
      id: `notif_${Date.now()}`,
      type: type || "BROADCAST",
      title,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
      linkUrl: linkUrl || "/admin",
    };

    DEMO_NOTIFICATIONS.unshift(newNotif);

    return NextResponse.json({
      success: true,
      message: "Notification broadcasted successfully.",
      data: newNotif,
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

