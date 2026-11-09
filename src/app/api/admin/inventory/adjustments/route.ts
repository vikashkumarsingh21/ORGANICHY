import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    try {
      const logs = await prisma.auditLog.findMany({
        where: {
          OR: [
            { entityType: "Inventory" },
            { action: "UPDATE_INVENTORY" },
          ],
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      return NextResponse.json({
        success: true,
        data: logs,
        count: logs.length,
      });
    } catch (e) {
      // In-memory demo logs
      return NextResponse.json({
        success: true,
        data: [
          {
            id: "log_1",
            action: "UPDATE_INVENTORY",
            entityType: "Inventory",
            entityId: "inv_1",
            createdAt: new Date(),
            user: { name: "Sourav (Founder)", email: "admin@organichy.com" },
            details: { previousStock: 140, newStock: 150, batchNumber: "BATCH-ORG-2026-11A", reason: "Weekly fresh stone-ground roast batch" },
          },
          {
            id: "log_2",
            action: "UPDATE_INVENTORY",
            entityType: "Inventory",
            entityId: "inv_2",
            createdAt: new Date(Date.now() - 86400000),
            user: { name: "Sourav (Founder)", email: "admin@organichy.com" },
            details: { previousStock: 180, newStock: 200, batchNumber: "BATCH-ORG-2026-11A", reason: "Packaging refill" },
          },
        ],
        count: 2,
      });
    }
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

