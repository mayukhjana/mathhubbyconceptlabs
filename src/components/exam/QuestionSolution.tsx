import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface QuestionSolutionProps {
  question: any;
  userAnswer: string | undefined;
  questionNumber: number;
}

export const QuestionSolution = ({ question, userAnswer, questionNumber }: QuestionSolutionProps) => {
  const [aiSolution, setAiSolution] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const generateSolution = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('generate-question-solution', {
        body: {
          question: question.question_text,
          options: {
            a: question.option_a,
            b: question.option_b,
            c: question.option_c,
            d: question.option_d
          },
          correctAnswer: question.correct_answer,
          userAnswer,
          explanation: question.answer_explanation
        }
      });

      if (error) throw error;
      setAiSolution(data.solution);
      setExpanded(true);
    } catch (error) {
      console.error('Error generating solution:', error);
      toast.error('Failed to generate AI solution');
    } finally {
      setLoading(false);
    }
  };

  const hasExplanation = question.answer_explanation || aiSolution;

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Solution & Explanation
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-8"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          {question.answer_explanation && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Explanation:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {question.answer_explanation}
              </p>
            </div>
          )}

          {!aiSolution && (
            <Button
              onClick={generateSolution}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating AI Solution...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Generate AI-Powered Detailed Solution
                </>
              )}
            </Button>
          )}

          {aiSolution && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <h4 className="font-medium">AI-Generated Solution:</h4>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{aiSolution}</ReactMarkdown>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
