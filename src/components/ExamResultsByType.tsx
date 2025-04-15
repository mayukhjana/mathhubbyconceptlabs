
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Define exam types
const BOARD_EXAMS = ["ICSE", "CBSE", "WBJEE", "West Bengal"];
const ENTRANCE_EXAMS = ["JEE", "NEET", "BITSAT", "WBJEE"];

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
    class: string;
  };
};

type ExamResultProps = {
  results: ExamResult[];
  loading: boolean;
};

const ExamResultsByType = ({ results, loading }: ExamResultProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Filter results based on exam type
  const filterResults = (type: string) => {
    if (type === "all") return results;
    if (type === "boards") {
      return results.filter(result => 
        result.exam?.board && BOARD_EXAMS.includes(result.exam.board)
      );
    }
    if (type === "entrance") {
      return results.filter(result => 
        result.exam?.board && ENTRANCE_EXAMS.includes(result.exam.board)
      );
    }
    return [];
  };
  
  const filteredResults = filterResults(activeTab);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
          <CardDescription>Loading your exam results...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Results By Type</CardTitle>
        <CardDescription>View your performance in different types of exams</CardDescription>
        
        <Tabs defaultValue="all" className="mt-2" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Exams</TabsTrigger>
            <TabsTrigger value="boards">Board Exams</TabsTrigger>
            <TabsTrigger value="entrance">Entrance Exams</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {filteredResults.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No results found for this category</p>
            <Button className="mt-4" asChild>
              <Link to="/exams">Try an exam</Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Time Taken</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id} className={
                  ENTRANCE_EXAMS.includes(result.exam?.board || "") 
                    ? "bg-amber-50 dark:bg-amber-900/10" 
                    : ""
                }>
                  <TableCell className="font-medium">
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 mt-2 rounded-full ${
                        ENTRANCE_EXAMS.includes(result.exam?.board || "") 
                          ? "bg-amber-500" 
                          : "bg-blue-500"
                      }`}></div>
                      <div>
                        {result.exam?.title || "Unknown Exam"}
                        <div className="text-xs text-muted-foreground">
                          {result.exam?.board} · {result.exam?.chapter || "General"} · {result.exam?.year}
                        </div>
                      </div>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamResultsByType;
