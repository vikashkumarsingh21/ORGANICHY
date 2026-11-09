import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPasswordResetToken, hashPassword } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`reset-pwd:${ip}`, {
      keyPrefix: "reset-pwd",
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many password reset attempts. Please wait ${rateLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const token = body?.token ? String(body.token).trim() : "";
    const newPassword = body?.newPassword ? String(body.newPassword) : "";

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Password reset token is required." },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const tokenPayload = verifyPasswordResetToken(token);
    if (!tokenPayload) {
      return NextResponse.json(
        {
          success: false,
          error: "The password reset link is invalid or has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    try {
      const user = await prisma.user.findUnique({
        where: { email: tokenPayload.email },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash },
        });

        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "PASSWORD_RESET_COMPLETED",
            entityType: "User",
            entityId: user.id,
            details: { email: tokenPayload.email },
          },
        });
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. You can now log in with your new password.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}

