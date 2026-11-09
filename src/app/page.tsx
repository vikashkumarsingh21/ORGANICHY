import HeroBanner from "@/components/home/HeroBanner";
import BenefitsBar from "@/components/home/BenefitsBar";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestSellers from "@/components/home/BestSellers";
import WhyChooseOrganichy from "@/components/home/WhyChooseOrganichy";
import ProductQuality from "@/components/home/ProductQuality";
import NutritionSection from "@/components/home/NutritionSection";
import PromotionalBanner from "@/components/home/PromotionalBanner";
import BrandStory from "@/components/home/BrandStory";
import CustomerTestimonials from "@/components/home/CustomerTestimonials";
import InstagramSection from "@/components/home/InstagramSection";
import FaqSection from "@/components/home/FaqSection";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 3. Premium Hero Section */}
      <HeroBanner />

      {/* Brand Value Strip */}
      <BenefitsBar />

      {/* 4. Featured Products */}
      <FeaturedProducts />

      {/* 5. Best Sellers */}
      <BestSellers />

      {/* 6. Why Choose ORGANICHY */}
      <WhyChooseOrganichy />

      {/* 7. Product Quality Section */}
      <ProductQuality />

      {/* 8. Nutrition Information Section */}
      <NutritionSection />

      {/* 9. Promotional Banner */}
      <PromotionalBanner />

      {/* 10. Brand Story */}
      <BrandStory />

      {/* 11. Customer Testimonials */}
      <CustomerTestimonials />

      {/* 12. Instagram Section */}
      <InstagramSection />

      {/* 13. FAQ Section */}
      <FaqSection />

      {/* 14. Newsletter Subscription */}
      <Newsletter />
    </div>
  );
}
