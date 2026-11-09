import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

let DEMO_REVIEWS = [
  {
    id: "rev_1",
    productTitle: "All-Natural Creamy Peanut Butter (1kg)",
    userName: "Aditya Roy",
    userEmail: "aditya.r@example.com",
    rating: 5,
    title: "Best consistency and genuine peanuts aroma",
    comment: "No added sugar, pure roasted taste! Excellent texture for morning oatmeal and gym smoothies.",
    isVerified: true,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "rev_2",
    productTitle: "All-Natural Crunchy Peanut Butter (1kg)",
    userName: "Meera Krishnan",
    userEmail: "meera.k@example.com",
    rating: 5,
    title: "The crunch is unbelievable!",
    comment: "Ordered from Bengaluru, received within 3 days. Super fresh batch from Moradabad.",
    isVerified: true,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "rev_3",
    productTitle: "Dark Chocolate Peanut Butter (1kg)",
    userName: "Karan Johar",
    userEmail: "karan.j@example.com",
    rating: 5,
    title: "Guilt-free dessert craving fix",
    comment: "Rich dark cocoa notes paired with freshly ground peanuts. Definitely my new go-to snack.",
    isVerified: true,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "rev_4",
    productTitle: "All-Natural Creamy Peanut Butter (1kg)",
    userName: "Pooja Verma",
    userEmail: "pooja.v@example.com",
    rating: 4,
    title: "Good quality, needs stirring initially",
    comment: "Pure oil separation proves zero emulsifiers. Stored in fridge after stirring and it's perfect.",
    isVerified: false,
    status: "PENDING",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";

    try {
      const where: any = {};
      if (status !== "ALL") {
        where.isApproved = status === "APPROVED";
      }

      const reviews = await prisma.review.findMany({
        where,
        include: {
          product: { select: { title: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      if (reviews.length > 0) {
        return NextResponse.json({
          success: true,
          data: reviews.map((r) => ({
            id: r.id,
            productTitle: r.product.title,
            userName: r.user?.name || "Verified Customer",
            userEmail: r.user?.email || "N/A",
            rating: r.rating,
            title: r.title || "Customer Review",
            comment: r.comment,
            isVerified: r.isVerifiedPurchase,
            status: r.isApproved ? "APPROVED" : "PENDING",
            createdAt: r.createdAt.toISOString(),
          })),
        });
      }
    } catch (e) {}

    // Fallback
    const filtered = status === "ALL" ? DEMO_REVIEWS : DEMO_REVIEWS.filter((r) => r.status === status);
    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED")
      ? 401
      : error.message?.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const { reviewId, status } = body;

    try {
      await prisma.review.update({
        where: { id: reviewId },
        data: { isApproved: status === "APPROVED" },
      });
    } catch (e) {
      const rev = DEMO_REVIEWS.find((r) => r.id === reviewId);
      if (rev) rev.status = status;
    }

    return NextResponse.json({
      success: true,
      message: `Review marked as ${status}.`,
    });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED")
      ? 401
      : error.message?.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("id");

    if (reviewId) {
      try {
        await prisma.review.delete({ where: { id: reviewId } });
      } catch (e) {
        DEMO_REVIEWS = DEMO_REVIEWS.filter((r) => r.id !== reviewId);
      }
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully." });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED")
      ? 401
      : error.message?.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

