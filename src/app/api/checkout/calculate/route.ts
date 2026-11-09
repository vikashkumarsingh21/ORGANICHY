import { NextRequest, NextResponse } from "next/server";
import { CatalogService } from "@/lib/catalogService";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, couponCode, paymentMethod } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    const calculated = await CatalogService.calculateOrder(
      items,
      couponCode,
      paymentMethod || "RAZORPAY"
    );

    let isCodEnabled = true;
    try {
      const settings = await prisma.websiteSettings.findUnique({
        where: { id: "default_settings" },
      });
      if (settings) {
        isCodEnabled = settings.isCodEnabled;
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      data: {
        ...calculated,
        isCodEnabled,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate order" },
      { status: 400 }
    );
  }
}

