
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// This is needed to make this function public (no JWT verification required)
// We'll add this to config.toml later

serve(async (req) => {
  // Initialize Stripe
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });

  // Get the signature from the header
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("No signature found", { status: 400 });
  }

  try {
    // Get the raw body
    const body = await req.text();
    
    // Verify the webhook signature
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      return new Response("Webhook secret not configured", { status: 500 });
    }

    // Construct the event
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    // Handle specific event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Get customer details
      const customer = await stripe.customers.retrieve(session.customer as string);
      if ('deleted' in customer) {
        throw new Error('Customer has been deleted');
      }
      
      // Get subscription details
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const subscriptionId = subscription.id;
      const customerId = subscription.customer as string;
      
      // Get user data from customer email
      const { data: userData, error: userError } = await supabaseClient
        .from("profiles")
        .select("id")
        .eq("email", customer.email)
        .single();
      
      if (userError || !userData) {
        // Try to find user directly from auth schema
        const { data: authUsers } = await supabaseClient.auth.admin.listUsers();
        const user = authUsers.users.find(u => u.email === customer.email);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Calculate subscription end date
        const periodEnd = new Date(subscription.current_period_end * 1000);

        // Determine subscription type from price
        const priceId = subscription.items.data[0].price.id;
        const subscriptionType = priceId === Deno.env.get("STRIPE_ANNUAL_PRICE_ID") ? "annual" : "monthly";
        
        // Insert or update premium status
        await supabaseClient
          .from("premium_subscriptions")
          .upsert({
            user_id: user.id,
            stripe_subscription_id: subscriptionId,
            subscription_type: subscriptionType,
            status: 'active',
            expires_at: periodEnd.toISOString(),
          });
      }
    } else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      
      // Get customer
      const customer = await stripe.customers.retrieve(subscription.customer as string);
      if ('deleted' in customer) {
        throw new Error('Customer has been deleted');
      }
      
      // Find user by email
      const { data: authUsers } = await supabaseClient.auth.admin.listUsers();
      const user = authUsers.users.find(u => u.email === customer.email);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Check subscription status
      if (subscription.status === 'active') {
        const periodEnd = new Date(subscription.current_period_end * 1000);
        const priceId = subscription.items.data[0].price.id;
        const subscriptionType = priceId === Deno.env.get("STRIPE_ANNUAL_PRICE_ID") ? "annual" : "monthly";
        
        // Update premium status
        await supabaseClient
          .from("premium_subscriptions")
          .upsert({
            user_id: user.id,
            stripe_subscription_id: subscription.id,
            subscription_type: subscriptionType,
            status: 'active',
            expires_at: periodEnd.toISOString(),
          });
      } else if (subscription.status === 'canceled') {
        // Handle cancellation
        await supabaseClient
          .from("premium_subscriptions")
          .update({ status: 'canceled' })
          .eq('user_id', user.id)
          .eq('stripe_subscription_id', subscription.id);
      }
    }
    
    // Return success
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});
