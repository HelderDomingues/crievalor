
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from 'https://esm.sh/stripe@12.18.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Test pricing configuration - use these instead of hardcoded price IDs
const TEST_PRICE_IDS = {
  price_basic: "price_1PGkXX2eZvKYlo2CNH9w1r3L",     // Replace with actual test price IDs
  price_pro: "price_1PGkXs2eZvKYlo2CUvCGXsFe",       // Replace with actual test price IDs
  price_enterprise: "price_1PGkYB2eZvKYlo2CZrwzM75I", // Replace with actual test price IDs
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Parse request body
    const { action, data } = await req.json();
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user from auth token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Not authorized", details: userError }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result;
    
    switch (action) {
      case "create-checkout-session":
        const { priceId, successUrl, cancelUrl } = data;
        
        // Map the price ID to a test price ID if needed
        const actualPriceId = TEST_PRICE_IDS[priceId] || priceId;
        
        console.log(`Creating checkout session for price ID: ${priceId} (mapped to: ${actualPriceId})`);
        
        // Get or create Stripe customer for the user
        const { data: subscriptions, error: subError } = await supabase
          .from("subscriptions")
          .select("stripe_customer_id")
          .eq("user_id", user.id)
          .maybeSingle();
        
        let customerId = subscriptions?.stripe_customer_id;
        
        if (!customerId) {
          // Create a new customer
          const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
              supabase_id: user.id,
            },
          });
          customerId = customer.id;
        }
        
        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          line_items: [
            {
              price: actualPriceId,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: {
            user_id: user.id,
          },
        });
        
        result = { sessionId: session.id, url: session.url };
        break;
        
      case "get-subscription":
        const { data: userSubscription, error: fetchError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
          
        if (fetchError) {
          throw new Error(fetchError.message);
        }
        
        result = { subscription: userSubscription };
        break;
        
      case "cancel-subscription":
        const { subscriptionId } = data;
        
        // Verify the subscription belongs to the user
        const { data: subData, error: verifyError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("stripe_subscription_id", subscriptionId)
          .maybeSingle();
          
        if (verifyError || !subData) {
          throw new Error("Subscription not found or doesn't belong to user");
        }
        
        // Cancel the subscription in Stripe
        await stripe.subscriptions.cancel(subscriptionId);
        
        // Update the subscription status in the database
        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscriptionId);
          
        result = { success: true };
        break;
        
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in stripe function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
