import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let settings = null;
    try {
      settings = await prisma.websiteSettings.findUnique({
        where: { id: "default_settings" },
      });
    } catch (e) {}

    if (!settings) {
      settings = {
        id: "default_settings",
        storeName: "ORGANICHY",
        tagline: "Pure Nutrition for Active Lifestyles",
        founderName: "Sourav",
        founderLocation: "Moradabad, Uttar Pradesh, India",
        supportEmail: "care@organichy.com",
        supportPhone: "+91 98765 43210",
        whatsappNumber: "+91 98765 43210",
        freeShippingThreshold: 499,
        standardShippingFee: 49,
        codFee: 40,
        isCodEnabled: true,
        announcementText: "🌱 FREE All-India Shipping on orders above ₹499 | 100% Pure & Freshly Roasted",
        isAnnouncementActive: true,
      };
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();

    try {
      const updated = await prisma.websiteSettings.upsert({
        where: { id: "default_settings" },
        update: {
          ...body,
          updatedAt: new Date(),
        },
        create: {
          id: "default_settings",
          ...body,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.userId,
          action: "UPDATE_WEBSITE_SETTINGS",
          entityType: "WebsiteSettings",
          entityId: "default_settings",
          details: body,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Website settings updated successfully",
        data: updated,
      });
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: e.message || "Failed to save settings" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED")
      ? 401
      : error.message?.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

