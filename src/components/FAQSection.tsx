
import { HelpCircle } from "lucide-react";
import { useState } from "react";

const FAQSection = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(3); // Default to the "How to hire?" question
  
  const faqs = [
    {
      question: "What is MathHub?",
      answer: "MathHub is an innovative online platform designed to help students excel in mathematics through comprehensive study materials, practice papers, and personalized learning paths."
    },
    {
      question: "How does MathHub help students improve?",
      answer: "MathHub provides access to over 5000+ practice papers, detailed performance analytics, and a structured learning approach that helps students identify and work on their weak areas."
    },
    {
      question: "What features are included in the Premium plan?",
      answer: "Premium members get unlimited access to all practice papers, performance analytics dashboard, ad-free experience across devices, mobile app access, and 24/7 customer support."
    },
    {
      question: "How to get started with MathHub?",
      answer: "Getting started with MathHub is simple.\nStep 1: Create an account\nStep 2: Choose your board and class\nStep 3: Browse through available practice papers\nStep 4: Start practicing and track your progress"
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes, MathHub offers a mobile app for Premium users, allowing you to practice and learn on-the-go across all your devices."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-accent/5 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-mathprimary/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-tl from-mathaccent/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-mathprimary/10 via-mathsecondary/10 to-mathaccent/10 border border-mathprimary/20 rounded-full p-3 mb-4 shadow-sm">
            <HelpCircle className="h-6 w-6 text-mathprimary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Find answers to common questions about MathHub and how we can help you excel in mathematics.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            {/* Left Column - Questions */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6 text-foreground">FAQs</h3>
              
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveFaq(index)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    activeFaq === index 
                      ? "border-mathprimary bg-gradient-to-r from-mathprimary/10 to-mathsecondary/5 shadow-md"
                      : "border-border hover:border-mathprimary/30 hover:bg-accent/30"
                  }`}
                >
                  <p className="font-medium text-foreground">{faq.question}</p>
                </div>
              ))}
              
              <div className="p-4 rounded-xl border border-border hover:border-mathprimary/30 hover:bg-accent/30 cursor-pointer mt-4 transition-all duration-200">
                <p className="font-medium text-foreground">My question isn't listed here (Send us feedback)</p>
              </div>
            </div>
            
            {/* Right Column - Answers */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Answers</h3>
              
              {activeFaq !== null && (
                <div className="bg-gradient-to-br from-mathaccent/20 via-mathsecondary/10 to-mathprimary/10 border border-mathaccent/30 p-6 rounded-2xl shadow-lg">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-mathprimary to-mathaccent mb-4"></div>
                  {faqs[activeFaq].answer.split('\n').map((paragraph, i) => (
                    <p key={i} className={`text-foreground leading-relaxed ${i > 0 ? "mt-2" : ""}`}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
