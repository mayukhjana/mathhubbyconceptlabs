
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Download, FileCheck, Lock, Star, Sparkle, InfoCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AuthWrapper from './AuthWrapper';

interface PaperCardProps {
  title: string;
  description?: string;  // Keep this optional
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
}

const PaperCard = ({
  title,
  description,  // We'll keep the parameter but won't render it
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
}: PaperCardProps) => {
  // Build badge array
  const badges = [];
  if (year) badges.push({ text: year, variant: 'outline' as const });
  if (examBoard) badges.push({ text: examBoard, variant: 'default' as const });
  if (isPremium) badges.push({ text: 'Premium', variant: 'secondary' as const });
  if (isAttempted) badges.push({ text: 'Attempted', variant: 'secondary' as const });

  const canAccessPremium = !isPremium || userIsPremium;
  
  return (
    <Card className={`overflow-hidden transition border ${
      isPremium 
        ? 'border-amber-200/50 dark:border-amber-700/50 shadow-amber-100/20 dark:shadow-amber-900/10' 
        : 'border-gray-200 dark:border-gray-800'
    } hover:shadow-md`}>
      <CardContent className="p-6">
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
        {/* Description line is now removed as requested */}

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
        
        {isFullMock && (
          <div className="mt-3 text-xs flex items-start gap-1 text-muted-foreground">
            <InfoCircle className="w-3 h-3 mt-0.5 shrink-0" />
            <span>Only MCQ questions can be practiced using our exam management system</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        {practiceUrl ? (
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
          <span className="text-xs text-muted-foreground">Coming Soon</span>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaperCard;
