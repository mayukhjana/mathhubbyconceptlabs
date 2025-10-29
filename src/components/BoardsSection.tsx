
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const BoardsSection = () => {
  const boards = [
    {
      name: "CBSE",
      description: "Comprehensive collection of CBSE math papers with solutions.",
      link: "/boards/cbse",
    },
    {
      name: "ICSE",
      description: "Access ICSE board papers from the past 10 years organized by chapters.",
      link: "/boards/icse",
    },
    {
      name: "Maharashtra State Board",
      description: "Complete Maharashtra SSC and HSC math papers with detailed solutions.",
      link: "/boards/maharashtra",
    },
    {
      name: "Tamil Nadu State Board",
      description: "Tamil Nadu board math papers for all standards with chapter-wise practice.",
      link: "/boards/tamil-nadu",
    },
    {
      name: "Karnataka State Board",
      description: "KSEEB math papers and resources for SSLC and PUC students.",
      link: "/boards/karnataka",
    },
    {
      name: "Kerala State Board",
      description: "Kerala SSLC and Plus One/Two math papers with comprehensive solutions.",
      link: "/boards/kerala",
    },
    {
      name: "Uttar Pradesh Board",
      description: "UP Board math papers for high school and intermediate students.",
      link: "/boards/uttar-pradesh",
    },
    {
      name: "Rajasthan Board",
      description: "RBSE math papers with solutions for secondary and senior secondary.",
      link: "/boards/rajasthan",
    },
    {
      name: "Madhya Pradesh Board",
      description: "MP Board math papers for classes 10th and 12th with detailed explanations.",
      link: "/boards/madhya-pradesh",
    },
    {
      name: "Gujarat State Board",
      description: "GSEB math papers for SSC and HSC with chapter-wise practice tests.",
      link: "/boards/gujarat",
    },
    {
      name: "Bihar Board",
      description: "Bihar Board math papers for matriculation and intermediate exams.",
      link: "/boards/bihar",
    },
    {
      name: "West Bengal Board",
      description: "WBBSE and WBCHSE math papers sorted by year and chapter.",
      link: "/boards/west-bengal",
    },
    {
      name: "Andhra Pradesh Board",
      description: "AP Board math papers for SSC and intermediate with solutions.",
      link: "/boards/andhra-pradesh",
    },
    {
      name: "Telangana Board",
      description: "TS Board math papers for SSC and intermediate students.",
      link: "/boards/telangana",
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board, index) => (
            <div key={board.name} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className={`h-32 bg-gradient-to-br ${
                index % 3 === 0 ? "from-mathprimary via-mathsecondary to-mathaccent" :
                index % 3 === 1 ? "from-mathsecondary via-mathaccent to-mathprimary" :
                "from-mathaccent via-mathprimary to-mathsecondary"
              } flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/5"></div>
                <h3 className="text-2xl font-bold text-white relative z-10 group-hover:scale-110 transition-transform duration-300 text-center px-2">{board.name}</h3>
              </div>
              <div className="p-4">
                <p className="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
                  {board.description}
                </p>
                <Button asChild size="sm" className="w-full bg-gradient-to-r from-mathprimary to-mathsecondary hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <Link to={board.link}>View Papers</Link>
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
