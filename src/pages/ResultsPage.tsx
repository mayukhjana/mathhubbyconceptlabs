
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
import { ProgressLineChart } from "@/components/charts/ProgressLineChart";
import { TrendingUp, Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Total Exams</CardTitle>
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{analysisData.totalExams}</div>
                    <p className="text-xs text-muted-foreground mt-1">Exams completed</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Average Score</CardTitle>
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                      {analysisData.averageScore}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Across all exams</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Best Score</CardTitle>
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                      {analysisData.bestScore}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Your highest achievement</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Improvement</CardTitle>
                      <div className="p-2 rounded-lg bg-orange-500/10">
                        <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                      {analysisData.progressOverTime.length > 1 
                        ? `+${(analysisData.progressOverTime[analysisData.progressOverTime.length - 1].score - analysisData.progressOverTime[0].score).toFixed(1)}%`
                        : 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Since first exam</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Left Column - AI Insights & Progress */}
                <div className="lg:col-span-2 space-y-6">
                  {/* AI Insights Section */}
                  {results.length >= 2 && (
                    <Card className="overflow-hidden border-mathprimary/20">
                      <CardHeader className="bg-gradient-to-r from-mathprimary/10 to-mathprimary/5">
                        <div className="flex items-center gap-2">
                          <div className="bg-mathprimary/20 p-2 rounded-full">
                            <Brain className="h-5 w-5 text-mathprimary" />
                          </div>
                          <CardTitle>AI-Powered Insights</CardTitle>
                        </div>
                        <CardDescription>
                          Personalized analysis based on your performance
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {loadingInsights ? (
                          <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-mathprimary mb-4" />
                            <p className="text-muted-foreground">Generating insights...</p>
                          </div>
                        ) : aiInsights ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{aiInsights}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Lightbulb className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                            <p className="text-lg font-medium mb-2">No insights yet</p>
                            <Button onClick={() => generateAiInsights(results)}>
                              Generate Insights
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Progress Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Progress Over Time</CardTitle>
                      <CardDescription>Track your improvement</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProgressLineChart data={analysisData.progressOverTime} />
                    </CardContent>
                  </Card>

                  {/* Board-wise Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Board-wise Performance</CardTitle>
                      <CardDescription>Your scores across different boards</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(analysisData.examsByBoard).map(([board, count]) => {
                          const avgScore = analysisData.scoresByBoard[board] || 0;
                          return (
                            <div key={board} className="flex flex-col p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted border hover:border-mathprimary/50 transition-colors">
                              <span className="font-medium text-sm text-muted-foreground">{board}</span>
                              <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-2xl font-bold text-mathprimary">{avgScore.toFixed(1)}%</span>
                                <span className="text-xs text-muted-foreground">{count} exam{count !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Chapter Performance */}
                <div className="lg:col-span-1">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Chapter Performance</CardTitle>
                      <CardDescription>Your strengths & areas to improve</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChapterPerformanceChart />
                    </CardContent>
                  </Card>
                </div>
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
