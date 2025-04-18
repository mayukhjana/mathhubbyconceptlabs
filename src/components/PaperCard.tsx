
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, LockKeyhole, Play, TrendingUp } from "lucide-react";

interface PaperCardProps {
  title: string;
  description?: string;
  year: string;
  isPremium: boolean;
  userIsPremium: boolean;
  downloadUrl?: string;
  solutionUrl?: string; // Add solutionUrl prop
  practiceUrl?: string;
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
  solutionUrl, // Include solutionUrl in component props
  practiceUrl,
  examBoard,
  isAttempted = false
}: PaperCardProps) => {
  const canAccess = !isPremium || userIsPremium;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardContent className="pt-6 pb-2 flex-1">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-gray-50">
            {examBoard}
          </Badge>
          {isPremium && (
            <Badge className="bg-gradient-to-r from-amber-400 to-yellow-600 text-white border-0">
              Premium
            </Badge>
          )}
        </div>
        <h3 className="font-medium mb-1 line-clamp-2">{title}</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          {description && <p className="line-clamp-2">{description}</p>}
          <p>Year: {year}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 pt-0 pb-4">
        <div className="grid grid-cols-2 gap-2 w-full">
          {downloadUrl || solutionUrl ? (
            <Button
              variant="outline"
              size="sm"
              asChild={canAccess}
              disabled={!canAccess}
              className="w-full"
            >
              {canAccess ? (
                <a href={solutionUrl || downloadUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  Solution
                </a>
              ) : (
                <>
                  <LockKeyhole className="h-4 w-4 mr-2" />
                  Solution
                </>
              )}
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              No Solution
            </Button>
          )}

          {practiceUrl && !isAttempted ? (
            <Button
              variant="default"
              size="sm"
              asChild={canAccess}
              disabled={!canAccess}
              className="w-full"
            >
              {canAccess ? (
                <Link to={practiceUrl}>
                  <Play className="h-4 w-4 mr-2" />
                  Practice
                </Link>
              ) : (
                <>
                  <LockKeyhole className="h-4 w-4 mr-2" />
                  Practice
                </>
              )}
            </Button>
          ) : practiceUrl && isAttempted ? (
            <Button
              variant="secondary"
              size="sm"
              asChild={canAccess}
              disabled={!canAccess}
              className="w-full bg-slate-100"
            >
              {canAccess ? (
                <Link to={practiceUrl}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Results
                </Link>
              ) : (
                <>
                  <LockKeyhole className="h-4 w-4 mr-2" />
                  View Results
                </>
              )}
            </Button>
          ) : (
            <Button variant="default" size="sm" disabled className="w-full">
              <Play className="h-4 w-4 mr-2" />
              No Practice
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaperCard;
