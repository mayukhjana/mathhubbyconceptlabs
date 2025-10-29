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
    const { question, options, correctAnswer, userAnswer, explanation } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const isCorrect = userAnswer === correctAnswer;
    const optionsText = Object.entries(options)
      .map(([key, value]) => `${key.toUpperCase()}) ${value}`)
      .join('\n');

    const prompt = `You are an expert mathematics tutor providing detailed explanations for exam questions.

Question: ${question}

Options:
${optionsText}

Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer || 'Not attempted'}
${explanation ? `Provided Explanation: ${explanation}` : ''}

Provide a comprehensive step-by-step solution that:
1. Explains why the correct answer is right
2. Shows the complete working/reasoning
3. ${!isCorrect ? 'Points out where the student went wrong' : 'Reinforces the correct understanding'}
4. Includes helpful tips or shortcuts if applicable

Format your response in clear, structured markdown with proper headings and bullet points.
Keep it educational and encouraging (300-400 words).`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert mathematics tutor providing detailed, step-by-step solutions.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to generate solution');
    }

    const data = await response.json();
    const solution = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ solution }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-question-solution:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
