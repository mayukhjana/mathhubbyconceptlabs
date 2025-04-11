
import { useEffect, useRef, useState } from "react";

interface SchoolLogo {
  name: string;
  logoUrl: string;
}

const schoolLogos: SchoolLogo[] = [
  {
    name: "St. Xavier's College",
    logoUrl: "/placeholder.svg"
  },
  {
    name: "La Martiniere",
    logoUrl: "/placeholder.svg"
  },
  {
    name: "Modern High School",
    logoUrl: "/placeholder.svg"
  },
  {
    name: "Delhi Public School",
    logoUrl: "/placeholder.svg"
  },
  {
    name: "Jadavpur University",
    logoUrl: "/placeholder.svg"
  },
  {
    name: "Presidency University",
    logoUrl: "/placeholder.svg"
  }
];

const SchoolLogosMarquee = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollAnimation = () => {
      if (isHovered) return;
      scrollContainer.scrollLeft += 1;
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      }
    };

    const animationInterval = setInterval(scrollAnimation, 30);
    return () => clearInterval(animationInterval);
  }, [isHovered]);

  return (
    <div className="w-full overflow-hidden bg-mathlight/50 dark:bg-gray-800/50 py-8">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-xl font-medium mb-6 text-mathdark dark:text-white">
          Trusted by Leading Educational Institutions
        </h3>
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-scroll scrollbar-none"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* Double the logos to create seamless loop */}
            {[...schoolLogos, ...schoolLogos].map((school, index) => (
              <div 
                key={`${school.name}-${index}`}
                className="flex flex-col items-center min-w-[160px] p-4"
              >
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mb-3 shadow-md">
                  <img 
                    src={school.logoUrl} 
                    alt={`${school.name} logo`} 
                    className="w-12 h-12 object-contain" 
                  />
                </div>
                <span className="text-sm text-center font-medium">{school.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolLogosMarquee;
