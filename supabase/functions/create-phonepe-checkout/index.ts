
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const PHONEPE_API_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    // Get subscription type from request body
    const { subscriptionType } = await req.json();
    const amount = subscriptionType === "annual" ? 149900 : 14900; // Amount in paise

    // Create a unique merchantTransactionId
    const merchantTransactionId = crypto.randomUUID();

    // Create payload for PhonePe
    const payload = {
      merchantId: Deno.env.get("PHONEPE_CLIENT_ID"),
      merchantTransactionId,
      merchantUserId: user.id,
      amount,
      redirectUrl: `${req.headers.get("origin")}/premium-success`,
      redirectMode: "REDIRECT",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    // Base64 encode the payload
    const base64Payload = btoa(JSON.stringify(payload));

    // Create checksum (SHA256 hash of base64 payload + "/pg/v1/pay" + merchant ID + salt key)
    const message = base64Payload + "/pg/v1/pay" + Deno.env.get("PHONEPE_CLIENT_ID") + Deno.env.get("PHONEPE_CLIENT_SECRET");
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const checksum = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // Make request to PhonePe
    const response = await fetch(`${PHONEPE_API_URL}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to initialize payment");
    }

    // Return success with redirect URL
    return new Response(
      JSON.stringify({ url: data.data.instrumentResponse.redirectInfo.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error creating PhonePe checkout:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
