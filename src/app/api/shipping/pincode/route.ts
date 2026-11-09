import { NextRequest, NextResponse } from "next/server";
import { ShippingService } from "@/lib/shipping";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pincode = body?.pincode;

    if (!pincode || typeof pincode !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid 6-digit Indian PIN code is required." },
        { status: 400 }
      );
    }

    const result = await ShippingService.checkPincode(pincode);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify PIN code serviceability." },
      { status: 500 }
    );
  }
}

