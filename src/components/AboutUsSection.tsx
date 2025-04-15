
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { StickyNote, Clock, Brain, GraduationCap } from "lucide-react";

const AboutUsSection = () => {
  return (
    <section className="w-full py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold text-mathdark dark:text-white mb-12">
          Who We Are
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - About us information */}
          <div className="space-y-8">
            <p className="text-lg text-mathdark/80 dark:text-gray-300 leading-relaxed">
              MathHub was founded by a team of passionate educators and mathematicians with a mission to make 
              mathematics education accessible, engaging, and effective for students across India. 
              We believe that the right resources and approach can transform math from a dreaded subject 
              to an exciting journey of discovery.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="bg-mathprimary/10 dark:bg-blue-900/30 p-3 rounded-full h-fit">
                  <StickyNote className="h-5 w-5 text-mathprimary dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-mathdark dark:text-white mb-1">5000+ Papers</h3>
                  <p className="text-sm text-mathdark/70 dark:text-gray-400">
                    Comprehensive collection of exam papers from all major educational boards
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-mathprimary/10 dark:bg-blue-900/30 p-3 rounded-full h-fit">
                  <Clock className="h-5 w-5 text-mathprimary dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-mathdark dark:text-white mb-1">10+ Years</h3>
                  <p className="text-sm text-mathdark/70 dark:text-gray-400">
                    Decade of experience in mathematics education and training
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-mathprimary/10 dark:bg-blue-900/30 p-3 rounded-full h-fit">
                  <Brain className="h-5 w-5 text-mathprimary dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-mathdark dark:text-white mb-1">AI-Powered</h3>
                  <p className="text-sm text-mathdark/70 dark:text-gray-400">
                    Smart analytics and personalized learning paths
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-mathprimary/10 dark:bg-blue-900/30 p-3 rounded-full h-fit">
                  <GraduationCap className="h-5 w-5 text-mathprimary dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-mathdark dark:text-white mb-1">75,000+ Students</h3>
                  <p className="text-sm text-mathdark/70 dark:text-gray-400">
                    Trusted by students across India for exam preparation
                  </p>
                </div>
              </div>
            </div>

            <p className="text-mathdark/80 dark:text-gray-300">
              Our mission is to empower every student with the tools and confidence to 
              excel in mathematics, regardless of their background or initial skill level.
            </p>
          </div>

          {/* Right side - YouTube video */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-md">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-mathdark dark:text-white">
                Why Mathematics Matters
              </h3>
            </div>
            <div className="p-4">
              <AspectRatio ratio={16/9} className="overflow-hidden rounded-md bg-muted">
                <iframe 
                  src="https://www.youtube.com/embed/UF2RR0Vt9_o"
                  title="Why Mathematics is Important - The Importance of Mathematics"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                ></iframe>
              </AspectRatio>
              <p className="mt-3 text-sm text-mathdark/70 dark:text-gray-400">
                Discover why mathematics is one of the most important subjects you'll learn, 
                with practical applications that extend far beyond the classroom.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
