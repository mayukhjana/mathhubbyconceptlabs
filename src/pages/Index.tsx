
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Users, 
  Award, 
  CheckCircle, 
  ChevronRight,
  BarChart3,
  Clock,
  Lightbulb,
  Zap,
  Database,
  ArrowRight,
  Star,
  BarChart,
  Brain,
  Trophy,
  PlusCircle,
  Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import SchoolLogosMarquee from "@/components/SchoolLogosMarquee";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Database className="h-6 w-6 text-mathprimary dark:text-blue-400" />,
    title: "5000+ Practice Papers",
    description: "Access thousands of previous year papers from ICSE, CBSE, and West Bengal boards organized by chapter."
  },
  {
    icon: <Brain className="h-6 w-6 text-mathprimary dark:text-blue-400" />,
    title: "Interactive MCQs",
    description: "Test your knowledge with our engaging multiple-choice questions and get instant feedback."
  },
  {
    icon: <BarChart className="h-6 w-6 text-mathprimary dark:text-blue-400" />,
    title: "Smart Analytics",
    description: "Track your progress over time with detailed analytics that adapt to your learning style."
  },
  {
    icon: <Sparkles className="h-6 w-6 text-mathprimary dark:text-blue-400" />,
    title: "AI-Powered Learning",
    description: "Our system recommends personalized learning resources based on your performance patterns."
  },
];

