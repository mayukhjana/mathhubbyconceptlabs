
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
} from "@/components/ui/card";
import { format } from "date-fns";
import { BarChart3, Clock, Calendar, Award, FileText, ArrowRight } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";

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

const ResultsPage = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        setResults(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to load your results. Please try again later.");
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

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
                  <Link to="/exams">
                    Browse Exams
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Summary Cards */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Total Exams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{results.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Exams completed</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {results.length > 0 
                        ? `${Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length)}%` 
                        : "0%"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Across all exams</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Best Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {results.length > 0 
                        ? `${Math.max(...results.map(r => r.score))}%` 
                        : "0%"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Your highest achievement</p>
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
                            <Button variant="outline" asChild size="sm">
                              <Link to={`/exams/${result.exam_id}`}>
                                Take Again
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      
      <Footer />
    </div>
  );
};

export default ResultsPage;
