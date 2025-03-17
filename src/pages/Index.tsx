
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Users, 
  Award, 
  CheckCircle, 
  ChevronRight 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: <BookOpen className="h-6 w-6 text-mathprimary" />,
    title: "Extensive Paper Collection",
    description: "Access thousands of previous year papers from ICSE, CBSE, and West Bengal boards organized by chapter."
  },
  {
    icon: <FileText className="h-6 w-6 text-mathprimary" />,
    title: "Practice with MCQs",
    description: "Test your knowledge with our interactive MCQ exams and get instant feedback on your performance."
  },
  {
    icon: <GraduationCap className="h-6 w-6 text-mathprimary" />,
    title: "Chapter-wise Organization",
    description: "Find papers organized by chapters for targeted preparation and focused learning."
  },
  {
    icon: <Users className="h-6 w-6 text-mathprimary" />,
    title: "Multiple Boards Support",
    description: "One platform for all major educational boards, with specialized content for each curriculum."
  },
];

const testimonials = [
  {
    name: "Rajiv Kumar",
    role: "CBSE Student, Class 12",
    content: "MathHub helped me score 95% in my math board exam. The practice papers organized by chapter were exactly what I needed!"
  },
  {
    name: "Priya Sharma",
    role: "ICSE Student, Class 10",
    content: "The MCQ practice exams gave me confidence before my finals. The instant feedback helped me understand my weak areas."
  },
  {
    name: "Ananya Roy",
    role: "West Bengal Board Student",
    content: "Finding previous year papers used to be so difficult. Now I have everything in one place. The premium subscription is worth every rupee!"
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-mathlight to-white pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-mathdark mb-6">
                Your Path to Math Excellence Starts Here
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Access thousands of previous year math papers from ICSE, CBSE, and West Bengal boards. Practice with our interactive exams and take your math preparation to the next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2">
                  <span>Get Started</span>
                  <ChevronRight size={16} />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/boards">Browse Papers</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative">
                <div className="bg-white rounded-xl shadow-xl p-6 z-10 relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-mathlight rounded-lg p-4 flex flex-col items-center text-center">
                      <BookOpen className="h-8 w-8 text-mathprimary mb-2" />
                      <span className="font-medium">3000+</span>
                      <span className="text-sm text-gray-600">Papers</span>
                    </div>
                    <div className="bg-mathlight rounded-lg p-4 flex flex-col items-center text-center">
                      <FileText className="h-8 w-8 text-mathprimary mb-2" />
                      <span className="font-medium">120+</span>
                      <span className="text-sm text-gray-600">Chapters</span>
                    </div>
                    <div className="bg-mathlight rounded-lg p-4 flex flex-col items-center text-center">
                      <Users className="h-8 w-8 text-mathprimary mb-2" />
                      <span className="font-medium">50K+</span>
                      <span className="text-sm text-gray-600">Students</span>
                    </div>
                    <div className="bg-mathlight rounded-lg p-4 flex flex-col items-center text-center">
                      <GraduationCap className="h-8 w-8 text-mathprimary mb-2" />
                      <span className="font-medium">3</span>
                      <span className="text-sm text-gray-600">Boards</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-mathprimary/5 rounded-lg p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-mathprimary">Pythagoras Theorem</span>
                        <span className="font-mono text-mathsecondary">a² + b² = c²</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-mathprimary">Quadratic Formula</span>
                        <span className="font-mono text-mathsecondary">x = (-b ± √(b² - 4ac))/2a</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-mathprimary">Area of Circle</span>
                        <span className="font-mono text-mathsecondary">A = πr²</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-mathprimary">Binomial Theorem</span>
                        <span className="font-mono text-mathsecondary">(a + b)ⁿ = ∑ⁿₖ₌₀(ⁿₖ)aⁿ⁻ᵏbᵏ</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-mathaccent/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-mathprimary/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-mathdark mb-4">Why Choose MathHub?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Designed by math educators and students, MathHub offers everything you need to excel in your mathematics exams.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="bg-mathlight inline-flex rounded-full p-3 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Boards Section */}
      <section className="py-20 bg-mathlight/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-mathdark mb-4">Explore By Board</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive resources for all major educational boards. Choose your board to get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-r from-mathprimary to-mathsecondary flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">ICSE</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Access ICSE board papers from the past 10 years organized by chapters.
                </p>
                <Button asChild className="w-full">
                  <Link to="/boards/icse">View ICSE Papers</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-r from-mathsecondary to-mathprimary flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">CBSE</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Comprehensive collection of CBSE math papers with solutions.
                </p>
                <Button asChild className="w-full">
                  <Link to="/boards/cbse">View CBSE Papers</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-mathdark via-mathprimary to-mathsecondary flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">West Bengal</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  All West Bengal board math papers sorted by year and chapter.
                </p>
                <Button asChild className="w-full">
                  <Link to="/boards/west-bengal">View WB Papers</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Premium Section */}
      <section className="py-20 bg-gradient-to-b from-mathdark to-black text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Upgrade to MathHub Premium</h2>
              <p className="text-gray-300 mb-8">
                Get unlimited access to all papers, practice exams, and exclusive resources to ace your math exams.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-mathprimary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Unlimited Downloads</h4>
                    <p className="text-gray-300 text-sm">Download as many papers as you need</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-mathprimary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Advanced Practice Tests</h4>
                    <p className="text-gray-300 text-sm">Access to all MCQ exams with detailed solutions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-mathprimary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Progress Tracking</h4>
                    <p className="text-gray-300 text-sm">Track your performance and identify areas for improvement</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-mathprimary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Ad-Free Experience</h4>
                    <p className="text-gray-300 text-sm">Enjoy an uninterrupted learning experience</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="bg-mathprimary hover:bg-mathsecondary text-white" size="lg" asChild>
                  <Link to="/premium">Upgrade Now</Link>
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-mathprimary font-bold">PREMIUM</div>
                    <div className="text-3xl font-bold mt-1">₹499</div>
                    <div className="text-gray-300 text-sm">per year</div>
                  </div>
                  <div className="bg-mathprimary text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {[
                    "Access to 3000+ papers",
                    "All practice exams included",
                    "Unlimited downloads",
                    "Performance analytics",
                    "Ad-free experience",
                    "Mobile app access"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-mathprimary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full" size="lg" asChild>
                  <Link to="/premium">Get Premium</Link>
                </Button>
                
                <div className="mt-4 text-center text-sm text-gray-400">
                  30-day money-back guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-mathdark mb-4">Student Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from students who improved their math scores with MathHub.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-mathlight p-8 rounded-xl relative">
                <div className="text-6xl text-mathprimary/20 absolute top-4 left-4">"</div>
                <p className="text-gray-700 mb-6 relative z-10">
                  {testimonial.content}
                </p>
                <div className="border-t border-mathprimary/20 pt-4">
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-mathprimary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Excel in Mathematics?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have improved their math scores with MathHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/boards">Browse Papers</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/premium">Get Premium</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
