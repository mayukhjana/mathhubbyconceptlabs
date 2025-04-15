
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
          {boards.map((board, index) => (
            <div key={board.name} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all">
              <div className={`h-48 bg-gradient-to-br ${
                index === 0 ? "from-mathprimary to-mathsecondary dark:from-blue-600 dark:to-purple-700" :
                index === 1 ? "from-mathsecondary to-mathprimary dark:from-purple-700 dark:to-blue-600" :
                "from-mathdark via-mathprimary to-mathsecondary dark:from-gray-700 dark:via-blue-600 dark:to-purple-700"
              } flex items-center justify-center relative`}>
                <h3 className="text-3xl font-bold text-white">{board.name}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {board.description}
                </p>
                <Button asChild className="w-full bg-mathprimary hover:bg-mathprimary/90 dark:bg-blue-600 dark:hover:bg-blue-700">
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
