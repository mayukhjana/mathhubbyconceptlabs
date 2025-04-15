
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const BoardsSection = () => {
  const boards = [
    {
      name: "ICSE",
      description: "Access ICSE board papers from the past 10 years organized by chapters.",
      link: "/boards/icse",
      logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
    },
    {
      name: "CBSE",
      description: "Comprehensive collection of CBSE math papers with solutions.",
      link: "/boards/cbse",
      logo: "https://images.unsplash.com/photo-1599008633840-052c7f756385?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
    },
    {
      name: "West Bengal",
      description: "All West Bengal board math papers sorted by year and chapter.",
      link: "/boards/west-bengal",
      logo: "https://images.unsplash.com/photo-1600025282051-ec0c6bf3137a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white">
                    <img 
                      src={board.logo} 
                      alt={`${board.name} Board Logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mt-16">{board.name}</h3>
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
