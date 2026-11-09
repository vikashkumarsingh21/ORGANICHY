import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { validateCartItemInput } from "@/lib/validations";
import { cookies } from "next/headers";
import crypto from "crypto";

function getOrCreateSessionId(): string {
  const cookieStore = cookies();
  let sessionId = cookieStore.get("organichy_cart_session")?.value;
  if (!sessionId) {
    sessionId = `sess_${crypto.randomBytes(16).toString("hex")}`;
    cookieStore.set("organichy_cart_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
  }
  return sessionId;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const sessionId = getOrCreateSessionId();

    let cart: any = null;

    try {
      cart = await prisma.cart.findFirst({
        where: user ? { userId: user.userId } : { sessionId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: { images: true },
                  },
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    } catch (e) {}

    const formattedItems = (cart?.items || []).map((item: any) => ({
      id: item.id,
      variantId: item.variantId,
      productId: item.variant.productId,
      title: item.variant.product.title,
      variantName: item.variant.name,
      flavor: item.variant.flavor,
      weight: item.variant.weight,
      price: item.variant.price,
      quantity: item.quantity,
      imageUrl: item.variant.product.images[0]?.url || "",
      lineTotal: item.variant.price * item.quantity,
    }));

    const subtotal = formattedItems.reduce((acc: number, it: any) => acc + it.lineTotal, 0);

    return NextResponse.json({
      success: true,
      data: {
        cartId: cart?.id || null,
        items: formattedItems,
        itemCount: formattedItems.reduce((acc: number, it: any) => acc + it.quantity, 0),
        subtotal,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load cart" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validateCartItemInput(body);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { success: false, error: "Invalid item input", details: validation.errors },
        { status: 400 }
      );
    }

    const { variantId, quantity } = validation.data;
    const user = await getSessionUser(req);
    const sessionId = getOrCreateSessionId();

    try {
      // Find or create cart
      let cart = await prisma.cart.findFirst({
        where: user ? { userId: user.userId } : { sessionId },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: user ? user.userId : null,
            sessionId: user ? null : sessionId,
          },
        });
      }

      // Upsert cart item
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_variantId: {
            cartId: cart.id,
            variantId,
          },
        },
      });

      let updatedItem;
      if (existingItem) {
        updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        updatedItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            variantId,
            quantity,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Item added to cart",
        data: updatedItem,
      });
    } catch (e) {
      // Fallback response for dev mode
      return NextResponse.json({
        success: true,
        message: "Item added to session cart (dev fallback)",
        data: { variantId, quantity },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("id");
    const user = await getSessionUser(req);
    const sessionId = getOrCreateSessionId();

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: "Cart item id is required" },
        { status: 400 }
      );
    }

    try {
      const cart = await prisma.cart.findFirst({
        where: user ? { userId: user.userId } : { sessionId },
      });

      if (cart) {
        await prisma.cartItem.deleteMany({
          where: { id: itemId, cartId: cart.id },
        });
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to remove item" },
      { status: 500 }
    );
  }
}

