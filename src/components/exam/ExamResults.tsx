
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
  const attemptedCount = Object.keys(userAnswers).length;
  const unattemptedCount = questions.length - attemptedCount;
  
  // Calculate answer statistics
  const correctAnswers = questions.filter(q => 
    userAnswers[q.id] && (
      q.is_multi_correct 
        ? Array.isArray(q.correct_answer)
          ? q.correct_answer.join(',') === userAnswers[q.id]
          : q.correct_answer === userAnswers[q.id]
        : userAnswers[q.id] === q.correct_answer
    )
  ).length;
  
  const incorrectAnswers = attemptedCount - correctAnswers;
  
  // Generate personalized feedback based on score
  const getFeedbackMessage = () => {
    if (score >= 90) {
      return "Outstanding performance! You've demonstrated exceptional understanding of the material.";
    } else if (score >= 75) {
      return "Great work! You have a solid grasp of most concepts.";
    } else if (score >= 60) {
      return "Good effort! You're on the right track, but there's room for improvement.";
    } else if (score >= 40) {
      return "You've made a good start, but should review the key concepts again.";
    } else {
      return "This topic needs more attention. Consider revisiting the fundamentals and practicing more.";
    }
  };

  // Generate study recommendations
  const getStudyRecommendations = () => {
    // Group incorrect answers by topic/chapter
    const topicMistakes: Record<string, number> = {};
    
    questions.forEach(q => {
      const isCorrect = userAnswers[q.id] && (
        q.is_multi_correct 
          ? Array.isArray(q.correct_answer)
            ? q.correct_answer.join(',') === userAnswers[q.id]
            : q.correct_answer === userAnswers[q.id]
          : userAnswers[q.id] === q.correct_answer
      );
      
      if (!isCorrect && q.id in userAnswers) {
        // For a real app, you'd have topic/chapter data for each question
        // For now, we'll use mock data
        const topic = "Mathematics"; // This would normally come from question metadata
        topicMistakes[topic] = (topicMistakes[topic] || 0) + 1;
      }
    });
    
    // Return recommendations based on identified weak areas
    if (Object.keys(topicMistakes).length === 0) {
      return "Continue practicing to maintain your knowledge.";
    }
    
    // Sort topics by number of mistakes (descending)
    const sortedTopics = Object.entries(topicMistakes)
      .sort(([, a], [, b]) => b - a)
      .map(([topic]) => topic);
    
    if (sortedTopics.length > 0) {
      return `Focus on improving your understanding of ${sortedTopics.join(', ')}.`;
    }
    
    return "Review all topics covered in this exam.";
  };

  const getCorrectAnswerText = (correctAnswer: string | string[]): string => {
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.join(', ');
    }
    return correctAnswer.includes(',') ? correctAnswer : correctAnswer;
  };

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
              {correctAnswers} / {attemptedCount} attempted
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
        
        {/* New section: Advanced Test Feedback */}
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-left border-b pb-2 mb-4">ADVANCED TEST FEEDBACK</h2>
          
          <div className="text-left mb-4">
            <div className="mb-2">Exam Summary</div>
            <div className={`bg-${score < 40 ? 'red' : score < 70 ? 'amber' : 'green'}-100 p-3 rounded-md flex justify-between items-center mb-4`}>
              <div className={`text-${score < 40 ? 'red' : score < 70 ? 'amber' : 'green'}-800 font-bold`}>
                Marks: {totalObtainedMarks}/{totalPossibleMarks}
              </div>
              <div className={`text-${score < 40 ? 'red' : score < 70 ? 'amber' : 'green'}-800`}>
                Percentage: {score.toFixed(1)}%
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Solution and Conceptwise Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md flex items-center gap-3 cursor-pointer">
                  <div className="bg-blue-100 dark:bg-blue-800/50 p-2 rounded">
                    <BarChart3 className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                  </div>
                  <div className="text-sm">Questionwise Analysis and Solutions</div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Score and Time Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md flex items-center gap-3 cursor-pointer">
                  <div className="bg-red-100 dark:bg-red-800/50 p-2 rounded">
                    <BarChart3 className="h-5 w-5 text-red-500 dark:text-red-300" />
                  </div>
                  <div className="text-sm">Subject wise Time Spent</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md flex items-center gap-3 cursor-pointer">
                  <div className="bg-amber-100 dark:bg-amber-800/50 p-2 rounded">
                    <BarChart3 className="h-5 w-5 text-amber-500 dark:text-amber-300" />
                  </div>
                  <div className="text-sm">Subject wise Score</div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Total number of Questions: {questions.length}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className="bg-green-500 text-white p-2 rounded-md">
                  <div className="font-bold">{correctAnswers}</div>
                  <div>Answered</div>
                </div>
                <div className="bg-red-500 text-white p-2 rounded-md">
                  <div className="font-bold">{incorrectAnswers}</div>
                  <div>Not Answered</div>
                </div>
                <div className="bg-gray-200 text-gray-800 p-2 rounded-md">
                  <div className="font-bold">{unattemptedCount}</div>
                  <div>Not Visited</div>
                </div>
                <div className="bg-blue-500 text-white p-2 rounded-md">
                  <div className="font-bold">0</div>
                  <div>Review Later</div>
                </div>
              </div>
            </div>
            
            {/* Personalized feedback */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border">
              <h3 className="font-bold mb-2">Personalized Feedback</h3>
              <p className="mb-3">{getFeedbackMessage()}</p>
              <h4 className="font-semibold mt-3 mb-1">Recommendation:</h4>
              <p>{getStudyRecommendations()}</p>
            </div>
          </div>
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
                is_multi_correct: question.is_multi_correct,
                image_url: question.image_url,
                is_image_question: question.is_image_question || false
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
