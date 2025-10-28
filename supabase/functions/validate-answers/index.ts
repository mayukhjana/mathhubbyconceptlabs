import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create clients
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const userSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user authentication
    const { data: { user }, error: userError } = await userSupabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { examId, userAnswers } = await req.json();

    if (!examId || !userAnswers) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch questions with correct answers using service role
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, correct_answer, is_multi_correct, marks, negative_marks')
      .eq('exam_id', examId);

    if (questionsError || !questions) {
      console.error('Error fetching questions:', questionsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch questions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate answers and calculate score
    let score = 0;
    let obtainedMarks = 0;
    let totalMarks = 0;
    const results: Record<string, boolean> = {};

    for (const question of questions) {
      totalMarks += Number(question.marks);
      const userAnswer = userAnswers[question.id];

      if (!userAnswer) {
        results[question.id] = false;
        continue;
      }

      let isCorrect = false;

      if (question.is_multi_correct) {
        // Handle multi-correct questions
        const correctAnswers = typeof question.correct_answer === 'string'
          ? question.correct_answer.split(',').sort()
          : question.correct_answer;
        const userAnswersSorted = userAnswer.split(',').sort();
        isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(userAnswersSorted);
      } else {
        // Handle single correct questions
        isCorrect = userAnswer === question.correct_answer;
      }

      results[question.id] = isCorrect;

      if (isCorrect) {
        score++;
        obtainedMarks += Number(question.marks);
      } else {
        obtainedMarks -= Number(question.negative_marks || 0);
      }
    }

    return new Response(
      JSON.stringify({
        score,
        totalMarks,
        obtainedMarks: Math.max(0, obtainedMarks),
        totalQuestions: questions.length,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in validate-answers:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
