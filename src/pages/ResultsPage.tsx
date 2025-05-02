
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { format } from "date-fns";
import { 
  BarChart3, 
  Clock, 
  Award, 
  FileText, 
  ArrowRight, 
  Activity, 
  Calendar,
  MapPin,
  Lightbulb,
  Sparkles,
  ChevronDown,
  Loader2
} from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";
import { toast } from "sonner";
import { fetchExamResults } from "@/services/exam/results";
import ChapterPerformanceChart from "@/components/ChapterPerformanceChart";
import ExamResultsByType from "@/components/ExamResultsByType";
import { ExamResult } from "@/services/exam/types";
import { supabase } from "@/integrations/supabase/client";

type AnalysisData = {
  totalExams: number;
  averageScore: number;
  bestScore: number;
  examsByBoard: Record<string, number>;
  scoresByBoard: Record<string, number>;
  progressOverTime: {date: string; score: number}[];
};

const ResultsPage = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    totalExams: 0,
    averageScore: 0,
    bestScore: 0,
    examsByBoard: {},
    scoresByBoard: {},
    progressOverTime: []
  });

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchExamResults(user.id);
        
        console.log("Fetched results:", data);
        
        // Ensure the data matches our ExamResult type
        const typedResults = data as unknown as ExamResult[];
        setResults(typedResults || []);
        
        // Analyze the data for detailed insights
        if (typedResults && typedResults.length > 0) {
          analyzeResultsData(typedResults);
          
          // Only generate insights if there are results
          if (typedResults.length >= 2) {
            generateAiInsights(typedResults);
          }
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to load your results. Please try again later.");
        toast.error("Failed to load your results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  const analyzeResultsData = (data: ExamResult[]) => {
    if (!data || data.length === 0) return;
    
    // Basic stats
    const totalExams = data.length;
    const averageScore = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / totalExams);
    const bestScore = Math.max(...data.map(r => r.score));
    
    // Group by board
    const examsByBoard: Record<string, number> = {};
    const scoresByBoard: Record<string, number> = {};
    const boardCounts: Record<string, number> = {};
    
    data.forEach(result => {
      const board = result.exams?.board || 'Unknown';
      examsByBoard[board] = (examsByBoard[board] || 0) + 1;
      
      // Calculate average score by board
      scoresByBoard[board] = (scoresByBoard[board] || 0) + result.score;
      boardCounts[board] = (boardCounts[board] || 0) + 1;
    });
    
    // Calculate average score for each board
    Object.keys(scoresByBoard).forEach(board => {
      scoresByBoard[board] = Math.round(scoresByBoard[board] / boardCounts[board]);
    });
    
    // Progress over time
    const progressOverTime = data
      .slice()
      .sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime())
      .map(result => ({
        date: format(new Date(result.completed_at), 'MMM d'),
        score: result.score,
      }));
    
    setAnalysisData({
      totalExams,
      averageScore,
      bestScore,
      examsByBoard,
      scoresByBoard,
      progressOverTime
    });
  };
  
  const generateAiInsights = async (results: ExamResult[]) => {
    if (results.length === 0) return;
    
    try {
      setLoadingInsights(true);
      
      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: { results }
      });
      
      if (error) {
        throw error;
      }
      
      if (data && data.analysis) {
        setAiInsights(data.analysis);
      }
    } catch (error) {
      console.error("Error generating AI insights:", error);
      toast.error("Failed to generate AI insights. Please try again later.");
    } finally {
      setLoadingInsights(false);
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
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Your Exam Results</h1>
              <p className="text-muted-foreground">
                View and track your performance across all exams
              </p>
            </div>
          </div>

          {error ? (
            <Card className="mb-8">
              <CardContent className="pt-6 text-center">
                <p className="text-red-500">{error}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : results.length === 0 ? (
            <Card className="mb-8">
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Results Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't completed any exams yet. Take an exam to see your results here.
                </p>
                <Button asChild>
                  <Link to="/exam-papers">
                    Browse Exams
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Total Exams</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analysisData.totalExams}</div>
                    <p className="text-xs text-muted-foreground mt-1">Exams completed</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Average Score</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analysisData.averageScore}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Across all exams</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Best Score</CardTitle>
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analysisData.bestScore}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Your highest achievement</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-base font-medium">
                      {results[0]?.exams?.title || "No exams"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {results[0]?.completed_at ? format(new Date(results[0].completed_at), "PPP") : "N/A"}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* AI-Generated Personalized Insights */}
              {results.length >= 2 && (
                <Card className="mb-8 overflow-hidden border-mathprimary/20">
                  <CardHeader className="bg-gradient-to-r from-mathprimary/10 to-mathprimary/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-mathprimary/20 p-2 rounded-full">
                          <Sparkles className="h-5 w-5 text-mathprimary" />
                        </div>
                        <CardTitle>AI-Powered Personalized Insights</CardTitle>
                      </div>
                    </div>
                    <CardDescription>
                      Custom analysis based on your exam performance patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {loadingInsights ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-mathprimary mb-4" />
                        <p className="text-muted-foreground">Generating personalized insights...</p>
                      </div>
                    ) : aiInsights ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {aiInsights.split('\n').map((paragraph, index) => {
                          // Check if the paragraph is a heading
                          if (paragraph.startsWith('#')) {
                            return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{paragraph.replace(/^#+ /, '')}</h3>;
                          }
                          // Check if the paragraph is a list item
                          else if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                            return <li key={index} className="ml-4">{paragraph.substring(2)}</li>;
                          }
                          // Regular paragraph
                          else if (paragraph.trim()) {
                            return <p key={index} className="mb-3">{paragraph}</p>;
                          }
                          // Empty line
                          return <br key={index} />;
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Lightbulb className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">No insights generated yet</p>
                        <p className="text-muted-foreground mb-4">Take more exams to get personalized AI recommendations</p>
                        <Button onClick={() => results.length >= 2 && generateAiInsights(results)}>
                          Generate Insights
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Suggested Roadmaps</CardTitle>
                    <CardDescription>Personalized learning paths</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center flex-col">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                      <MapPin className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground text-center max-w-[250px]">
                      Personalized study roadmaps based on your performance will be available soon.
                    </p>
                  </CardContent>
                </Card>
                
                <ChapterPerformanceChart />
              </div>
              
              <ExamResultsByType results={results} loading={false} />
              
              <div className="mt-8 flex justify-end">
                <Button variant="outline" asChild>
                  <Link to="/exam-papers">
                    Try more exams
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsPage;
