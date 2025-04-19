
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface RequestBody {
  question: string;
  image?: string; // base64 encoded image
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
      global: { headers: { Authorization: authHeader || '' } }
    });

    // Get user info from JWT
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const { question, image } = await req.json() as RequestBody;

    if (!question) {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user has reached the limit (5 questions per day for free users)
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD
    
    // Check if user is premium
    const { data: premiumData } = await supabase
      .from('user_premium')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();
    
    const isPremium = !!premiumData;
    
    if (!isPremium) {
      // Count today's questions for free users
      const { count, error: countError } = await supabase
        .from('ai_chat_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);
      
      if (countError) {
        console.error('Error checking daily limit:', countError);
      } else if (count && count >= 5) {
        return new Response(JSON.stringify({ 
          error: 'Daily limit reached for free users. Please upgrade to premium for unlimited questions.' 
        }), {
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Prepare request for Gemini
    let payload: any = {
      contents: [{
        parts: [
          { 
            text: `As MathHub AI, you specialize in mathematics education. You provide clear, step-by-step solutions to math problems with helpful explanations. When answering, use proper mathematical notation and break down complex concepts. If you're uncertain about any part of the question, explain why and offer the best possible guidance.

User Question: ${question}`
          }
        ]
      }]
    };

    // Add image to request if provided
    if (image) {
      payload.contents[0].parts.push({
        inline_data: {
          mime_type: "image/jpeg", // Assuming JPEG; adjust as needed
          data: image
        }
      });
    }

    // Call Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error('Gemini API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to generate answer' }), {
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const geminiData = await geminiResponse.json();
    const answer = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate an answer.';

    // Save the interaction to history
    const { error: historyError } = await supabase
      .from('ai_chat_history')
      .insert({
        user_id: user.id,
        question,
        answer,
        has_image: !!image
      });

    if (historyError) {
      console.error('Error saving to chat history:', historyError);
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
