
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Calendar, Clock, Star, ArrowUpRight } from "lucide-react";

interface UserResult {
  id: string;
  exam_id: string;
  score: number;
  total_questions: number;
  time_taken: number | null;
  completed_at: string;
  exam: {
    title: string;
    board: string;
    class: string;
    year: string;
    chapter: string | null;
  } | null;
}

const UserResultsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [results, setResults] = useState<UserResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_results')
          .select(`
            *,
            exam:exam_id (
              title, 
              board, 
              class, 
              year,
              chapter
            )
          `)
          .order('completed_at', { ascending: false });

        if (error) {
          throw error;
        }

        setResults(data || []);
      } catch (error: any) {
        console.error("Error fetching results:", error.message);
        toast({
          title: "Error",
          description: "Failed to load your exam results. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchResults();
    }
  }, [user, toast]);

  // Filter results by board
  const filterResultsByBoard = (board: string) => {
    if (board === "all") {
      return results;
    }
    return results.filter(result => result.exam?.board === board);
  };

  // Calculate percentage score
  const calculatePercentage = (score: number, totalQuestions: number) => {
    return Math.round((score / totalQuestions) * 100);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time taken in minutes and seconds
  const formatTimeTaken = (seconds: number | null) => {
    if (!seconds) return "N/A";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <Navbar />
        
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2 dark:text-white">Your Exam Results</h1>
            <p className="text-muted-foreground mb-8 dark:text-gray-400">
              Track your progress and performance across different exams
            </p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList>
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="icse">ICSE</TabsTrigger>
                <TabsTrigger value="cbse">CBSE</TabsTrigger>
                <TabsTrigger value="west-bengal">West Bengal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <ResultsList 
                  results={filterResultsByBoard("all")}
                  isLoading={isLoading}
                  calculatePercentage={calculatePercentage}
                  formatDate={formatDate}
                  formatTimeTaken={formatTimeTaken}
                  navigate={navigate}
                />
              </TabsContent>
              
              <TabsContent value="icse" className="mt-6">
                <ResultsList 
                  results={filterResultsByBoard("icse")}
                  isLoading={isLoading}
                  calculatePercentage={calculatePercentage}
                  formatDate={formatDate}
                  formatTimeTaken={formatTimeTaken}
                  navigate={navigate}
                />
              </TabsContent>
              
              <TabsContent value="cbse" className="mt-6">
                <ResultsList 
                  results={filterResultsByBoard("cbse")}
                  isLoading={isLoading}
                  calculatePercentage={calculatePercentage}
                  formatDate={formatDate}
                  formatTimeTaken={formatTimeTaken}
                  navigate={navigate}
                />
              </TabsContent>
              
              <TabsContent value="west-bengal" className="mt-6">
                <ResultsList 
                  results={filterResultsByBoard("west-bengal")}
                  isLoading={isLoading}
                  calculatePercentage={calculatePercentage}
                  formatDate={formatDate}
                  formatTimeTaken={formatTimeTaken}
                  navigate={navigate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </AuthGuard>
  );
};

// Results list component
interface ResultsListProps {
  results: UserResult[];
  isLoading: boolean;
  calculatePercentage: (score: number, total: number) => number;
  formatDate: (date: string) => string;
  formatTimeTaken: (seconds: number | null) => string;
  navigate: (path: string) => void;
}

const ResultsList = ({ 
  results, 
  isLoading, 
  calculatePercentage, 
  formatDate, 
  formatTimeTaken,
  navigate 
}: ResultsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mathprimary"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-3xl text-muted-foreground mb-4">No results found</div>
        <p className="text-muted-foreground mb-6">
          You haven't completed any exams in this category yet.
        </p>
        <Button onClick={() => navigate("/exams")}>
          Take an Exam
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result) => (
        <Card 
          key={result.id}
          className="overflow-hidden hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
        >
          <CardHeader className="pb-3">
            <CardTitle className="line-clamp-2 dark:text-white">
              {result.exam?.title || "Untitled Exam"}
            </CardTitle>
            <CardDescription>
              {result.exam?.board.toUpperCase() || ""} Class {result.exam?.class || ""} • {result.exam?.year || ""}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="flex justify-between mb-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">{formatDate(result.completed_at)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">{formatTimeTaken(result.time_taken)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-2">
              {/* Score */}
              <div className="bg-mathlight dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1 dark:text-gray-400">Score</div>
                <div className="font-medium dark:text-white">
                  {result.score} / {result.total_questions}
                </div>
              </div>
              
              {/* Percentage */}
              <div className="bg-mathlight dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1 dark:text-gray-400">Percentage</div>
                <div 
                  className={`font-medium ${
                    calculatePercentage(result.score, result.total_questions) >= 70
                      ? "text-green-600 dark:text-green-500"
                      : calculatePercentage(result.score, result.total_questions) >= 40
                      ? "text-yellow-600 dark:text-yellow-500"
                      : "text-red-600 dark:text-red-500"
                  }`}
                >
                  {calculatePercentage(result.score, result.total_questions)}%
                </div>
              </div>
            </div>
            
            {result.exam?.chapter && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded bg-mathprimary/10 dark:bg-mathprimary/30 text-xs font-medium text-mathprimary">
                  {result.exam.chapter.charAt(0).toUpperCase() + result.exam.chapter.slice(1)}
                </span>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full text-mathprimary hover:text-mathprimary hover:bg-mathprimary/5 border-mathprimary/20"
              onClick={() => navigate(`/exams/${result.exam_id}`)}
            >
              <span>Review Exam</span>
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default UserResultsPage;
