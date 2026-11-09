import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const productId = params.id;

    try {
      const updated = await prisma.$transaction(async (tx) => {
        const prod = await tx.product.update({
          where: { id: productId },
          data: {
            title: body.title,
            slug: body.slug ? body.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-") : undefined,
            shortDescription: body.shortDescription,
            description: body.description,
            benefits: Array.isArray(body.benefits) ? body.benefits : undefined,
            ingredients: body.ingredients,
            nutritionFacts: body.nutritionFacts,
            categoryId: body.categoryId,
            isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
            isBestSeller: body.isBestSeller !== undefined ? Boolean(body.isBestSeller) : undefined,
            status: body.status,
          },
        });

        // Update variants if provided
        if (Array.isArray(body.variants)) {
          for (const v of body.variants) {
            if (v.id) {
              await tx.productVariant.update({
                where: { id: v.id },
                data: {
                  name: v.name,
                  weight: v.weight,
                  flavor: v.flavor,
                  sku: v.sku,
                  price: parseFloat(v.price),
                  compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice) : null,
                  stock: v.stock !== undefined ? parseInt(v.stock, 10) : undefined,
                },
              });

              if (v.stock !== undefined) {
                await tx.inventory.upsert({
                  where: { variantId: v.id },
                  update: { stockQuantity: parseInt(v.stock, 10) },
                  create: {
                    variantId: v.id,
                    stockQuantity: parseInt(v.stock, 10),
                    lowStockThreshold: 15,
                  },
                });
              }
            }
          }
        }

        await tx.auditLog.create({
          data: {
            userId: admin.userId,
            action: "UPDATE_PRODUCT",
            entityType: "Product",
            entityId: productId,
            details: { title: body.title, status: body.status },
          },
        });

        return prod;
      });

      return NextResponse.json({
        success: true,
        message: "Product updated successfully",
        data: updated,
      });
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: e.message || "Failed to update product" },
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

// Quick status toggle (Publish / Unpublish)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const productId = params.id;
    const { status } = body;

    if (!status || !["ACTIVE", "DRAFT", "ARCHIVED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value (must be ACTIVE, DRAFT, or ARCHIVED)" },
        { status: 400 }
      );
    }

    try {
      const updated = await prisma.product.update({
        where: { id: productId },
        data: { status },
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.userId,
          action: status === "ACTIVE" ? "PUBLISH_PRODUCT" : "UNPUBLISH_PRODUCT",
          entityType: "Product",
          entityId: productId,
          details: { newStatus: status },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Product is now ${status === "ACTIVE" ? "Published (Live)" : "Drafted (Unpublished)"}`,
        data: updated,
      });
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: e.message || "Failed to update status" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    const statusCode = error.message?.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status: statusCode });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    const productId = params.id;

    try {
      // Archive to preserve historic order integrity
      await prisma.product.update({
        where: { id: productId },
        data: { status: "ARCHIVED" },
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.userId,
          action: "ARCHIVE_PRODUCT",
          entityType: "Product",
          entityId: productId,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Product successfully archived.",
      });
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: e.message || "Failed to archive product" },
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
