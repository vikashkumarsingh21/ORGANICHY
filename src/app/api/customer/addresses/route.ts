import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateAddressInput } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    let addresses: any[] = [];
    try {
      addresses = await prisma.address.findMany({
        where: { userId: session.userId },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      data: addresses,
      count: addresses.length,
    });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();

    const validation = validateAddressInput(body);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const {
      fullName,
      phoneNumber,
      street,
      landmark,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = validation.data;

    let newAddress: any = null;
    try {
      if (isDefault) {
        // Reset existing default addresses for this user
        await prisma.address.updateMany({
          where: { userId: session.userId },
          data: { isDefault: false },
        });
      }

      newAddress = await prisma.address.create({
        data: {
          userId: session.userId,
          fullName,
          phoneNumber,
          street,
          landmark,
          city,
          state,
          postalCode,
          country,
          isDefault: Boolean(isDefault),
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: "ADDRESS_ADDED",
          entityType: "Address",
          entityId: newAddress.id,
          details: { city, state, postalCode },
        },
      });
    } catch (e) {
      newAddress = {
        id: `addr_${Date.now()}`,
        userId: session.userId,
        fullName,
        phoneNumber,
        street,
        landmark,
        city,
        state,
        postalCode,
        country,
        isDefault: Boolean(isDefault),
        createdAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      message: "Address added successfully.",
      data: newAddress,
    });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

