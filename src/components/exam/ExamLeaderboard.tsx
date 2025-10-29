import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Loader2, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  score: number;
  obtained_marks: number;
  total_marks: number;
  rank: number;
  created_at: string;
}

interface ExamLeaderboardProps {
  examId: string;
  examTitle: string;
  isEntranceExam?: boolean;
  userScore?: number;
  userObtainedMarks?: number;
}

export const ExamLeaderboard = ({ 
  examId, 
  examTitle, 
  isEntranceExam = false,
  userScore = 0,
  userObtainedMarks = 0
}: ExamLeaderboardProps) => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectedRank, setProjectedRank] = useState<string | null>(null);
  const [loadingRank, setLoadingRank] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [examId]);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_leaderboards')
        .select('*')
        .eq('exam_id', examId)
        .order('rank', { ascending: true })
        .limit(50);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const generateProjectedRank = async () => {
    if (!isEntranceExam) return;
    
    try {
      setLoadingRank(true);
      const { data, error } = await supabase.functions.invoke('generate-projected-rank', {
        body: {
          examTitle,
          score: userScore,
          obtainedMarks: userObtainedMarks,
          leaderboardData: leaderboard
        }
      });

      if (error) throw error;
      setProjectedRank(data.projectedRank);
    } catch (error) {
      console.error('Error generating projected rank:', error);
      toast.error('Failed to generate projected rank');
    } finally {
      setLoadingRank(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <Award className="h-4 w-4 text-muted-foreground" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 border-yellow-300 dark:border-yellow-700";
    if (rank === 2) return "bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800/30 dark:to-gray-700/20 border-gray-300 dark:border-gray-600";
    if (rank === 3) return "bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 border-amber-300 dark:border-amber-700";
    return "";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Exam Leaderboard
        </CardTitle>
        <CardDescription>
          Top performers in {examTitle}
          {leaderboard.length > 0 && ` (${leaderboard.length} participants)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No leaderboard data yet. Be the first to take this exam!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry) => {
              const isCurrentUser = user && entry.user_id === user.id;
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    getRankColor(entry.rank)
                  } ${isCurrentUser ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <div className="font-medium">
                        Rank #{entry.rank}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{entry.score}%</div>
                    <div className="text-sm text-muted-foreground">
                      {entry.obtained_marks}/{entry.total_marks} marks
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isEntranceExam && user && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  AI-Powered Rank Projection
                </h4>
                <p className="text-sm text-muted-foreground">
                  Get an estimated rank for this entrance exam
                </p>
              </div>
              <Button
                onClick={generateProjectedRank}
                disabled={loadingRank}
                size="sm"
              >
                {loadingRank ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  'Generate Rank'
                )}
              </Button>
            </div>
            {projectedRank && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{projectedRank}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
