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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchExamById, Exam } from "@/services/examService";
import LoadingAnimation from "@/components/LoadingAnimation";

interface QuestionForm {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  marks?: number;
  negative_marks?: number;
  is_multi_correct?: boolean;
}

const AdminQuestionUploadPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
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
        
        if (existingQuestions) {
          const formattedQuestions = existingQuestions.map(q => ({
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_answer: q.correct_answer,
            marks: q.marks,
            negative_marks: q.negative_marks,
            is_multi_correct: q.is_multi_correct
          }));
          setQuestions(formattedQuestions);
        } else {
          setQuestions([createEmptyQuestion()]);
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
  
  const createEmptyQuestion = (): QuestionForm => ({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "a"
  });
  
  const handleQuestionChange = (index: number, field: keyof QuestionForm, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };
  
  const handleAddQuestion = () => {
    setQuestions([...questions, createEmptyQuestion()]);
  };
  
  const handleRemoveQuestion = (index: number) => {
    if (questions.length === 1) {
      toast({ title: "Error", description: "You must have at least one question" });
      return;
    }
    
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };
  
  const handleSaveQuestions = async () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text || !q.option_a || !q.option_b || !q.option_c || !q.option_d) {
        toast({ 
          title: "Validation Error", 
          description: `Question ${i+1} has empty fields` 
        });
        return;
      }
    }
    
    setIsSaving(true);
    
    try {
      const questionsToInsert = questions.map((q, index) => ({
        exam_id: examId,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer,
        order_number: index + 1,
        marks: q.marks,
        negative_marks: q.negative_marks,
        is_multi_correct: q.is_multi_correct
      }));
      
      const { error } = await supabase
        .from("questions")
        .insert(questionsToInsert);
        
      if (error) {
        throw new Error(error.message);
      }
      
      toast({ title: "Success", description: "Questions saved successfully" });
      navigate("/admin/exams");
      
    } catch (error: any) {
      console.error("Error saving questions:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to save questions" 
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
              <h1 className="text-3xl font-bold">Add Exam Questions</h1>
              <p className="text-muted-foreground mt-1">{exam?.title}</p>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="space-y-6 mb-6">
            {questions.map((question, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveQuestion(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor={`question-${index}`}>Question Text</Label>
                    <Textarea
                      id={`question-${index}`}
                      value={question.question_text}
                      onChange={(e) => handleQuestionChange(index, "question_text", e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`option-a-${index}`}>Option A</Label>
                      <Input
                        id={`option-a-${index}`}
                        value={question.option_a}
                        onChange={(e) => handleQuestionChange(index, "option_a", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`option-b-${index}`}>Option B</Label>
                      <Input
                        id={`option-b-${index}`}
                        value={question.option_b}
                        onChange={(e) => handleQuestionChange(index, "option_b", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`option-c-${index}`}>Option C</Label>
                      <Input
                        id={`option-c-${index}`}
                        value={question.option_c}
                        onChange={(e) => handleQuestionChange(index, "option_c", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`option-d-${index}`}>Option D</Label>
                      <Input
                        id={`option-d-${index}`}
                        value={question.option_d}
                        onChange={(e) => handleQuestionChange(index, "option_d", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <RadioGroup
                      value={question.correct_answer}
                      onValueChange={(value) => handleQuestionChange(index, "correct_answer", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="a" id={`correct-a-${index}`} />
                        <Label htmlFor={`correct-a-${index}`}>A</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="b" id={`correct-b-${index}`} />
                        <Label htmlFor={`correct-b-${index}`}>B</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="c" id={`correct-c-${index}`} />
                        <Label htmlFor={`correct-c-${index}`}>C</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="d" id={`correct-d-${index}`} />
                        <Label htmlFor={`correct-d-${index}`}>D</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={handleAddQuestion}
              className="flex-1 sm:flex-grow-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Question
            </Button>
            
            <Button 
              onClick={handleSaveQuestions} 
              disabled={isSaving}
              className="flex-1 sm:flex-grow-0"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save All Questions"}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminQuestionUploadPage;
