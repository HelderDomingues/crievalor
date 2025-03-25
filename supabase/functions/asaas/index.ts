
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ASAAS_API_BASE_URL = "https://sandbox.asaas.com/api/v3";
const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Parse request body
    const body = await req.json();
    const { action, data } = body;
    
    console.log(`Processing action: ${action}`, data);
    
    if (!action) {
      throw new Error("Missing action parameter");
    }

    if (!ASAAS_API_KEY) {
      console.error("Missing ASAAS_API_KEY");
      return new Response(JSON.stringify({ error: "Server configuration error - missing Asaas key" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
    
    // Helper function to make Asaas API requests
    async function asaasRequest(endpoint: string, method = "GET", payload?: any) {
      const url = `${ASAAS_API_BASE_URL}${endpoint}`;
      console.log(`Making ${method} request to Asaas API: ${url}`);
      
      const options: RequestInit = {
        method,
        headers: {
          "access_token": ASAAS_API_KEY,
          "Content-Type": "application/json",
        },
      };
      
      if (payload && (method === "POST" || method === "PUT")) {
        options.body = JSON.stringify(payload);
      }
      
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        console.log(`Asaas API response status: ${response.status}`);
        console.log(`Asaas API response body:`, data);
        
        if (!response.ok) {
          console.error("Asaas API error:", data);
          throw new Error(`Asaas API error: ${data.errors?.[0]?.description || JSON.stringify(data) || "Unknown error"}`);
        }
        
        return data;
      } catch (error) {
        console.error(`Error in Asaas request to ${url}:`, error);
        throw error;
      }
    }

    switch (action) {
      case "create-customer": {
        const { name, email, phone, cpfCnpj } = data;
        
        console.log("Creating customer with data:", { name, email, phone, cpfCnpj });
        
        // Create customer in Asaas
        const customer = await asaasRequest("/customers", "POST", {
          name,
          email,
          phone,
          cpfCnpj,
          notificationDisabled: false
        });
        
        result = { customer };
        break;
      }
        
      case "create-payment": {
        const { customerId, value, description, installments = 1, dueDate, planId, successUrl, cancelUrl, generateLink = false, nextDueDate } = data;
        
        // Create payment in Asaas
        const paymentData: any = {
          customer: customerId,
          billingType: installments > 1 ? "CREDIT_CARD" : "UNDEFINED",
          value,
          description,
          dueDate: dueDate || new Date(Date.now() + 3600 * 1000 * 24).toISOString().split('T')[0], // Default to tomorrow
        };
        
        if (installments > 1) {
          paymentData.installmentCount = installments;
          paymentData.installmentValue = (value / installments).toFixed(2);
        }
        
        console.log("Creating payment with data:", paymentData);
        
        // Create payment in Asaas
        const payment = await asaasRequest("/payments", "POST", paymentData);
        
        // Generate payment link
        let paymentLink = null;
        if (generateLink) {
          console.log("Generating payment link for payment:", payment.id);
          
          // Define data for payment link
          const linkData = {
            name: description || "Compra de Plano",
            description: `Pagamento ${description}`,
            endDate: new Date(Date.now() + 3600 * 1000 * 24 * 7).toISOString().split('T')[0], // 7 days from now
            value,
            billingType: installments > 1 ? "CREDIT_CARD" : "UNDEFINED",
            chargeType: "DETACHED",
            installmentSettings: installments > 1 ? {
              installmentCount: installments,
              installmentValue: (value / installments).toFixed(2)
            } : undefined,
            externalReference: payment.id,
            callback: {
              autoRedirect: true,
              successUrl: successUrl || "",
              autoRedirectDelay: 5
            }
          };
          
          console.log("Creating payment link with data:", linkData);
          
          const linkResponse = await asaasRequest(`/paymentLinks`, "POST", linkData);
          console.log("Payment link created:", linkResponse);
          
          paymentLink = linkResponse.url;
        }
        
        // Save subscription data in database - using renamed columns
        const { data: subscriptionData, error: subError } = await supabase
          .from("subscriptions")
          .upsert({
            user_id: user.id,
            asaas_customer_id: customerId,
            asaas_subscription_id: payment.id,
            asaas_payment_link: paymentLink,
            plan_id: planId,
            status: payment.status || "pending",
            installments,
            current_period_end: null, // Since it's a one-time payment
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id', returning: 'representation' });
          
        if (subError) {
          console.error("Error saving payment data to database:", subError);
          throw new Error(`Error saving payment data: ${subError.message}`);
        }
        
        result = { 
          payment, 
          paymentLink,
          dbSubscription: subscriptionData?.[0] 
        };
        break;
      }
        
      case "create-subscription": {
        const { customerId, planId, value, description, billingType = "CREDIT_CARD", installments = 1, nextDueDate } = data;
        
        // Create subscription in Asaas
        const subscription = await asaasRequest("/subscriptions", "POST", {
          customer: customerId,
          billingType,
          value,
          nextDueDate: nextDueDate || new Date(Date.now() + 3600 * 1000 * 24).toISOString().split('T')[0], // Default to tomorrow
          description,
          cycle: "MONTHLY",
          installments: installments > 1 ? installments : undefined,
        });
        
        // Get the payment link for this subscription
        const paymentLink = await asaasRequest(`/paymentLinks`, "POST", {
          name: description || "Assinatura de Plano",
          description: `Pagamento da assinatura: ${description}`,
          endDate: new Date(Date.now() + 3600 * 1000 * 24 * 7).toISOString().split('T')[0], // 7 days from now
          value,
          billingType: "CREDIT_CARD",
          chargeType: "SUBSCRIPTION",
          subscriptionId: subscription.id,
          installmentSettings: installments > 1 ? {
            installmentCount: installments,
            installmentValue: (value / installments).toFixed(2)
          } : undefined,
          callback: {
            autoRedirect: true,
            successUrl: `${data.successUrl || ""}`,
            autoRedirectDelay: 5
          }
        });
        
        // Save subscription in database with renamed columns
        const { data: subscriptionData, error: subError } = await supabase
          .from("subscriptions")
          .upsert({
            user_id: user.id,
            asaas_customer_id: customerId,
            asaas_subscription_id: subscription.id,
            asaas_payment_link: paymentLink.url,
            plan_id: planId,
            status: "pending",
            installments,
            current_period_end: new Date(subscription.nextDueDate).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id', returning: 'representation' });
          
        if (subError) {
          console.error("Error saving subscription to database:", subError);
          throw new Error(`Error saving subscription: ${subError.message}`);
        }
        
        result = { 
          subscription, 
          paymentLink: paymentLink.url,
          dbSubscription: subscriptionData?.[0] 
        };
        break;
      }
        
      case "get-subscription": {
        try {
          // Use the provided userId if available, otherwise use the authenticated user's id
          const effectiveUserId = data?.userId || user.id;
          console.log(`Fetching subscription for user: ${effectiveUserId}`);
          
          // First try to get from database
          const { data: subscription, error: fetchError } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", effectiveUserId)
            .maybeSingle();
            
          if (fetchError) {
            console.error("Error fetching subscription:", fetchError);
            throw new Error(`Error fetching subscription: ${fetchError.message}`);
          }
          
          if (subscription?.asaas_subscription_id) {
            // Get latest status from Asaas
            try {
              const asaasSubscription = await asaasRequest(`/subscriptions/${subscription.asaas_subscription_id}`);
              
              // Update the database if status has changed
              if (asaasSubscription.status !== subscription.status) {
                const { error: updateError } = await supabase
                  .from("subscriptions")
                  .update({ 
                    status: asaasSubscription.status,
                    updated_at: new Date().toISOString()
                  })
                  .eq("id", subscription.id);
                  
                if (updateError) {
                  console.error("Error updating subscription status:", updateError);
                }
                
                subscription.status = asaasSubscription.status;
              }
            } catch (error) {
              console.error("Error fetching subscription from Asaas:", error);
              // Continue with local data if Asaas API call fails
            }
          }
          
          result = { subscription };
        } catch (error) {
          console.error("Error in get-subscription:", error);
          return new Response(JSON.stringify({ error: `Error getting subscription: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
      }
        
      case "cancel-subscription": {
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
          .eq("asaas_subscription_id", subscriptionId)
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
        
        // Cancel the subscription in Asaas
        await asaasRequest(`/subscriptions/${subscriptionId}/cancel`, "POST");
        
        // Update the subscription status in database
        await supabase
          .from("subscriptions")
          .update({ 
            status: "canceled",
            updated_at: new Date().toISOString()
          })
          .eq("asaas_subscription_id", subscriptionId);
          
        result = { success: true };
        break;
      }
        
      case "get-payments": {
        // Get payments for the customer from Asaas using the renamed column
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("asaas_customer_id")
          .eq("user_id", user.id)
          .maybeSingle();
          
        if (!subscription?.asaas_customer_id) {
          return new Response(JSON.stringify({ payments: [] }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        // Get payments from Asaas
        const payments = await asaasRequest(`/payments?customer=${subscription.asaas_customer_id}`);
        
        result = { payments: payments.data };
        break;
      }
      
      case "get-payment": {
        const { paymentId } = data;
        
        if (!paymentId) {
          return new Response(JSON.stringify({ error: "Missing payment ID" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        // Get payment details from Asaas
        const payment = await asaasRequest(`/payments/${paymentId}`);
        
        result = { payment };
        break;
      }
        
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
    console.error("Error in asaas function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
