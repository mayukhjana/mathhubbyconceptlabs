
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface RequestBody {
  question: string;
  useCustomKey?: boolean;
  customApiKey?: string;
}

function createSupabaseClient(authHeader: string | null) {
  if (authHeader) {
    return createClient(supabaseUrl!, supabaseAnonKey!, {
      global: { headers: { Authorization: authHeader } }
    });
  }
  return createClient(supabaseUrl!, supabaseServiceKey!);
}

async function checkUserQuotaAndUpdate(supabase: any, userId: string): Promise<boolean> {
  // Check if user exists in user_ai_doubts table
  let { data: userAiDoubts, error: fetchError } = await supabase
    .from('user_ai_doubts')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {  // PGRST116 = not found
    console.error("Error fetching user AI doubts:", fetchError);
    return false;
  }

  // If user doesn't have a record, create one
  if (!userAiDoubts) {
    const { error: insertError } = await supabase
      .from('user_ai_doubts')
      .insert({
        user_id: userId,
        total_used: 1
      });

    if (insertError) {
      console.error("Error creating user AI doubts record:", insertError);
      return false;
    }
    return true;
  }

  // Check if user has used less than 5 doubts or is premium
  const { data: userPremium } = await supabase
    .from('user_premium')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  const isPremium = !!userPremium;

  if (isPremium || userAiDoubts.total_used < 5) {
    // Increment total_used if not premium
    if (!isPremium) {
      const { error: updateError } = await supabase
        .from('user_ai_doubts')
        .update({ total_used: userAiDoubts.total_used + 1, updated_at: new Date().toISOString() })
        .eq('id', userAiDoubts.id);

      if (updateError) {
        console.error("Error updating user AI doubts:", updateError);
        return false;
      }
    }
    return true;
  }

  return false;
}

async function saveAiChatHistory(supabase: any, userId: string, question: string, answer: string) {
  const { error } = await supabase
    .from('ai_chat_history')
    .insert({
      user_id: userId,
      question,
      answer
    });

  if (error) {
    console.error("Error saving chat history:", error);
  }
}

// Handle the request
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const supabase = createSupabaseClient(authHeader);

    // Get user info from JWT
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { question, useCustomKey = false, customApiKey = '' } = await req.json() as RequestBody;

    // Check if user can make this request
    const canProceed = await checkUserQuotaAndUpdate(supabase, user.id);
    if (!canProceed && !useCustomKey) {
      return new Response(JSON.stringify({
        error: 'Free quota exhausted. Please upgrade to premium or use your own API key.'
      }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Determine which API key to use
    const apiKey = useCustomKey ? customApiKey : openAiApiKey;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Format the system prompt for math-focused assistance
    const systemPrompt = `You are MathHub AI, a specialized math tutor that helps students solve math problems and understand mathematical concepts.
    Focus on providing clear, step-by-step solutions to math problems.
    For complex math, use clear explanations and break down the concepts.
    If a question is not math-related, politely redirect to math topics.
    Always be encouraging and supportive, recognizing that learning math can be challenging.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      if (useCustomKey) {
        return new Response(JSON.stringify({ 
          error: 'Error with your custom API key. Please check that it is valid and has sufficient credits.' 
        }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ error: 'Failed to get answer from AI' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const answer = data.choices[0].message.content;

    // Save chat history only if not using custom key
    if (!useCustomKey) {
      await saveAiChatHistory(supabase, user.id, question, answer);
    }

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
