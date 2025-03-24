import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from 'https://esm.sh/stripe@12.18.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  console.log("Stripe webhook function invoked");
  
  if (!endpointSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET in environment variables");
    return new Response(JSON.stringify({ error: "Webhook secret missing in configuration" }), {
      status: 500,
    });
  }
  
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    console.error("Webhook signature missing in request");
    return new Response(JSON.stringify({ error: "Webhook signature missing" }), {
      status: 400,
    });
  }
  
  const body = await req.text();
  let event;
  
  try {
    console.log("Constructing Stripe event from webhook payload");
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    console.log(`Webhook event type: ${event.type}`);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
      status: 400,
    });
  }
  
  // Initialize Supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  if (!supabaseServiceKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY in environment variables");
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
    });
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log("Processing checkout.session.completed event");
        const session = event.data.object;
        
        // Extract the customer and subscription IDs
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        
        // Check for user_id in metadata - this is critical
        if (!session.metadata || !session.metadata.user_id) {
          console.error("CRITICAL ERROR: No user_id found in session metadata:", JSON.stringify(session.metadata));
          throw new Error("User ID missing in session metadata");
        }
        
        const userId = session.metadata.user_id;
        console.log(`Session completed for user: ${userId}, subscription: ${subscriptionId}, customer: ${customerId}`);
        
        // Get subscription details from Stripe
        console.log("Retrieving subscription details from Stripe");
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;
        
        console.log(`Subscription price ID: ${priceId}`);
        
        // Check if user exists in auth.users
        const { data: authUserData, error: authUserError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();
          
        if (authUserError) {
          console.error(`Error checking user existence: ${authUserError.message}`);
          console.log(`Will attempt to create subscription for user ${userId} anyway`);
        } else {
          console.log(`User ${userId} exists in profiles table`);
        }
        
        // Insert or update subscription record with more data validation
        console.log(`Upserting subscription record for user: ${userId}`);
        const { data: upsertData, error: upsertError } = await supabase
          .from("subscriptions")
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan_id: priceId,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id',
            returning: 'representation'
          });
          
        if (upsertError) {
          console.error(`Error updating subscription: ${upsertError.message}`);
          throw new Error(`Error updating subscription: ${upsertError.message}`);
        }
        
        console.log("Subscription record updated successfully:", upsertData);
        
        // Verify subscription was saved successfully
        const { data: verifyData, error: verifyError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .single();
          
        if (verifyError) {
          console.error(`Error verifying subscription save: ${verifyError.message}`);
        } else {
          console.log("Verified subscription saved successfully:", verifyData);
        }
        
        break;
      }
      
      case 'invoice.payment_succeeded': {
        console.log("Processing invoice.payment_succeeded event");
        const invoice = event.data.object;
        if (!invoice.subscription) {
          console.log("No subscription associated with this invoice, skipping");
          break;
        }
        
        // Get subscription details from Stripe
        console.log(`Retrieving subscription: ${invoice.subscription}`);
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        
        // Update subscription record
        console.log("Updating subscription record in database");
        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", invoice.subscription);
          
        if (error) {
          console.error(`Error updating subscription: ${error.message}`);
        } else {
          console.log("Subscription updated successfully");
        }
          
        break;
      }
      
      case 'customer.subscription.updated': {
        console.log("Processing customer.subscription.updated event");
        const subscription = event.data.object;
        
        // Update subscription record
        console.log(`Updating subscription: ${subscription.id}`);
        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
          
        if (error) {
          console.error(`Error updating subscription: ${error.message}`);
        } else {
          console.log("Subscription updated successfully");
        }
          
        break;
      }
      
      case 'customer.subscription.deleted': {
        console.log("Processing customer.subscription.deleted event");
        const subscription = event.data.object;
        
        // Update subscription record
        console.log(`Marking subscription as canceled: ${subscription.id}`);
        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
          
        if (error) {
          console.error(`Error updating subscription: ${error.message}`);
        } else {
          console.log("Subscription canceled successfully");
        }
          
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return new Response(JSON.stringify({ received: true }));
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
