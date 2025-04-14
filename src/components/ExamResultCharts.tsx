
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#F44336', '#9C27B0', '#FF9800'];

interface ChartProps {
  results: {
    exam: {
      board: string;
      chapter?: string;
      title: string;
    };
    score: number;
    total_questions: number;
  }[];
  type: 'entrance' | 'board';
}

const ExamResultCharts = ({ results, type }: ChartProps) => {
  // Process data for chapter-wise performance (for board exams)
  const chapterPerformance = results.reduce((acc, result) => {
    if (result.exam.chapter) {
      if (!acc[result.exam.chapter]) {
        acc[result.exam.chapter] = {
          totalScore: 0,
          count: 0
        };
      }
      acc[result.exam.chapter].totalScore += result.score;
      acc[result.exam.chapter].count += 1;
    }
    return acc;
  }, {} as Record<string, { totalScore: number; count: number; }>);

  const chapterData = Object.entries(chapterPerformance).map(([chapter, data]) => ({
    name: chapter,
    averageScore: Math.round(data.totalScore / data.count)
  }));

  // Process data for board-wise performance (for entrance exams)
  const boardPerformance = results.reduce((acc, result) => {
    if (!acc[result.exam.board]) {
      acc[result.exam.board] = {
        totalScore: 0,
        count: 0
      };
    }
    acc[result.exam.board].totalScore += result.score;
    acc[result.exam.board].count += 1;
    return acc;
  }, {} as Record<string, { totalScore: number; count: number; }>);

  const boardData = Object.entries(boardPerformance).map(([board, data]) => ({
    name: board,
    averageScore: Math.round(data.totalScore / data.count)
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {type === 'board' ? 'Chapter-wise Performance' : 'Board-wise Performance'}
          </CardTitle>
          <CardDescription>
            {type === 'board' 
              ? 'Your average scores by chapter'
              : 'Your average scores by exam board'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={type === 'board' ? chapterData : boardData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="averageScore" fill="#3b82f6">
                  {(type === 'board' ? chapterData : boardData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>Distribution of your exam scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: '90-100%', value: results.filter(r => r.score >= 90).length },
                    { name: '70-89%', value: results.filter(r => r.score >= 70 && r.score < 90).length },
                    { name: '50-69%', value: results.filter(r => r.score >= 50 && r.score < 70).length },
                    { name: '<50%', value: results.filter(r => r.score < 50).length },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {results.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamResultCharts;
