import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json(
        { success: false, authenticated: false, user: null },
        { status: 401 }
      );
    }

    let userDetails = null;
    try {
      userDetails = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          addresses: { orderBy: { isDefault: "desc" } },
          orders: {
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { items: true },
          },
        },
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: session.userId,
        name: userDetails?.name || session.name,
        email: session.email,
        role: session.role,
        phone: userDetails?.phone,
        addresses: userDetails?.addresses || [],
        recentOrders: userDetails?.orders || [],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch user session" },
      { status: 500 }
    );
  }
}

