import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

let DEMO_FAQS = [
  {
    id: "faq_1",
    category: "Product & Ingredients",
    question: "Does ORGANICHY Peanut Butter contain added hydrogenated palm oil or trans fats?",
    answer: "No. Absolutely never. ORGANICHY contains 100% slow-roasted premium peanuts and nothing else in our All-Natural Classic range. Zero palm oil, zero emulsifiers, and zero added sugars.",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "faq_2",
    category: "Product & Ingredients",
    question: "Why is there oil on top of my freshly opened peanut butter jar?",
    answer: "Natural oil separation is the hallmark of genuine, unadulterated peanut butter! Because we do not add artificial stabilizers, pure peanut oil naturally rises to the surface. Simply stir thoroughly before your first use.",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "faq_3",
    category: "Shipping & Delivery",
    question: "Where do ORGANICHY parcels dispatch from?",
    answer: "All orders are batch-roasted and freshly fulfilled directly from our central manufacturing facility in Moradabad, Uttar Pradesh, India.",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "faq_4",
    category: "Shipping & Delivery",
    question: "What are your shipping charges and delivery timelines?",
    answer: "We offer FREE All-India express shipping on all orders of ₹499 or more. For orders below ₹499, a flat standard shipping fee of ₹49 applies. Delivery typically takes 24-48 hours in UP/Delhi-NCR and 3-5 business days across the rest of India.",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "faq_5",
    category: "Storage & Shelf Life",
    question: "Do I need to refrigerate ORGANICHY Peanut Butter after opening?",
    answer: "Refrigeration is not mandatory, but storing in a cool, dry place or in the refrigerator helps maintain a thicker consistency and preserves maximum freshness for up to 9 months.",
    displayOrder: 5,
    isActive: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ success: true, data: DEMO_FAQS });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const { category, question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json({ success: false, error: "Question and answer are required." }, { status: 400 });
    }

    const newFaq = {
      id: `faq_${Date.now()}`,
      category: category || "General",
      question,
      answer,
      displayOrder: DEMO_FAQS.length + 1,
      isActive: true,
    };

    DEMO_FAQS.push(newFaq);

    return NextResponse.json({ success: true, message: "FAQ added successfully.", data: newFaq });
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
    const { id, category, question, answer, isActive } = body;

    const faqIndex = DEMO_FAQS.findIndex((f) => f.id === id);
    if (faqIndex === -1) {
      return NextResponse.json({ success: false, error: "FAQ not found." }, { status: 404 });
    }

    DEMO_FAQS[faqIndex] = {
      ...DEMO_FAQS[faqIndex],
      category: category || DEMO_FAQS[faqIndex].category,
      question: question || DEMO_FAQS[faqIndex].question,
      answer: answer || DEMO_FAQS[faqIndex].answer,
      isActive: isActive !== undefined ? isActive : DEMO_FAQS[faqIndex].isActive,
    };

    return NextResponse.json({ success: true, message: "FAQ updated successfully.", data: DEMO_FAQS[faqIndex] });
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
    const id = searchParams.get("id");

    if (id) {
      DEMO_FAQS = DEMO_FAQS.filter((f) => f.id !== id);
    }

    return NextResponse.json({ success: true, message: "FAQ deleted." });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED")
      ? 401
      : error.message?.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

