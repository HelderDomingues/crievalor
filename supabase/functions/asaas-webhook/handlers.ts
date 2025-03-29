
// CORS headers for all responses
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow requests from any origin
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, user-agent, x-hook-token, asaas-token, access_token",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

// Helper function to log request details
export function logRequestDetails(req: Request): void {
  console.log(`${req.method} request received at ${new Date().toISOString()}`);
  console.log("URL:", req.url);
  
  // Get client IP
  const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("X-Forwarded-For") || "unknown";
  console.log("Client IP:", clientIP);
  
  // Log all headers for debugging
  const headersObj = Object.fromEntries(req.headers.entries());
  console.log("Headers:", JSON.stringify(headersObj, null, 2));
}

// Helper function to process payment events
export async function handlePaymentEvent(supabase: any, event: string, payment: any, corsHeaders: any) {
  try {
    // Find subscription associated with this payment
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("payment_id", payment.id)
      .maybeSingle();

    if (subscriptionError) {
      console.error("Error finding subscription by payment_id:", subscriptionError);
      throw subscriptionError;
    }

    // If no subscription found by payment_id, try to find by external reference
    if (!subscription) {
      console.log(`No subscription found for payment_id ${payment.id}, trying to find by externalReference`);
      
      if (payment.externalReference) {
        const { data: subByRef, error: refError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("external_reference", payment.externalReference)
          .maybeSingle();
        
        if (refError) {
          console.error("Error finding subscription by external reference:", refError);
        }
        
        if (!refError && subByRef) {
          console.log(`Found subscription by external reference: ${payment.externalReference}`);
          
          // Update the payment_id in the subscription
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({ 
              payment_id: payment.id,
              payment_status: payment.status,
              updated_at: new Date().toISOString() 
            })
            .eq("id", subByRef.id);
          
          if (updateError) {
            console.error("Error updating payment_id in subscription:", updateError);
            throw updateError;
          } else {
            console.log(`Payment ID updated in subscription ${subByRef.id}`);
            
            // Continue processing with the found subscription
            return await processPaymentUpdate(supabase, event, payment, subByRef, corsHeaders);
          }
        } else {
          console.log(`No subscription found for external reference: ${payment.externalReference}`);
        }
      }
      
      // If we got here, no subscription was found
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Payment event received, but no matching subscription found",
          paymentId: payment.id,
          externalReference: payment.externalReference || 'none',
          jwtVerificationDisabled: true
        }),
        {
          status: 200, // Return 200 to prevent retries
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Process the payment event for the found subscription
    return await processPaymentUpdate(supabase, event, payment, subscription, corsHeaders);
  } catch (error) {
    console.error("Error in handlePaymentEvent:", error);
    throw error;
  }
}

// Helper function to process payment status updates
async function processPaymentUpdate(supabase: any, event: string, payment: any, subscription: any, corsHeaders: any) {
  // Update subscription status based on payment event
  let newStatus = subscription.status;
  
  switch (event) {
    case "PAYMENT_RECEIVED":
    case "PAYMENT_CONFIRMED":
    case "PAYMENT_RECEIVED_IN_CASH":
      newStatus = "active";
      break;
    
    case "PAYMENT_OVERDUE":
      newStatus = "past_due";
      break;
    
    case "PAYMENT_DELETED":
    case "PAYMENT_REFUNDED":
    case "PAYMENT_CHARGEBACK_REQUESTED":
    case "PAYMENT_CHARGEBACK_DISPUTE":
      newStatus = "canceled";
      break;
    
    default:
      console.log(`Event ${event} does not require status update`);
      break;
  }

  // Update subscription if status needs to change
  if (newStatus !== subscription.status) {
    console.log(`Updating subscription ${subscription.id} status from ${subscription.status} to ${newStatus}`);
    
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({ 
        status: newStatus, 
        payment_status: payment.status,
        updated_at: new Date().toISOString() 
      })
      .eq("id", subscription.id);
    
    if (updateError) {
      console.error("Error updating subscription:", updateError);
      throw updateError;
    }
  } else {
    // Update only the payment status
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({ 
        payment_status: payment.status,
        updated_at: new Date().toISOString() 
      })
      .eq("id", subscription.id);
    
    if (updateError) {
      console.error("Error updating payment status:", updateError);
      throw updateError;
    }
  }

  console.log("Webhook processed successfully");
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: "Webhook processed successfully",
      subscription: subscription.id,
      paymentId: payment.id,
      newStatus: newStatus,
      jwtVerificationDisabled: true
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
