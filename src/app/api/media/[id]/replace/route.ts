import { NextRequest, NextResponse } from "next/server";
import { MediaService } from "@/lib/mediaService";
import { requireAdmin } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No replacement file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const replaced = await MediaService.replace(params.id, buffer);

    return NextResponse.json({
      success: true,
      message: "Image file replaced successfully. Website sections using this image are now updated.",
      data: replaced,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to replace image asset" },
      { status: 500 }
    );
  }
}

