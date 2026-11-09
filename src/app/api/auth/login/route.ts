import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signAuthToken, setAuthCookie } from "@/lib/auth";
import { validateLoginInput } from "@/lib/validations";
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Protection (Brute Force Defense)
    const ip = getClientIp(req);
    const rate = checkRateLimit(`auth_login:${ip}`, 10, 60);
    if (!rate.success) {
      return rateLimitExceededResponse(rate.resetSeconds);
    }

    const body = await req.json();
    const validation = validateLoginInput(body);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (e) {}

    // Fallback demo authentication if DB is in dev/unseeded state
    const envAdminEmail = process.env.ADMIN_EMAIL || "admin@organichy.com";
    const envAdminPass = process.env.ADMIN_PASSWORD;
    const isDev = process.env.NODE_ENV !== "production";

    const matchesFallbackAdmin =
      email === envAdminEmail &&
      ((envAdminPass && password === envAdminPass) ||
        (isDev && (password === "OrganichyAdmin@2026" || password === "OrganichySecureAdmin2026!")));

    if (!user && matchesFallbackAdmin) {
      user = {
        id: "usr_admin_sourav",
        name: process.env.ADMIN_NAME || "Sourav (Founder)",
        email: envAdminEmail,
        role: "ADMIN",
        phone: "+91 98765 43210",
      };
    } else if (!user && isDev && email === "vikram.athlete@gmail.com" && password === "Password@123") {
      user = {
        id: "usr_customer_vikram",
        name: "Vikram Athlete",
        email: "vikram.athlete@gmail.com",
        role: "CUSTOMER",
        phone: "+91 98765 12345",
      };
    } else if (user && user.passwordHash) {
      const isMatch = await comparePassword(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password credentials." },
          { status: 401 }
        );
      }
    } else if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password credentials." },
        { status: 401 }
      );
    }

    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    setAuthCookie(token);

    // Record login audit log if DB connected
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "USER_LOGIN",
          entityType: "User",
          entityId: user.id,
          details: { email },
        },
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("API POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to log in" },
      { status: 500 }
    );
  }
}

