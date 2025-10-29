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
    const { results } = await req.json();
    
    if (!results || results.length === 0) {
      return new Response(
        JSON.stringify({ analysis: 'No results available to analyze yet.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Prepare performance summary
    const totalExams = results.length;
    const avgScore = (results.reduce((acc: number, r: any) => acc + r.score, 0) / totalExams).toFixed(1);
    const bestScore = Math.max(...results.map((r: any) => r.score));
    const recentScore = results[results.length - 1]?.score || 0;
    
    // Group by board/exam type
    const examsByType: Record<string, number> = {};
    const scoresByType: Record<string, number[]> = {};
    
    results.forEach((result: any) => {
      const examType = result.exams?.board || 'Unknown';
      examsByType[examType] = (examsByType[examType] || 0) + 1;
      if (!scoresByType[examType]) scoresByType[examType] = [];
      scoresByType[examType].push(result.score);
    });

    const prompt = `You are an expert education analyst. Analyze this student's exam performance and provide personalized insights.

Performance Summary:
- Total Exams Taken: ${totalExams}
- Average Score: ${avgScore}%
- Best Score: ${bestScore}%
- Recent Score: ${recentScore}%

Exam Distribution:
${Object.entries(examsByType).map(([type, count]) => {
  const avgTypeScore = (scoresByType[type].reduce((a: number, b: number) => a + b, 0) / scoresByType[type].length).toFixed(1);
  return `- ${type}: ${count} exam(s), Avg: ${avgTypeScore}%`;
}).join('\n')}

Provide a concise analysis (150-200 words) covering:
1. Overall performance assessment
2. Strongest areas
3. Areas needing improvement
4. 2-3 specific actionable recommendations

Use a supportive and motivating tone. Format with clear sections using markdown.`;

    console.log("Generating AI insights for student performance");

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert education analyst providing personalized exam performance feedback.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service unavailable. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || 'Keep practicing to improve!';

    console.log("AI insights generated successfully");

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating insights:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate insights',
        analysis: 'Unable to generate insights at this time. Keep practicing and review your mistakes!' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
