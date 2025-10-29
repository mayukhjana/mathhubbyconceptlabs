
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const BoardsSection = () => {
  const boards = [
    {
      name: "ICSE",
      description: "Access ICSE board papers from the past 10 years organized by chapters.",
      link: "/boards/icse",
    },
    {
      name: "CBSE",
      description: "Comprehensive collection of CBSE math papers with solutions.",
      link: "/boards/cbse",
    },
    {
      name: "West Bengal",
      description: "All West Bengal board math papers sorted by year and chapter.",
      link: "/boards/west-bengal",
    }
  ];

  return (
    <section className="py-20 bg-accent/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-mathprimary/5 via-mathsecondary/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-mathaccent/5 via-mathsecondary/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-mathprimary/10 via-mathsecondary/10 to-mathaccent/10 border border-mathprimary/20 text-foreground text-sm mb-4 shadow-sm">
            <BookOpen className="w-4 h-4 mr-2 text-mathprimary" />
            <span className="font-medium">Educational Boards</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Explore By Board</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We offer comprehensive resources for all major educational boards. Choose your board to get started.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {boards.map((board, index) => (
            <div key={board.name} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className={`h-48 bg-gradient-to-br ${
                index === 0 ? "from-mathprimary via-mathsecondary to-mathaccent" :
                index === 1 ? "from-mathsecondary via-mathaccent to-mathprimary" :
                "from-mathaccent via-mathprimary to-mathsecondary"
              } flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/5"></div>
                <h3 className="text-4xl font-bold text-white relative z-10 group-hover:scale-110 transition-transform duration-300">{board.name}</h3>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {board.description}
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-mathprimary to-mathsecondary hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <Link to={board.link}>View {board.name} Papers</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoardsSection;
