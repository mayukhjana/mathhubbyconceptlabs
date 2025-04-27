
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in Supabase secrets");
    }

    const { question, image } = await req.json();
    
    if (!question && !image) {
      return new Response(
        JSON.stringify({ 
          error: "Missing input", 
          details: "Please provide a question or an image" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log("Received request with question:", question?.substring(0, 100), "and image:", image ? "yes" : "no");
    
    // Build request for Gemini
    const requestBody: any = {
      contents: [
        {
          parts: []
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    // Setup system prompt
    const systemPrompt = `You are MathHub AI, a specialized math tutor developed by MathHub. 
    You are an expert in all areas of mathematics including algebra, calculus, geometry, statistics, 
    and more. Your goal is to help students understand mathematical concepts and solve problems. 
    Provide clear step-by-step explanations. Format your answers using markdown, including LaTeX 
    for mathematical expressions where appropriate. Be thorough but concise.`;
    
    // Add system prompt
    requestBody.contents[0].parts.push({
      text: systemPrompt
    });
    
    // Add user's question
    if (question) {
      requestBody.contents[0].parts.push({
        text: question
      });
    }
    
    // Add image if provided
    if (image) {
      try {
        requestBody.contents[0].parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: image
          }
        });
      } catch (imageError) {
        console.error("Error processing image:", imageError);
      }
    }

    // Call Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    console.log("Calling Gemini API...");
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} ${response.statusText}`, errorText);
      return new Response(
        JSON.stringify({ 
          error: "Failed to get answer from Gemini AI", 
          details: `Status: ${response.status}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
      console.error("Invalid response from Gemini:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ 
          error: "Invalid response from Gemini AI",
          details: "No content generated" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const answer = data.candidates[0].content.parts[0].text;
    
    console.log("Successfully generated response from Gemini");
    
    return new Response(
      JSON.stringify({ answer }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error("Error in gemini-math-ai function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
