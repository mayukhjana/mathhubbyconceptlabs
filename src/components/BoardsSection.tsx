import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BoardsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!emblaApi) return;
    
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [boards, setBoards] = useState([
    {
      name: "CBSE",
      description: "Comprehensive collection of CBSE math papers with solutions.",
      link: "/boards/cbse/papers",
      image: null as string | null,
    },
    {
      name: "ICSE",
      description: "Access ICSE board papers from the past 10 years organized by chapters.",
      link: "/boards/icse/papers",
      image: null as string | null,
    },
    {
      name: "Maharashtra State Board",
      description: "Complete Maharashtra SSC and HSC math papers with detailed solutions.",
      link: "/boards/maharashtra/papers",
      image: null as string | null,
    },
    {
      name: "Tamil Nadu State Board",
      description: "Tamil Nadu board math papers for all standards with chapter-wise practice.",
      link: "/boards/tamil-nadu/papers",
      image: null as string | null,
    },
    {
      name: "Karnataka State Board",
      description: "KSEEB math papers and resources for SSLC and PUC students.",
      link: "/boards/karnataka/papers",
      image: null as string | null,
    },
    {
      name: "Kerala State Board",
      description: "Kerala SSLC and Plus One/Two math papers with comprehensive solutions.",
      link: "/boards/kerala/papers",
      image: null as string | null,
    },
    {
      name: "Uttar Pradesh Board",
      description: "UP Board math papers for high school and intermediate students.",
      link: "/boards/uttar-pradesh/papers",
      image: null as string | null,
    },
    {
      name: "Rajasthan Board",
      description: "RBSE math papers with solutions for secondary and senior secondary.",
      link: "/boards/rajasthan/papers",
      image: null as string | null,
    },
    {
      name: "Madhya Pradesh Board",
      description: "MP Board math papers for classes 10th and 12th with detailed explanations.",
      link: "/boards/madhya-pradesh/papers",
      image: null as string | null,
    },
    {
      name: "Gujarat State Board",
      description: "GSEB math papers for SSC and HSC with chapter-wise practice tests.",
      link: "/boards/gujarat/papers",
      image: null as string | null,
    },
    {
      name: "Bihar Board",
      description: "Bihar Board math papers for matriculation and intermediate exams.",
      link: "/boards/bihar/papers",
      image: null as string | null,
    },
    {
      name: "West Bengal Board",
      description: "WBBSE and WBCHSE math papers sorted by year and chapter.",
      link: "/boards/west-bengal/papers",
      image: null as string | null,
    },
    {
      name: "Andhra Pradesh Board",
      description: "AP Board math papers for SSC and intermediate with solutions.",
      link: "/boards/andhra-pradesh/papers",
      image: null as string | null,
    },
    {
      name: "Telangana Board",
      description: "TS Board math papers for SSC and intermediate students.",
      link: "/boards/telangana/papers",
      image: null as string | null,
    }
  ]);

  useEffect(() => {
    const fetchBoardImages = async () => {
      try {
        const { data, error } = await supabase
          .from('exams')
          .select('board, image_url')
          .eq('category', 'board')
          .not('image_url', 'is', null);

        if (error) throw error;

        if (data && data.length > 0) {
          // Create a map of board names to image URLs
          const boardImageMap = data.reduce((acc: any, exam: any) => {
            if (exam.image_url && !acc[exam.board.toLowerCase()]) {
              acc[exam.board.toLowerCase()] = exam.image_url;
            }
            return acc;
          }, {});

          // Update boards with fetched images
          setBoards(prevBoards => prevBoards.map(board => ({
            ...board,
            image: boardImageMap[board.name.toLowerCase()] || board.image
          })));
        }
      } catch (error) {
        console.error('Error fetching board images:', error);
      }
    };

    fetchBoardImages();
  }, []);

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
        
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {boards.map((board, index) => (
                <div key={board.name} className="flex-[0_0_100%] min-[640px]:flex-[0_0_calc(50%-0.75rem)] lg:flex-[0_0_calc(33.333%-1rem)] min-w-0">
                  <div className="group bg-card border-2 border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden hover:shadow-xl hover:scale-105 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 h-full">
                    <div className={`h-40 md:h-48 ${
                      board.image 
                        ? 'relative' 
                        : `bg-gradient-to-br ${
                            index % 3 === 0 ? "from-blue-600 via-blue-700 to-blue-900" :
                            index % 3 === 1 ? "from-blue-700 via-blue-800 to-blue-950" :
                            "from-blue-800 via-blue-900 to-indigo-900"
                          }`
                    } flex items-center justify-center overflow-hidden`}>
                      {board.image ? (
                        <>
                          <img 
                            src={board.image} 
                            alt={board.name} 
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-blue-800/40 to-blue-950/50"></div>
                          <h3 className="text-xl md:text-2xl font-bold text-white relative z-10 group-hover:scale-110 transition-transform duration-300 text-center px-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{board.name}</h3>
                        </>
                      ) : (
                        <h3 className="text-xl md:text-2xl font-bold text-white relative z-10 group-hover:scale-110 transition-transform duration-300 text-center px-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{board.name}</h3>
                      )}
                    </div>
                    <div className="p-4 md:p-5">
                      <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed line-clamp-2">
                        {board.description}
                      </p>
                      <Button asChild size="sm" className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <Link to={board.link}>View Papers</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background/95 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform z-10"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background/95 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform z-10"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BoardsSection;
