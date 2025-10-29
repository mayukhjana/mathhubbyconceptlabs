import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ProgressData = {
  date: string;
  score: number;
};

type ProgressLineChartProps = {
  data: ProgressData[];
};

export const ProgressLineChart = ({ data }: ProgressLineChartProps) => {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200/50 dark:stroke-gray-700/50" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderRadius: "8px",
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--mathprimary))"
            strokeWidth={2.5}
            dot={{ fill: "hsl(var(--mathprimary))", r: 4 }}
            activeDot={{ r: 6, fill: "hsl(var(--mathprimary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressLineChart;
