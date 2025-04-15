
import { Sparkles, Database, Brain, BarChart } from "lucide-react";

const features = [{
  icon: <Database className="h-6 w-6 text-mathprimary dark:text-blue-400" />,
  title: "5000+ Practice Papers",
  description: "Access thousands of previous year papers from ICSE, CBSE, and West Bengal boards organized by chapter."
}, {
  icon: <Brain className="h-6 w-6 text-mathprimary dark:text-blue-400" />,
  title: "Interactive MCQs",
  description: "Test your knowledge with our engaging multiple-choice questions and get instant feedback."
}, {
  icon: <BarChart className="h-6 w-6 text-mathprimary dark:text-blue-400" />,
  title: "Smart Analytics",
  description: "Track your progress over time with detailed analytics that adapt to your learning style."
}, {
  icon: <Sparkles className="h-6 w-6 text-mathprimary dark:text-blue-400" />,
  title: "AI-Powered Learning",
  description: "Our system recommends personalized learning resources based on your performance patterns."
}];

const FeaturesSection = () => {
  return (
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
            <div key={index} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
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
  );
};

export default FeaturesSection;
