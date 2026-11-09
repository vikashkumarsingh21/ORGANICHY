import { NextResponse } from "next/server";
import { CatalogService } from "@/lib/catalogService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await CatalogService.getCategories();
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

