
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Update to production URL when ready
const PHONEPE_API_URL = "https://api-preprod.phonepe.com/apis/hermes-pg/pg/v1";
const MERCHANT_ID = Deno.env.get("PHONEPE_CLIENT_ID") || "";
const MERCHANT_SECRET = Deno.env.get("PHONEPE_CLIENT_SECRET") || "";

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
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: user.id,
      amount,
      redirectUrl: `${req.headers.get("origin")}/premium-success`,
      redirectMode: "REDIRECT",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    console.log("PhonePe Payload:", JSON.stringify(payload));

    // Base64 encode the payload
    const base64Payload = btoa(JSON.stringify(payload));

    // Create checksum (SHA256 hash of base64 payload + "/pg/v1/pay" + merchant ID + salt key)
    const message = base64Payload + "/pg/v1/pay" + MERCHANT_ID + MERCHANT_SECRET;
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const checksum = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    console.log("Generated X-VERIFY:", checksum);

    // Make request to PhonePe
    const response = await fetch(`${PHONEPE_API_URL}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const responseData = await response.json();
    console.log("PhonePe API Response:", JSON.stringify(responseData));

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to initialize payment");
    }

    // Return success with redirect URL
    return new Response(
      JSON.stringify({ 
        url: responseData.data?.instrumentResponse?.redirectInfo?.url || null,
        status: responseData.code,
        message: responseData.message
      }),
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
