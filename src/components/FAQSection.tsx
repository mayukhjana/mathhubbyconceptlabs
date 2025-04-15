
import { QuestionMarkCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
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
      question: "Is there a mobile app available?",
      answer: "Yes, MathHub offers a mobile app for Premium users, allowing you to practice and learn on-the-go across all your devices."
    },
    {
      question: "How often is new content added?",
      answer: "We regularly update our content library with new practice papers, exam materials, and learning resources to ensure students have access to the latest and most relevant study materials."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-mathprimary/10 dark:bg-blue-500/10 rounded-full p-2 mb-4">
            <QuestionMarkCircle className="h-6 w-6 text-mathprimary dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about MathHub and how we can help you excel in mathematics.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="text-left font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
