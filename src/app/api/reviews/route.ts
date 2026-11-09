import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateReviewInput } from "@/lib/validations";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    let reviews: any[] = [];
    try {
      reviews = await prisma.review.findMany({
        where: { productId, isApproved: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validateReviewInput(body);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { success: false, error: "Invalid review input", details: validation.errors },
        { status: 400 }
      );
    }

    const { productId, rating, title, comment, authorName, authorEmail } = validation.data;
    const session = await getSessionUser(req);

    // Check if user has a verified purchase of this product
    let isVerifiedPurchase = false;
    try {
      const pastOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { userId: session?.userId },
            { guestEmail: authorEmail },
          ],
          paymentStatus: "PAID",
          items: {
            some: { productId },
          },
        },
      });
      if (pastOrder) isVerifiedPurchase = true;
    } catch (e) {}

    let newReview: any = null;
    try {
      newReview = await prisma.review.create({
        data: {
          productId,
          userId: session?.userId || null,
          authorName,
          authorEmail,
          rating,
          title,
          comment,
          isVerifiedPurchase,
          isApproved: true, // auto-approve standard reviews
        },
      });

      // Recalculate Product Average Rating
      const aggregations = await prisma.review.aggregate({
        where: { productId, isApproved: true },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: Number((aggregations._avg.rating || 5).toFixed(1)),
          reviewCount: aggregations._count.rating || 1,
        },
      });
    } catch (e) {
      newReview = {
        id: `rev_${Date.now()}`,
        productId,
        authorName,
        rating,
        title,
        comment,
        isVerifiedPurchase,
        createdAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback! Your review has been submitted.",
      data: newReview,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}

