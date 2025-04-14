
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuestionCard, { Question } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckSquare, 
  Clock, 
  AlertTriangle,
  Trophy,
  BookOpen,
  Home,
  BarChart3,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoadingAnimation from "@/components/LoadingAnimation";
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
  
  // Load exam data from Supabase
  useEffect(() => {
    const loadExam = async () => {
      if (!examId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch exam details
        const examData = await fetchExamById(examId);
        
        if (!examData) {
          setError("Exam not found");
          setLoading(false);
          return;
        }
        
        // Fetch questions
        const questionsData = await fetchQuestionsForExam(examId);
        
        if (!questionsData || questionsData.length === 0) {
          setError("No questions found for this exam");
          setLoading(false);
          return;
        }
        
        // Format questions to match the Question interface
        const formattedQuestions = questionsData.map(q => ({
          id: q.id,
          text: q.question_text,
          options: [
            { id: "a", text: q.option_a },
            { id: "b", text: q.option_b },
            { id: "c", text: q.option_c },
            { id: "d", text: q.option_d }
          ],
          correctAnswer: q.correct_answer
        }));
        
        // Set exam data
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
        
        // Initialize timer
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
    const questionsWithResults = exam.questions.map(question => {
      const isCorrect = userAnswers[question.id] === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      return {
        ...question,
        isCorrect
      };
    });
    
    const calculatedScore = Math.round((correctAnswers / (exam.questions.length || 1)) * 100);
    setScore(calculatedScore);
    
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
          time_taken: timeTakenSeconds
        });

        const { error } = await supabase
          .from('user_results')
          .insert({
            user_id: user.id,
            exam_id: examId,
            score: calculatedScore,
            total_questions: exam.questions.length || 0,
            time_taken: timeTakenSeconds
          });
          
        if (error) {
          throw error;
        } else {
          console.log("Result saved successfully");
          setResultSaved(true);
          toast.success(`Exam completed! Your score: ${calculatedScore}% has been saved.`);
        }
      } catch (error: any) {
        console.error('Error saving exam result:', error);
        toast.error(`Failed to save your result: ${error.message}`);
      }
    } else {
      toast.success(`Exam completed! Your score: ${calculatedScore}%`);
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
              <Link to="/exams">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Exams
              </Link>
            </Button>
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-xl font-bold">{exam.title}</h1>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>{exam.board}{exam.chapter ? ` - ${exam.chapter}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckSquare size={14} />
                        <span>{answeredCount}/{exam.questions.length} Answered</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-mathlight dark:bg-gray-700 px-4 py-2 rounded-full">
                    <Clock size={18} className={timeRemaining && timeRemaining < 300 ? "text-red-500 animate-pulse" : "text-mathprimary dark:text-blue-400"} />
                    <span className={`font-mono font-medium ${timeRemaining && timeRemaining < 300 ? "text-red-500" : ""}`}>
                      {timeRemaining !== null ? formatTime(timeRemaining) : "00:00"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{answeredCount}/{exam.questions.length} Questions</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
              
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                userAnswer={userAnswers[currentQuestion.id]}
                questionNumber={currentQuestionIndex + 1}
              />
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="gap-2"
                >
                  <ArrowLeft size={16} />
                  Previous
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleSubmit}
                  className="gap-2"
                >
                  <CheckSquare size={16} />
                  Submit Exam
                </Button>
                
                <Button 
                  onClick={handleNext}
                  disabled={currentQuestionIndex === exam.questions.length - 1}
                  className="gap-2"
                >
                  Next
                  <ArrowRight size={16} />
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-mathprimary/10 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-12 h-12 text-mathprimary dark:text-blue-400" />
                </div>
                
                <h1 className="text-2xl font-bold mb-2">Exam Completed!</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  You've completed the {exam.title} exam.
                </p>
                
                <div className="bg-mathlight dark:bg-gray-700 rounded-lg p-6 mb-8">
                  <h2 className="text-lg font-medium mb-4">Your Results</h2>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600 dark:text-gray-300">Score:</span>
                    <span className="text-xl font-bold">{score}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600 dark:text-gray-300">Correct Answers:</span>
                    <span className="font-medium">{exam.questions.filter(q => userAnswers[q.id] === q.correctAnswer).length} / {exam.questions.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Time Taken:</span>
                    <span className="font-medium">{formatTime(timeTaken)}</span>
                  </div>

                  {user && (
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
                  {exam.questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      onAnswer={() => {}}
                      userAnswer={userAnswers[question.id]}
                      showResult={true}
                      questionNumber={index + 1}
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
