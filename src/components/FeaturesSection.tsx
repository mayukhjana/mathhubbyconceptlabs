
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
    <section className="py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-mathprimary/10 via-mathsecondary/10 to-mathaccent/10 border border-mathprimary/20 text-foreground text-sm mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 mr-2 text-mathprimary" />
            <span className="font-medium">Why Choose MathHub</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Excel in Math
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Designed by educators and students, MathHub offers a comprehensive suite of tools to boost your performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:scale-105 hover:border-mathprimary/30 transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-mathprimary/10 via-mathsecondary/10 to-mathaccent/10 inline-flex rounded-2xl p-3 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
