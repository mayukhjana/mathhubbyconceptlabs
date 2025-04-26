
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface RequestBody {
  question: string;
  image?: string; // base64 encoded
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

async function saveAiChatHistory(supabase: any, userId: string, question: string, answer: string, hasImage: boolean = false) {
  const { error } = await supabase
    .from('ai_chat_history')
    .insert({
      user_id: userId,
      question,
      answer,
      has_image: hasImage
    });

  if (error) {
    console.error("Error saving chat history:", error);
  }
}

// Call Gemini API for math problems
async function callGeminiApi(question: string, imageBase64?: string) {
  try {
    const apiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    const requestBody: any = {
      contents: [
        {
          parts: [
            {
              text: `You are MathHub AI, a specialized math tutor that helps students solve math problems.
                     Focus on providing clear, step-by-step solutions to math problems.
                     For complex math, use clear explanations and break down the concepts.
                     If a question is not math-related, politely redirect to math topics.
                     Always be encouraging and supportive.
                     
                     Here is the student's question: ${question}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    };
    
    // Add image if provided
    if (imageBase64) {
      requestBody.contents[0].parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageBase64
        }
      });
    }
    
    const response = await fetch(`${apiEndpoint}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error response:", errorText);
      throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated from Gemini");
    }
    
    // Extract the text content from the response
    const answer = data.candidates[0].content.parts
      .filter((part: any) => part.text)
      .map((part: any) => part.text)
      .join("\n");
      
    return answer;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
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

    const { question, image } = await req.json() as RequestBody;

    // Check if user can make this request
    const canProceed = await checkUserQuotaAndUpdate(supabase, user.id);
    if (!canProceed) {
      return new Response(JSON.stringify({
        error: 'Free quota exhausted. Please upgrade to premium.'
      }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let answer;
    try {
      // Call Gemini API for answer
      answer = await callGeminiApi(question, image);
      
      // Save chat history
      await saveAiChatHistory(supabase, user.id, question, answer, !!image);
      
    } catch (error: any) {
      console.error('Error processing math question:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to get answer from Gemini AI',
        details: error.message 
      }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
