
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
    // Verify API key exists
    if (!geminiApiKey) {
      console.error("Missing Gemini API key");
      return new Response(JSON.stringify({ error: "Server configuration error: Missing API key" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get auth header and create supabase client
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client with proper authentication
    const supabase = createClient(
      supabaseUrl || '',
      supabaseServiceKey || '', 
      {
        global: { 
          headers: { Authorization: authHeader } 
        }
      }
    );

    // Get user info from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    let requestBody: RequestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { question, image } = requestBody;

    if (!question) {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user has reached the limit (5 questions per day for free users)
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD
    
    // Check if user is premium
    const { data: premiumData, error: premiumError } = await supabase
      .from('user_premium')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();
    
    if (premiumError) {
      console.error("Error checking premium status:", premiumError);
    }
    
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
      }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    };

    // Add image to request if provided
    if (image) {
      try {
        payload.contents[0].parts.push({
          inline_data: {
            mime_type: "image/jpeg", // Assuming JPEG; adjust as needed
            data: image
          }
        });
      } catch (error) {
        console.error("Error adding image to payload:", error);
        // Continue without the image if there's an error
      }
    }

    console.log("Calling Gemini API with question:", question.substring(0, 50) + "...");

    // Call Gemini API with proper error handling
    let geminiResponse;
    try {
      geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error("Network error calling Gemini API:", error);
      return new Response(JSON.stringify({ 
        error: 'Failed to connect to AI service',
        details: error.message || String(error)
      }), {
        status: 503, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error status:', geminiResponse.status);
      console.error('Gemini API error response:', errorText);
      
      try {
        // Try to parse the error as JSON
        const errorJson = JSON.parse(errorText);
        return new Response(JSON.stringify({ 
          error: 'AI service error',
          details: errorJson.error?.message || 'Unknown error',
          status: geminiResponse.status
        }), {
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (e) {
        // If parsing fails, return the raw error text
        return new Response(JSON.stringify({ 
          error: 'AI service error',
          details: errorText.substring(0, 200),
          status: geminiResponse.status
        }), {
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    let geminiData;
    try {
      geminiData = await geminiResponse.json();
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return new Response(JSON.stringify({ 
        error: 'Invalid response from AI service',
        details: error.message || String(error)
      }), {
        status: 502, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Debug response structure
    console.log("Gemini API response structure:", Object.keys(geminiData));
    
    let answer;
    if (geminiData.candidates && geminiData.candidates.length > 0 && 
        geminiData.candidates[0].content && geminiData.candidates[0].content.parts && 
        geminiData.candidates[0].content.parts.length > 0) {
      answer = geminiData.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected response structure from Gemini:", JSON.stringify(geminiData).substring(0, 200));
      return new Response(JSON.stringify({ 
        error: "Failed to generate an answer",
        details: "The AI service returned an unexpected response format"
      }), {
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

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
      // Continue even if saving to history fails
    }

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message || String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
