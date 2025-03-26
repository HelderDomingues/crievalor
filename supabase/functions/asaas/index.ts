
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
      
      if (payload) {
        console.log("Request payload:", JSON.stringify(payload, null, 2));
      }
      
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
        
        // More detailed logging of the response body
        if (response.ok) {
          console.log(`Asaas API response data:`, data);
        } else {
          console.error("Asaas API error details:", data);
          throw new Error(`Asaas API error: ${JSON.stringify(data.errors || data)}`);
        }
        
        return data;
      } catch (error) {
        console.error(`Error in Asaas request to ${url}:`, error);
        throw error;
      }
    }

    // Check if payment exists with this external reference
    async function checkExistingPayment(externalReference: string) {
      try {
        // Query payments filtering by external reference
        const response = await asaasRequest(`/payments?externalReference=${externalReference}`);
        return response && response.data && response.data.length > 0 ? response.data[0] : null;
      } catch (error) {
        console.error("Error checking existing payment:", error);
        return null;
      }
    }

    // Check if payment link exists with this external reference
    async function checkExistingPaymentLink(externalReference: string) {
      try {
        const response = await asaasRequest(`/paymentLinks?externalReference=${externalReference}`);
        return response && response.data && response.data.length > 0 ? response.data[0] : null;
      } catch (error) {
        console.error("Error checking existing payment link:", error);
        return null;
      }
    }

    // New function: Check if user has any pending payments for a specific plan
    async function checkPendingPayments(customerId: string, planId: string, userId: string) {
      try {
        // Query subscriptions for this user and plan
        const { data: subscriptions, error } = await supabase
          .from("subscriptions")
          .select("*, asaas_subscription_id, asaas_payment_link")
          .eq("user_id", userId)
          .eq("plan_id", planId)
          .eq("status", "pending");
          
        if (error) {
          console.error("Error querying subscriptions:", error);
          return null;
        }
        
        if (!subscriptions || subscriptions.length === 0) {
          return null;
        }
        
        // Check if any subscription has a payment link
        const subscription = subscriptions[0];
        if (subscription.asaas_payment_link) {
          // Verify if the payment link is still valid in Asaas
          try {
            const paymentId = subscription.asaas_subscription_id;
            const payment = await asaasRequest(`/payments/${paymentId}`);
            
            // Only return if the payment is still pending
            if (payment && ["PENDING", "RECEIVED", "CONFIRMED"].includes(payment.status)) {
              return {
                payment,
                paymentLink: subscription.asaas_payment_link,
                dbSubscription: subscription
              };
            }
          } catch (error) {
            console.error("Error checking payment status:", error);
            // If we can't verify the payment, assume it's invalid and continue
          }
        }
        
        return null;
      } catch (error) {
        console.error("Error in checkPendingPayments:", error);
        return null;
      }
    }

    switch (action) {
      case "check-existing-payments": {
        try {
          const { customerId, planId, userId } = data;
          
          if (!customerId || !planId || !userId) {
            throw new Error("Missing required parameters for check-existing-payments");
          }
          
          const pendingPayment = await checkPendingPayments(customerId, planId, userId);
          
          result = pendingPayment || { exists: false };
        } catch (error) {
          console.error("Error checking existing payments:", error);
          return new Response(JSON.stringify({ error: `Failed to check existing payments: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
      }
      
      case "create-customer": {
        const { name, email, phone, cpfCnpj, mobilePhone, address, postalCode, externalReference } = data;
        
        console.log("Creating customer with data:", { name, email, phone, cpfCnpj });
        
        if (!cpfCnpj) {
          return new Response(JSON.stringify({ error: "CPF ou CNPJ é obrigatório" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        try {
          // Create customer in Asaas with all available fields from the documentation
          const customerData = {
            name: name || "Cliente",
            email: email || "",
            phone: phone || "",
            mobilePhone: mobilePhone || phone || "",
            cpfCnpj: cpfCnpj,
            address: address || "",
            postalCode: postalCode || "",
            externalReference: externalReference || "",
            notificationDisabled: false
          };
          
          // Create customer in Asaas
          const customer = await asaasRequest("/customers", "POST", customerData);
          
          result = { customer };
        } catch (error) {
          console.error("Error creating customer:", error);
          return new Response(JSON.stringify({ error: `Failed to create customer: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
      }
        
      case "create-payment": {
        try {
          const { customerId, value, description, installments = 1, dueDate, planId, successUrl, cancelUrl, generateLink = true, externalReference } = data;
          
          if (!customerId) {
            throw new Error("Missing customerId parameter");
          }
          
          if (!value && value !== 0) {
            throw new Error("Missing value parameter");
          }
          
          if (!externalReference) {
            throw new Error("Missing externalReference parameter");
          }
          
          if (!planId) {
            throw new Error("Missing planId parameter");
          }
          
          // Check for duplicate payment with same external reference
          const existingPayment = await checkExistingPayment(externalReference);
          const existingPaymentLink = await checkExistingPaymentLink(externalReference);
          
          if (existingPayment && existingPaymentLink) {
            console.log(`Payment and link with externalReference ${externalReference} already exists, returning existing payment link`);
            
            // Find the subscription in database with the existing payment ID
            const { data: subscriptionData } = await supabase
              .from("subscriptions")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle();
            
            return new Response(JSON.stringify({ 
              payment: existingPayment,
              paymentLink: existingPaymentLink.url,
              dbSubscription: subscriptionData || null,
              isExisting: true
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          
          // Calculate due date (1 business day after current date)
          const paymentDueDate = dueDate || new Date(Date.now() + 3600 * 1000 * 24).toISOString().split('T')[0]; // Default to tomorrow
          
          let payment;
          let paymentLink = null;
          
          // If payment doesn't exist, create it
          if (!existingPayment) {
            // Create payment in Asaas
            const paymentData: any = {
              customer: customerId,
              billingType: installments > 1 ? "CREDIT_CARD" : "UNDEFINED",
              value,
              description: description || "Compra de Plano",
              dueDate: paymentDueDate,
              externalReference: externalReference
            };
            
            if (installments > 1) {
              paymentData.installmentCount = installments;
              paymentData.installmentValue = (value / installments).toFixed(2);
            }
            
            console.log("Creating payment with data:", paymentData);
            
            // Create payment in Asaas
            payment = await asaasRequest("/payments", "POST", paymentData);
          } else {
            payment = existingPayment;
          }
          
          // Generate payment link if it doesn't exist
          if (!existingPaymentLink && generateLink) {
            console.log("Generating payment link for payment");
            
            // Define data for payment link
            const linkData = {
              name: description || "Compra de Plano",
              description: `Pagamento ${description || ""}`.trim(),
              endDate: new Date(Date.now() + 3600 * 1000 * 24 * 7).toISOString().split('T')[0], // 7 days from now
              value,
              billingType: installments > 1 ? "CREDIT_CARD" : "UNDEFINED",
              chargeType: "DETACHED",
              dueDateLimitDays: 1, // Required parameter
              installmentSettings: installments > 1 ? {
                installmentCount: installments,
                installmentValue: (value / installments).toFixed(2)
              } : undefined,
              externalReference: externalReference,
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
          } else if (existingPaymentLink) {
            paymentLink = existingPaymentLink.url;
          }
          
          // Skip saving to database if we're returning an existing payment
          if (!existingPayment || !existingPaymentLink) {
            // First, check if a subscription record already exists for this user
            const { data: existingSub } = await supabase
              .from("subscriptions")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle();
            
            let subscriptionData;
            
            if (existingSub) {
              // Update existing subscription
              const { data: updatedSub, error: updateError } = await supabase
                .from("subscriptions")
                .update({
                  asaas_customer_id: customerId,
                  asaas_subscription_id: payment.id,
                  asaas_payment_link: paymentLink,
                  plan_id: planId,
                  status: payment.status || "pending",
                  installments,
                  current_period_end: null, // Since it's a one-time payment
                  updated_at: new Date().toISOString()
                })
                .eq("id", existingSub.id)
                .select()
                .single();
                
              if (updateError) {
                console.error("Error updating subscription:", updateError);
                throw new Error(`Error updating subscription: ${updateError.message}`);
              }
              
              subscriptionData = updatedSub;
            } else {
              // Create new subscription
              const { data: newSub, error: insertError } = await supabase
                .from("subscriptions")
                .insert({
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
                })
                .select()
                .single();
                
              if (insertError) {
                console.error("Error inserting subscription:", insertError);
                throw new Error(`Error inserting subscription: ${insertError.message}`);
              }
              
              subscriptionData = newSub;
            }
            
            result = { 
              payment, 
              paymentLink,
              dbSubscription: subscriptionData 
            };
          } else {
            result = { 
              payment, 
              paymentLink,
              isExisting: true
            };
          }
        } catch (error) {
          console.error("Error creating payment:", error);
          return new Response(JSON.stringify({ error: `Failed to create payment: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
      }
        
      case "create-subscription": {
        try {
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
            description: `Pagamento da assinatura: ${description || ""}`.trim(),
            endDate: new Date(Date.now() + 3600 * 1000 * 24 * 7).toISOString().split('T')[0], // 7 days from now
            value,
            billingType: "CREDIT_CARD",
            chargeType: "SUBSCRIPTION",
            dueDateLimitDays: 1, // Importante! Adiciona o número de dias úteis para vencimento
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
          
          // Check if a subscription already exists for this user
          const { data: existingSub } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();
          
          let subscriptionData;
          
          if (existingSub) {
            // Update existing subscription
            const { data: updatedSub, error: updateError } = await supabase
              .from("subscriptions")
              .update({
                asaas_customer_id: customerId,
                asaas_subscription_id: subscription.id,
                asaas_payment_link: paymentLink.url,
                plan_id: planId,
                status: "pending",
                installments,
                current_period_end: new Date(subscription.nextDueDate).toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq("id", existingSub.id)
              .select()
              .single();
              
            if (updateError) {
              console.error("Error updating subscription:", updateError);
              throw new Error(`Error updating subscription: ${updateError.message}`);
            }
            
            subscriptionData = updatedSub;
          } else {
            // Create new subscription
            const { data: newSub, error: insertError } = await supabase
              .from("subscriptions")
              .insert({
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
              })
              .select()
              .single();
              
            if (insertError) {
              console.error("Error inserting subscription:", insertError);
              throw new Error(`Error inserting subscription: ${insertError.message}`);
            }
            
            subscriptionData = newSub;
          }
          
          result = { 
            subscription, 
            paymentLink: paymentLink.url,
            dbSubscription: subscriptionData 
          };
        } catch (error) {
          console.error("Error creating subscription:", error);
          return new Response(JSON.stringify({ error: `Failed to create subscription: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
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
              // Check if it's a subscription or a one-time payment
              let asaasStatus;
              
              if (subscription.asaas_subscription_id.startsWith("sub_")) {
                // It's a subscription
                const asaasSubscription = await asaasRequest(`/subscriptions/${subscription.asaas_subscription_id}`);
                asaasStatus = asaasSubscription.status;
              } else {
                // It's a payment
                const asaasPayment = await asaasRequest(`/payments/${subscription.asaas_subscription_id}`);
                asaasStatus = asaasPayment.status;
              }
              
              // Update the database if status has changed
              if (asaasStatus && asaasStatus !== subscription.status) {
                const { error: updateError } = await supabase
                  .from("subscriptions")
                  .update({ 
                    status: asaasStatus,
                    updated_at: new Date().toISOString()
                  })
                  .eq("id", subscription.id);
                  
                if (updateError) {
                  console.error("Error updating subscription status:", updateError);
                }
                
                subscription.status = asaasStatus;
              }
            } catch (error) {
              console.error("Error fetching data from Asaas:", error);
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
        try {
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
            throw new Error(`Error verifying subscription: ${verifyError.message}`);
          }
          
          if (!subData) {
            return new Response(JSON.stringify({ error: "Subscription not found or doesn't belong to user" }), {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          
          // Check if it's a subscription or a one-time payment
          if (subscriptionId.startsWith("sub_")) {
            // Cancel the subscription in Asaas
            await asaasRequest(`/subscriptions/${subscriptionId}/cancel`, "POST");
          } else {
            // It's a payment, we can't cancel it if it's already paid
            const payment = await asaasRequest(`/payments/${subscriptionId}`);
            
            if (["CONFIRMED", "RECEIVED", "PAID"].includes(payment.status)) {
              throw new Error("Cannot cancel a payment that has already been processed");
            }
            
            // Try to delete or refund the payment
            if (["PENDING", "AWAITING_RISK_ANALYSIS"].includes(payment.status)) {
              await asaasRequest(`/payments/${subscriptionId}`, "DELETE");
            }
          }
          
          // Update the subscription status in database
          await supabase
            .from("subscriptions")
            .update({ 
              status: "canceled",
              updated_at: new Date().toISOString()
            })
            .eq("asaas_subscription_id", subscriptionId);
            
          result = { success: true };
        } catch (error) {
          console.error("Error canceling subscription:", error);
          return new Response(JSON.stringify({ error: `Failed to cancel subscription: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
      }
        
      case "get-payments": {
        try {
          // Get payments for the customer from Asaas
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
        } catch (error) {
          console.error("Error getting payments:", error);
          return new Response(JSON.stringify({ error: `Failed to get payments: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
      }
      
      case "get-payment": {
        try {
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
        } catch (error) {
          console.error("Error getting payment:", error);
          return new Response(JSON.stringify({ error: `Failed to get payment: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
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
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
