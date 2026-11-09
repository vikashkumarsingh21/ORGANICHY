import { NextRequest, NextResponse } from "next/server";
import { CatalogService } from "@/lib/catalogService";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Product slug is required" },
        { status: 400 }
      );
    }

    const product = await CatalogService.getProductBySlug(slug);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error(`API GET /api/products/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product details" },
      { status: 500 }
    );
  }
}

