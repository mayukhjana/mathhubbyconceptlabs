import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { BookOpen, ClockIcon, Search, Lock, CheckCircle, BarChart3 } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Exam {
  id: string;
  title: string;
  board: string;
  class: string;
  year: string;
  duration: number;
  is_premium: boolean;
}

const EntranceExamsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [examFilter, setExamFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [completedExamIds, setCompletedExamIds] = useState<string[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch entrance exams
        const { data: examsData, error: examsError } = await supabase
          .from("exams")
          .select("*")
          .eq("category", "entrance")
          .order("year", { ascending: false });
        
        if (examsError) throw examsError;
        setExams(examsData || []);
        
        // Check premium status
        if (user) {
          const { data: subscriptionData } = await supabase
            .from("premium_subscriptions")
            .select("status, expires_at")
            .eq("user_id", user.id)
            .eq("status", "active")
            .single();
          
          if (subscriptionData && new Date(subscriptionData.expires_at) > new Date()) {
            setIsPremium(true);
          }
          
          // Load completed exams
          const { data: resultsData, error: resultsError } = await supabase
            .from("user_results")
            .select('exam_id')
            .eq("user_id", user.id);
          
          if (resultsError) throw resultsError;
          
          if (resultsData) {
            const examIds = resultsData.map(result => result.exam_id);
            setCompletedExamIds(examIds);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);
  
  const isExamCompleted = (examId: string) => {
    return completedExamIds.includes(examId);
  };
  
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         exam.board.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExam = examFilter === "all" || exam.board === examFilter;
    const matchesYear = yearFilter === "all" || exam.year === yearFilter;
    
    return matchesSearch && matchesExam && matchesYear;
  });
  
  const uniqueExams = Array.from(new Set(exams.map(exam => exam.board)));
  const uniqueYears = Array.from(new Set(exams.map(exam => exam.year)));
  
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-accent/10 to-background py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-4 text-foreground">Entrance Exams</h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
              Prepare for major engineering and competitive entrance examinations with our comprehensive practice papers.
            </p>
            
            {/* Filters */}
            <div className="bg-card rounded-lg shadow-sm border p-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="text"
                    placeholder="Search for exams..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <Select value={examFilter} onValueChange={setExamFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Exam" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exams</SelectItem>
                      {uniqueExams.map(exam => (
                        <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-48">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {uniqueYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Exams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map(exam => {
                const examCompleted = isExamCompleted(exam.id);
                return (
                  <Card key={exam.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg text-foreground">{exam.title}</CardTitle>
                        {exam.is_premium && !isPremium && (
                          <span className="bg-primary text-primary-foreground p-1.5 rounded-md">
                            <Lock size={14} />
                          </span>
                        )}
                        {examCompleted && (
                          <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-1.5 rounded-md">
                            <CheckCircle size={14} />
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen size={14} />
                          <span>{exam.board}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {exam.year}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClockIcon size={14} />
                        <span>{exam.duration} minutes</span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      {exam.is_premium && !isPremium ? (
                        <Button className="w-full" asChild>
                          <Link to="/premium">Upgrade to Take</Link>
                        </Button>
                      ) : examCompleted ? (
                        <div className="flex flex-col w-full gap-2">
                          <div className="text-sm text-center font-medium text-amber-600 dark:text-amber-400 pb-1">
                            Already Completed
                          </div>
                          <Button className="w-full" variant="outline" asChild>
                            <Link to="/results">
                              <BarChart3 size={16} className="mr-2" />
                              View Results
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <Button className="w-full" asChild>
                          <Link to={`/exams/${exam.id}`}>Start Exam</Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            
            {filteredExams.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground text-lg">No exams found matching your filters.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                    setExamFilter("all");
                    setYearFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EntranceExamsPage;
