import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { examTitle, score, obtainedMarks, leaderboardData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Prepare leaderboard statistics
    const totalParticipants = leaderboardData.length;
    const averageScore = leaderboardData.reduce((sum: number, entry: any) => sum + entry.score, 0) / totalParticipants;
    const topScores = leaderboardData.slice(0, 10).map((entry: any) => ({
      rank: entry.rank,
      score: entry.score,
      marks: entry.obtained_marks
    }));

    const prompt = `You are an expert education analyst specializing in competitive entrance exams. 
    
Exam: ${examTitle}
Student's Score: ${score}% (${obtainedMarks} marks)
Total Participants: ${totalParticipants}
Average Score: ${averageScore.toFixed(2)}%

Top 10 Scores:
${topScores.map((s: any) => `Rank ${s.rank}: ${s.score}% (${s.marks} marks)`).join('\n')}

Based on this exam's leaderboard data and considering typical competitive entrance exam patterns, provide:
1. An estimated rank range for this score
2. Percentile estimation
3. Brief analysis of the performance relative to others
4. Suggestion on whether this score is competitive for admission

Keep the response concise and actionable (200-250 words).`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert education analyst providing rank projections for entrance exams.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to generate projected rank');
    }

    const data = await response.json();
    const projectedRank = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ projectedRank }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-projected-rank:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
