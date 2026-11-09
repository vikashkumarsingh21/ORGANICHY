import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Track Your Order | All-India Express Delivery | ORGANICHY",
  description:
    "Track your freshly roasted ORGANICHY peanut butter batch from our Moradabad facility directly to your doorstep using your Order ID or Courier AWB number.",
  alternates: {
    canonical: `${SITE_URL}/order-tracking`,
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function OrderTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

