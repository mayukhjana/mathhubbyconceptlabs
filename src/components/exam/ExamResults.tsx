
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Award, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Question } from "@/services/exam/types";
import QuestionCard from "@/components/QuestionCard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

interface ExamResultsProps {
  score: number;
  timeTaken: number;
  questions: Question[];
  userAnswers: Record<string, string>;
  totalObtainedMarks: number;
  totalPossibleMarks: number;
  resultSaved: boolean;
  formatTime: (seconds: number) => string;
}

export function ExamResults({
  score,
  timeTaken,
  questions,
  userAnswers,
  totalObtainedMarks,
  totalPossibleMarks,
  resultSaved,
  formatTime
}: ExamResultsProps) {
  const { user } = useAuth();
  
  useEffect(() => {
    if (resultSaved) {
      toast.success("Result saved successfully!");
    } else if (user) {
      toast.warning("Result couldn't be saved. You can still see your score.");
    }
  }, [resultSaved, user]);

  const getCorrectQuestions = () => {
    return questions.filter((q) => {
      const userAnswer = userAnswers[q.id];
      if (!userAnswer) return false;
      
      return q.is_multi_correct 
        ? userAnswer === q.correct_answer.toString() 
        : userAnswer === q.correct_answer.toString();
    }).length;
  };

  const correctQuestions = getCorrectQuestions();
  const incorrectQuestions = questions.length - correctQuestions;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Exam Complete!</h1>
        <p className="text-muted-foreground">
          Here's a summary of your performance
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center flex flex-col items-center">
          <Award className="h-8 w-8 text-mathprimary mb-2" />
          <p className="text-lg font-bold">{score}%</p>
          <p className="text-muted-foreground">Score</p>
        </Card>
        
        <Card className="p-4 text-center flex flex-col items-center">
          <Clock className="h-8 w-8 text-mathprimary mb-2" />
          <p className="text-lg font-bold">{formatTime(timeTaken)}</p>
          <p className="text-muted-foreground">Time Taken</p>
        </Card>
        
        <Card className="p-4 text-center flex flex-col items-center">
          <BookOpen className="h-8 w-8 text-mathprimary mb-2" />
          <p className="text-lg font-bold">{totalObtainedMarks}/{totalPossibleMarks}</p>
          <p className="text-muted-foreground">Total Marks</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 text-center flex flex-col items-center">
          <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
          <p className="text-lg font-bold">{correctQuestions}</p>
          <p className="text-muted-foreground">Correct Answers</p>
        </Card>
        
        <Card className="p-4 text-center flex flex-col items-center">
          <XCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-lg font-bold">{incorrectQuestions}</p>
          <p className="text-muted-foreground">Incorrect Answers</p>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Question Review</h2>
        {questions.map((q, index) => (
          <div key={q.id} className="mb-6">
            <QuestionCard 
              question={q} 
              index={index} 
              showAnswer={true} // Show answers in results page
            />
            <div className="mt-2 flex items-center space-x-2">
              <p className="text-sm">
                <span className="font-semibold">Your answer:</span> {userAnswers[q.id] || "Not answered"}
              </p>
              {userAnswers[q.id] && (
                userAnswers[q.id] === q.correct_answer.toString() ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center space-x-4 pt-4">
        <Button asChild variant="outline">
          <Link to="/exams">Back to Exams</Link>
        </Button>
        <Button asChild>
          <Link to="/results">View All Results</Link>
        </Button>
      </div>
    </div>
  );
}
