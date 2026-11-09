import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) | ORGANICHY Peanut Butter",
  description:
    "Find answers to common questions about ORGANICHY peanut butter, natural oil separation, shelf life, storage, clean ingredients, and shipping timelines from Moradabad.",
  alternates: {
    canonical: `${SITE_URL}/faqs`,
  },
  openGraph: {
    title: "ORGANICHY FAQs & Peanut Butter Transparency",
    description: "Learn about natural oil separation, pure ingredients, and zero palm oil promise.",
    url: `${SITE_URL}/faqs`,
  },
};

export default function FaqsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

