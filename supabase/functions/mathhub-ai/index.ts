
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
const claudeApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface RequestBody {
  question: string;
  model: string;
  files?: Array<{
    name: string;
    content: string; // base64 encoded
    type: string;
  }>;
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

async function callOpenAI(question: string, files: any[] = []) {
  const messages = [
    { 
      role: 'system', 
      content: `You are MathHub AI, a specialized math tutor that helps students solve math problems and understand mathematical concepts.
      Focus on providing clear, step-by-step solutions to math problems.
      For complex math, use clear explanations and break down the concepts.
      If a question is not math-related, politely redirect to math topics.
      Always be encouraging and supportive, recognizing that learning math can be challenging.`
    },
    { 
      role: 'user', 
      content: [
        { type: 'text', text: question }
      ]
    }
  ];
  
  // Add any files to the message
  if (files && files.length > 0) {
    for (const file of files) {
      messages[1].content.push({
        type: 'image_url',
        image_url: {
          url: `data:${file.type};base64,${file.content}`
        }
      });
    }
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7
    })
  });

  return response;
}

async function callClaude(question: string, files: any[] = []) {
  const messages = [
    { 
      role: 'user', 
      content: [
        { 
          type: 'text', 
          text: `You are MathHub AI, a specialized math tutor that helps students solve math problems and understand mathematical concepts.
          Focus on providing clear, step-by-step solutions to math problems.
          For complex math, use clear explanations and break down the concepts.
          If a question is not math-related, politely redirect to math topics.
          Always be encouraging and supportive, recognizing that learning math can be challenging.
          
          Here is the question: ${question}`
        }
      ]
    }
  ];
  
  // Add any files to the messages
  if (files && files.length > 0) {
    for (const file of files) {
      messages[0].content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: file.type,
          data: file.content
        }
      });
    }
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': claudeApiKey!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages
    })
  });

  return response;
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

    const { question, model = 'gpt-4o', files = [] } = await req.json() as RequestBody;

    // Check if user can make this request
    const canProceed = await checkUserQuotaAndUpdate(supabase, user.id);
    if (!canProceed) {
      return new Response(JSON.stringify({
        error: 'Free quota exhausted. Please upgrade to premium.'
      }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let response;
    let data;
    let answer;

    // Call the appropriate API based on the selected model
    if (model.startsWith('gpt-')) {
      response = await callOpenAI(question, files);
      data = await response.json();
      
      if (!response.ok) {
        console.error('OpenAI API error:', data);
        return new Response(JSON.stringify({ error: 'Failed to get answer from AI' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      answer = data.choices[0].message.content;
    } 
    else if (model.startsWith('claude-')) {
      response = await callClaude(question, files);
      data = await response.json();
      
      if (!response.ok) {
        console.error('Claude API error:', data);
        return new Response(JSON.stringify({ error: 'Failed to get answer from Claude AI' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      answer = data.content[0].text;
    }
    else {
      return new Response(JSON.stringify({ error: 'Invalid model selected' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Save chat history
    await saveAiChatHistory(supabase, user.id, question, answer);

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
