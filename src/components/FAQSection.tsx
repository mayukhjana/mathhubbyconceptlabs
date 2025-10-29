import { ChevronDown } from "lucide-react";
import { useState } from "react";
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
      question: "How to get started with MathHub?",
      answer: "Getting started with MathHub is simple. Step 1: Create an account. Step 2: Choose your board and class. Step 3: Browse through available practice papers. Step 4: Start practicing and track your progress."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes, MathHub offers a mobile app for Premium users, allowing you to practice and learn on-the-go across all your devices."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time. You'll still have access to premium content until the end of your billing period."
    },
    {
      question: "How do I access premium content?",
      answer: "Once subscribed, all premium content will be automatically unlocked throughout the website. You'll see the premium badge disappear from locked items."
    },
    {
      question: "Is there a student discount?",
      answer: "We offer special discounts for educational institutions. Please contact us for more information."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-primary font-semibold text-sm">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to know about MathHub
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:bg-primary/5">
                  <span className="text-left font-semibold text-foreground">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-8 text-center p-6 bg-primary/5 rounded-xl border border-primary/20">
            <p className="text-foreground font-medium mb-2">Still have questions?</p>
            <p className="text-muted-foreground text-sm">
              Contact our support team and we'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
