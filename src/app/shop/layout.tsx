import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Shop 100% Pure Peanut Butter & Nutrition | ORGANICHY",
  description:
    "Explore ORGANICHY's slow-roasted peanut butter range: All-Natural Creamy, Crunchy, and Dark Chocolate. 100% roasted Indian peanuts with zero palm oil. Free shipping on orders over ₹499.",
  alternates: {
    canonical: `${SITE_URL}/shop`,
  },
  openGraph: {
    title: "Shop All-Natural Peanut Butter | ORGANICHY Moradabad",
    description: "Zero palm oil, high protein, clean nutrition jars dispatched fresh across India.",
    url: `${SITE_URL}/shop`,
    siteName: "ORGANICHY",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