const testimonials = [
  {
    name: "Rajiv Kumar",
    role: "CBSE Student, Class 12",
    content: "MathHub helped me score 95% in my math board exam. The practice papers organized by chapter were exactly what I needed!",
    avatar: "/placeholder.svg"
  },
  {
    name: "Priya Sharma",
    role: "ICSE Student, Class 10",
    content: "The MCQ practice exams gave me confidence before my finals. The instant feedback helped me understand my weak areas.",
    avatar: "/placeholder.svg"
  },
  {
    name: "Ananya Roy",
    role: "West Bengal Board Student",
    content: "Finding previous year papers used to be so difficult. Now I have everything in one place. The premium subscription is worth every rupee!",
    avatar: "/placeholder.svg"
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section - Modern & Minimal Design */}
      <section className="relative overflow-hidden pt-16 md:pt-20 pb-16 md:pb-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-mathprimary/5 to-transparent dark:from-mathprimary/10 dark:to-transparent"></div>
          <div className="absolute bottom-24 left-0 w-72 h-72 bg-mathprimary/10 dark:bg-mathprimary/5 rounded-full filter blur-3xl"></div>
          <div className="absolute top-32 right-10 w-96 h-96 bg-mathsecondary/10 dark:bg-mathsecondary/5 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-mathprimary/10 dark:bg-mathprimary/20 text-mathprimary dark:text-blue-300 text-sm mb-6">
                <Star className="w-4 h-4 mr-2" />
                <span>Trusted by 75,000+ students across India</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-mathdark dark:text-white mb-6 tracking-tight leading-tight">
                Excel in Mathematics with <span className="text-mathprimary dark:text-blue-400 relative">
                  Confidence
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 10" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-lg text-mathdark/70 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                Access thousands of practice papers, interactive exams, and personalized analytics for ICSE, CBSE, and West Bengal boards.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="gap-2 bg-mathprimary hover:bg-mathprimary/90 dark:bg-blue-600 dark:hover:bg-blue-700">
                  <span>Start Learning</span>
                  <ArrowRight size={16} />
                </Button>
                <Button size="lg" variant="outline" className="border-mathprimary/30 text-mathprimary dark:border-blue-500/30 dark:text-blue-400 hover:bg-mathprimary/5 dark:hover:bg-blue-900/20" asChild>
                  <Link to="/boards">Browse Papers</Link>
                </Button>
              </div>
              
              <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700">
                      <span className="sr-only">User</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-mathdark/70 dark:text-gray-400">
                  <span className="font-semibold text-mathdark dark:text-white">4.9/5</span> from over 5,000 reviews
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="relative mx-auto max-w-lg">
                {/* Main dashboard card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-t-2xl p-3 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs bg-white/20 dark:bg-black/20 text-gray-500 dark:text-gray-400 rounded-md px-2 py-0.5 flex-grow text-center">mathhub.io/dashboard</div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-mathdark dark:text-white">Your Progress</h3>
                        <span className="text-sm text-mathprimary dark:text-blue-400">75% Complete</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-mathprimary dark:bg-blue-500 rounded-full" style={{width: "75%"}}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex flex-col items-center text-center">
                        <Database className="h-8 w-8 text-mathprimary dark:text-blue-400 mb-2" />
                        <span className="font-bold text-lg text-mathdark dark:text-white">5000+</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Practice Papers</span>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex flex-col items-center text-center">
                        <BookOpen className="h-8 w-8 text-mathprimary dark:text-blue-400 mb-2" />
                        <span className="font-bold text-lg text-mathdark dark:text-white">150+</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Math Chapters</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500 dark:text-gray-400">Algebra</span>
                          <span className="font-medium text-mathdark dark:text-white">86%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{width: "86%"}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500 dark:text-gray-400">Calculus</span>
                          <span className="font-medium text-mathdark dark:text-white">72%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-mathprimary dark:bg-blue-500 rounded-full" style={{width: "72%"}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500 dark:text-gray-400">Geometry</span>
                          <span className="font-medium text-mathdark dark:text-white">54%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{width: "54%"}}></div>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-mathprimary hover:bg-mathprimary/90 dark:bg-blue-600 dark:hover:bg-blue-700" asChild>
                      <Link to="/premium">Upgrade to Premium</Link>
                    </Button>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-4 md:-right-12 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg rotate-6 hidden sm:block border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-mathdark dark:text-white">
                    <Trophy size={16} className="text-yellow-500" />
                    <span>Top 5% student!</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 md:-left-12 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg -rotate-3 hidden sm:block border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-mathdark dark:text-white">
                    <Zap size={16} className="text-mathprimary dark:text-blue-400" />
                    <span>Next quiz: Tomorrow</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* School Logos Marquee */}
      <SchoolLogosMarquee />
      
      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-mathprimary/10 dark:bg-mathprimary/20 text-mathprimary dark:text-blue-300 text-sm mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Why Choose MathHub</span>
            </div>
            <h2 className="text-3xl font-bold text-mathdark dark:text-white mb-4">
              Everything You Need to Excel in Math
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Designed by math educators and students, MathHub offers a comprehensive suite of tools to boost your performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="bg-mathprimary/10 dark:bg-blue-900/30 inline-flex rounded-full p-3 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-mathdark dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Boards Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-mathprimary/10 dark:bg-mathprimary/20 text-mathprimary dark:text-blue-300 text-sm mb-4">
              <BookOpen className="w-4 h-4 mr-2" />
              <span>Educational Boards</span>
            </div>
            <h2 className="text-3xl font-bold text-mathdark dark:text-white mb-4">Explore By Board</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We offer comprehensive resources for all major educational boards. Choose your board to get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all">
              <div className="h-48 bg-gradient-to-br from-mathprimary to-mathsecondary dark:from-blue-600 dark:to-purple-700 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">ICSE</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Access ICSE board papers from the past 10 years organized by chapters.
                </p>
                <Button asChild className="w-full bg-mathprimary hover:bg-mathprimary/90 dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Link to="/boards/icse">View ICSE Papers</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all">
              <div className="h-48 bg-gradient-to-br from-mathsecondary to-mathprimary dark:from-purple-700 dark:to-blue-600 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">CBSE</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Comprehensive collection of CBSE math papers with solutions.
                </p>
                <Button asChild className="w-full bg-mathprimary hover:bg-mathprimary/90 dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Link to="/boards/cbse">View CBSE Papers</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all">
              <div className="h-48 bg-gradient-to-br from-mathdark via-mathprimary to-mathsecondary dark:from-gray-700 dark:via-blue-600 dark:to-purple-700 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">West Bengal</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  All West Bengal board math papers sorted by year and chapter.
                </p>
                <Button asChild className="w-full bg-mathprimary hover:bg-mathprimary/90 dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Link to="/boards/west-bengal">View WB Papers</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Premium Section */}
      <section className="py-20 bg-gradient-to-b from-mathdark to-black dark:from-gray-900 dark:to-black text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-mathprimary opacity-10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-mathsecondary opacity-10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm mb-6">
                <Award className="w-4 h-4 mr-2" />
                <span>Premium Experience</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-6">Upgrade to MathHub Premium</h2>
              <p className="text-gray-300 mb-8">
                Get unlimited access to all papers, practice exams, and exclusive resources to ace your math exams.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-mathprimary dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Unlimited Downloads</h4>
                    <p className="text-gray-300 text-sm">Download as many papers as you need</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-mathprimary dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Advanced Practice Tests</h4>
                    <p className="text-gray-300 text-sm">Access to all MCQ exams with detailed solutions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-mathprimary dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Performance Tracking</h4>
                    <p className="text-gray-300 text-sm">Track your performance and identify areas for improvement</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-mathprimary dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Ad-Free Experience</h4>
                    <p className="text-gray-300 text-sm">Enjoy an uninterrupted learning experience</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="bg-white text-mathdark hover:bg-gray-100 dark:hover:bg-gray-200" size="lg" asChild>
                  <Link to="/premium">Upgrade Now</Link>
                </Button>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex gap-4 mb-6">
                      <Button 
                        variant={activeTab === 'monthly' ? 'default' : 'outline'} 
                        size="sm"
                        className="border-white/20 text-white"
                        onClick={() => setActiveTab('monthly')}
                      >
                        Monthly
                      </Button>
                      <Button
                        variant={activeTab === 'yearly' ? 'default' : 'outline'}
                        size="sm" 
                        className="border-white/20 text-white"
                        onClick={() => setActiveTab('yearly')}
                      >
                        Yearly <span className="ml-1 text-xs bg-green-500 px-1.5 py-0.5 rounded-full">Save 20%</span>
                      </Button>
                    </div>
                  
                    <div className="text-mathprimary dark:text-blue-400 font-bold">PREMIUM</div>
                    <div className="text-3xl font-bold mt-1">
                      {activeTab === 'monthly' ? '₹149' : '₹1,499'}
                    </div>
                    <div className="text-gray-300 text-sm">per {activeTab === 'monthly' ? 'month' : 'year'}</div>
                  </div>
                  <div className="bg-mathprimary dark:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {[
                    "Access to 5000+ papers",
                    "All practice exams included",
                    "Unlimited downloads",
                    "Performance analytics",
                    "Ad-free experience",
                    "Mobile app access"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-mathprimary dark:text-blue-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-white text-mathdark hover:bg-gray-100 dark:hover:bg-gray-200" size="lg" asChild>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 relative">
                <div className="text-6xl text-mathprimary/20 dark:text-blue-500/20 absolute top-4 left-4">"</div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 relative z-10">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium text-mathdark dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-mathprimary dark:bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Excel in Mathematics?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have improved their math scores with MathHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-mathprimary dark:text-blue-700 hover:bg-gray-100 dark:hover:bg-gray-100" asChild>
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
