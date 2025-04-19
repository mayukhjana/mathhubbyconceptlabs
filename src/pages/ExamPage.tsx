import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { ExamNavigation } from "@/components/exam/ExamNavigation";
import { ExamResults } from "@/components/exam/ExamResults";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { fetchExamById, fetchQuestionsForExam } from "@/services/examService";
import type { Question } from "@/services/exam/types";

const ExamPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [attemptedQuestions, setAttemptedQuestions] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeupDialog, setShowTimeupDialog] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [resultSaved, setResultSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalObtainedMarks, setTotalObtainedMarks] = useState(0);
  const [totalPossibleMarks, setTotalPossibleMarks] = useState(0);
  
  const [exam, setExam] = useState<{
    id: string;
    title: string;
    board: string;
    chapter: string | null;
    year: string;
    duration: number;
    isPremium: boolean;
    questions: Question[];
  } | null>(null);
  
  useEffect(() => {
    const loadExam = async () => {
      if (!examId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const examData = await fetchExamById(examId);
        
        if (!examData) {
          setError("Exam not found");
          setLoading(false);
          return;
        }
        
        // Check if exam was already attempted
        if (user) {
          const wasAttempted = await checkExamAttempted(user.id, examId);
          if (wasAttempted) {
            toast.warning("Note: Results won't be saved as you've already attempted this exam once.");
          }
        }
        
        const questionsData = await fetchQuestionsForExam(examId);
        
        if (!questionsData || questionsData.length === 0) {
          setError("No questions found for this exam");
          setLoading(false);
          return;
        }
        
        setExam({
          id: examData.id,
          title: examData.title,
          board: examData.board,
          chapter: examData.chapter,
          year: examData.year,
          duration: examData.duration,
          isPremium: examData.is_premium,
          questions: questionsData
        });
        
        setTimeRemaining(examData.duration * 60);
        setStartTime(new Date());
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading exam:", error);
        setError("Failed to load exam");
        setLoading(false);
      }
    };
    
    loadExam();
  }, [examId, user]);
  
  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0 || examCompleted) return;
    
    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
      
      if (timeRemaining === 1) {
        setShowTimeupDialog(true);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeRemaining, examCompleted]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleAnswer = (questionId: string, selectedOption: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
    setAttemptedQuestions(prev => new Set(prev).add(questionId));
  };

  const skipQuestion = () => {
    handleNext();
  };
  
  const handleNext = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmit = () => {
    if (!exam) return;
    
    const unattemptedCount = exam.questions.length - attemptedQuestions.size;
    if (unattemptedCount > 0) {
      setShowSubmitDialog(true);
      return;
    }
    
    finishExam();
  };
  
  const finishExam = async () => {
    if (!exam) return;
    
    let correctAnswers = 0;
    let calculatedObtainedMarks = 0;
    let calculatedPossibleMarks = 0;
    
    const questionsWithResults = exam.questions.map(question => {
      const userAnswer = userAnswers[question.id];
      if (!userAnswer) {
        calculatedPossibleMarks += question.marks;
        return {
          ...question,
          isCorrect: false,
          isAttempted: false
        };
      }
      
      let isCorrect = false;
      
      if (question.is_multi_correct) {
        const correctAnswerArray = Array.isArray(question.correct_answer) 
          ? question.correct_answer 
          : question.correct_answer.split(',').map(a => a.trim());
        
        const userAnswerArray = userAnswer.split(',').map(a => a.trim());
        
        isCorrect = correctAnswerArray.length === userAnswerArray.length && 
          correctAnswerArray.every(a => userAnswerArray.includes(a));
      } else {
        isCorrect = userAnswer === (
          Array.isArray(question.correct_answer) 
            ? question.correct_answer[0] 
            : question.correct_answer
        );
      }
      
      if (isCorrect) {
        correctAnswers++;
        calculatedObtainedMarks += question.marks;
      } else if (userAnswer) {
        calculatedObtainedMarks -= question.negative_marks;
      }
      
      calculatedPossibleMarks += question.marks;
      
      return {
        ...question,
        isCorrect,
        isAttempted: true
      };
    });
    
    const calculatedScore = Math.round((correctAnswers / (exam.questions.length || 1)) * 100);
    setScore(calculatedScore);
    setTotalObtainedMarks(calculatedObtainedMarks);
    setTotalPossibleMarks(calculatedPossibleMarks);
    
    const endTime = new Date();
    const timeTakenSeconds = startTime 
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) 
      : (exam.duration || 0) * 60 - (timeRemaining || 0);
    
    setTimeTaken(timeTakenSeconds);
    setExamCompleted(true);
    
    if (user && examId) {
      try {
        console.log("Saving result to database", {
          user_id: user.id,
          exam_id: examId,
          score: calculatedScore,
          total_questions: exam.questions.length || 0,
          time_taken: timeTakenSeconds,
          total_marks: calculatedPossibleMarks,
          obtained_marks: calculatedObtainedMarks
        });

        const { error } = await supabase
          .from('user_results')
          .insert({
            user_id: user.id,
            exam_id: examId,
            score: calculatedScore,
            total_questions: exam.questions.length || 0,
            time_taken: timeTakenSeconds,
            total_marks: calculatedPossibleMarks,
            obtained_marks: calculatedObtainedMarks
          });
          
        if (error) {
          throw error;
        } else {
          console.log("Result saved successfully");
          setResultSaved(true);
          toast.success(`Exam completed! Your score: ${calculatedScore}% (${calculatedObtainedMarks}/${calculatedPossibleMarks} marks)`);
        }
      } catch (error: any) {
        console.error('Error saving exam result:', error);
        toast.error(`Failed to save your result: ${error.message}`);
      }
    } else {
      toast.success(`Exam completed! Your score: ${calculatedScore}% (${calculatedObtainedMarks}/${calculatedPossibleMarks} marks)`);
      if (!user) {
        toast.info("Sign in to save your results and track your progress!");
      }
    }
  };
  
  const handleTimeup = () => {
    setShowTimeupDialog(false);
    finishExam();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-mathprimary mb-4" />
          <p className="text-xl text-gray-600">Loading exam...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !exam) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold text-center mb-2">
            {error || "Exam not found"}
          </h1>
          <p className="text-gray-600 text-center mb-6">
            We couldn't find the exam you're looking for. It might have been removed or doesn't exist.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/exams">Back to Exams</Link>
            </Button>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const currentQuestion = exam.questions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progress = (answeredCount / exam.questions.length) * 100;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          {!examCompleted ? (
            <>
              <ExamHeader
                title={exam.title}
                board={exam.board}
                chapter={exam.chapter}
                answeredCount={answeredCount}
                totalQuestions={exam.questions.length}
                timeRemaining={timeRemaining}
              />
              
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{answeredCount}/{exam.questions.length} Questions</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <QuestionCard
                question={{
                  id: currentQuestion.id,
                  text: currentQuestion.question_text,
                  options: [
                    { id: "a", text: currentQuestion.option_a },
                    { id: "b", text: currentQuestion.option_b },
                    { id: "c", text: currentQuestion.option_c },
                    { id: "d", text: currentQuestion.option_d }
                  ],
                  correctAnswer: currentQuestion.correct_answer,
                  marks: currentQuestion.marks,
                  negative_marks: currentQuestion.negative_marks,
                  is_multi_correct: currentQuestion.is_multi_correct
                }}
                onAnswer={handleAnswer}
                userAnswer={userAnswers[currentQuestion.id]}
                questionNumber={currentQuestionIndex + 1}
                key={currentQuestion.id} // Add key based on question ID to force re-render
              />
              
              <div className="flex justify-between mt-6">
                <Button 
                  onClick={handlePrevious} 
                  variant="outline" 
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                <div className="space-x-2">
                  <Button
                    onClick={skipQuestion}
                    variant="secondary"
                  >
                    Skip Question
                  </Button>
                  
                  {currentQuestionIndex < exam.questions.length - 1 ? (
                    <Button onClick={handleNext}>Next</Button>
                  ) : (
                    <Button onClick={handleSubmit} variant="default" className="bg-mathprimary">
                      Submit Exam
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <ExamResults
              score={score}
              timeTaken={timeTaken}
              totalObtainedMarks={totalObtainedMarks}
              totalPossibleMarks={totalPossibleMarks}
              questions={exam.questions}
              userAnswers={userAnswers}
              resultSaved={resultSaved}
              formatTime={formatTime}
            />
          )}
        </div>
      </main>
      
      <Footer />
      
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              You have only answered {answeredCount} out of {exam.questions.length} questions. 
              Unanswered questions will be marked as zero, with no negative marking.
              Are you sure you want to submit the exam now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Answering</AlertDialogCancel>
            <AlertDialogAction onClick={finishExam}>Submit Anyway</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showTimeupDialog} onOpenChange={setShowTimeupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Time's Up!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your exam time has expired. Your answers will be submitted automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleTimeup}>View Results</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamPage;
