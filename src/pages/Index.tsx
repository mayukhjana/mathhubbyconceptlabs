
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BoardsSection from "@/components/BoardsSection";
import EntranceExamsSection from "@/components/EntranceExamsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main>
        <h1 className="sr-only">MathHub Online - India's Leading Mathematics Practice Platform for ICSE, CBSE and West Bengal Board Students</h1>
        <HeroSection />
        <FeaturesSection />
        <BoardsSection />
        <EntranceExamsSection />
        <CTASection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
      {/* Collapsed ElevenLabs AI Assistant */}
      <div className="fixed bottom-4 right-4 z-50 scale-75 origin-bottom-right">
        <elevenlabs-convai agent-id="edFvSxL1bJBXJMNu2u0K"></elevenlabs-convai>
      </div>
    </div>
  );
};

export default Index;
