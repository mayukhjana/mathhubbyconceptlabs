
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BoardsSection from "@/components/BoardsSection";
import PremiumSection from "@/components/PremiumSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <BoardsSection />
      <PremiumSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
      <div className="fixed bottom-4 right-4 z-50">
        <elevenlabs-convai agent-id="edFvSxL1bJBXJMNu2u0K"></elevenlabs-convai>
      </div>
    </div>
  );
};

export default Index;

