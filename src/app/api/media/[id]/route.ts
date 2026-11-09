import { NextRequest, NextResponse } from "next/server";
import { MediaService } from "@/lib/mediaService";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await MediaService.getById(params.id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Media item not found" },
        { status: 404 }
      );
    }

    const usage = await MediaService.checkUsage(params.id);

    return NextResponse.json({
      success: true,
      data: item,
      usage,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch media item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const updated = await MediaService.update(params.id, {
      title: body.title,
      altText: body.altText,
      folder: body.folder,
      tags: body.tags,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Media item not found for update" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Media metadata updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update media item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";

    const usage = await MediaService.checkUsage(params.id);

    if (usage.inUse && !force) {
      return NextResponse.json(
        {
          success: false,
          error: "IMAGE_IN_USE",
          message: `Cannot delete image because it is currently assigned to: ${usage.locations.join(
            ", "
          )}. Unassign it first or confirm force deletion.`,
          locations: usage.locations,
        },
        { status: 409 }
      );
    }

    const deleted = await MediaService.delete(params.id, force);

    return NextResponse.json({
      success: true,
      message: "Media asset deleted successfully from Cloudinary and database",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete media asset" },
      { status: 500 }
    );
  }
}

