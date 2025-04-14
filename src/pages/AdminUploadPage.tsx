import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import QuestionForm, { QuestionData } from "@/components/QuestionForm";
import { Save, Pencil, Trash, Play } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createExam, createQuestions, uploadExamFile, fetchEntranceExams } from "@/services/examService";
import ExamTypeSelector from "@/components/admin/ExamTypeSelector";
import FileUploadZone from "@/components/admin/FileUploadZone";
import RecentUploads from "@/components/admin/RecentUploads";
import ExamDetailsForm from "@/components/admin/ExamDetailsForm";
import UploadInstructions from "@/components/admin/UploadInstructions";

const AdminUploadPage = () => {
  const { user } = useAuth();
  
  // State management
  const [examType, setExamType] = useState("entrance");
  const [selectedBoard, setSelectedBoard] = useState("WBJEE");
  const [selectedClass, setSelectedClass] = useState("11-12");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [examTitle, setExamTitle] = useState("");
  const [examDuration, setExamDuration] = useState(60);
  const [isPremium, setIsPremium] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentUploads, setRecentUploads] = useState<{
    id: string;
    name: string;
    board: string;
    class: string;
    year: string;
  }[]>([]);

  // Reset form to initial state
  const resetForm = () => {
    setExamTitle("");
    setSelectedBoard("WBJEE");
    setSelectedClass("11-12");
    setSelectedChapter("");
    setSelectedYear(new Date().getFullYear().toString());
    setExamDuration(60);
    setIsPremium(false);
    setUploadedFile(null);
    setSolutionFile(null);
    setQuestions([]);
    setEditingQuestionIndex(null);
  };

  // Load recent uploads
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
          year: exam.year,
          url: `/exams/${exam.id}`
        }));
        
        setRecentUploads(formattedUploads);
      } catch (error) {
        console.error("Error loading recent uploads:", error);
      }
    };
    
    loadRecentUploads();
  }, []);

  // File handling
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setUploadedFile(null);
      return;
    }
    setUploadedFile(event.target.files[0]);
  };
  
  const handleSolutionFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSolutionFile(null);
      return;
    }
    setSolutionFile(event.target.files[0]);
  };

  // Question management
  const handleSaveQuestion = (questionData: QuestionData) => {
    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = questionData;
      setQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
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

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
  };

  // Form validation
  const isExamFormValid = () => {
    return (
      examTitle && 
      selectedBoard && 
      selectedClass && 
      selectedYear &&
      examDuration > 0 &&
      uploadedFile !== null
    );
  };

  // Create unified exam with both PDF and MCQs
  const handleCreateUnifiedExam = async () => {
    if (!user) {
      toast.error("You must be logged in to create an exam");
      return;
    }
    
    if (!isExamFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Create the exam record first
      const examPayload = {
        title: examTitle || `${selectedBoard} Mathematics ${selectedYear}`,
        board: selectedBoard,
        class: selectedClass,
        chapter: selectedChapter || null,
        year: selectedYear,
        duration: examDuration,
        is_premium: isPremium
      };
      
      const insertedExam = await createExam(examPayload);
      setUploadProgress(30);
      
      // Upload the question paper PDF
      if (uploadedFile) {
        await uploadExamFile(uploadedFile, insertedExam.id, 'paper', selectedBoard);
      }
      setUploadProgress(50);
      
      // Upload the solution PDF if provided
      if (solutionFile) {
        await uploadExamFile(solutionFile, insertedExam.id, 'solution', selectedBoard);
      }
      setUploadProgress(70);
      
      // Create MCQ questions if provided
      if (questions.length > 0) {
        const questionsWithExamId = questions.map(question => ({
          ...question,
          exam_id: insertedExam.id
        }));
        
        await createQuestions(questionsWithExamId);
      }
      setUploadProgress(90);
      
      // Add to recent uploads
      setRecentUploads(prev => [
        {
          id: insertedExam.id,
          name: insertedExam.title,
          board: insertedExam.board,
          class: insertedExam.class,
          year: insertedExam.year,
          url: `/exams/${insertedExam.id}`
        },
        ...prev.filter(upload => upload.board !== "WBJEE" || upload.id !== insertedExam.id).slice(0, 4)
      ]);
      
      setUploadProgress(100);
      
      // Reset the form
      resetForm();
      
      toast.success("Exam created successfully with PDF and MCQs!");
    } catch (error: any) {
      console.error("Error creating unified exam:", error);
      toast.error(`Failed to create exam: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
                    
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="font-medium">PDF Papers</h3>
                      
                      <FileUploadZone 
                        id="file-upload"
                        label="Exam Paper (PDF)"
                        file={uploadedFile}
                        onChange={handleFileChange}
                        required={true}
                      />
                      
                      <FileUploadZone 
                        id="solution-upload"
                        label="Solution (PDF, Optional)"
                        file={solutionFile}
                        onChange={handleSolutionFileChange}
                      />
                    </div>
                    
                    <div className="border-t pt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">MCQ Questions (Optional)</h3>
                        <span className="text-sm text-muted-foreground">
                          {questions.length} questions added
                        </span>
                      </div>
                      
                      {questions.length > 0 && editingQuestionIndex === null && (
                        <div className="space-y-4 mb-4">
                          {questions.map((question, index) => (
                            <div 
                              key={index} 
                              className="border rounded-md p-4 hover:border-mathprimary/50 transition-colors"
                            >
                              <div className="flex justify-between mb-2">
                                <h4 className="font-medium">Question #{question.order_number}</h4>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditQuestion(index)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleRemoveQuestion(index)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="mb-2">{question.question_text}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                {['a', 'b', 'c', 'd'].map((option) => (
                                  <div 
                                    key={option}
                                    className={`p-2 rounded ${
                                      question.correct_answer === option 
                                        ? 'bg-green-100' 
                                        : 'bg-gray-100'
                                    }`}
                                  >
                                    {option.toUpperCase()}: {question[`option_${option}` as keyof typeof question]}
                                    {question.correct_answer === option && (
                                      <span className="ml-2 text-green-600 font-medium">(Correct)</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {editingQuestionIndex !== null ? (
                        <QuestionForm
                          initialData={questions[editingQuestionIndex]}
                          onSave={handleSaveQuestion}
                          onCancel={() => setEditingQuestionIndex(null)}
                          index={editingQuestionIndex}
                        />
                      ) : (
                        <QuestionForm
                          onSave={handleSaveQuestion}
                          index={questions.length}
                        />
                      )}
                    </div>
                    
                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-mathprimary h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
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
