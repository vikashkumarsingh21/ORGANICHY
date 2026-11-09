import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);
    const orderId = params.id;

    let order: any = null;
    try {
      order = await prisma.order.findFirst({
        where: {
          id: orderId,
          ...(session.role !== "ADMIN" ? { userId: session.userId } : {}),
        },
        include: {
          items: {
            include: {
              product: {
                include: { images: true },
              },
            },
          },
          shipment: true,
          payments: true,
        },
      });
    } catch (e) {}

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

