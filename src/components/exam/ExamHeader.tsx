
import { BookOpen, CheckSquare, Clock } from "lucide-react";

interface ExamHeaderProps {
  title: string;
  board: string;
  chapter?: string | null;
  answeredCount: number;
  totalQuestions: number;
  timeRemaining: number | null;
}

export const ExamHeader = ({
  title,
  board,
  chapter,
  answeredCount,
  totalQuestions,
  timeRemaining,
}: ExamHeaderProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>{board}{chapter ? ` - ${chapter}` : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckSquare size={14} />
              <span>{answeredCount}/{totalQuestions} Answered</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-mathlight dark:bg-gray-700 px-4 py-2 rounded-full">
          <Clock 
            size={18} 
            className={timeRemaining && timeRemaining < 300 ? "text-red-500 animate-pulse" : "text-mathprimary dark:text-blue-400"} 
          />
          <span className={`font-mono font-medium ${timeRemaining && timeRemaining < 300 ? "text-red-500" : ""}`}>
            {timeRemaining !== null ? formatTime(timeRemaining) : "00:00"}
          </span>
        </div>
      </div>
    </div>
  );
};
