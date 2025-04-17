
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchExamById, Exam } from "@/services/examService";
import LoadingAnimation from "@/components/LoadingAnimation";
import QuestionForm, { QuestionData } from "@/components/QuestionForm";
import { toast as sonnerToast } from "sonner";

const AdminQuestionUploadPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<Exam | null>(null);
  const [examDuration, setExamDuration] = useState<number>(60);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const loadExamAndQuestions = async () => {
      if (!examId) return;
      
      try {
        const [examData, { data: existingQuestions }] = await Promise.all([
          fetchExamById(examId),
          supabase
            .from('questions')
            .select('*')
            .eq('exam_id', examId)
            .order('order_number')
        ]);
        
        setExam(examData);
        if (examData?.duration) {
          setExamDuration(examData.duration);
        }
        
        if (existingQuestions && existingQuestions.length > 0) {
          const formattedQuestions = existingQuestions.map(q => ({
            id: q.id,
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_answer: q.correct_answer,
            marks: q.marks || 1, // Ensure marks is never null
            negative_marks: q.negative_marks || 0,
            is_multi_correct: q.is_multi_correct || false,
            order_number: q.order_number,
            exam_id: q.exam_id
          }));
          setQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error('Error loading exam and questions:', error);
        toast({
          title: "Error",
          description: "Failed to load exam data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadExamAndQuestions();
  }, [examId, toast]);
  
  const handleSaveQuestion = (questionData: QuestionData) => {
    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = {
        ...questionData,
        order_number: editingQuestionIndex + 1
      };
      setQuestions(updatedQuestions);
      sonnerToast.success("Question updated successfully");
    } else {
      // Add new question
      setQuestions([...questions, {
        ...questionData,
        order_number: questions.length + 1
      }]);
      sonnerToast.success("Question added successfully");
    }
    
    setEditingQuestionIndex(null);
    setShowQuestionForm(false);
  };
  
  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setShowQuestionForm(true);
  };
  
  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    
    // Update order numbers
    const reorderedQuestions = updatedQuestions.map((q, idx) => ({
      ...q,
      order_number: idx + 1
    }));
    
    setQuestions(reorderedQuestions);
    sonnerToast.success("Question removed");
  };
  
  const handleSaveExam = async () => {
    if (!examId) return;
    
    try {
      setIsSaving(true);
      
      // First update the exam duration
      if (exam && exam.duration !== examDuration) {
        await supabase
          .from('exams')
          .update({ duration: examDuration })
          .eq('id', examId);
      }
      
      // Delete all existing questions
      await supabase
        .from('questions')
        .delete()
        .eq('exam_id', examId);
      
      if (questions.length > 0) {
        // Insert all questions
        const questionsToInsert = questions.map(q => ({
          exam_id: examId,
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: Array.isArray(q.correct_answer) ? q.correct_answer.join(',') : q.correct_answer,
          order_number: q.order_number,
          marks: q.marks || 1, // Ensure marks is never null
          negative_marks: q.negative_marks || 0,
          is_multi_correct: q.is_multi_correct || false
        }));
        
        const { error } = await supabase
          .from('questions')
          .insert(questionsToInsert);
          
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Exam questions saved successfully"
      });
      
      navigate('/admin/exam-upload');
      
    } catch (error) {
      console.error("Error saving questions:", error);
      toast({
        title: "Error",
        description: "Failed to save exam questions",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <LoadingAnimation />
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Modify Exam</h1>
              <p className="text-muted-foreground mt-1">{exam?.title}</p>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Exam Settings</CardTitle>
                <CardDescription>Manage exam duration and other settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="duration" className="text-sm font-medium">
                        Duration (minutes)
                      </label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={examDuration}
                        onChange={(e) => setExamDuration(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
              <Button 
                onClick={() => {
                  setEditingQuestionIndex(null);
                  setShowQuestionForm(true);
                }}
                variant="outline"
                disabled={showQuestionForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
            
            {showQuestionForm && (
              <QuestionForm
                initialData={editingQuestionIndex !== null ? questions[editingQuestionIndex] : undefined}
                onSave={handleSaveQuestion}
                onCancel={() => {
                  setEditingQuestionIndex(null);
                  setShowQuestionForm(false);
                }}
                index={editingQuestionIndex !== null ? editingQuestionIndex : questions.length}
              />
            )}
            
            {!showQuestionForm && questions.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">No questions added yet</p>
                  <Button 
                    onClick={() => setShowQuestionForm(true)}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Question
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {!showQuestionForm && questions.map((question, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">Question {index + 1}</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditQuestion(index)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleRemoveQuestion(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>{question.question_text}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="space-y-1">
                        <p><span className="font-medium">A:</span> {question.option_a}</p>
                        <p><span className="font-medium">B:</span> {question.option_b}</p>
                      </div>
                      <div className="space-y-1">
                        <p><span className="font-medium">C:</span> {question.option_c}</p>
                        <p><span className="font-medium">D:</span> {question.option_d}</p>
                      </div>
                    </div>
                    <div className="flex text-sm mt-4 justify-between">
                      <div>
                        <span className="font-medium">Correct:</span> {
                          Array.isArray(question.correct_answer) 
                            ? question.correct_answer.map(a => a.toUpperCase()).join(', ') 
                            : question.correct_answer.toUpperCase()
                        }
                        {question.is_multi_correct && <span className="text-xs ml-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">Multiple Correct</span>}
                      </div>
                      <div>
                        <span className="font-medium">Marks:</span> {question.marks} | <span className="font-medium">Negative:</span> {question.negative_marks}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleSaveExam} 
              disabled={isSaving}
              size="lg"
            >
              {isSaving ? "Saving..." : "Save Exam"}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminQuestionUploadPage;
