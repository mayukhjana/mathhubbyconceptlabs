
import { Users } from "lucide-react";

const testimonials = [{
  name: "Rajiv Kumar",
  role: "CBSE Student, Class 12",
  content: "MathHub helped me score 95% in my math board exam. The practice papers organized by chapter were exactly what I needed!"
}, {
  name: "Priya Sharma",
  role: "ICSE Student, Class 10",
  content: "The MCQ practice exams gave me confidence before my finals. The instant feedback helped me understand my weak areas."
}, {
  name: "Ananya Roy",
  role: "West Bengal Board Student",
  content: "Finding previous year papers used to be so difficult. Now I have everything in one place. The premium subscription is worth every rupee!"
}, {
  name: "Vikram Mehta",
  role: "JEE Advanced Qualifier",
  content: "The JEE papers with detailed solutions were instrumental in my preparation. I could practice anytime and track my improvement daily."
}, {
  name: "Amit Singh",
  role: "CBSE Student, Class 10",
  content: "The chapter-wise practice helped me focus on my weak topics. My math marks improved by 30%!"
}, {
  name: "Sneha Patel",
  role: "ICSE Student, Class 12",
  content: "Best platform for math practice! The AI explanations made complex problems so easy to understand."
}];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-mathprimary/10 via-mathsecondary/10 to-mathaccent/10 border border-mathprimary/20 text-foreground text-sm mb-4 shadow-sm">
            <Users className="w-4 h-4 mr-2 text-mathprimary" />
            <span className="font-medium">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Student Success Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Hear from students who improved their math scores with MathHub.
          </p>
        </div>
        
        <div className="relative h-[600px] overflow-hidden">
          <div className="absolute inset-0 flex gap-6">
            {/* Column 1 - Moving Up */}
            <div className="flex-1 space-y-6 animate-scroll-up">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div key={`col1-${index}`} className="bg-card border border-border p-6 rounded-2xl hover:shadow-xl hover:border-mathprimary/30 transition-all duration-300 relative">
                  <div className="text-5xl text-mathprimary/10 absolute top-4 left-4">"</div>
                  <p className="text-muted-foreground leading-relaxed mb-4 relative z-10 text-sm">
                    {testimonial.content}
                  </p>
                  <div className="border-t border-border pt-3">
                    <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 2 - Moving Down */}
            <div className="flex-1 space-y-6 animate-scroll-down">
              {[...testimonials.slice(2), ...testimonials.slice(2)].map((testimonial, index) => (
                <div key={`col2-${index}`} className="bg-card border border-border p-6 rounded-2xl hover:shadow-xl hover:border-mathprimary/30 transition-all duration-300 relative">
                  <div className="text-5xl text-mathprimary/10 absolute top-4 left-4">"</div>
                  <p className="text-muted-foreground leading-relaxed mb-4 relative z-10 text-sm">
                    {testimonial.content}
                  </p>
                  <div className="border-t border-border pt-3">
                    <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 3 - Moving Up (hidden on mobile) */}
            <div className="hidden md:block flex-1 space-y-6 animate-scroll-up-slow">
              {[...testimonials.slice(1), ...testimonials.slice(1)].map((testimonial, index) => (
                <div key={`col3-${index}`} className="bg-card border border-border p-6 rounded-2xl hover:shadow-xl hover:border-mathprimary/30 transition-all duration-300 relative">
                  <div className="text-5xl text-mathprimary/10 absolute top-4 left-4">"</div>
                  <p className="text-muted-foreground leading-relaxed mb-4 relative z-10 text-sm">
                    {testimonial.content}
                  </p>
                  <div className="border-t border-border pt-3">
                    <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gradient overlays */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
