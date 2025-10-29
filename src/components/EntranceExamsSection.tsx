import { Button } from "@/components/ui/button";
import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

const EntranceExamsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  const entranceExams = [
    {
      name: "JEE Main",
      description: "Joint Entrance Examination for admission to NITs, IIITs, and other engineering colleges.",
      link: "/exam-papers",
    },
    {
      name: "JEE Advanced",
      description: "Advanced level entrance exam for admission to IITs across India.",
      link: "/exam-papers",
    },
    {
      name: "BITSAT",
      description: "Birla Institute of Technology and Science Admission Test for BITS Pilani campuses.",
      link: "/exam-papers",
    },
    {
      name: "SSC CGL",
      description: "Staff Selection Commission Combined Graduate Level Examination for various government posts.",
      link: "/exam-papers",
    },
    {
      name: "VITEEE",
      description: "VIT Engineering Entrance Examination for admission to VIT campuses.",
      link: "/exam-papers",
    },
    {
      name: "SRMJEEE",
      description: "SRM Joint Engineering Entrance Examination for SRM Institute of Science and Technology.",
      link: "/exam-papers",
    },
    {
      name: "KCET",
      description: "Karnataka Common Entrance Test for engineering, medical, and other professional courses.",
      link: "/exam-papers",
    },
    {
      name: "MHT CET",
      description: "Maharashtra Common Entrance Test for engineering and pharmacy admissions.",
      link: "/exam-papers",
    },
    {
      name: "COMEDK",
      description: "Consortium of Medical, Engineering and Dental Colleges of Karnataka entrance exam.",
      link: "/exam-papers",
    },
    {
      name: "TS EAMCET",
      description: "Telangana State Engineering, Agriculture & Medical Common Entrance Test.",
      link: "/exam-papers",
    },
    {
      name: "AP EAMCET",
      description: "Andhra Pradesh Engineering, Agriculture & Medical Common Entrance Test.",
      link: "/exam-papers",
    },
    {
      name: "WBJEE",
      description: "West Bengal Joint Entrance Examination for engineering and medical admissions.",
      link: "/exam-papers",
    },
    {
      name: "KEAM",
      description: "Kerala Engineering Architecture Medical entrance examination.",
      link: "/exam-papers",
    },
    {
      name: "TNEA",
      description: "Tamil Nadu Engineering Admissions for admission to engineering colleges.",
      link: "/exam-papers",
    },
    {
      name: "CUET",
      description: "Common University Entrance Test for admission to central universities.",
      link: "/exam-papers",
    },
    {
      name: "IPU CET",
      description: "Guru Gobind Singh Indraprastha University Common Entrance Test.",
      link: "/exam-papers",
    },
    {
      name: "UPSEE",
      description: "Uttar Pradesh State Entrance Examination for engineering admissions.",
      link: "/exam-papers",
    }
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-mathaccent/5 via-mathprimary/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-mathsecondary/5 via-mathaccent/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-mathaccent/10 via-mathprimary/10 to-mathsecondary/10 border border-mathaccent/20 text-foreground text-sm mb-4 shadow-sm">
            <GraduationCap className="w-4 h-4 mr-2 text-mathaccent" />
            <span className="font-medium">Entrance Examinations</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Prepare for Entrance Exams</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Master mathematics for all major engineering and competitive entrance examinations across India.
          </p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {entranceExams.map((exam, index) => (
                <div key={exam.name} className="flex-[0_0_calc(33.333%-1rem)] min-w-0">
                  <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                    <div className={`h-32 bg-gradient-to-br ${
                      index % 3 === 0 ? "from-mathaccent via-mathprimary to-mathsecondary" :
                      index % 3 === 1 ? "from-mathprimary via-mathsecondary to-mathaccent" :
                      "from-mathsecondary via-mathaccent to-mathprimary"
                    } flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/5"></div>
                      <h3 className="text-2xl font-bold text-white relative z-10 group-hover:scale-110 transition-transform duration-300 text-center px-2">{exam.name}</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
                        {exam.description}
                      </p>
                      <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <Link to={exam.link}>View Papers</Link>
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

export default EntranceExamsSection;
