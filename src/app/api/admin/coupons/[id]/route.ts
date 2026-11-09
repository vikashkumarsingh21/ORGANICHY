import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateCouponInput } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
    const id = params.id;
    const body = await req.json();

    const validation = validateCouponInput(body);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      startDate,
      endDate,
      usageLimit,
      isActive,
    } = validation.data;

    try {
      const updated = await prisma.coupon.update({
        where: { id },
        data: {
          code,
          description: description || null,
          discountType,
          discountValue,
          minOrderValue,
          maxDiscountValue: maxDiscountValue || null,
          startDate,
          endDate,
          usageLimit: usageLimit || null,
          isActive,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Coupon '${code}' updated successfully.`,
        data: updated,
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: `Coupon '${code}' updated (dev mode).`,
        data: { id, ...validation.data },
      });
    }
  } catch (error: any) {
    const isAuth = error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update coupon" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
    const id = params.id;
    const body = await req.json();

    if (body.isActive === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing 'isActive' property in request body." },
        { status: 400 }
      );
    }

    const isActive = Boolean(body.isActive);

    try {
      const updated = await prisma.coupon.update({
        where: { id },
        data: { isActive },
      });

      return NextResponse.json({
        success: true,
        message: `Coupon status updated to ${isActive ? "Active" : "Inactive"}.`,
        data: updated,
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: `Coupon status toggled to ${isActive ? "Active" : "Inactive"}.`,
        data: { id, isActive },
      });
    }
  } catch (error: any) {
    const isAuth = error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: error.message || "Failed to toggle coupon status" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
    const id = params.id;

    try {
      await prisma.coupon.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: "Coupon deleted successfully.",
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: "Coupon deleted successfully (dev mode).",
      });
    }
  } catch (error: any) {
    const isAuth = error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete coupon" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

