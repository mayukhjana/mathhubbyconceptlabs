import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import type { Question } from "@/services/exam/types";

interface AIInsightsProps {
  score: number;
  questions: Question[];
  userAnswers: Record<string, string>;
  examId: string;
}

export const AIInsights = ({ score, questions, userAnswers, examId }: AIInsightsProps) => {
  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        setLoading(true);

        const correctCount = questions.filter(q => {
          const userAnswer = userAnswers[q.id];
          if (!userAnswer) return false;
          
          if (q.is_multi_correct) {
            const correctAnswerArray = Array.isArray(q.correct_answer) 
              ? q.correct_answer 
              : q.correct_answer.split(',').map(a => a.trim());
            const userAnswerArray = userAnswer.split(',').map(a => a.trim());
            return correctAnswerArray.length === userAnswerArray.length && 
              correctAnswerArray.every(a => userAnswerArray.includes(a));
          }
          
          return userAnswer === (Array.isArray(q.correct_answer) ? q.correct_answer[0] : q.correct_answer);
        }).length;

        const { data, error } = await supabase.functions.invoke('generate-insights', {
          body: {
            examId,
            score,
            totalQuestions: questions.length,
            correctAnswers: correctCount,
            incorrectAnswers: Object.keys(userAnswers).length - correctCount,
            unattempted: questions.length - Object.keys(userAnswers).length
          }
        });

        if (error) throw error;
        
        setInsights(data?.insights || "Keep practicing to improve your performance!");
      } catch (error) {
        console.error("Error generating insights:", error);
        setInsights("Unable to generate insights at this time. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [score, questions, userAnswers, examId]);

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Analyzing your performance...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{insights}</p>
      </div>
    </Card>
  );
};
