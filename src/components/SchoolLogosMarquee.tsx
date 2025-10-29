interface SchoolLogo {
  name: string;
  logoUrl: string;
}

const schoolLogos: SchoolLogo[] = [{
  name: "West Bengal Board",
  logoUrl: "/wbbse-logo.png"
}];

const SchoolLogosMarquee = () => {
  return (
    <div className="w-full overflow-hidden bg-mathlight/50 dark:bg-gray-800/50 py-8">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-xl font-medium mb-6 text-mathdark dark:text-white">
          Trusted by Leading Educational Institutions
        </h3>
        <div className="relative overflow-hidden">
          <div className="flex gap-12 animate-marquee hover:pause-animation">
            {/* Triple the logos for seamless infinite loop */}
            {[...schoolLogos, ...schoolLogos, ...schoolLogos].map((school, index) => (
              <div key={`${school.name}-${index}`} className="flex flex-col items-center min-w-[180px] p-4 flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mb-3 shadow-md">
                  <img src={school.logoUrl} alt={`${school.name} logo`} className="w-16 h-16 object-contain" />
                </div>
                <span className="text-sm text-center font-medium text-mathdark dark:text-white">{school.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolLogosMarquee;