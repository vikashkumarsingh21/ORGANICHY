import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { stockQuantity, lowStockThreshold, batchNumber, warehouseLocation } = body;

    const inventoryId = params.id;

    try {
      const updated = await prisma.$transaction(async (tx) => {
        const inv = await tx.inventory.update({
          where: { id: inventoryId },
          data: {
            stockQuantity: stockQuantity !== undefined ? parseInt(stockQuantity, 10) : undefined,
            lowStockThreshold: lowStockThreshold !== undefined ? parseInt(lowStockThreshold, 10) : undefined,
            batchNumber: batchNumber || undefined,
            warehouseLocation: warehouseLocation || undefined,
          },
        });

        // Also update parent variant stock count
        if (stockQuantity !== undefined) {
          await tx.productVariant.update({
            where: { id: inv.variantId },
            data: { stock: parseInt(stockQuantity, 10) },
          });
        }

        await tx.auditLog.create({
          data: {
            userId: admin.userId,
            action: "UPDATE_INVENTORY",
            entityType: "Inventory",
            entityId: inventoryId,
            details: { newStock: stockQuantity, batchNumber },
          },
        });

        return inv;
      });

      return NextResponse.json({
        success: true,
        message: "Inventory level updated successfully",
        data: updated,
      });
    } catch (dbError: any) {
      return NextResponse.json(
        { success: false, error: dbError.message || "Failed to update inventory" },
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

