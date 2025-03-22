
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from 'https://esm.sh/stripe@12.18.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    if (!stripeSecretKey) {
      console.error("Missing STRIPE_SECRET_KEY");
      return new Response(JSON.stringify({ error: "Server configuration error - missing Stripe key" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Parse request body
    let action, data;
    try {
      const body = await req.json();
      action = body.action;
      data = body.data;
      
      if (!action) {
        throw new Error("Missing action parameter");
      }
    } catch (error) {
      console.error("Error parsing request:", error);
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
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
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Not authorized", details: userError }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result;
    
    switch (action) {
      case "create-checkout-session":
        const { priceId, successUrl, cancelUrl } = data;
        
        if (!priceId || !successUrl || !cancelUrl) {
          return new Response(JSON.stringify({ error: "Missing required parameters for checkout" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        console.log(`Creating checkout session for price ID: ${priceId}`);
        
        // Get or create Stripe customer for the user
        const { data: subscriptions, error: subError } = await supabase
          .from("subscriptions")
          .select("stripe_customer_id")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (subError) {
          console.error("Error fetching subscription:", subError);
        }
        
        let customerId = subscriptions?.stripe_customer_id;
        
        if (!customerId) {
          // Create a new customer
          try {
            const customer = await stripe.customers.create({
              email: user.email,
              metadata: {
                supabase_id: user.id,
              },
            });
            customerId = customer.id;
            console.log(`Created new customer: ${customerId}`);
          } catch (error) {
            console.error("Error creating customer:", error);
            return new Response(JSON.stringify({ error: `Error creating Stripe customer: ${error.message}` }), {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
        
        // Create checkout session
        try {
          const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
              {
                price: priceId,
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
          console.log(`Created checkout session: ${session.id}`);
        } catch (error) {
          console.error("Error creating checkout session:", error);
          return new Response(JSON.stringify({ error: `Error creating checkout session: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
        
      case "get-subscription":
        const { data: userSubscription, error: fetchError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
          
        if (fetchError) {
          console.error("Error fetching subscription:", fetchError);
          return new Response(JSON.stringify({ error: `Error fetching subscription: ${fetchError.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        result = { subscription: userSubscription };
        break;
        
      case "cancel-subscription":
        const { subscriptionId } = data;
        
        if (!subscriptionId) {
          return new Response(JSON.stringify({ error: "Missing subscription ID" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        // Verify the subscription belongs to the user
        const { data: subData, error: verifyError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("stripe_subscription_id", subscriptionId)
          .maybeSingle();
          
        if (verifyError) {
          console.error("Error verifying subscription:", verifyError);
          return new Response(JSON.stringify({ error: `Error verifying subscription: ${verifyError.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        if (!subData) {
          return new Response(JSON.stringify({ error: "Subscription not found or doesn't belong to user" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        // Cancel the subscription in Stripe
        try {
          await stripe.subscriptions.cancel(subscriptionId);
          
          // Update the subscription status in the database
          await supabase
            .from("subscriptions")
            .update({ status: "canceled" })
            .eq("stripe_subscription_id", subscriptionId);
            
          result = { success: true };
        } catch (error) {
          console.error("Error canceling subscription:", error);
          return new Response(JSON.stringify({ error: `Error canceling subscription: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
        
      default:
        return new Response(JSON.stringify({ error: `Unsupported action: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in stripe function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
