import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

const EntranceExamsSection = () => {
  const entranceExams = [
    {
      name: "JEE Main",
      description: "Joint Entrance Examination for admission to NITs, IIITs, and other engineering colleges.",
      link: "/boards/jee-main",
    },
    {
      name: "JEE Advanced",
      description: "Advanced level entrance exam for admission to IITs across India.",
      link: "/boards/jee-advanced",
    },
    {
      name: "BITSAT",
      description: "Birla Institute of Technology and Science Admission Test for BITS Pilani campuses.",
      link: "/boards/bitsat",
    },
    {
      name: "VITEEE",
      description: "VIT Engineering Entrance Examination for admission to VIT campuses.",
      link: "/boards/viteee",
    },
    {
      name: "SRMJEEE",
      description: "SRM Joint Engineering Entrance Examination for SRM Institute of Science and Technology.",
      link: "/boards/srmjeee",
    },
    {
      name: "KCET",
      description: "Karnataka Common Entrance Test for engineering, medical, and other professional courses.",
      link: "/boards/kcet",
    },
    {
      name: "MHT CET",
      description: "Maharashtra Common Entrance Test for engineering and pharmacy admissions.",
      link: "/boards/mht-cet",
    },
    {
      name: "COMEDK",
      description: "Consortium of Medical, Engineering and Dental Colleges of Karnataka entrance exam.",
      link: "/boards/comedk",
    },
    {
      name: "TS EAMCET",
      description: "Telangana State Engineering, Agriculture & Medical Common Entrance Test.",
      link: "/boards/ts-eamcet",
    },
    {
      name: "AP EAMCET",
      description: "Andhra Pradesh Engineering, Agriculture & Medical Common Entrance Test.",
      link: "/boards/ap-eamcet",
    },
    {
      name: "WBJEE",
      description: "West Bengal Joint Entrance Examination for engineering and medical admissions.",
      link: "/boards/wbjee",
    },
    {
      name: "KEAM",
      description: "Kerala Engineering Architecture Medical entrance examination.",
      link: "/boards/keam",
    },
    {
      name: "TNEA",
      description: "Tamil Nadu Engineering Admissions for admission to engineering colleges.",
      link: "/boards/tnea",
    },
    {
      name: "CUET",
      description: "Common University Entrance Test for admission to central universities.",
      link: "/boards/cuet",
    },
    {
      name: "IPU CET",
      description: "Guru Gobind Singh Indraprastha University Common Entrance Test.",
      link: "/boards/ipu-cet",
    },
    {
      name: "UPSEE",
      description: "Uttar Pradesh State Entrance Examination for engineering admissions.",
      link: "/boards/upsee",
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {entranceExams.map((exam, index) => (
            <div key={exam.name} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
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
                <Button asChild size="sm" className="w-full bg-gradient-to-r from-mathaccent to-mathprimary hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <Link to={exam.link}>View Papers</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EntranceExamsSection;
