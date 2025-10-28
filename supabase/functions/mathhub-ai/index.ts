import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';
import { corsHeaders } from '../_shared/cors.ts';

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

interface RequestBody {
  question: string;
  files?: Array<{
    name: string;
    content: string; // base64 encoded
    type: string;
  }>;
}

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

    const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { question, files = [] } = await req.json() as RequestBody;

    if (!question && files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Please provide a question or an image' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check and update user quota
    const canProceed = await checkAndUpdateQuota(supabase, user.id);
    if (!canProceed) {
      return new Response(
        JSON.stringify({ 
          error: 'Daily limit reached', 
          details: 'Free users get 5 questions per day. Upgrade to premium for unlimited questions.' 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build messages for AI
    const messages: any[] = [
      { 
        role: 'system', 
        content: `You are MathHub AI, a specialized math tutor helping students solve math problems.
        
Key guidelines:
- Provide clear, step-by-step solutions
- Break down complex concepts into simple explanations
- Use examples when helpful
- Be encouraging and supportive
- If the question is not math-related, politely redirect to math topics
- For image-based questions, analyze the problem carefully and provide a complete solution` 
      },
      { 
        role: 'user', 
        content: []
      }
    ];

    // Add text question
    messages[1].content.push({ type: 'text', text: question || 'Please analyze this math problem from the image.' });

    // Add images if provided
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

    // Call Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Lovable AI error:', response.status, errorData);
      
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

      return new Response(
        JSON.stringify({ error: 'Failed to get AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content;

    if (!answer) {
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save chat history
    await saveChatHistory(supabase, user.id, question, answer, files.length > 0);

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in mathhub-ai:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function checkAndUpdateQuota(supabase: any, userId: string): Promise<boolean> {
  // Check if user has premium subscription
  const { data: subscription } = await supabase
    .from('premium_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .single();

  // Premium users have unlimited access
  if (subscription) {
    return true;
  }

  // Check daily usage for free users
  let { data: usage, error } = await supabase
    .from('user_ai_doubts')
    .select('*')
    .eq('user_id', userId)
    .single();

  const today = new Date().toISOString().split('T')[0];

  if (error && error.code === 'PGRST116') {
    // Create new record
    await supabase
      .from('user_ai_doubts')
      .insert({
        user_id: userId,
        total_used: 1,
        updated_at: new Date().toISOString()
      });
    return true;
  }

  if (usage) {
    const lastUpdate = new Date(usage.updated_at).toISOString().split('T')[0];
    
    if (today !== lastUpdate) {
      // Reset count for new day
      await supabase
        .from('user_ai_doubts')
        .update({ 
          total_used: 1, 
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', userId);
      return true;
    }

    // Check daily limit (5 for free users)
    if (usage.total_used < 5) {
      await supabase
        .from('user_ai_doubts')
        .update({ 
          total_used: usage.total_used + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      return true;
    }

    return false;
  }

  return true;
}

async function saveChatHistory(
  supabase: any, 
  userId: string, 
  question: string, 
  answer: string, 
  hasImage: boolean
) {
  const { error } = await supabase
    .from('ai_chat_history')
    .insert({
      user_id: userId,
      question,
      answer,
      has_image: hasImage
    });

  if (error) {
    console.error('Error saving chat history:', error);
  }
}
