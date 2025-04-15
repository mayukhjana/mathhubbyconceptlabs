
import { Users } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const testimonials = [{
  name: "Rajiv Kumar",
  role: "CBSE Student, Class 12",
  content: "MathHub helped me score 95% in my math board exam. The practice papers organized by chapter were exactly what I needed!",
  avatar: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=150&h=150"
}, {
  name: "Priya Sharma",
  role: "ICSE Student, Class 10",
  content: "The MCQ practice exams gave me confidence before my finals. The instant feedback helped me understand my weak areas.",
  avatar: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=150&h=150"
}, {
  name: "Ananya Roy",
  role: "West Bengal Board Student",
  content: "Finding previous year papers used to be so difficult. Now I have everything in one place. The premium subscription is worth every rupee!",
  avatar: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=150&h=150"
}, {
  name: "Vikram Mehta",
  role: "JEE Advanced Qualifier",
  content: "The JEE papers with detailed solutions were instrumental in my preparation. I could practice anytime and track my improvement daily.",
  avatar: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?auto=format&fit=crop&w=150&h=150"
}];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-mathprimary/10 dark:bg-mathprimary/20 text-mathprimary dark:text-blue-300 text-sm mb-4">
            <Users className="w-4 h-4 mr-2" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-3xl font-bold text-mathdark dark:text-white mb-4">Student Success Stories</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from students who improved their math scores with MathHub.
          </p>
        </div>
        
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="h-full bg-gray-50 dark:bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-gray-700 relative">
                  <div className="text-6xl text-mathprimary/20 dark:text-blue-500/20 absolute top-4 left-4">"</div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 relative z-10">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-medium text-mathdark dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="static translate-y-0 mr-2" />
            <CarouselNext className="static translate-y-0 ml-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
