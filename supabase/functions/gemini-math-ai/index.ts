
import { corsHeaders } from '../_shared/cors.ts';

interface RequestBody {
  question: string;
  image?: string; // base64 encoded
}

// Main request handler
Deno.serve(async (req) => {
  console.log("Gemini math AI function invoked");
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get API key from environment variable
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing API key" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    let requestBody: RequestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract question and image from request
    const { question, image } = requestBody;
    
    // Validate input
    if (!question && !image) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Question or image is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Received request with question: ${question}\n and image: ${image ? "yes" : "no"}`);

    // Set up content parts for the API request
    const parts = [
      {
        text: `You are MathHub AI, a specialized math tutor that helps students solve math problems step by step. 
Here is the math question: ${question}`
      }
    ];

    // Add image if provided
    if (image) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: image
        }
      });
    }

    console.log("Calling Gemini API...");
    
    // Call Google's Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
        },
        safetySettings: [
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
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    // Check for API errors
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorData}`);
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const data = await response.json();
      
      // Check for valid response structure
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error("Invalid response from Gemini API:", data);
        return new Response(
          JSON.stringify({ error: "Invalid response format from Gemini API" }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Extract the answer text from the response
      const answerText = data.candidates[0].content.parts[0].text;
      console.log("Successfully generated response from Gemini");

      return new Response(
        JSON.stringify({ answer: answerText }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error("Error parsing Gemini API response:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to process Gemini API response" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
