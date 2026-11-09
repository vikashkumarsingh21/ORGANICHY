import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us | Customer Care & Moradabad Facility | ORGANICHY",
  description:
    "Get in touch with the ORGANICHY team in Moradabad, Uttar Pradesh. Contact our customer care via WhatsApp, phone, or email for order queries, bulk gym orders, or wholesale inquiries.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact ORGANICHY Customer Support",
    description: "Questions about your peanut butter batch? We are here to help.",
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

