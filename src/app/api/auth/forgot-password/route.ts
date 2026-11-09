import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`forgot-pwd:${ip}`, {
      keyPrefix: "forgot-pwd",
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many password reset requests. Please try again after ${rateLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = body?.email ? String(body.email).toLowerCase().trim() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    let userExists = false;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) userExists = true;
    } catch (e) {}

    // Allow test accounts in development
    if (email === "vikram.athlete@gmail.com" || email === "admin@organichy.com") {
      userExists = true;
    }

    const token = generatePasswordResetToken(email);
    const resetUrl = `/reset-password?token=${encodeURIComponent(token)}`;

    // In production, an email with nodemailer/resend would be sent.
    // For local dev, we return the reset link directly for testing convenience.
    return NextResponse.json({
      success: true,
      message: "If an account is associated with this email, a password reset link has been generated.",
      resetUrl, // Provided for instant testing
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process forgot password request" },
      { status: 500 }
    );
  }
}

