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

const ExamPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
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
        
        const questionsData = await fetchQuestionsForExam(examId);
        
        if (!questionsData || questionsData.length === 0) {
          setError("No questions found for this exam");
          setLoading(false);
          return;
        }
        
        const formattedQuestions = questionsData.map(q => {
          let correctAnswer = q.correct_answer;
          if (typeof correctAnswer === 'string' && q.is_multi_correct) {
            correctAnswer = correctAnswer.split(',');
          }
          
          return {
            id: q.id,
            text: q.question_text,
            options: [
              { id: "a", text: q.option_a },
              { id: "b", text: q.option_b },
              { id: "c", text: q.option_c },
              { id: "d", text: q.option_d }
            ],
            correctAnswer: correctAnswer,
            marks: q.marks,
            negative_marks: q.negative_marks,
            is_multi_correct: q.is_multi_correct || false
          };
        });
        
        setExam({
          id: examData.id,
          title: examData.title,
          board: examData.board,
          chapter: examData.chapter,
          year: examData.year,
          duration: examData.duration,
          isPremium: examData.is_premium,
          questions: formattedQuestions
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
  }, [examId]);
  
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
    
    if (Object.keys(userAnswers).length < exam.questions.length) {
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
      const isCorrect = Array.isArray(question.correctAnswer)
        ? question.correctAnswer.includes(userAnswers[question.id] || '')
        : userAnswers[question.id] === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
        calculatedObtainedMarks += question.marks;
      } else if (userAnswers[question.id]) {
        calculatedObtainedMarks -= question.negative_marks;
      }
      calculatedPossibleMarks += question.marks;
      return {
        ...question,
        isCorrect
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
                question={currentQuestion}
                onAnswer={handleAnswer}
                userAnswer={userAnswers[currentQuestion.id]}
                questionNumber={currentQuestionIndex + 1}
              />
              
              <ExamNavigation
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={exam.questions.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleSubmit}
              />
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
              You have only answered {answeredCount} out of {exam.questions.length} questions. Are you sure you want to submit the exam now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
