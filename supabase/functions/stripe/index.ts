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
    
    console.log("Stripe key available, initializing Stripe client");
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Parse request body
    let action, data;
    try {
      const body = await req.json();
      action = body.action;
      data = body.data;
      
      console.log(`Processing action: ${action}`, data);
      
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

    console.log(`Authenticated user: ${user.id}`);
    let result;
    
    switch (action) {
      case "create-checkout-session":
        try {
          const { priceId, successUrl, cancelUrl, userId } = data;
          
          if (!priceId || !successUrl || !cancelUrl) {
            return new Response(JSON.stringify({ error: "Missing required parameters for checkout" }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          
          // Use the provided userId if available, otherwise use the authenticated user's id
          const effectiveUserId = userId || user.id;
          console.log(`Creating checkout session for price ID: ${priceId} and user ID: ${effectiveUserId}`);
          
          // Get or create Stripe customer for the user
          const { data: subscriptions, error: subError } = await supabase
            .from("subscriptions")
            .select("stripe_customer_id")
            .eq("user_id", effectiveUserId)
            .maybeSingle();
          
          if (subError) {
            console.error("Error fetching subscription:", subError);
          }
          
          let customerId = subscriptions?.stripe_customer_id;
          
          if (!customerId) {
            // Create a new customer
            console.log("Creating new Stripe customer");
            const customer = await stripe.customers.create({
              email: user.email,
              metadata: {
                supabase_id: effectiveUserId,
              },
            });
            customerId = customer.id;
            console.log(`Created new customer: ${customerId}`);
          } else {
            console.log(`Using existing customer: ${customerId}`);
          }
          
          // Create checkout session
          console.log("Creating Stripe checkout session");
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
              user_id: effectiveUserId,
            },
          });
          
          console.log(`Created checkout session: ${session.id}, URL: ${session.url}`);
          result = { sessionId: session.id, url: session.url };
        } catch (error) {
          console.error("Error creating checkout session:", error);
          return new Response(JSON.stringify({ error: `Error creating checkout session: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
        
      case "get-subscription":
        try {
          // Use the provided userId if available, otherwise use the authenticated user's id
          const effectiveUserId = data?.userId || user.id;
          console.log(`Fetching subscription for user: ${effectiveUserId}`);
          
          const { data: userSubscription, error: fetchError } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", effectiveUserId)
            .maybeSingle();
            
          if (fetchError) {
            console.error("Error fetching subscription:", fetchError);
            return new Response(JSON.stringify({ error: `Error fetching subscription: ${fetchError.message}` }), {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          
          console.log("Subscription data:", userSubscription);
          
          if (!userSubscription && effectiveUserId) {
            // If no subscription is found in the database, try to find one in Stripe
            console.log("No subscription found in database, checking Stripe directly");
            
            // First, check if the user has a customer record in any existing subscription
            const { data: customerData } = await supabase
              .from("subscriptions")
              .select("stripe_customer_id")
              .eq("user_id", effectiveUserId)
              .maybeSingle();
              
            if (customerData?.stripe_customer_id) {
              console.log(`Found customer ID: ${customerData.stripe_customer_id}, checking subscriptions in Stripe`);
              
              const subscriptions = await stripe.subscriptions.list({
                customer: customerData.stripe_customer_id,
                status: 'active',
                limit: 1,
              });
              
              if (subscriptions.data.length > 0) {
                const stripeSubscription = subscriptions.data[0];
                console.log("Found active subscription in Stripe:", stripeSubscription.id);
                
                // Save this subscription to the database
                const priceId = stripeSubscription.items.data[0].price.id;
                
                const newSubscription = {
                  user_id: effectiveUserId,
                  stripe_customer_id: customerData.stripe_customer_id,
                  stripe_subscription_id: stripeSubscription.id,
                  plan_id: priceId,
                  status: stripeSubscription.status,
                  current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                
                const { data: savedSub, error: saveError } = await supabase
                  .from("subscriptions")
                  .upsert(newSubscription, { onConflict: 'user_id', returning: 'representation' });
                  
                if (saveError) {
                  console.error("Error saving subscription from Stripe:", saveError);
                } else {
                  console.log("Saved subscription from Stripe to database:", savedSub);
                  return new Response(JSON.stringify({ subscription: savedSub[0] }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                  });
                }
              }
            }
          }
          
          result = { subscription: userSubscription };
        } catch (error) {
          console.error("Error in get-subscription:", error);
          return new Response(JSON.stringify({ error: `Error getting subscription: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
        
      case "cancel-subscription":
        const { subscriptionId } = data;
        
        if (!subscriptionId) {
          return new Response(JSON.stringify({ error: "Missing subscription ID" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        console.log(`Verifying subscription: ${subscriptionId} for user: ${user.id}`);
        
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
          console.log(`Canceling Stripe subscription: ${subscriptionId}`);
          await stripe.subscriptions.cancel(subscriptionId);
          
          // Update the subscription status in the database
          console.log("Updating subscription status in database");
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
        
      case "get-invoices":
        try {
          // Get the customer ID from the subscriptions table
          const { data: subscription, error: subError } = await supabase
            .from("subscriptions")
            .select("stripe_customer_id")
            .eq("user_id", user.id)
            .maybeSingle();
            
          if (subError) {
            console.error("Error fetching subscription for invoices:", subError);
            return new Response(JSON.stringify({ error: `Error fetching subscription: ${subError.message}` }), {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          
          if (!subscription || !subscription.stripe_customer_id) {
            console.log("No subscription or customer ID found for user");
            return new Response(JSON.stringify({ invoices: [] }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          
          console.log(`Fetching invoices for customer: ${subscription.stripe_customer_id}`);
          
          // Get invoices from Stripe
          const invoices = await stripe.invoices.list({
            customer: subscription.stripe_customer_id,
            limit: 10, // Limit to the 10 most recent invoices
          });
          
          console.log(`Retrieved ${invoices.data.length} invoices`);
          
          result = { invoices: invoices.data };
        } catch (error) {
          console.error("Error getting invoices:", error);
          return new Response(JSON.stringify({ error: `Error getting invoices: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
        
      case "get-invoice":
        try {
          const { invoiceId } = data;
          
          if (!invoiceId) {
            return new Response(JSON.stringify({ error: "Missing invoice ID" }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          
          console.log(`Fetching invoice: ${invoiceId}`);
          
          // Get invoice from Stripe
          const invoice = await stripe.invoices.retrieve(invoiceId);
          
          // Verify this invoice belongs to the current user
          const { data: subscription, error: subError } = await supabase
            .from("subscriptions")
            .select("stripe_customer_id")
            .eq("user_id", user.id)
            .maybeSingle();
            
          if (subError) {
            console.error("Error verifying customer:", subError);
            return new Response(JSON.stringify({ error: `Error verifying customer: ${subError.message}` }), {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          
          if (!subscription || subscription.stripe_customer_id !== invoice.customer) {
            return new Response(JSON.stringify({ error: "Invoice does not belong to user" }), {
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          
          result = { invoice };
        } catch (error) {
          console.error("Error getting invoice:", error);
          return new Response(JSON.stringify({ error: `Error getting invoice: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
        
      case "update-contract-acceptance":
        try {
          const { accepted, acceptedAt } = data;
          
          console.log(`Updating contract acceptance for user ${user.id}: ${accepted}`);
          
          // Update the subscription record with contract acceptance
          const { data: updateData, error: updateError } = await supabase
            .from("subscriptions")
            .update({
              contract_accepted: accepted,
              contract_accepted_at: acceptedAt,
            })
            .eq("user_id", user.id)
            .select()
            .maybeSingle();
            
          if (updateError) {
            console.error("Error updating contract acceptance:", updateError);
            return new Response(JSON.stringify({ error: `Error updating contract acceptance: ${updateError.message}` }), {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          
          result = { success: true, data: updateData };
        } catch (error) {
          console.error("Error updating contract acceptance:", error);
          return new Response(JSON.stringify({ error: `Error updating contract acceptance: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
        
      case "request-receipt":
        // In a real implementation, this would generate a receipt PDF
        // and either email it to the user or return a download URL
        result = { success: true, message: "Receipt request processed" };
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
