import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BookOpen, HelpCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Question } from '@/services/exam/types';
interface QuestionStatus {
  isAnswered: boolean;
  isMarkedForReview: boolean;
  isVisited: boolean;
}
interface ExamSidebarProps {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  markedQuestions?: Set<string>;
  onQuestionSelect: (index: number) => void;
  examTitle: string;
  showSidebar?: boolean; // To control visibility after exam completion
}
export const ExamSidebar: React.FC<ExamSidebarProps> = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  markedQuestions = new Set(),
  onQuestionSelect,
  examTitle,
  showSidebar = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

  // Default to open on desktop
  useEffect(() => {
    if (!isMobile && !isTablet) {
      setIsOpen(true);
    }
  }, [isMobile, isTablet]);
  const getQuestionStatus = (questionId: string): QuestionStatus => {
    const isAnswered = userAnswers[questionId] !== undefined;
    const isMarkedForReview = markedQuestions.has(questionId);
    const isVisited = currentQuestionIndex === questions.findIndex(q => q.id === questionId) || isAnswered;
    return {
      isAnswered,
      isMarkedForReview,
      isVisited
    };
  };
  const getStatusColor = (status: QuestionStatus) => {
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
  return <>
      {/* Mobile/tablet button to toggle sidebar */}
      {(isMobile || isTablet) && <Button variant="outline" size="sm" className="fixed top-16 left-0 z-40 p-1 h-8 w-8 rounded-r-md border-l-0" onClick={toggleSidebar}>
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </Button>}
      
      <div className={cn("fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out", "flex flex-col w-64 md:w-72 lg:w-80 bg-white dark:bg-gray-900 border-r shadow-lg pt-14", isMobile || isTablet ? isOpen ? "translate-x-0" : "-translate-x-full" : "translate-x-0", isMobile || isTablet ? "" : "static z-0 pt-0", "dark:border-gray-800")}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-sm truncate">{examTitle}</h2>
          {(isMobile || isTablet) && <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={toggleSidebar}>
              <ChevronLeft size={16} />
            </Button>}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
          
          {Object.entries(groupedQuestions).map(([subject, subjectQuestions]) => <div key={subject} className="space-y-2">
              <h3 className="text-sm font-medium bg-gray-100 dark:bg-gray-800 p-2 rounded">{subject}</h3>
              <div className="grid grid-cols-5 gap-2">
                {subjectQuestions.map(question => {
              const questionIndex = questions.findIndex(q => q.id === question.id);
              const status = getQuestionStatus(question.id);
              const statusColor = getStatusColor(status);
              const isActive = questionIndex === currentQuestionIndex;
              return <Button key={question.id} variant="outline" size="sm" className={cn("h-8 w-8 p-0 flex items-center justify-center font-medium", statusColor, isActive && "ring-2 ring-offset-2 ring-primary")} onClick={() => {
                onQuestionSelect(questionIndex);
                if (isMobile || isTablet) {
                  setIsOpen(false);
                }
              }}>
                      {questionIndex + 1}
                    </Button>;
            })}
              </div>
            </div>)}
        </div>
        
        <div className="p-4 border-t flex space-x-2">
          
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={toggleSidebar}>
            <HelpCircle className="w-4 h-4 mr-1" />
            Instructions
          </Button>
        </div>
      </div>
    </>;
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