import { NextRequest, NextResponse } from "next/server";
import { requireAuth, comparePassword, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();

    const currentPassword = String(body?.currentPassword || "");
    const newPassword = String(body?.newPassword || "");

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: "Current password is required." },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
      });

      if (user?.passwordHash) {
        const isMatch = await comparePassword(currentPassword, user.passwordHash);
        if (!isMatch) {
          return NextResponse.json(
            { success: false, error: "Incorrect current password." },
            { status: 400 }
          );
        }
      }

      const passwordHash = await hashPassword(newPassword);

      await prisma.user.update({
        where: { id: session.userId },
        data: { passwordHash },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: "PASSWORD_CHANGED",
          entityType: "User",
          entityId: session.userId,
        },
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

