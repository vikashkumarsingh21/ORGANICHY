import { NextRequest, NextResponse } from "next/server";
import { CatalogService } from "@/lib/catalogService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || searchParams.get("q") || undefined;
    const flavor = searchParams.get("flavor") || undefined;
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const inStock = searchParams.get("inStock") === "true";
    const sortBy = (searchParams.get("sortBy") as any) || "FEATURED";

    const result = await CatalogService.getProducts({
      page,
      limit,
      category,
      search,
      flavor,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("API GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

