
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Home
} from "lucide-react";
import { toast } from "sonner";
import LoadingAnimation from "@/components/LoadingAnimation";

// Mock exam data
const examsData: Record<string, {
  title: string;
  board: string;
  chapter: string;
  year: string;
  duration: number;
  questions: Question[];
  isPremium: boolean;
}> = {
  "icse-alg-2022": {
    title: "ICSE Algebra 2022",
    board: "ICSE",
    chapter: "Algebra",
    year: "2022",
    duration: 60,
    isPremium: false,
    questions: [
      {
        id: "q1",
        text: "If a² + b² = 25 and ab = 12, find the value of (a + b)².",
        options: [
          { id: "a", text: "25" },
          { id: "b", text: "37" },
          { id: "c", text: "49" },
          { id: "d", text: "61" }
        ],
        correctAnswer: "c"
      },
      {
        id: "q2",
        text: "Solve for x: 3x² - 5x - 2 = 0",
        options: [
          { id: "a", text: "x = 2, x = -1/3" },
          { id: "b", text: "x = -2, x = 1/3" },
          { id: "c", text: "x = 2, x = 1/3" },
          { id: "d", text: "x = -2, x = -1/3" }
        ],
        correctAnswer: "a"
      },
      {
        id: "q3",
        text: "The sum of first n terms of an AP is 3n² + 4n. Find the nth term of the AP.",
        options: [
          { id: "a", text: "6n + 4" },
          { id: "b", text: "6n + 1" },
          { id: "c", text: "6n - 2" },
          { id: "d", text: "6n" }
        ],
        correctAnswer: "a"
      },
      {
        id: "q4",
        text: "If α and β are the roots of the equation x² - 5x + 6 = 0, find the value of α² + β².",
        options: [
          { id: "a", text: "13" },
          { id: "b", text: "25" },
          { id: "c", text: "36" },
          { id: "d", text: "49" }
        ],
        correctAnswer: "b"
      },
      {
        id: "q5",
        text: "The quadratic equation x² + px + 12 = 0 has equal roots. Find the value of p.",
        options: [
          { id: "a", text: "±4" },
          { id: "b", text: "±6" },
          { id: "c", text: "±8" },
          { id: "d", text: "±12" }
        ],
        correctAnswer: "c"
      }
    ]
  }
};

const ExamPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeupDialog, setShowTimeupDialog] = useState(false);
  
  const exam = examId ? examsData[examId] : null;
  
  useEffect(() => {
    if (exam) {
      // Set timer
      setTimeRemaining(exam.duration * 60);
    }
  }, [exam]);
  
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
    if (currentQuestionIndex < (exam?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmit = () => {
    if (Object.keys(userAnswers).length < (exam?.questions.length || 0)) {
      setShowSubmitDialog(true);
      return;
    }
    
    finishExam();
  };
  
  const finishExam = () => {
    let correctAnswers = 0;
    
    exam?.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / (exam?.questions.length || 1)) * 100);
    setScore(calculatedScore);
    setExamCompleted(true);
    
    // Show toast with score
    toast.success(`Exam completed! Your score: ${calculatedScore}%`);
  };
  
  const handleTimeup = () => {
    setShowTimeupDialog(false);
    finishExam();
  };
  
  if (!exam) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">Exam not found</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  const currentQuestion = exam.questions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progress = (answeredCount / exam.questions.length) * 100;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <LoadingAnimation />
      <Navbar />
      
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          {!examCompleted ? (
            <>
              {/* Exam Header */}
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-xl font-bold">{exam.title}</h1>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>{exam.board} - {exam.chapter}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckSquare size={14} />
                        <span>{answeredCount}/{exam.questions.length} Answered</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-mathlight px-4 py-2 rounded-full">
                    <Clock size={18} className={timeRemaining && timeRemaining < 300 ? "text-red-500 animate-pulse" : "text-mathprimary"} />
                    <span className={`font-mono font-medium ${timeRemaining && timeRemaining < 300 ? "text-red-500" : ""}`}>
                      {timeRemaining !== null ? formatTime(timeRemaining) : "00:00"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{answeredCount}/{exam.questions.length} Questions</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
              
              {/* Question */}
              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  userAnswer={userAnswers[currentQuestion.id]}
                  questionNumber={currentQuestionIndex + 1}
                />
              )}
              
              {/* Navigation Buttons */}
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
            /* Results Screen */
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-mathprimary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-12 h-12 text-mathprimary" />
                </div>
                
                <h1 className="text-2xl font-bold mb-2">Exam Completed!</h1>
                <p className="text-gray-600 mb-6">
                  You've completed the {exam.title} exam.
                </p>
                
                <div className="bg-mathlight rounded-lg p-6 mb-8">
                  <h2 className="text-lg font-medium mb-4">Your Results</h2>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Score:</span>
                    <span className="text-xl font-bold">{score}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Correct Answers:</span>
                    <span className="font-medium">{exam.questions.filter(q => userAnswers[q.id] === q.correctAnswer).length} / {exam.questions.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time Taken:</span>
                    <span className="font-medium">{formatTime((exam.duration * 60) - (timeRemaining || 0))}</span>
                  </div>
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
                    <a href="/exams">
                      <ArrowLeft size={16} />
                      Back to Exams
                    </a>
                  </Button>
                  
                  <Button className="gap-2" asChild>
                    <a href="/">
                      <Home size={16} />
                      Go to Home
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Submit Confirmation Dialog */}
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
      
      {/* Time Up Dialog */}
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
