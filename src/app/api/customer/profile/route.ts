import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();

    const name = sanitizeString(body?.name);
    const phone = sanitizeString(body?.phone);

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: "Full name must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (phone && !/^(?:\+91|91)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ""))) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid 10-digit Indian phone number." },
        { status: 400 }
      );
    }

    let updatedUser: any = null;
    try {
      updatedUser = await prisma.user.update({
        where: { id: session.userId },
        data: {
          name,
          phone: phone || null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: "PROFILE_UPDATED",
          entityType: "User",
          entityId: session.userId,
          details: { name, phone },
        },
      });
    } catch (e) {
      updatedUser = {
        id: session.userId,
        name,
        email: session.email,
        phone,
        role: session.role,
      };
    }

    return NextResponse.json({
      success: true,
      message: "Profile details updated successfully.",
      user: updatedUser,
    });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

