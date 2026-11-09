import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateAddressInput } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);
    const addressId = params.id;
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

    try {
      if (isDefault) {
        await prisma.address.updateMany({
          where: { userId: session.userId },
          data: { isDefault: false },
        });
      }

      const updated = await prisma.address.update({
        where: { id: addressId, userId: session.userId },
        data: {
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

      return NextResponse.json({
        success: true,
        message: "Address updated successfully.",
        data: updated,
      });
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: e.message || "Failed to update address" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);
    const addressId = params.id;

    try {
      await prisma.address.deleteMany({
        where: { id: addressId, userId: session.userId },
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

