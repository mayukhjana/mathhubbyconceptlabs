
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
    
    console.log("Received webhook event:", event.type);
    
    // Handle specific event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log("Checkout session completed:", session.id);
      
      // Get customer details
      const customer = await stripe.customers.retrieve(session.customer as string);
      if ('deleted' in customer) {
        throw new Error('Customer has been deleted');
      }
      
      // Get subscription details
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const subscriptionId = subscription.id;
      const customerId = subscription.customer as string;
      const subscriptionStatus = subscription.status;
      
      console.log(`Processing subscription ${subscriptionId} for customer ${customerId} with status ${subscriptionStatus}`);
      
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
          console.error("User not found for email:", customer.email);
          throw new Error('User not found');
        }
        
        // Calculate subscription end date
        const periodEnd = new Date(subscription.current_period_end * 1000);
        console.log(`Setting up premium subscription until ${periodEnd.toISOString()}`);

        // Insert or update premium status
        const { data: premiumData, error: premiumError } = await supabaseClient
          .from("user_premium")
          .upsert({
            user_id: user.id,
            payment_id: subscriptionId,
            payment_provider: 'stripe',
            is_active: subscriptionStatus === 'active',
            starts_at: new Date().toISOString(),
            expires_at: periodEnd.toISOString(),
          }, { onConflict: 'user_id' })
          .select();
          
        if (premiumError) {
          console.error("Error updating premium status:", premiumError);
          throw new Error(`Error updating premium status: ${premiumError.message}`);
        }
        
        console.log("Premium status updated successfully:", premiumData);
      } else {
        // User found in profiles table
        const userId = userData.id;
        const periodEnd = new Date(subscription.current_period_end * 1000);
        
        console.log(`User found in profiles. Setting up premium for user ${userId} until ${periodEnd.toISOString()}`);
        
        // Insert or update premium status
        const { data: premiumData, error: premiumError } = await supabaseClient
          .from("user_premium")
          .upsert({
            user_id: userId,
            payment_id: subscriptionId,
            payment_provider: 'stripe',
            is_active: subscriptionStatus === 'active',
            starts_at: new Date().toISOString(),
            expires_at: periodEnd.toISOString(),
          }, { onConflict: 'user_id' })
          .select();
          
        if (premiumError) {
          console.error("Error updating premium status:", premiumError);
          throw new Error(`Error updating premium status: ${premiumError.message}`);
        }
        
        console.log("Premium status updated successfully:", premiumData);
      }
    } else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      console.log("Subscription updated:", subscription.id);
      
      // Get customer
      const customer = await stripe.customers.retrieve(subscription.customer as string);
      if ('deleted' in customer) {
        throw new Error('Customer has been deleted');
      }
      
      // Find user by email
      const { data: authUsers } = await supabaseClient.auth.admin.listUsers();
      const user = authUsers.users.find(u => u.email === customer.email);
      
      if (!user) {
        console.error("User not found for email:", customer.email);
        throw new Error('User not found');
      }
      
      console.log(`Processing subscription update for user ${user.id}`);
      
      // Check subscription status
      if (subscription.status === 'active') {
        const periodEnd = new Date(subscription.current_period_end * 1000);
        console.log(`Updating premium status: active until ${periodEnd.toISOString()}`);
        
        // Update premium status
        const { data: premiumData, error: premiumError } = await supabaseClient
          .from("user_premium")
          .upsert({
            user_id: user.id,
            payment_id: subscription.id,
            payment_provider: 'stripe',
            is_active: true,
            starts_at: new Date().toISOString(),
            expires_at: periodEnd.toISOString(),
          }, { onConflict: 'user_id' })
          .select();
          
        if (premiumError) {
          console.error("Error updating premium status:", premiumError);
          throw new Error(`Error updating premium status: ${premiumError.message}`);
        }
        
        console.log("Premium status updated successfully:", premiumData);
      } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
        console.log(`Subscription ${subscription.id} is ${subscription.status}, marking as inactive`);
        
        // Handle cancellation
        const { error: updateError } = await supabaseClient
          .from("user_premium")
          .update({ 
            is_active: false,
            expires_at: new Date(subscription.canceled_at ? subscription.canceled_at * 1000 : Date.now()).toISOString()
          })
          .eq('user_id', user.id)
          .eq('payment_id', subscription.id);
          
        if (updateError) {
          console.error("Error marking subscription as inactive:", updateError);
          throw new Error(`Error marking subscription as inactive: ${updateError.message}`);
        }
        
        console.log("Subscription marked as inactive successfully");
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      console.log("Subscription deleted:", subscription.id);
      
      // Mark subscription as inactive in database
      const { error: deleteError } = await supabaseClient
        .from("user_premium")
        .update({ 
          is_active: false,
          expires_at: new Date().toISOString()
        })
        .eq('payment_id', subscription.id);
        
      if (deleteError) {
        console.error("Error handling subscription deletion:", deleteError);
        throw new Error(`Error handling subscription deletion: ${deleteError.message}`);
      }
      
      console.log("Subscription marked as inactive due to deletion");
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
