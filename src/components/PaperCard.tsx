
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Download, FileCheck, Lock, Star, Sparkle, Info, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AuthWrapper from './AuthWrapper';

interface PaperCardProps {
  title: string;
  description?: string;
  downloadUrl?: string;
  solutionUrl?: string;
  practiceUrl?: string;
  year?: string;
  isPremium?: boolean;
  userIsPremium?: boolean;
  examBoard?: string;
  isAttempted?: boolean;
  requireAuth?: boolean;
  isFullMock?: boolean;
  hasMcqQuestions?: boolean;
  examResult?: {
    score: number;
    totalQuestions: number;
    obtainedMarks: number;
    totalMarks: number;
  };
}

const PaperCard = ({
  title,
  description,
  downloadUrl,
  solutionUrl,
  practiceUrl,
  year,
  isPremium = false,
  userIsPremium = false,
  examBoard,
  isAttempted = false,
  requireAuth = true,
  isFullMock = false,
  hasMcqQuestions = false,
  examResult
}: PaperCardProps) => {
  // Build badge array
  const badges = [];
  if (year) badges.push({ text: year, variant: 'outline' as const });
  if (examBoard) badges.push({ text: examBoard, variant: 'default' as const });
  if (isPremium) badges.push({ text: 'Premium', variant: 'secondary' as const });
  if (isAttempted) badges.push({ text: 'Attempted', variant: 'secondary' as const });

  const canAccessPremium = !isPremium || userIsPremium;
  const canPractice = practiceUrl && hasMcqQuestions;
  
  return (
    <Card className={`overflow-hidden transition border ${
      isPremium 
        ? 'border-amber-200/50 dark:border-amber-700/50 shadow-amber-100/20 dark:shadow-amber-900/10' 
        : 'border-gray-200 dark:border-gray-800'
    } hover:shadow-md`}>
      <CardContent className="p-6">
        {/* Badges section */}
        <div className="flex flex-wrap gap-1 mb-3">
          {badges.map((badge, index) => (
            <Badge
              key={index}
              variant={badge.variant}
              className={
                badge.text === 'Premium'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0'
                  : badge.text === 'Attempted'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0'
                  : ''
              }
            >
              {badge.text === 'Premium' && <Sparkle className="w-3 h-3 mr-1" />}
              {badge.text === 'Attempted' && <FileCheck className="w-3 h-3 mr-1" />}
              {badge.text}
            </Badge>
          ))}
        </div>
        
        <h3 className="text-lg font-semibold mb-1 line-clamp-2">{title}</h3>

        {/* Add Results Section when exam is attempted */}
        {isAttempted && examResult && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
              <Trophy className="w-4 h-4" />
              <span className="font-semibold">Your Results</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Score:</span>
                <span className="font-medium">{examResult.score}/{examResult.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Marks:</span>
                <span className="font-medium">{examResult.obtainedMarks}/{examResult.totalMarks}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {downloadUrl && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <AuthWrapper
                      requireAuth={requireAuth}
                      tooltipText="Sign in to download this paper"
                    >
                      {canAccessPremium ? (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs"
                        >
                          <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Paper
                          </a>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs"
                          disabled
                        >
                          <Link to="/premium">
                            <Lock className="w-3 h-3 mr-1" />
                            Premium
                          </Link>
                        </Button>
                      )}
                    </AuthWrapper>
                  </span>
                </TooltipTrigger>
                <TooltipContent>{canAccessPremium ? 'Download question paper' : 'Premium feature'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {solutionUrl && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <AuthWrapper
                      requireAuth={requireAuth}
                      tooltipText="Sign in to view solutions"
                    >
                      {canAccessPremium ? (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs"
                        >
                          <a
                            href={solutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileCheck className="w-3 h-3 mr-1" />
                            Solutions
                          </a>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs"
                          disabled
                        >
                          <Link to="/premium">
                            <Lock className="w-3 h-3 mr-1" />
                            Premium
                          </Link>
                        </Button>
                      )}
                    </AuthWrapper>
                  </span>
                </TooltipTrigger>
                <TooltipContent>{canAccessPremium ? 'View solutions' : 'Premium feature'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {isFullMock && !hasMcqQuestions && (
          <div className="mt-3 text-xs flex items-start gap-1 text-muted-foreground">
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            <span>No MCQ questions available for practice</span>
          </div>
        )}
        
        {isFullMock && hasMcqQuestions && (
          <div className="mt-3 text-xs flex items-start gap-1 text-muted-foreground">
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            <span>Practice MCQ questions using our exam management system</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        {canPractice ? (
          <AuthWrapper
            requireAuth={requireAuth}
            tooltipText="Sign in to practice this exam"
          >
            {canAccessPremium ? (
              <Button
                variant="default"
                size="sm"
                asChild
                className="w-full bg-gradient-to-r from-mathprimary to-blue-600 hover:from-mathprimary/90 hover:to-blue-600/90"
              >
                <Link to={practiceUrl}>Practice Now</Link>
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                asChild
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
              >
                <Link to="/premium">
                  <Star className="w-3 h-3 mr-1" />
                  Upgrade
                </Link>
              </Button>
            )}
          </AuthWrapper>
        ) : (
          <span className="text-xs text-muted-foreground">
            {isFullMock && !hasMcqQuestions ? "No MCQ Questions" : "Coming Soon"}
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaperCard;
