
import { Download, Lock, File, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface PaperCardProps {
  title: string;
  description: string;
  year: string;
  isPremium: boolean;
  userIsPremium?: boolean;
  downloadUrl?: string;
  practiceUrl?: string;
  solutionUrl?: string;
  examBoard?: string;
}

const PaperCard = ({
  title,
  description,
  year,
  isPremium,
  userIsPremium = false,
  downloadUrl,
  practiceUrl,
  solutionUrl,
  examBoard
}: PaperCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingSolution, setIsDownloadingSolution] = useState(false);
  const [localUserIsPremium, setLocalUserIsPremium] = useState(userIsPremium);
  
  useEffect(() => {
    // For demo purposes, check premium status from localStorage
    // In a real app, this would come from context or a subscription service
    const premiumStatus = localStorage.getItem("userIsPremium") === "true";
    setLocalUserIsPremium(premiumStatus);
  }, []);
  
  const handleDownload = () => {
    if (isPremium && !localUserIsPremium) {
      toast.error("This is a premium paper. Please upgrade to access it.", {
        action: {
          label: "Upgrade",
          onClick: () => window.location.href = "/premium"
        }
      });
      return;
    }
    
    setIsDownloading(true);
    
    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);
      toast.success("Download started!");
      // In a real app, window.location.href = downloadUrl
    }, 1500);
  };
  
  const handleDownloadSolution = () => {
    if (isPremium && !localUserIsPremium) {
      toast.error("Solutions are available for premium users only. Please upgrade to access them.", {
        action: {
          label: "Upgrade",
          onClick: () => window.location.href = "/premium"
        }
      });
      return;
    }
    
    setIsDownloadingSolution(true);
    
    // Simulate download delay
    setTimeout(() => {
      setIsDownloadingSolution(false);
      toast.success("Solution download started!");
      // In a real app, window.location.href = solutionUrl
    }, 1500);
  };
  
  // Check if this is a JEE or WBJEE paper to show solutions button
  const showSolutionsButton = examBoard === 'JEE Mains' || examBoard === 'JEE Advanced' || examBoard === 'WBJEE';
  
  return (
    <Card className="paper overflow-hidden h-full flex flex-col hover:border-mathprimary/50 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          {isPremium && !localUserIsPremium && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-mathprimary text-white p-1.5 rounded-md">
                    <Lock size={14} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Premium paper</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <File size={14} />
          <span>Year: {year}</span>
        </div>
        {examBoard && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <BookOpen size={14} />
            <span>Board: {examBoard}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t pt-4">
        <div className="flex w-full justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading || (isPremium && !localUserIsPremium)}
            className="flex gap-1 items-center flex-1"
          >
            <Download size={14} />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
          
          {practiceUrl && (
            <Button 
              size="sm"
              disabled={isPremium && !localUserIsPremium}
              asChild={!(isPremium && !localUserIsPremium)}
              onClick={isPremium && !localUserIsPremium ? () => {
                toast.error("This is a premium paper. Please upgrade to access it.", {
                  action: {
                    label: "Upgrade",
                    onClick: () => window.location.href = "/premium"
                  }
                });
              } : undefined}
              className="flex-1"
            >
              {!(isPremium && !localUserIsPremium) ? (
                <a href={practiceUrl}>Practice</a>
              ) : (
                "Practice"
              )}
            </Button>
          )}
        </div>
        
        {/* Solutions button for JEE and WBJEE papers */}
        {showSolutionsButton && (
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleDownloadSolution}
            disabled={isDownloadingSolution || (isPremium && !localUserIsPremium)}
            className="w-full flex gap-2 items-center"
          >
            <BookOpen size={14} />
            {isDownloadingSolution ? "Downloading..." : "Download Solutions"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaperCard;
