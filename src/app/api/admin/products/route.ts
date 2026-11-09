import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEMO_PRODUCTS } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status") || "ALL";
    const category = searchParams.get("category") || "ALL";
    const search = searchParams.get("search") || "";

    try {
      const where: any = {};

      if (status !== "ALL") {
        where.status = status;
      }

      if (category !== "ALL") {
        where.category = { slug: category };
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ];
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          category: true,
          images: { orderBy: { displayOrder: "asc" } },
          variants: {
            include: { inventory: true },
            orderBy: { price: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        data: products,
        count: products.length,
      });
    } catch (dbError) {
      // In-memory fallback representation for local dev
      let fallback = DEMO_PRODUCTS.map((p) => ({
        ...p,
        status: "ACTIVE",
        variants: p.variants.map((v) => ({
          ...v,
          inventory: {
            stockQuantity: v.stock,
            lowStockThreshold: 15,
            batchNumber: "BATCH-ORG-2026-11A",
            warehouseLocation: "Moradabad Central Facility, UP",
          },
        })),
      }));

      if (search) {
        fallback = fallback.filter((p) =>
          p.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (category !== "ALL") {
        fallback = fallback.filter((p) => p.category?.slug === category);
      }

      return NextResponse.json({
        success: true,
        data: fallback,
        count: fallback.length,
      });
    }
  } catch (error: any) {
    const statusCode = error.message?.includes("UNAUTHORIZED")
      ? 401
      : error.message?.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: error.message }, { status: statusCode });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();

    const {
      title,
      slug,
      shortDescription,
      description,
      benefits,
      ingredients,
      nutritionFacts,
      categoryId,
      status = "ACTIVE",
      isFeatured = false,
      isBestSeller = false,
      variants,
      images,
    } = body;

    if (!title || !slug || !description || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Missing required product fields (title, slug, description, categoryId)" },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    try {
      const created = await prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            title,
            slug: cleanSlug,
            shortDescription,
            description,
            benefits: Array.isArray(benefits) ? benefits : [],
            ingredients,
            nutritionFacts,
            categoryId,
            status,
            isFeatured: Boolean(isFeatured),
            isBestSeller: Boolean(isBestSeller),
          },
        });

        if (Array.isArray(variants) && variants.length > 0) {
          for (let i = 0; i < variants.length; i++) {
            const v = variants[i];
            const stockQty = parseInt(v.stock || "100", 10);
            const variant = await tx.productVariant.create({
              data: {
                productId: product.id,
                name: v.name || `${v.weight} ${v.flavor}`,
                weight: v.weight || "1kg",
                flavor: v.flavor || "Natural",
                sku: v.sku || `ORG-${cleanSlug.slice(0, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
                price: parseFloat(v.price || "499"),
                compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice) : null,
                stock: stockQty,
                isDefault: i === 0 || Boolean(v.isDefault),
              },
            });

            await tx.inventory.create({
              data: {
                variantId: variant.id,
                stockQuantity: stockQty,
                lowStockThreshold: 15,
                batchNumber: v.batchNumber || "BATCH-ORG-NEW",
                warehouseLocation: "Moradabad Central Facility, UP",
              },
            });
          }
        }

        if (Array.isArray(images) && images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            await tx.productImage.create({
              data: {
                productId: product.id,
                url: images[i].url,
                altText: images[i].altText || title,
                displayOrder: i + 1,
                isThumbnail: i === 0,
              },
            });
          }
        }

        await tx.auditLog.create({
          data: {
            userId: admin.userId,
            action: "CREATE_PRODUCT",
            entityType: "Product",
            entityId: product.id,
            details: { title, slug: cleanSlug, categoryId },
          },
        });

        return product;
      });

      return NextResponse.json({
        success: true,
        message: "Product created successfully",
        data: created,
      });
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: e.message || "Failed to create product" },
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
