import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Download, Eye, FileText, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface PaperCardProps {
  title: string;
  description: string;
  year: string;
  isPremium: boolean;
  userIsPremium: boolean;
  downloadUrl?: string;
  solutionUrl?: string;
  practiceUrl: string;
  examBoard: string;
  isAttempted?: boolean;
}

const PaperCard = ({
  title,
  description,
  year,
  isPremium,
  userIsPremium,
  downloadUrl,
  solutionUrl,
  practiceUrl,
  isAttempted = false
}: PaperCardProps) => {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-grow p-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {isPremium && (
            <div className="shrink-0">
              <Lock className="h-4 w-4 text-yellow-500" />
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 p-6 pt-0">
        {(!isPremium || userIsPremium) && (
          <>
            <div className="w-full flex gap-2">
              {downloadUrl && (
                <Button variant="outline" className="w-full" onClick={() => window.open(downloadUrl)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
            
            <div className="w-full">
              {isAttempted ? (
                <Button asChild variant="default" className="w-full">
                  <Link to="/results">
                    <Eye className="mr-2 h-4 w-4" />
                    View Results
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="default" className="w-full">
                  <Link to={practiceUrl}>
                    <FileText className="mr-2 h-4 w-4" />
                    Practice Now
                  </Link>
                </Button>
              )}
            </div>
          </>
        )}
        
        {isPremium && !userIsPremium && (
          <Button asChild variant="default" className="w-full">
            <Link to="/premium">
              <Lock className="mr-2 h-4 w-4" />
              Unlock Premium
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaperCard;
