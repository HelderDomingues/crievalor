
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
        const userId = session.metadata.user_id;
        
        if (!userId) {
          throw new Error("User ID missing in session metadata");
        }
        
        console.log(`Session completed for user: ${userId}, subscription: ${subscriptionId}`);
        
        // Get subscription details from Stripe
        console.log("Retrieving subscription details from Stripe");
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;
        
        console.log(`Subscription price ID: ${priceId}`);
        
        // Insert or update subscription record
        console.log("Updating subscription record in database");
        const { error } = await supabase
          .from("subscriptions")
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan_id: priceId,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          }, {
            onConflict: 'user_id'
          });
          
        if (error) {
          console.error(`Error updating subscription: ${error.message}`);
          throw new Error(`Error updating subscription: ${error.message}`);
        }
        
        console.log("Subscription record updated successfully");
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
