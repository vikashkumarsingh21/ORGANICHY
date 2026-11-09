import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppPill from "@/components/layout/WhatsAppPill";
import CartDrawer from "@/components/layout/CartDrawer";
import { SITE_URL, getOrganizationSchema, getWebsiteSchema } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ORGANICHY | 100% Pure Slow-Roasted Peanut Butter & Clean Nutrition",
    template: "%s | ORGANICHY",
  },
  description:
    "Born in Moradabad, India. ORGANICHY crafts 100% all-natural, high-protein peanut butter with zero palm oil, zero chemical emulsifiers, and zero added sugars. Pure clean fuel for gym enthusiasts and active families.",
  keywords: [
    "ORGANICHY",
    "Peanut Butter",
    "All Natural Peanut Butter India",
    "High Protein Peanut Butter",
    "Clean Nutrition Moradabad",
    "Roasted Peanut Butter 1kg",
    "Dark Chocolate Peanut Butter",
    "Gym Nutrition India",
  ],
  authors: [{ name: "Sourav", url: SITE_URL }],
  creator: "Sourav (ORGANICHY)",
  publisher: "ORGANICHY Pure Nutrition",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ORGANICHY | Premium Nutrition Brand - Made in Moradabad, India",
    description:
      "Pure slow-roasted peanut butter crafted with 100% Indian farm peanuts. Zero hydrogenated oils. 30g protein per 100g.",
    url: SITE_URL,
    siteName: "ORGANICHY",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "ORGANICHY Pure Roasted Peanut Butter Jars",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ORGANICHY | 100% Pure Slow-Roasted Peanut Butter",
    description: "Zero palm oil, zero stabilizers. 100% pure roasted Indian peanuts.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = getOrganizationSchema();
  const webSiteSchema = getWebsiteSchema();

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-brand-cream-50 text-brand-charcoal-900">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppPill />
      </body>
    </html>
  );
}
