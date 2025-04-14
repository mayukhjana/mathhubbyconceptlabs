import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { format } from "date-fns";
import { 
  BarChart3, 
  Clock, 
  Award, 
  FileText, 
  ArrowRight, 
  AlertCircle, 
  Activity, 
  TrendingUp,
  CalendarRange,
  Flame,
  Calendar,
  Download
} from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";
import { toast } from "sonner";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { getFileDownloadUrl } from "@/services/exam/storage";

type ExamResult = {
  id: string;
  exam_id: string;
  completed_at: string;
  score: number;
  total_questions: number;
  time_taken: number;
  exam?: {
    title: string;
    board: string;
    chapter: string;
    year: string;
  };
};

type AnalysisData = {
  totalExams: number;
  averageScore: number;
  bestScore: number;
  examsByBoard: Record<string, number>;
  scoresByBoard: Record<string, number>;
  progressOverTime: {date: string; score: number}[];
  timeByScore: {score: number; time: number}[];
  completedExamsByBoard: {name: string; value: number}[];
  scoreDistribution: {range: string; count: number}[];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ResultsPage = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedExamIds, setCompletedExamIds] = useState<string[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    totalExams: 0,
    averageScore: 0,
    bestScore: 0,
    examsByBoard: {},
    scoresByBoard: {},
    progressOverTime: [],
    timeByScore: [],
    completedExamsByBoard: [],
    scoreDistribution: [
      {range: "0-25%", count: 0},
      {range: "26-50%", count: 0},
      {range: "51-75%", count: 0},
      {range: "76-100%", count: 0}
    ]
  });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from("user_results")
          .select(`
            id,
            exam_id,
            completed_at,
            score,
            total_questions,
            time_taken,
            exam:exams (
              title,
              board,
              chapter,
              year
            )
          `)
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false });

        if (error) throw new Error(error.message);
        
        console.log("Fetched results:", data);
        setResults(data || []);
        
        if (data) {
          const examIds = data.map(result => result.exam_id);
          setCompletedExamIds(examIds);
          localStorage.setItem('completedExamIds', JSON.stringify(examIds));
          
          analyzeResultsData(data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to load your results. Please try again later.");
        setLoading(false);
        toast.error("Failed to load your results");
      }
    };

    fetchResults();
  }, [user]);

  const analyzeResultsData = (data: ExamResult[]) => {
    if (!data || data.length === 0) return;
    
    const totalExams = data.length;
    const averageScore = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / totalExams);
    const bestScore = Math.max(...data.map(r => r.score));
    
    const examsByBoard: Record<string, number> = {};
    const scoresByBoard: Record<string, number> = {};
    const boardCounts: Record<string, number> = {};
    
    data.forEach(result => {
      const board = result.exam?.board || 'Unknown';
      examsByBoard[board] = (examsByBoard[board] || 0) + 1;
      
      scoresByBoard[board] = (scoresByBoard[board] || 0) + result.score;
      boardCounts[board] = (boardCounts[board] || 0) + 1;
    });
    
    Object.keys(scoresByBoard).forEach(board => {
      scoresByBoard[board] = Math.round(scoresByBoard[board] / boardCounts[board]);
    });
    
    const progressOverTime = data
      .slice()
      .sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime())
      .map(result => ({
        date: format(new Date(result.completed_at), 'MMM d'),
        score: result.score,
      }));
    
    const timeByScore = data.map(result => ({
      score: result.score,
      time: Math.round(result.time_taken / 60),
    }));
    
    const completedExamsByBoard = Object.entries(examsByBoard).map(([name, value]) => ({
      name,
      value
    }));
    
    const scoreDistribution = [
      {range: "0-25%", count: 0},
      {range: "26-50%", count: 0},
      {range: "51-75%", count: 0},
      {range: "76-100%", count: 0}
    ];
    
    data.forEach(result => {
      if (result.score <= 25) scoreDistribution[0].count++;
      else if (result.score <= 50) scoreDistribution[1].count++;
      else if (result.score <= 75) scoreDistribution[2].count++;
      else scoreDistribution[3].count++;
    });
    
    setAnalysisData({
      totalExams,
      averageScore,
      bestScore,
      examsByBoard,
      scoresByBoard,
      progressOverTime,
      timeByScore,
      completedExamsByBoard,
      scoreDistribution
    });
  };

  const handleDownloadSolution = async (examId: string, board: string) => {
    try {
      const downloadUrl = await getFileDownloadUrl(examId, 'solution', board);
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      } else {
        toast.error("Solution not available for this exam");
      }
    } catch (error) {
      console.error("Error downloading solution:", error);
      toast.error("Failed to download solution");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
                      {results[0]?.exam?.title || "No exams"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {results[0]?.completed_at ? format(new Date(results[0].completed_at), "PPP") : "N/A"}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Progress Over Time</CardTitle>
                    <CardDescription>Your score progression across exams</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      {analysisData.progressOverTime.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={analysisData.progressOverTime}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">Not enough data to show progress</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Score Distribution</CardTitle>
                    <CardDescription>Breakdown of your score ranges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analysisData.scoreDistribution}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <XAxis dataKey="range" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3498db">
                            {analysisData.scoreDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Exams by Board</CardTitle>
                    <CardDescription>Distribution of exams across boards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      {analysisData.completedExamsByBoard.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analysisData.completedExamsByBoard}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {analysisData.completedExamsByBoard.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">Not enough data to show distribution</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Performance by Exam Board</CardTitle>
                    <CardDescription>Average scores by exam board</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      {Object.keys(analysisData.scoresByBoard).length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={Object.entries(analysisData.scoresByBoard).map(([name, value]) => ({
                              name,
                              score: value
                            }))}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="score" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">Not enough data to show performance</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Exam History</CardTitle>
                  <CardDescription>
                    All your previous exam attempts and scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exam Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Time Taken</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">
                            <div>{result.exam?.title || "Unknown Exam"}</div>
                            <div className="text-xs text-muted-foreground">
                              {result.exam?.board} · {result.exam?.chapter} · {result.exam?.year}
                            </div>
                          </TableCell>
                          <TableCell>
                            {result.completed_at ? format(new Date(result.completed_at), "PPP") : "Unknown"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Award className={`h-4 w-4 ${
                                result.score >= 80 ? "text-green-500" : 
                                result.score >= 60 ? "text-yellow-500" : 
                                "text-red-500"
                              }`} />
                              <span>{result.score}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{formatTime(result.time_taken || 0)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-1.5"
                                disabled={true}
                                title="You have already completed this exam"
                              >
                                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                                Already Completed
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5"
                                onClick={() => result.exam && handleDownloadSolution(result.exam_id, result.exam.board)}
                              >
                                <Download className="h-3.5 w-3.5" />
                                Solution
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {results.length} of {results.length} results
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/exam-papers">
                      Try more exams
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsPage;
