
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
import { BookOpen, FileText, ClockIcon, Search, Lock, CheckCircle, BarChart3 } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Mock exam data
const examsData = [
  {
    id: "icse-alg-2022",
    title: "ICSE Algebra 2022",
    board: "ICSE",
    subject: "Mathematics",
    chapter: "Algebra",
    year: "2022",
    duration: 60,
    questionCount: 30,
    isPremium: false
  },
  {
    id: "cbse-num-2022",
    title: "CBSE Number Systems 2022",
    board: "CBSE",
    subject: "Mathematics",
    chapter: "Number Systems",
    year: "2022",
    duration: 45,
    questionCount: 25,
    isPremium: false
  },
  {
    id: "wb-alg-2022",
    title: "West Bengal Algebra 2022",
    board: "West Bengal",
    subject: "Mathematics",
    chapter: "Algebra",
    year: "2022",
    duration: 60,
    questionCount: 35,
    isPremium: false
  },
  {
    id: "icse-geo-2022",
    title: "ICSE Geometry 2022",
    board: "ICSE",
    subject: "Mathematics",
    chapter: "Geometry",
    year: "2022",
    duration: 60,
    questionCount: 25,
    isPremium: false
  },
  {
    id: "icse-trig-2022",
    title: "ICSE Trigonometry 2022",
    board: "ICSE",
    subject: "Mathematics",
    chapter: "Trigonometry",
    year: "2022",
    duration: 45,
    questionCount: 20,
    isPremium: false
  },
  {
    id: "icse-calc-2022",
    title: "ICSE Calculus 2022",
    board: "ICSE",
    subject: "Mathematics",
    chapter: "Calculus",
    year: "2022",
    duration: 75,
    questionCount: 40,
    isPremium: true
  },
  {
    id: "cbse-rel-2022",
    title: "CBSE Relations and Functions 2022",
    board: "CBSE",
    subject: "Mathematics",
    chapter: "Relations and Functions",
    year: "2022",
    duration: 60,
    questionCount: 30,
    isPremium: true
  },
  {
    id: "wb-calc-2022",
    title: "West Bengal Calculus 2022",
    board: "West Bengal",
    subject: "Mathematics",
    chapter: "Calculus",
    year: "2022",
    duration: 90,
    questionCount: 45,
    isPremium: true
  }
];

const ExamsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [boardFilter, setBoardFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [userIsPremium] = useState(false); // Would come from auth context
  const [completedExamIds, setCompletedExamIds] = useState<string[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load completed exams from localStorage or fetch fresh from database
    const loadCompletedExams = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("user_results")
          .select('exam_id')
          .eq("user_id", user.id);
        
        if (error) throw error;
        
        if (data) {
          const examIds = data.map(result => result.exam_id);
          setCompletedExamIds(examIds);
          localStorage.setItem('completedExamIds', JSON.stringify(examIds));
        }
      } catch (err) {
        console.error("Error loading completed exams:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCompletedExams();
  }, [user]);
  
  // Check if an exam is completed
  const isExamCompleted = (examId: string) => {
    // For mock data we'll need to map the string ID to a UUID
    // In a real app, you'd just check if the UUID is in the completedExamIds array
    return completedExamIds.some(id => id.includes(examId));
  };
  
  const filteredExams = examsData.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         exam.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBoard = boardFilter === "all" || exam.board === boardFilter;
    const matchesYear = yearFilter === "all" || exam.year === yearFilter;
    
    return matchesSearch && matchesBoard && matchesYear;
  });
  
  const uniqueBoards = Array.from(new Set(examsData.map(exam => exam.board)));
  const uniqueYears = Array.from(new Set(examsData.map(exam => exam.year)));
  
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
      
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-mathlight to-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-4">Practice Exams</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              Test your knowledge with our collection of interactive MCQ exams from previous years.
            </p>
            
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search for exams..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <Select value={boardFilter} onValueChange={setBoardFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Boards</SelectItem>
                      {uniqueBoards.map(board => (
                        <SelectItem key={board} value={board}>{board}</SelectItem>
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
                  <Card key={exam.id} className="paper overflow-hidden hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{exam.title}</CardTitle>
                        {exam.isPremium && !userIsPremium && (
                          <span className="bg-mathprimary text-white p-1.5 rounded-md">
                            <Lock size={14} />
                          </span>
                        )}
                        {examCompleted && (
                          <span className="bg-green-100 text-green-700 p-1.5 rounded-md">
                            <CheckCircle size={14} />
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen size={14} />
                          <span>{exam.board} Board</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText size={14} />
                          <span>{exam.chapter}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ClockIcon size={14} />
                          <span>{exam.duration} minutes</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {exam.questionCount} Questions
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      {exam.isPremium && !userIsPremium ? (
                        <Button className="w-full" asChild>
                          <Link to="/premium">Upgrade to Take</Link>
                        </Button>
                      ) : examCompleted ? (
                        <div className="flex flex-col w-full gap-2">
                          <div className="text-sm text-center font-medium text-amber-600 pb-1">
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
                <p className="text-gray-500 text-lg">No exams found matching your filters.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                    setBoardFilter("all");
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

export default ExamsList;
