
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import QuestionForm, { QuestionData } from "@/components/QuestionForm";
import { Upload, File, Check, Plus, Save, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Type for exam information
interface ExamData {
  title: string;
  board: string;
  class: string;
  chapter: string;
  year: string;
  duration: number;
  is_premium: boolean;
}

// Define interface for the exam database record
interface ExamRecord extends ExamData {
  id: string;
  created_at?: string;
  created_by?: string;
}

const AdminUploadPage = () => {
  // Exam basics state
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [examDuration, setExamDuration] = useState(60);
  const [isPremium, setIsPremium] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Questions state
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  
  // API states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentUploads, setRecentUploads] = useState<{
    id: string;
    name: string;
    board: string;
    class: string;
    year: string;
    url: string;
  }[]>([]);
  
  // Available boards and classes
  const boards = ["WBJEE", "JEE MAINS", "JEE ADVANCED"];
  const classes = ["10", "12"];
  const years = Array.from({ length: 6 }, (_, i) => (2024 - i).toString());
  const chapters = {
    "10": ["algebra", "geometry", "statistics", "trigonometry", "calculus"],
    "12": ["algebra", "calculus", "statistics", "vectors", "matrices", "probability"]
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setUploadedFile(null);
      return;
    }
    setUploadedFile(event.target.files[0]);
  };
  
  // Add or update question
  const handleSaveQuestion = (questionData: QuestionData) => {
    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = questionData;
      setQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
      toast.success("Question updated!");
    } else {
      // Add new question
      setQuestions([...questions, questionData]);
      toast.success("Question added!");
    }
  };
  
  // Remove question
  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    // Re-number remaining questions
    const renumberedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      order_number: i + 1
    }));
    setQuestions(renumberedQuestions);
    toast.success("Question removed");
  };
  
  // Edit question
  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
  };
  
  // Check if form is valid
  const isExamFormValid = () => {
    return (
      examTitle && 
      selectedBoard && 
      selectedClass && 
      selectedYear &&
      examDuration > 0
    );
  };
  
  // Create a new MCQ exam
  const handleCreateMCQExam = async () => {
    if (!isExamFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (questions.length < 1) {
      toast.error("Please add at least one question");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + 10;
          if (next >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return next;
        });
      }, 300);
      
      // Prepare exam data
      const examPayload: ExamData = {
        title: examTitle,
        board: selectedBoard,
        class: selectedClass,
        chapter: selectedChapter,
        year: selectedYear,
        duration: examDuration,
        is_premium: isPremium
      };
      
      // Insert exam
      const { data: insertedExam, error: examError } = await supabase
        .from('exams')
        .insert(examPayload)
        .select()
        .single();
      
      if (examError) {
        throw new Error(`Error creating exam: ${examError.message}`);
      }
      
      if (!insertedExam) {
        throw new Error("Failed to create exam: No data returned from insert operation");
      }
      
      // Insert questions
      const questionsWithExamId = questions.map(question => ({
        ...question,
        exam_id: insertedExam.id
      }));
      
      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsWithExamId);
      
      if (questionsError) {
        throw new Error(`Error adding questions: ${questionsError.message}`);
      }
      
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
        ...prev.slice(0, 4) // Keep only 5 most recent
      ]);
      
      // Complete progress bar
      setUploadProgress(100);
      
      // Reset form
      setExamTitle("");
      setSelectedBoard("");
      setSelectedClass("");
      setSelectedChapter("");
      setSelectedYear("");
      setExamDuration(60);
      setIsPremium(true);
      setQuestions([]);
      
      toast.success("MCQ exam created successfully!");
    } catch (error: any) {
      console.error("Error creating MCQ exam:", error);
      toast.error(`Failed to create exam: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Upload PDF paper
  const handleUploadPDF = async () => {
    if (!uploadedFile || !selectedBoard || !selectedClass || !selectedYear) {
      toast.error("Please fill in all fields and select a file to upload");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create a file path format like: WBJEE_class12_2022.pdf
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${selectedBoard.replace(/\s/g, '_')}_class${selectedClass}_${selectedYear}.${fileExt}`;
      const filePath = `exam_papers/${fileName}`;
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          return next;
        });
      }, 400);
      
      // Create the exam record
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .insert({
          title: `${selectedBoard} Mathematics ${selectedYear}`,
          board: selectedBoard,
          class: selectedClass,
          year: selectedYear,
          duration: examDuration,
          is_premium: isPremium
        })
        .select()
        .single();
        
      if (examError) {
        throw new Error(`Error creating exam record: ${examError.message}`);
      }
      
      // Wait for "upload" to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to recent uploads
      setRecentUploads(prev => [
        {
          id: examData.id,
          name: examData.title,
          board: selectedBoard,
          class: selectedClass,
          year: selectedYear,
          url: `/exam-papers?board=${selectedBoard}`
        },
        ...prev.slice(0, 4) // Keep only 5 most recent
      ]);
      
      // Reset form
      setSelectedBoard("");
      setSelectedClass("");
      setSelectedYear("");
      setUploadedFile(null);
      
      // Show success message
      toast.success("File uploaded successfully! The exam will now appear in the Entrance Exams section.");
      
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to upload file: ${error.message}`);
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
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="upload">Upload PDF Papers</TabsTrigger>
                <TabsTrigger value="mcq">Create MCQ Exam</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Upload Form */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upload Exam Paper</CardTitle>
                        <CardDescription>
                          Upload PDF files of exam papers to make them available to students
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="board">Board</Label>
                            <Select 
                              value={selectedBoard} 
                              onValueChange={setSelectedBoard}
                            >
                              <SelectTrigger id="board">
                                <SelectValue placeholder="Select Board" />
                              </SelectTrigger>
                              <SelectContent>
                                {boards.map(board => (
                                  <SelectItem key={board} value={board}>
                                    {board}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="class">Class</Label>
                            <Select 
                              value={selectedClass} 
                              onValueChange={setSelectedClass}
                            >
                              <SelectTrigger id="class">
                                <SelectValue placeholder="Select Class" />
                              </SelectTrigger>
                              <SelectContent>
                                {classes.map(cls => (
                                  <SelectItem key={cls} value={cls}>
                                    Class {cls}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Select 
                              value={selectedYear} 
                              onValueChange={setSelectedYear}
                            >
                              <SelectTrigger id="year">
                                <SelectValue placeholder="Select Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {years.map(year => (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="file-upload">Exam Paper (PDF)</Label>
                          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                            {uploadedFile ? (
                              <div className="flex items-center gap-2">
                                <File size={24} className="text-mathprimary" />
                                <span>{uploadedFile.name}</span>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  Drag and drop your file here, or click to select
                                </p>
                              </div>
                            )}
                            <Input 
                              id="file-upload" 
                              type="file" 
                              accept=".pdf" 
                              onChange={handleFileChange}
                              className="hidden" 
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="premium"
                            checked={isPremium}
                            onCheckedChange={setIsPremium}
                          />
                          <Label htmlFor="premium">Mark as Premium Content</Label>
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
                          onClick={handleUploadPDF} 
                          disabled={!uploadedFile || !selectedBoard || !selectedClass || !selectedYear || isUploading}
                          className="ml-auto"
                        >
                          {isUploading ? "Uploading..." : "Upload Paper"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  {/* Recent Uploads */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Uploads</CardTitle>
                        <CardDescription>
                          Recently uploaded exam papers
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {recentUploads.length > 0 ? (
                          <ul className="space-y-3">
                            {recentUploads.map(upload => (
                              <li key={upload.id} className="border rounded-md p-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-medium">{upload.board} Class {upload.class}</div>
                                    <div className="text-sm text-muted-foreground">Year: {upload.year}</div>
                                  </div>
                                  <div className="bg-green-100 text-green-800 p-1 rounded">
                                    <Check size={14} />
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground text-sm">No recent uploads</p>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle>Upload Instructions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                          <li>Upload files in PDF format</li>
                          <li>Maximum file size: 10MB</li>
                          <li>Name format will be automatically generated</li>
                          <li>Uploaded papers will be immediately available to students in the Entrance Exams section</li>
                          <li>For premium papers, students will need a subscription</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mcq">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* MCQ Creation Form */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create MCQ Exam</CardTitle>
                        <CardDescription>
                          Create multiple-choice question exams for students to practice online
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-medium">Exam Details</h3>
                          
                          <div className="space-y-2">
                            <Label htmlFor="exam-title">Exam Title</Label>
                            <Input
                              id="exam-title"
                              value={examTitle}
                              onChange={(e) => setExamTitle(e.target.value)}
                              placeholder="E.g., WBJEE Mathematics 2024"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="mcq-board">Board</Label>
                              <Select 
                                value={selectedBoard} 
                                onValueChange={setSelectedBoard}
                              >
                                <SelectTrigger id="mcq-board">
                                  <SelectValue placeholder="Select Board" />
                                </SelectTrigger>
                                <SelectContent>
                                  {boards.map(board => (
                                    <SelectItem key={board} value={board}>
                                      {board}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="mcq-class">Class</Label>
                              <Select 
                                value={selectedClass} 
                                onValueChange={setSelectedClass}
                              >
                                <SelectTrigger id="mcq-class">
                                  <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                  {classes.map(cls => (
                                    <SelectItem key={cls} value={cls}>
                                      Class {cls}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="mcq-year">Year</Label>
                              <Select 
                                value={selectedYear} 
                                onValueChange={setSelectedYear}
                              >
                                <SelectTrigger id="mcq-year">
                                  <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map(year => (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="mcq-chapter">Chapter (Optional)</Label>
                              <Select 
                                value={selectedChapter} 
                                onValueChange={setSelectedChapter}
                                disabled={!selectedClass}
                              >
                                <SelectTrigger id="mcq-chapter">
                                  <SelectValue placeholder="Select Chapter" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedClass && (
                                    chapters[selectedClass as "10" | "12"].map(chapter => (
                                      <SelectItem key={chapter} value={chapter}>
                                        {chapter.charAt(0).toUpperCase() + chapter.slice(1)}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="mcq-duration">Duration (minutes)</Label>
                              <Input
                                id="mcq-duration"
                                type="number"
                                min="5"
                                value={examDuration}
                                onChange={(e) => setExamDuration(Number(e.target.value))}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="premium"
                              checked={isPremium}
                              onCheckedChange={setIsPremium}
                            />
                            <Label htmlFor="premium">Mark as Premium Content</Label>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Questions</h3>
                            <span className="text-sm text-muted-foreground">
                              {questions.length} questions added
                            </span>
                          </div>
                          
                          {/* List of existing questions */}
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
                                    <div className={`p-2 rounded ${question.correct_answer === 'a' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                      A: {question.option_a}
                                      {question.correct_answer === 'a' && <span className="ml-2 text-green-600 font-medium">(Correct)</span>}
                                    </div>
                                    <div className={`p-2 rounded ${question.correct_answer === 'b' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                      B: {question.option_b}
                                      {question.correct_answer === 'b' && <span className="ml-2 text-green-600 font-medium">(Correct)</span>}
                                    </div>
                                    <div className={`p-2 rounded ${question.correct_answer === 'c' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                      C: {question.option_c}
                                      {question.correct_answer === 'c' && <span className="ml-2 text-green-600 font-medium">(Correct)</span>}
                                    </div>
                                    <div className={`p-2 rounded ${question.correct_answer === 'd' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                      D: {question.option_d}
                                      {question.correct_answer === 'd' && <span className="ml-2 text-green-600 font-medium">(Correct)</span>}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Question form */}
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
                          onClick={() => {
                            setExamTitle("");
                            setSelectedBoard("");
                            setSelectedClass("");
                            setSelectedChapter("");
                            setSelectedYear("");
                            setExamDuration(60);
                            setIsPremium(true);
                            setQuestions([]);
                          }}
                        >
                          Clear Form
                        </Button>
                        <Button 
                          onClick={handleCreateMCQExam} 
                          disabled={!isExamFormValid() || questions.length === 0 || isUploading}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {isUploading ? "Saving..." : "Create Exam"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  {/* Tips and Recent Uploads */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent MCQ Exams</CardTitle>
                        <CardDescription>
                          Recently created multiple-choice exams
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {recentUploads.length > 0 ? (
                          <ul className="space-y-3">
                            {recentUploads.map(upload => (
                              <li key={upload.id} className="border rounded-md p-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-medium">{upload.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {upload.board} Class {upload.class}
                                    </div>
                                  </div>
                                  <div className="bg-green-100 text-green-800 p-1 rounded">
                                    <Check size={14} />
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground text-sm">No recent MCQ exams</p>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle>Creating Good MCQs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                          <li>Keep questions clear and concise</li>
                          <li>Make sure there is only one correct answer</li>
                          <li>Avoid using "All of the above" or "None of the above"</li>
                          <li>Make distractors plausible</li>
                          <li>Use consistent grammar across all options</li>
                          <li>Aim for 20-25 questions per exam for an hour</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default AdminUploadPage;
