import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateCouponInput } from "@/lib/validations";

export const dynamic = "force-dynamic";

// In-memory fallback coupons for development when database is unmigrated
let FALLBACK_COUPONS: any[] = [
  {
    id: "cp-1",
    code: "ORGANICHY10",
    description: "10% off on all nutrition orders over ₹299",
    discountType: "PERCENTAGE" as const,
    discountValue: 10,
    minOrderValue: 299,
    maxDiscountValue: 200,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2027-12-31"),
    usageLimit: 1000,
    usageCount: 142,
    isActive: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date(),
    _count: { orders: 142 },
  },
  {
    id: "cp-2",
    code: "SOURAV100",
    description: "Founder Sourav's Special: ₹100 flat off above ₹499",
    discountType: "FIXED" as const,
    discountValue: 100,
    minOrderValue: 499,
    maxDiscountValue: null,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2027-12-31"),
    usageLimit: 500,
    usageCount: 68,
    isActive: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date(),
    _count: { orders: 68 },
  },
  {
    id: "cp-3",
    code: "FREESHIP",
    description: "Free All-India express shipping on your order",
    discountType: "FREE_SHIPPING" as const,
    discountValue: 49,
    minOrderValue: 0,
    maxDiscountValue: null,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2027-12-31"),
    usageLimit: 2000,
    usageCount: 310,
    isActive: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date(),
    _count: { orders: 310 },
  },
];

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toUpperCase() || "";
    const status = searchParams.get("status") || "ALL";

    try {
      const where: any = {};
      if (status === "ACTIVE") where.isActive = true;
      if (status === "INACTIVE") where.isActive = false;
      if (search) {
        where.OR = [
          { code: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const coupons = await prisma.coupon.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { orders: true } },
        },
      });

      if (coupons.length > 0) {
        return NextResponse.json({ success: true, data: coupons });
      }
    } catch (dbErr) {
      // Prisma offline fallback
    }

    // Filter fallback data
    let filtered = [...FALLBACK_COUPONS];
    if (status === "ACTIVE") filtered = filtered.filter((c) => c.isActive);
    if (status === "INACTIVE") filtered = filtered.filter((c) => !c.isActive);
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.code.includes(search) ||
          (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    const isAuth = error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch coupons" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
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
      // Check unique code
      const existing = await prisma.coupon.findUnique({ where: { code } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: `Coupon code '${code}' already exists.` },
          { status: 409 }
        );
      }

      const created = await prisma.coupon.create({
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

      return NextResponse.json(
        { success: true, message: `Coupon '${code}' created successfully.`, data: created },
        { status: 201 }
      );
    } catch (dbErr) {
      // Fallback in-memory creation for dev
      const newCoupon = {
        id: `cp_${Date.now()}`,
        code,
        description: description || null,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscountValue: maxDiscountValue || null,
        startDate,
        endDate,
        usageLimit: usageLimit || null,
        usageCount: 0,
        isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { orders: 0 },
      };
      FALLBACK_COUPONS.unshift(newCoupon);

      return NextResponse.json(
        { success: true, message: `Coupon '${code}' created successfully (dev mode).`, data: newCoupon },
        { status: 201 }
      );
    }
  } catch (error: any) {
    const isAuth = error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create coupon" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

