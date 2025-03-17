
import { useState, useEffect } from "react";

const LoadingAnimation = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!loading) return null;
  
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-72 h-72 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow text-mathprimary opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        
        <div className="absolute w-40 h-48 bg-white/90 shadow-lg rounded-md p-4 transform animate-paper-float loader-paper">
          <div className="border-b border-mathprimary/20 pb-2 mb-2">
            <div className="h-3 w-24 bg-mathprimary/30 rounded-full mb-2"></div>
            <div className="h-2 w-20 bg-mathprimary/20 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-mathprimary/10 rounded-full"></div>
            <div className="h-2 w-3/4 bg-mathprimary/10 rounded-full"></div>
            <div className="h-2 w-5/6 bg-mathprimary/10 rounded-full"></div>
            <div className="h-2 w-2/3 bg-mathprimary/10 rounded-full"></div>
          </div>
          <div className="absolute -top-3 -right-2 w-10 h-10 rounded-full bg-mathprimary/20 flex items-center justify-center text-mathprimary animate-float">
            π
          </div>
        </div>
        
        <div className="absolute w-36 h-44 bg-white/80 shadow-lg rounded-md p-4 transform -rotate-6 translate-x-10 translate-y-6 loader-paper animate-paper-float" style={{ animationDelay: "0.3s" }}>
          <div className="border-b border-mathsecondary/20 pb-2 mb-2">
            <div className="h-3 w-20 bg-mathsecondary/30 rounded-full mb-2"></div>
            <div className="h-2 w-16 bg-mathsecondary/20 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-mathsecondary/10 rounded-full"></div>
            <div className="h-2 w-4/5 bg-mathsecondary/10 rounded-full"></div>
            <div className="h-2 w-3/4 bg-mathsecondary/10 rounded-full"></div>
          </div>
          <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-mathsecondary/20 flex items-center justify-center text-mathsecondary animate-float" style={{ animationDelay: "0.5s" }}>
            ∑
          </div>
        </div>
        
        <div className="absolute w-32 h-40 bg-white/70 shadow-lg rounded-md p-4 transform rotate-3 -translate-x-12 translate-y-3 loader-paper animate-paper-float" style={{ animationDelay: "0.6s" }}>
          <div className="border-b border-mathprimary/20 pb-2 mb-2">
            <div className="h-2 w-16 bg-mathprimary/30 rounded-full mb-2"></div>
            <div className="h-2 w-14 bg-mathprimary/20 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-mathprimary/10 rounded-full"></div>
            <div className="h-2 w-2/3 bg-mathprimary/10 rounded-full"></div>
            <div className="h-2 w-5/6 bg-mathprimary/10 rounded-full"></div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-mathprimary/20 flex items-center justify-center text-mathprimary animate-float" style={{ animationDelay: "0.8s" }}>
            ∞
          </div>
        </div>
        
        <h2 className="absolute bottom-0 text-mathprimary text-2xl font-display font-bold animate-fade-in">
          MathHub
        </h2>
      </div>
    </div>
  );
};

export default LoadingAnimation;
