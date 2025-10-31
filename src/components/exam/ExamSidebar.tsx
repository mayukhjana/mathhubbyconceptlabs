
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BookOpen, HelpCircle, List } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Question } from '@/services/exam/types';
import { InstructionsDialog } from './InstructionsDialog';

interface QuestionStatus {
  isAnswered: boolean;
  isMarkedForReview: boolean;
  isVisited: boolean;
  isCorrect?: boolean; // Add this for showing correct/incorrect answers after exam completion
}

interface ExamSidebarProps {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  markedQuestions?: Set<string>;
  onQuestionSelect: (index: number) => void;
  examTitle: string;
  showSidebar?: boolean; // To control visibility after exam completion
  examCompleted?: boolean; // To show correct/incorrect answers
  questionsWithResults?: any[]; // Questions with results for showing correct/incorrect answers
  examId?: string; // For fetching instructions
}

export const ExamSidebar: React.FC<ExamSidebarProps> = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  markedQuestions = new Set(),
  onQuestionSelect,
  examTitle,
  showSidebar = true,
  examCompleted = false,
  questionsWithResults = [],
  examId
}) => {
  const [isOpen, setIsOpen] = useState(true); // Start open
  const [showInstructions, setShowInstructions] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = !isMobile && !isTablet;

  // Sidebar starts open on desktop, closed on mobile/tablet during exam
  useEffect(() => {
    if (isDesktop && !examCompleted) {
      setIsOpen(true); // Start open on desktop
    } else if (!examCompleted) {
      setIsOpen(false); // Start closed on mobile/tablet during exam
    }
  }, [isMobile, isTablet, isDesktop, examCompleted]);

  const getQuestionStatus = (questionId: string): QuestionStatus => {
    const isAnswered = userAnswers[questionId] !== undefined;
    const isMarkedForReview = markedQuestions.has(questionId);
    const isVisited = currentQuestionIndex === questions.findIndex(q => q.id === questionId) || isAnswered;
    
    // If exam is completed, check if answer is correct
    let isCorrect;
    if (examCompleted && questionsWithResults.length > 0) {
      const questionResult = questionsWithResults.find(q => q.id === questionId);
      if (questionResult) {
        isCorrect = questionResult.isCorrect;
      }
    }
    
    return {
      isAnswered,
      isMarkedForReview,
      isVisited,
      isCorrect
    };
  };

  const getStatusColor = (status: QuestionStatus) => {
    // When exam is completed, show green for correct and red for incorrect
    if (examCompleted && status.isCorrect !== undefined) {
      return status.isCorrect 
        ? "bg-green-500 text-white" 
        : "bg-red-500 text-white";
    }
    
    // Normal exam mode colors
    if (status.isAnswered && status.isMarkedForReview) {
      return "bg-blue-500 text-white"; // Answered and marked for review
    } else if (status.isAnswered) {
      return "bg-green-500 text-white"; // Answered
    } else if (status.isMarkedForReview) {
      return "bg-orange-500 text-white"; // Marked for review
    } else if (status.isVisited) {
      return "bg-gray-300 text-gray-700"; // Visited but not answered
    } else {
      return "bg-gray-200 text-gray-500"; // Not visited
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Group questions by subject (using order_number to group them)
  const groupedQuestions = questions.reduce<Record<string, Question[]>>((groups, question) => {
    // Use question order_number to group questions (1-10, 11-20, etc.)
    const groupSize = 10;
    const groupNumber = Math.floor((question.order_number - 1) / groupSize) + 1;
    const groupName = `Questions ${(groupNumber - 1) * groupSize + 1}-${groupNumber * groupSize}`;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(question);
    return groups;
  }, {});

  if (!showSidebar) {
    return null;
  }

  return (
    <>
      {/* Toggle button - bigger on mobile, always visible */}
      <Button 
        variant="outline" 
        size="sm" 
        className={cn(
          "fixed z-40 rounded-r-md border-l-0 top-16 left-0",
          isMobile ? "p-2 h-12 w-12" : "p-1 h-8 w-8"
        )} 
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <ChevronLeft size={isMobile ? 24 : 16} />
        ) : examCompleted ? (
          <List size={isMobile ? 24 : 16} />
        ) : (
          <ChevronRight size={isMobile ? 24 : 16} />
        )}
      </Button>
      
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out", 
          "flex flex-col w-64 md:w-72 lg:w-80 bg-white dark:bg-gray-900 border-r shadow-lg pt-14", 
          isOpen ? "translate-x-0" : "-translate-x-full",
          "dark:border-gray-800"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-sm truncate">
            {examCompleted ? "Questions Overview" : examTitle}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {examCompleted ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Question Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span>Correct Answer</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                  <span>Incorrect Answer</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
                  <span>Not Answered</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Question Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
                  <span>Not Visited</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                  <span>Review Later</span>
                </div>
              </div>
            </div>
          )}
          
          {Object.entries(groupedQuestions).map(([subject, subjectQuestions]) => (
            <div key={subject} className="space-y-2">
              <h3 className="text-sm font-medium bg-gray-100 dark:bg-gray-800 p-2 rounded">{subject}</h3>
              <div className="grid grid-cols-5 gap-2">
                {subjectQuestions.map(question => {
                  const questionIndex = questions.findIndex(q => q.id === question.id);
                  const status = getQuestionStatus(question.id);
                  const statusColor = getStatusColor(status);
                  const isActive = questionIndex === currentQuestionIndex;
                  return (
                    <Button 
                      key={question.id} 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "h-8 w-8 p-0 flex items-center justify-center font-medium dark:text-foreground", 
                        statusColor, 
                        isActive && "ring-2 ring-offset-2 ring-primary"
                      )}
                      onClick={() => {
                        onQuestionSelect(questionIndex);
                        if (isMobile || isTablet) {
                          setIsOpen(false);
                        }
                      }}
                    >
                      {questionIndex + 1}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {!examCompleted && examId && (
          <div className="p-4 border-t flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs" 
              onClick={() => setShowInstructions(true)}
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              Instructions
            </Button>
          </div>
        )}
      </div>

      {examId && (
        <InstructionsDialog
          open={showInstructions}
          onOpenChange={setShowInstructions}
          examId={examId}
        />
      )}
    </>
  );
};

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}
