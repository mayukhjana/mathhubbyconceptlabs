
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PaperCard from "@/components/PaperCard";
import { 
  fetchEntranceExams, 
  getFileDownloadUrl
} from "@/services/examService";
import { Exam, ENTRANCE_OPTIONS } from "@/services/exam/types";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ExamPapersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  
  const loadExams = useCallback(async () => {
    setLoading(true);
    try {
      const examData = await fetchEntranceExams();
      console.log("Loaded entrance exams:", examData.length, "exams");
      
      if (user) {
        const { data: attemptedExams } = await supabase
          .from('user_results')
          .select('exam_id')
          .eq('user_id', user.id);
          
        const attemptedExamIds = new Set(attemptedExams?.map(result => result.exam_id) || []);
        
        const examDataWithAttempted = examData.map(exam => ({
          ...exam,
          isAttempted: attemptedExamIds.has(exam.id)
        }));
        
        setExams(examDataWithAttempted);
      } else {
        setExams(examData);
      }
      
      setLastRefresh(Date.now());
      toast({
        title: "Exams refreshed",
        description: `Successfully loaded ${examData.length} exams`
      });
    } catch (error) {
      console.error("Error loading exams:", error);
      toast({
        title: "Error",
        description: "Failed to load exams. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);
  
  useEffect(() => {
    loadExams();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadExams();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, loadExams]);
  
  const examCategories = [
    { id: "all", label: "All Entrance Exams" },
    ...ENTRANCE_OPTIONS.map(board => ({ id: board, label: board }))
  ];
  
  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.board.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.year.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = activeCategory === "all" || exam.board === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
  };
  
  const handleRefresh = () => {
    loadExams();
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
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Entrance Exam Papers</h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search for exam papers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={activeCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {examCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="whitespace-nowrap"
            >
              Refresh Exams
            </Button>
          </div>
          
          <div className="mt-6">
            <ExamsList 
              exams={filteredExams} 
              userIsPremium={isPremium}
              searchQuery={searchQuery}
              lastRefresh={lastRefresh}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const ExamsList = ({ 
  exams, 
  userIsPremium,
  searchQuery,
  lastRefresh
}: { 
  exams: Exam[], 
  userIsPremium: boolean,
  searchQuery: string,
  lastRefresh: number
}) => {
  if (exams.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground">
          {searchQuery ? 
            "No exam papers found matching your search." :
            "No exam papers available in this category yet."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map(exam => (
        <ExamPaperCard 
          key={`${exam.id}-${lastRefresh}`} 
          exam={exam} 
          userIsPremium={userIsPremium} 
        />
      ))}
    </div>
  );
};

const ExamPaperCard = ({ exam, userIsPremium }: { exam: Exam, userIsPremium: boolean }) => {
  const [paperUrl, setPaperUrl] = useState<string | null>(null);
  const [solutionUrl, setSolutionUrl] = useState<string | null>(null);
  const [isAttempted, setIsAttempted] = useState(false);
  const [hasMcqQuestions, setHasMcqQuestions] = useState(false);
  const [examResult, setExamResult] = useState<{
    score: number;
    totalQuestions: number;
    obtainedMarks: number;
    totalMarks: number;
  } | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const paperDownloadUrl = await getFileDownloadUrl(exam.id, 'paper', exam.board);
        const solutionDownloadUrl = await getFileDownloadUrl(exam.id, 'solution', exam.board);
        
        setPaperUrl(paperDownloadUrl);
        setSolutionUrl(solutionDownloadUrl);
      } catch (error) {
        console.error("Error fetching download URLs:", error);
      }
    };

    const checkAttempted = async () => {
      if (user) {
        const { data: results } = await supabase
          .from('user_results')
          .select('*')
          .eq('exam_id', exam.id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (results) {
          setIsAttempted(true);
          setExamResult({
            score: results.score,
            totalQuestions: results.total_questions,
            obtainedMarks: results.obtained_marks,
            totalMarks: results.total_marks
          });
        }
      }
    };
    
    const checkMcqQuestions = async () => {
      try {
        const { data: questions, error } = await supabase
          .from('questions')
          .select('id')
          .eq('exam_id', exam.id)
          .limit(1);
        
        if (error) {
          console.error("Error checking MCQ questions:", error);
        } else {
          setHasMcqQuestions(questions && questions.length > 0);
        }
      } catch (error) {
        console.error("Error checking MCQ questions:", error);
      }
    };
    
    fetchUrls();
    checkAttempted();
    checkMcqQuestions();
  }, [exam.id, exam.board, user]);
  
  return (
    <PaperCard 
      title={exam.title}
      description={`${exam.board} ${exam.year} Entrance Exam`}
      year={exam.year}
      isPremium={exam.is_premium}
      userIsPremium={userIsPremium}
      downloadUrl={paperUrl || undefined}
      solutionUrl={solutionUrl || undefined}
      practiceUrl={`/exams/${exam.id}`}
      examBoard={exam.board}
      isAttempted={exam.isAttempted || isAttempted}
      requireAuth={true}
      isFullMock={true}
      hasMcqQuestions={hasMcqQuestions}
      examResult={examResult || undefined}
    />
  );
};

export default ExamPapersPage;
