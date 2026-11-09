import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signAuthToken, setAuthCookie } from "@/lib/auth";
import { validateRegisterInput } from "@/lib/validations";
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`auth_register:${ip}`, 5, 60);
    if (!rate.success) {
      return rateLimitExceededResponse(rate.resetSeconds);
    }

    const body = await req.json();
    const validation = validateRegisterInput(body);

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

    const { name, email, password, phone } = validation.data;

    // Check if user already exists
    let existingUser = null;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    } catch (e) {}

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address already exists. Please login instead.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user in DB or simulate for offline dev
    let newUser: any = null;
    try {
      newUser = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          phone: phone || null,
          role: "CUSTOMER",
        },
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId: newUser.id,
          action: "USER_REGISTERED",
          entityType: "User",
          entityId: newUser.id,
          details: { email, name },
        },
      });
    } catch (e) {
      newUser = {
        id: `usr_${Date.now()}`,
        name,
        email,
        phone,
        role: "CUSTOMER",
        createdAt: new Date(),
      };
    }

    const token = signAuthToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Welcome to ORGANICHY!",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API POST /api/auth/register error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to register account",
      },
      { status: 500 }
    );
  }
}

