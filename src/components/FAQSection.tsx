
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
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-mathprimary/10 dark:bg-blue-500/10 rounded-full p-2 mb-4">
            <HelpCircle className="h-6 w-6 text-mathprimary dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about MathHub and how we can help you excel in mathematics.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            {/* Left Column - Questions */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">FAQs</h3>
              
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveFaq(index)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    activeFaq === index 
                      ? "border-mathprimary bg-mathprimary/5"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  <p className="font-medium">{faq.question}</p>
                </div>
              ))}
              
              <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 cursor-pointer mt-4">
                <p className="font-medium">My question isn't listed here (Send us feedback)</p>
              </div>
            </div>
            
            {/* Right Column - Answers */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Answers</h3>
              
              {activeFaq !== null && (
                <div className="bg-amber-100 dark:bg-amber-900/20 p-6 rounded-2xl">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mb-4"></div>
                  {faqs[activeFaq].answer.split('\n').map((paragraph, i) => (
                    <p key={i} className={`${i > 0 ? "mt-2" : ""}`}>{paragraph}</p>
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
