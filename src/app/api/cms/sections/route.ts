import { NextRequest, NextResponse } from "next/server";
import { CmsService } from "@/lib/cmsService";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/cms/sections
 * Optional query params:
 * - ?page=home | about | story | faq | contact | footer | seo | global
 * - ?key=home_hero_banner
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || undefined;
    const key = searchParams.get("key");

    if (key) {
      const section = await CmsService.getSectionByKey(key);
      if (!section) {
        return NextResponse.json(
          { success: false, error: `Section '${key}' not found` },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: section,
      });
    }

    const sections = await CmsService.getAllSections(page);
    return NextResponse.json({
      success: true,
      data: sections,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch website sections" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cms/sections
 * Create a new website section (Admin Only)
 */
export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const { sectionKey, page = "home", title } = body;

    if (!sectionKey || !title) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: sectionKey and title" },
        { status: 400 }
      );
    }

    const existing = await CmsService.getSectionByKey(sectionKey);
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Section with key '${sectionKey}' already exists` },
        { status: 409 }
      );
    }

    const created = await CmsService.upsertSection(body);
    return NextResponse.json({
      success: true,
      message: `Section '${sectionKey}' created successfully`,
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create section" },
      { status: error.status || 500 }
    );
  }
}

/**
 * PUT /api/cms/sections
 * Update an existing website section (Admin Only)
 */
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const { sectionKey, mediaItemId, customUrl } = body;

    if (!sectionKey) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: sectionKey" },
        { status: 400 }
      );
    }

    // Support legacy/media assignment payloads as well as full updates
    const updatePayload = {
      ...body,
      mediaAssetId: mediaItemId !== undefined ? mediaItemId : body.mediaAssetId,
      fallbackUrl: customUrl !== undefined ? customUrl : body.fallbackUrl,
    };

    const updated = await CmsService.upsertSection(updatePayload);

    return NextResponse.json({
      success: true,
      message: `Section '${sectionKey}' updated and published successfully`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update website section" },
      { status: error.status || 500 }
    );
  }
}

/**
 * PATCH /api/cms/sections
 * Quick actions: toggle active status or bulk reorder (Admin Only)
 */
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const { action, sectionKey, isActive, reorder } = body;

    if (action === "toggle_status" && sectionKey) {
      await CmsService.toggleSectionStatus(sectionKey, !!isActive);
      return NextResponse.json({
        success: true,
        message: `Section '${sectionKey}' visibility updated to ${isActive ? "Published" : "Hidden"}`,
      });
    }

    if (action === "reorder" && Array.isArray(reorder)) {
      await CmsService.reorderSections(reorder);
      return NextResponse.json({
        success: true,
        message: "Sections reordered successfully",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action or parameters for PATCH" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to patch section" },
      { status: error.status || 500 }
    );
  }
}

/**
 * DELETE /api/cms/sections
 * Delete custom section (Admin Only)
 */
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const sectionKey = searchParams.get("key");

    if (!sectionKey) {
      return NextResponse.json(
        { success: false, error: "Missing sectionKey parameter" },
        { status: 400 }
      );
    }

    await CmsService.deleteSection(sectionKey);
    return NextResponse.json({
      success: true,
      message: `Section '${sectionKey}' deleted successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete section" },
      { status: error.status || 500 }
    );
  }
}
