import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signAuthToken, setAuthCookie } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { validateLoginInput } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`admin-login:${ip}`, {
      keyPrefix: "admin-login",
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many administrative login attempts. Locked for security. Try again after ${rateLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = validateLoginInput(body);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.errors },
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

    // Check seed credentials if DB is unmigrated or empty
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
    } else if (user) {
      // STRICT ADMIN CHECK: Customers are blocked here!
      if (user.role !== "ADMIN") {
        return NextResponse.json(
          {
            success: false,
            error: "Access Denied: This administrative console is strictly restricted to verified ORGANICHY managers.",
          },
          { status: 403 }
        );
      }

      if (user.passwordHash) {
        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) {
          return NextResponse.json(
            { success: false, error: "Invalid administrative credentials." },
            { status: 401 }
          );
        }
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid administrative credentials." },
        { status: 401 }
      );
    }

    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: "ADMIN",
    });

    setAuthCookie(token);

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "ADMIN_LOGIN_SUCCESS",
          entityType: "User",
          entityId: user.id,
          ipAddress: ip,
          details: { email },
        },
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: "Administrator authentication successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "ADMIN",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to authenticate administrator" },
      { status: 500 }
    );
  }
}

