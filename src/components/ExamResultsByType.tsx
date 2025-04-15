
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamResult } from "@/services/exam/types";

// Define exam types
const BOARD_EXAMS = ["ICSE", "CBSE", "West Bengal Board"];
const ENTRANCE_EXAMS = ["WBJEE", "JEE MAINS", "JEE ADVANCED"];

// Define an extended type that includes the related exam data
type ExamResultWithExam = ExamResult & {
  exams: {
    title: string;
    board: string;
    chapter: string | null;
    year: string;
    class: string;
  };
};

type ExamResultProps = {
  results: ExamResultWithExam[];
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
        result.exams?.board && BOARD_EXAMS.includes(result.exams.board)
      );
    }
    if (type === "entrance") {
      return results.filter(result => 
        result.exams?.board && ENTRANCE_EXAMS.includes(result.exams.board)
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
              <Link to="/exam-papers">Try an exam</Link>
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
                  ENTRANCE_EXAMS.includes(result.exams?.board || "") 
                    ? "bg-amber-50 dark:bg-amber-900/10" 
                    : ""
                }>
                  <TableCell className="font-medium">
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 mt-2 rounded-full ${
                        ENTRANCE_EXAMS.includes(result.exams?.board || "") 
                          ? "bg-amber-500" 
                          : "bg-blue-500"
                      }`}></div>
                      <div>
                        {result.exams?.title || "Unknown Exam"}
                        <div className="text-xs text-muted-foreground">
                          {result.exams?.board || ""} · {result.exams?.chapter || "General"} · {result.exams?.year || ""}
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
