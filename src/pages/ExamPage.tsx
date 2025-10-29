import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Loader2, Menu } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { ExamNavigation } from "@/components/exam/ExamNavigation";
import { ExamResults } from "@/components/exam/ExamResults";
import { ExamSidebar } from "@/components/exam/ExamSidebar";
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
import { checkExamAttempted } from "@/services/exam/results"; 
import type { Question } from "@/services/exam/types";
import { useIsMobile } from "@/hooks/use-mobile";

const ExamPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [attemptedQuestions, setAttemptedQuestions] = useState<Set<string>>(new Set());
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeupDialog, setShowTimeupDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [resultSaved, setResultSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalObtainedMarks, setTotalObtainedMarks] = useState(0);
  const [totalPossibleMarks, setTotalPossibleMarks] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [questionsWithResults, setQuestionsWithResults] = useState<any[]>([]);
  
  // Detect if using tablet
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
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
        
        console.log("Fetched questions:", questionsData);
        
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

  // Fullscreen management
  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.log("Fullscreen not supported or denied");
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (err) {
      console.log("Error exiting fullscreen");
    }
  };

  // Enter fullscreen when exam loads
  useEffect(() => {
    if (exam && !examCompleted) {
      enterFullscreen();
    }
  }, [exam]);

  // Prevent tab switching, screenshots, and enforce fullscreen
  useEffect(() => {
    if (!exam || examCompleted) return;

    // Detect tab switching
    const handleVisibilityChange = () => {
      if (document.hidden && !examCompleted) {
        setTabSwitchCount(prev => prev + 1);
        toast.warning(`Warning: Tab switching detected! (${tabSwitchCount + 1} times)`);
      }
    };

    // Prevent screenshots
    const preventScreenshot = (e: KeyboardEvent) => {
      if (
        (e.key === 'PrintScreen') ||
        (e.ctrlKey && e.shiftKey && e.key === 'S') ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'))
      ) {
        e.preventDefault();
        toast.error("Screenshots are not allowed during the exam!");
        return false;
      }
    };

    // Disable right-click
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error("Right-click is disabled during the exam!");
      return false;
    };

    // Handle fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !examCompleted) {
        toast.warning("Please stay in fullscreen mode during the exam!");
        enterFullscreen();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', preventScreenshot);
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', preventScreenshot);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [exam, examCompleted, tabSwitchCount]);
  
  const handleAnswer = (questionId: string, selectedOption: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
    setAttemptedQuestions(prev => new Set(prev).add(questionId));
  };

  const handleMarkForReview = (questionId: string) => {
    setMarkedForReview(prev => {
      const updated = new Set(prev);
      if (updated.has(questionId)) {
        updated.delete(questionId);
      } else {
        updated.add(questionId);
      }
      return updated;
    });
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
    
    try {
      // Validate answers securely on the backend (also returns correct answers)
      const { data: validationData, error: validationError } = await supabase.functions.invoke('validate-answers', {
        body: { examId: exam.id, userAnswers }
      });

      if (validationError) {
        console.error('Validation error:', validationError);
        throw validationError;
      }
      if (!validationData) {
        throw new Error('No validation data returned');
      }

      const { score: validatedScore, totalMarks, obtainedMarks, results, correctAnswers: correctAnswersMap } = validationData as any;

      // Build enriched questions list with correctness and correct answers
      const updatedQuestionsWithResults = exam.questions.map((question) => {
        const isAttempted = !!userAnswers[question.id];
        const isCorrect = !!(results?.[question.id]);
        const correctedAnswer = (correctAnswersMap?.[question.id] ?? '') as string;
        return {
          ...question,
          isCorrect,
          isAttempted,
          // Inject correct answer so UI can display it without exposing during exam
          correct_answer: correctedAnswer,
        } as any;
      });
      
      setQuestionsWithResults(updatedQuestionsWithResults);
      setScore(validatedScore);
      setTotalObtainedMarks(obtainedMarks);
      setTotalPossibleMarks(totalMarks);
      
      const endTime = new Date();
      const timeTakenSeconds = startTime 
        ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) 
        : (exam.duration || 0) * 60 - (timeRemaining || 0);
      
      setTimeTaken(timeTakenSeconds);
      setExamCompleted(true);
      
      // Exit fullscreen when exam completes
      exitFullscreen();
      
      if (user && examId) {
        try {
          console.log("Saving result to database", {
            user_id: user.id,
            exam_id: examId,
            score: validatedScore,
            total_questions: exam.questions.length || 0,
            time_taken: timeTakenSeconds,
            total_marks: totalMarks,
            obtained_marks: obtainedMarks
          });

          // Save to user_results
          const { error } = await supabase
            .from('user_results')
            .insert({
              user_id: user.id,
              exam_id: examId,
              score: validatedScore,
              total_questions: exam.questions.length || 0,
              time_taken: timeTakenSeconds,
              total_marks: totalMarks,
              obtained_marks: obtainedMarks
            });
            
          if (error) {
            throw error;
          }

          // Save to leaderboard
          const { error: leaderboardError } = await supabase
            .from('exam_leaderboards')
            .upsert({
              exam_id: examId,
              user_id: user.id,
              score: validatedScore,
              obtained_marks: obtainedMarks,
              total_marks: totalMarks
            }, {
              onConflict: 'exam_id,user_id'
            });

          if (leaderboardError) {
            console.error('Error saving to leaderboard:', leaderboardError);
          }
          
          console.log("Result saved successfully");
          setResultSaved(true);
          toast.success(`Exam completed! Your score: ${validatedScore}% (${obtainedMarks}/${totalMarks} marks)`);
        } catch (error: any) {
          console.error('Error saving exam result:', error);
          toast.error(`Failed to save your result: ${error.message}`);
        }
      } else {
        toast.success(`Exam completed! Your score: ${validatedScore}% (${obtainedMarks}/${totalMarks} marks)`);
        if (!user) {
          toast.info("Sign in to save your results and track your progress!");
        }
      }
    } catch (error: any) {
      console.error('Failed to validate answers via backend:', error);
      toast.error('Could not validate answers. Please try again.');
    }
  };
  
  const handleTimeup = () => {
    setShowTimeupDialog(false);
    finishExam();
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
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
      
      <div className="flex flex-1">
        {/* Sidebar - always visible on desktop during exam, toggleable on mobile/tablet */}
        <ExamSidebar 
          questions={exam.questions}
          currentQuestionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          markedQuestions={markedForReview}
          onQuestionSelect={handleQuestionSelect}
          examTitle={exam.title}
          showSidebar={true} // Always show sidebar component, but control visibility inside
          examCompleted={examCompleted} // Pass whether exam is completed
          questionsWithResults={questionsWithResults} // Pass questions with results for correct/incorrect answers
          examId={examId}
        />
        
        {/* Main content */}
        <main className={`flex-grow py-6 w-full ${isTablet ? 'px-6' : ''}`}>
          <div className={`container mx-auto ${isMobile ? 'px-4' : isTablet ? 'px-6' : 'px-4 lg:px-8'}`}>
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
                    is_multi_correct: currentQuestion.is_multi_correct,
                    image_url: currentQuestion.image_url,
                    is_image_question: currentQuestion.is_image_question || false
                  }}
                  onAnswer={handleAnswer}
                  userAnswer={userAnswers[currentQuestion.id]}
                  questionNumber={currentQuestionIndex + 1}
                  key={currentQuestion.id}
                />
                
                <div className="flex justify-between mt-6">
                  <Button 
                    onClick={handlePrevious} 
                    variant="outline" 
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleMarkForReview(currentQuestion.id)}
                      variant={markedForReview.has(currentQuestion.id) ? "default" : "outline"}
                      className={markedForReview.has(currentQuestion.id) ? "bg-orange-500 hover:bg-orange-600" : ""}
                    >
                      {markedForReview.has(currentQuestion.id) ? "Marked for Review" : "Mark for Review"}
                    </Button>
                    
                    <Button 
                      onClick={handleSubmit} 
                      variant="default" 
                      className="bg-mathprimary hover:bg-mathprimary/90"
                    >
                      Submit Exam
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={skipQuestion}
                    variant="outline"
                  >
                    {currentQuestionIndex < exam.questions.length - 1 ? "Next" : "Skip"}
                  </Button>
                </div>
              </>
            ) : (
          <ExamResults 
            score={score}
            timeTaken={timeTaken}
            totalObtainedMarks={totalObtainedMarks}
            totalPossibleMarks={totalPossibleMarks}
            questions={questionsWithResults}
            userAnswers={userAnswers}
            resultSaved={resultSaved}
            formatTime={formatTime}
            examId={examId || ""}
            examTitle={exam.title}
            isEntranceExam={exam.board.toLowerCase().includes('jee') || exam.board.toLowerCase().includes('neet') || exam.board.toLowerCase().includes('entrance')}
          />
            )}
          </div>
        </main>
      </div>
      
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

export default ExamPage;
