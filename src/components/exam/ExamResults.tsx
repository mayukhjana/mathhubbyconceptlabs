
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionCard from "@/components/QuestionCard";
import type { Question } from "@/services/exam/types";

interface ExamResultsProps {
  score: number;
  timeTaken: number;
  totalObtainedMarks: number;
  totalPossibleMarks: number;
  questions: Question[];
  userAnswers: Record<string, string>;
  resultSaved: boolean;
  formatTime: (seconds: number) => string;
}

export const ExamResults = ({
  score,
  timeTaken,
  totalObtainedMarks,
  totalPossibleMarks,
  questions,
  userAnswers,
  resultSaved,
  formatTime,
}: ExamResultsProps) => {
  // Calculate attempted vs unattempted questions
  const attemptedCount = Object.keys(userAnswers).length;
  const unattemptedCount = questions.length - attemptedCount;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-mathprimary/10 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-12 h-12 text-mathprimary dark:text-blue-400" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Exam Completed!</h1>
        
        <div className="bg-mathlight dark:bg-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Your Results</h2>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 dark:text-gray-300">Total Marks:</span>
            <span className="font-medium">{totalObtainedMarks} / {totalPossibleMarks}</span>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 dark:text-gray-300">Correct Answers:</span>
            <span className="font-medium">
              {questions.filter(q => 
                userAnswers[q.id] && (
                  q.is_multi_correct 
                    ? q.correct_answer.split(',').join(',') === userAnswers[q.id]
                    : userAnswers[q.id] === q.correct_answer
                )
              ).length} / {attemptedCount} attempted
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 dark:text-gray-300">Questions Attempted:</span>
            <span className="font-medium">
              {attemptedCount} / {questions.length}
              {unattemptedCount > 0 && ` (${unattemptedCount} skipped)`}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Time Taken:</span>
            <span className="font-medium">{formatTime(timeTaken)}</span>
          </div>

          {resultSaved !== undefined && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Results Saved:</span>
                <span className={`font-medium ${resultSaved ? "text-green-500" : "text-red-500"}`}>
                  {resultSaved ? "Yes" : "No"}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-medium mb-4">Review Your Answers</h3>
        
        <div className="space-y-4 max-h-96 overflow-y-auto mb-8">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={{
                id: question.id,
                text: question.question_text,
                options: [
                  { id: "a", text: question.option_a },
                  { id: "b", text: question.option_b },
                  { id: "c", text: question.option_c },
                  { id: "d", text: question.option_d }
                ],
                correctAnswer: question.correct_answer,
                marks: question.marks,
                negative_marks: question.negative_marks,
                is_multi_correct: question.is_multi_correct
              }}
              onAnswer={() => {}}
              userAnswer={userAnswers[question.id]}
              showResult={true}
              questionNumber={index + 1}
              skipped={!userAnswers[question.id]}
            />
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="gap-2" asChild>
            <Link to="/results">
              <BarChart3 size={16} />
              View All Results
            </Link>
          </Button>
          
          <Button className="gap-2" asChild>
            <Link to="/exams">
              <ArrowRight size={16} />
              More Exams
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
