
import { Download, Lock, File } from "lucide-react";
import { useState } from "react";
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
}

const PaperCard = ({
  title,
  description,
  year,
  isPremium,
  userIsPremium = false,
  downloadUrl,
  practiceUrl
}: PaperCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = () => {
    if (isPremium && !userIsPremium) {
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
  
  return (
    <Card className="paper overflow-hidden h-full flex flex-col hover:border-mathprimary/50 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          {isPremium && (
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
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex gap-2 items-center"
        >
          <Download size={14} />
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
        
        {practiceUrl && (
          <Button 
            size="sm"
            asChild
          >
            <a href={practiceUrl}>Practice</a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaperCard;
