
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { createExam, createQuestions, fetchEntranceExams } from "@/services/exam";
import { uploadExamFile, ensureStorageBuckets } from "@/services/exam/storage";
import ExamTypeSelector from "@/components/admin/ExamTypeSelector";
import RecentUploads from "@/components/admin/RecentUploads";
import ExamDetailsForm from "@/components/admin/ExamDetailsForm";
import UploadInstructions from "@/components/admin/UploadInstructions";
import UnifiedExamForm from "@/components/admin/UnifiedExamForm";
import { Question } from "@/services/exam/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AdminUploadPage = () => {
  const { user } = useAuth();
  
  const [examType, setExamType] = useState("entrance");
  const [selectedBoard, setSelectedBoard] = useState("WBJEE");
  const [selectedClass, setSelectedClass] = useState("11-12");
  const [selectedChapter, setSelectedChapter] = useState("none");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [examTitle, setExamTitle] = useState("");
  const [examDuration, setExamDuration] = useState(60);
  const [isPremium, setIsPremium] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [bucketsReady, setBucketsReady] = useState(false);
  const [recentUploads, setRecentUploads] = useState<{
    id: string;
    name: string;
    board: string;
    class: string;
    year: string;
  }[]>([]);

  useEffect(() => {
    const initBuckets = async () => {
      try {
        console.log("Initializing storage buckets...");
        const result = await ensureStorageBuckets();
        setBucketsReady(result);
        if (!result) {
          setError("Failed to initialize storage buckets. Please try again later.");
        } else {
          console.log("Storage buckets initialized successfully");
        }
      } catch (err: any) {
        console.error("Error initializing buckets:", err);
        setError(`Failed to initialize storage buckets: ${err.message}`);
        toast.error(`Storage initialization failed: ${err.message}`);
      }
    };
    
    initBuckets();
  }, []);

  const resetForm = () => {
    setExamTitle("");
    setSelectedBoard("WBJEE");
    setSelectedClass("11-12");
    setSelectedChapter("none");
    setSelectedYear(new Date().getFullYear().toString());
    setExamDuration(60);
    setIsPremium(false);
    setUploadedFile(null);
    setSolutionFile(null);
    setQuestions([]);
    setError(null);
  };

  useEffect(() => {
    const loadRecentUploads = async () => {
      try {
        const exams = await fetchEntranceExams();
        const filteredExams = exams.filter(exam => exam.board !== "WBJEE");
        
        const formattedUploads = filteredExams.slice(0, 5).map(exam => ({
          id: exam.id,
          name: exam.title,
          board: exam.board,
          class: exam.class,
          year: exam.year
        }));
        
        setRecentUploads(formattedUploads);
      } catch (error) {
        console.error("Error loading recent uploads:", error);
      }
    };
    
    loadRecentUploads();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setUploadedFile(null);
      return;
    }
    
    const file = event.target.files[0];
    const fileType = file.type;
    
    if (!fileType.includes('pdf')) {
      toast.error("Please upload a PDF document for exam papers");
      return;
    }
    
    setUploadedFile(file);
  };
  
  const handleSolutionFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSolutionFile(null);
      return;
    }
    
    const file = event.target.files[0];
    const fileType = file.type;
    
    if (!fileType.includes('pdf')) {
      toast.error("Please upload a PDF document for solutions");
      return;
    }
    
    setSolutionFile(file);
  };

  const handleSaveQuestion = (questionData: Question) => {
    const existingIndex = questions.findIndex(q => q.order_number === questionData.order_number);
    if (existingIndex !== -1) {
      const updatedQuestions = [...questions];
      updatedQuestions[existingIndex] = questionData;
      setQuestions(updatedQuestions);
      toast.success("Question updated!");
    } else {
      setQuestions([...questions, questionData]);
      toast.success("Question added!");
    }
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    const renumberedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      order_number: i + 1
    }));
    setQuestions(renumberedQuestions);
    toast.success("Question removed");
  };

  const isExamFormValid = () => {
    return (
      examTitle && 
      selectedBoard && 
      selectedClass && 
      selectedYear &&
      examDuration > 0 &&
      bucketsReady
    );
  };

  const handleCreateUnifiedExam = async () => {
    if (!user) {
      toast.error("You must be logged in to create an exam");
      return;
    }
    
    if (!bucketsReady) {
      toast.error("Storage is not ready. Please try again in a moment.");
      try {
        console.log("Retrying bucket initialization...");
        const result = await ensureStorageBuckets();
        setBucketsReady(result);
        if (!result) {
          toast.error("Storage initialization failed. Please try again later.");
          return;
        }
        toast.success("Storage initialized successfully");
      } catch (err: any) {
        console.error("Error reinitializing buckets:", err);
        toast.error(`Storage initialization failed: ${err.message}`);
        return;
      }
    }
    
    if (!isExamFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    setError(null);
    
    try {
      const finalChapter = selectedChapter === "none" ? null : selectedChapter;
      
      const examPayload = {
        title: examTitle || `${selectedBoard} Mathematics ${selectedYear}`,
        board: selectedBoard,
        class: selectedClass,
        chapter: finalChapter,
        year: selectedYear,
        duration: examDuration,
        is_premium: isPremium
      };
      
      const insertedExam = await createExam(examPayload);
      setUploadProgress(30);
      
      if (uploadedFile) {
        const fileExt = uploadedFile.name.split('.').pop()?.toLowerCase();
        if (fileExt !== 'pdf') {
          toast.error('Exam papers must be PDF documents');
          setIsUploading(false);
          return;
        }
        
        try {
          await uploadExamFile(uploadedFile, insertedExam.id, 'paper', selectedBoard);
        } catch (err: any) {
          console.error("Error uploading paper:", err);
          toast.error(`Failed to upload paper: ${err.message}`);
        }
      }
      setUploadProgress(50);
      
      if (solutionFile) {
        const fileExt = solutionFile.name.split('.').pop()?.toLowerCase();
        if (fileExt !== 'pdf') {
          toast.error('Solutions must be PDF documents');
        } else {
          try {
            await uploadExamFile(solutionFile, insertedExam.id, 'solution', selectedBoard);
          } catch (err: any) {
            console.error("Error uploading solution:", err);
            toast.error(`Failed to upload solution: ${err.message}`);
          }
        }
      }
      setUploadProgress(70);
      
      if (questions.length > 0) {
        console.log("Questions before adding exam_id:", questions);
        
        const questionsWithExamId = questions.map(question => {
          let processedQuestion = { ...question, exam_id: insertedExam.id };
          
          if (processedQuestion.is_multi_correct && Array.isArray(processedQuestion.correct_answer)) {
            console.log("Processing multi-correct question:", processedQuestion);
          }
          
          return processedQuestion;
        });
        
        console.log("Questions to be inserted:", questionsWithExamId);
        await createQuestions(questionsWithExamId);
      }
      setUploadProgress(90);
      
      setRecentUploads(prev => [
        {
          id: insertedExam.id,
          name: insertedExam.title,
          board: insertedExam.board,
          class: insertedExam.class,
          year: insertedExam.year
        },
        ...prev.filter(upload => upload.board !== "WBJEE" || upload.id !== insertedExam.id).slice(0, 4)
      ]);
      
      setUploadProgress(100);
      toast.success("Exam created successfully with PDF and MCQs!");
      resetForm();
    } catch (error: any) {
      console.error("Error creating unified exam:", error);
      setError(error.message || "Failed to create exam");
      toast.error(`Failed to create exam: ${error.message}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Admin Upload Panel</h1>
            <p className="text-muted-foreground mb-8">
              Upload exam papers and create MCQ tests for students to practice
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Unified Exam</CardTitle>
                    <CardDescription>
                      Upload PDF papers and create MCQ questions for the same exam
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {!bucketsReady && (
                      <Alert className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Storage Initializing</AlertTitle>
                        <AlertDescription>
                          The storage system is initializing. Please wait a moment before uploading files.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Exam Details</h3>
                      
                      <ExamTypeSelector 
                        examType={examType}
                        selectedBoard={selectedBoard}
                        onExamTypeChange={setExamType}
                        onBoardChange={setSelectedBoard}
                      />
                      
                      <ExamDetailsForm 
                        examTitle={examTitle}
                        selectedClass={selectedClass}
                        selectedChapter={selectedChapter}
                        selectedYear={selectedYear}
                        examDuration={examDuration}
                        isPremium={isPremium}
                        onExamTitleChange={setExamTitle}
                        onClassChange={setSelectedClass}
                        onChapterChange={setSelectedChapter}
                        onYearChange={setSelectedYear}
                        onDurationChange={setExamDuration}
                        onPremiumChange={setIsPremium}
                      />
                    </div>
                    
                    <UnifiedExamForm
                      uploadedFile={uploadedFile}
                      solutionFile={solutionFile}
                      questions={questions}
                      isUploading={isUploading}
                      uploadProgress={uploadProgress}
                      onFileChange={handleFileChange}
                      onSolutionFileChange={handleSolutionFileChange}
                      onSaveQuestion={handleSaveQuestion}
                      onRemoveQuestion={handleRemoveQuestion}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      disabled={isUploading}
                      className="mr-auto"
                      onClick={resetForm}
                    >
                      Clear Form
                    </Button>
                    <Button 
                      onClick={handleCreateUnifiedExam} 
                      disabled={!isExamFormValid() || isUploading}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isUploading ? "Creating..." : "Create Unified Exam"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Mentor Verification</CardTitle>
                    <CardDescription>Review and verify mentor applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => window.location.href = '/admin/mentor-verification'}
                    >
                      View Applications
                    </Button>
                  </CardContent>
                </Card>
                <RecentUploads uploads={recentUploads} />
                <div className="mt-4">
                  <UploadInstructions type="unified" />
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default AdminUploadPage;
