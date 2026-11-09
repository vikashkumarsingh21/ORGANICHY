import { NextRequest, NextResponse } from "next/server";
import { MediaService, MEDIA_CATEGORIES } from "@/lib/mediaService";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") || "ALL";
    const search = searchParams.get("search") || "";

    const mediaList = await MediaService.getAll({ folder, search });

    return NextResponse.json({
      success: true,
      categories: MEDIA_CATEGORIES,
      count: mediaList.length,
      data: mediaList,
    });
  } catch (error: any) {
    console.error("API GET /api/media error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch media assets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Enforce administrative authorization
    await requireAdmin(req);

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "Other Website Images";
    const customTitle = formData.get("title") as string | null;
    const customAlt = formData.get("altText") as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No image files provided for upload" },
        { status: 400 }
      );
    }

    const uploadedAssets = [];

    for (const file of files) {
      // Validate Mime Type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `File '${file.name}' has invalid type (${file.type}). Allowed: JPG, PNG, WEBP, AVIF, GIF.`,
          },
          { status: 400 }
        );
      }

      // Validate File Size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `File '${file.name}' exceeds the 10MB maximum file size limit.`,
          },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(buffer, {
        folder: folder.toLowerCase().replace(/\s+/g, "_"),
        tags: ["organichy", folder.toLowerCase()],
      });

      // Save metadata record
      const cleanTitle =
        customTitle ||
        file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

      const record = await MediaService.create({
        title: cleanTitle,
        publicId: uploadResult.public_id,
        secureUrl: uploadResult.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        folder,
        altText: customAlt || cleanTitle,
        tags: [folder.toLowerCase().replace(/\s+/g, "-")],
      });

      uploadedAssets.push(record);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedAssets.length} image(s)`,
      data: uploadedAssets,
    });
  } catch (error: any) {
    console.error("API POST /api/media error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}

