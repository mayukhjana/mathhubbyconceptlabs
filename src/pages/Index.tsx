
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import AboutUsSection from "@/components/AboutUsSection";
import BoardsSection from "@/components/BoardsSection";
import PremiumSection from "@/components/PremiumSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <HeroSection />
      <AboutUsSection />
      <FeaturesSection />
      <BoardsSection />
      <PremiumSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
