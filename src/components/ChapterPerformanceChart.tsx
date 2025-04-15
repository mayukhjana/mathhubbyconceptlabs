
import { useState, useEffect } from "react";
import { fetchChapterPerformance } from "@/services/exam/results";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Loader2 } from "lucide-react";

type ChapterResult = {
  id: string;
  score: number;
  total_questions: number;
  exams: {
    title: string;
    board: string;
    chapter: string;
  };
};

type ChapterPerformance = {
  chapter: string;
  average_score: number;
  attempts: number;
  board: string;
};

const ChapterPerformanceChart = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<ChapterPerformance[]>([]);
  const [activeBoard, setActiveBoard] = useState<string>("all");
  const [availableBoards, setAvailableBoards] = useState<string[]>([]);

  useEffect(() => {
    const loadChapterPerformance = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const results = await fetchChapterPerformance(user.id);
        
        // Process the results to get chapter-wise average scores
        const chapterMap = new Map<string, {board: string, scores: number[], total: number}>();
        
        results.forEach((result: ChapterResult) => {
          const chapter = result.exams.chapter || 'Unknown';
          const board = result.exams.board || 'Unknown';
          const key = `${board}:${chapter}`;
          
          if (!chapterMap.has(key)) {
            chapterMap.set(key, { board, scores: [], total: 0 });
          }
          
          const entry = chapterMap.get(key)!;
          entry.scores.push(result.score);
          entry.total += 1;
        });
        
        // Convert to array for the chart
        const chartData: ChapterPerformance[] = Array.from(chapterMap.entries()).map(([key, value]) => {
          const [board, chapter] = key.split(':');
          const average_score = value.scores.reduce((a, b) => a + b, 0) / value.scores.length;
          
          return {
            chapter,
            board,
            average_score: Math.round(average_score),
            attempts: value.total
          };
        });
        
        // Get unique boards
        const boards = Array.from(new Set(chartData.map(item => item.board)));
        
        setPerformanceData(chartData);
        setAvailableBoards(boards);
        setActiveBoard(boards.length > 0 ? "all" : "none");
        
      } catch (err) {
        console.error("Error loading chapter performance:", err);
        setError("Failed to load chapter performance data");
      } finally {
        setLoading(false);
      }
    };
    
    loadChapterPerformance();
  }, [user]);
  
  const filteredData = activeBoard === "all" 
    ? performanceData 
    : performanceData.filter(item => item.board === activeBoard);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chapter Performance</CardTitle>
          <CardDescription>Loading chapter-wise performance data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-mathprimary" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chapter Performance</CardTitle>
          <CardDescription>Error loading performance data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (performanceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chapter Performance</CardTitle>
          <CardDescription>No chapter performance data available</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center flex-col">
          <Book className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Complete more chapter-specific exams to see your performance</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chapter Performance</CardTitle>
        <CardDescription>Your average scores in different chapters</CardDescription>
        
        {availableBoards.length > 0 && (
          <Tabs defaultValue="all" className="mt-2" onValueChange={setActiveBoard} value={activeBoard}>
            <TabsList>
              <TabsTrigger value="all">All Boards</TabsTrigger>
              {availableBoards.map(board => (
                <TabsTrigger key={board} value={board}>{board}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="chapter"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
              />
              <YAxis 
                domain={[0, 100]}
                label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === "average_score") return [`${value}%`, "Average Score"];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar 
                name="Average Score" 
                dataKey="average_score" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChapterPerformanceChart;
