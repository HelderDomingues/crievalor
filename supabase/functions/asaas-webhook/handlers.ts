
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
    // Enhanced logging for debugging
    console.log(`Processing ${event} event for payment ${payment.id}`);
    console.log("Payment full details:", JSON.stringify(payment, null, 2));
    
    // Extract useful customer information if available
    let customerInfo = null;
    if (payment.customer) {
      if (typeof payment.customer === 'string') {
        console.log(`Customer ID provided: ${payment.customer}`);
        // First, try to get customer details from Asaas
        try {
          const { data, error } = await supabase.functions.invoke("asaas", {
            body: {
              action: "get-customer",
              data: {
                customerId: payment.customer
              }
            }
          });
          
          if (!error && data?.customer) {
            console.log("Retrieved customer data from Asaas:", data.customer);
            customerInfo = {
              asaas_id: data.customer.id,
              name: data.customer.name,
              email: data.customer.email,
              cpf_cnpj: data.customer.cpfCnpj,
              phone: data.customer.phone || data.customer.mobilePhone
            };
            
            // Check if this customer exists in our database
            const { data: existingCustomer, error: customerError } = await supabase
              .from("asaas_customers")
              .select("*")
              .eq("asaas_id", data.customer.id)
              .maybeSingle();
              
            if (customerError) {
              console.error("Error checking for existing customer:", customerError);
            } else if (!existingCustomer) {
              console.log("Customer not found in database, creating new record");
              
              // Create profile first if it doesn't exist
              const { data: userProfile, error: profileError } = await supabase.auth.admin.createUser({
                email: data.customer.email,
                email_confirm: true,
                user_metadata: {
                  full_name: data.customer.name,
                  phone: data.customer.phone || data.customer.mobilePhone,
                  cpf: data.customer.cpfCnpj
                },
                password: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
              });
              
              if (profileError) {
                console.error("Error creating user profile:", profileError);
              } else {
                console.log("Created new user profile:", userProfile);
                
                // Now create asaas_customer record
                const { error: insertError } = await supabase
                  .from("asaas_customers")
                  .insert({
                    asaas_id: data.customer.id,
                    user_id: userProfile.user.id,
                    email: data.customer.email,
                    cpf_cnpj: data.customer.cpfCnpj
                  });
                  
                if (insertError) {
                  console.error("Error creating asaas_customer record:", insertError);
                } else {
                  console.log("Created new asaas_customer record");
                }
              }
            } else {
              console.log("Found existing customer in database:", existingCustomer);
            }
          }
        } catch (error) {
          console.error("Error retrieving customer details from Asaas:", error);
          
          // Try to get customer details from our database
          const { data: customerData, error: customerError } = await supabase
            .from("asaas_customers")
            .select("*")
            .eq("asaas_id", payment.customer)
            .maybeSingle();
            
          if (customerError) {
            console.error("Error fetching customer data:", customerError);
          } else if (customerData) {
            console.log("Found customer data in database:", customerData);
            customerInfo = {
              asaas_id: customerData.asaas_id,
              user_id: customerData.user_id,
              email: customerData.email,
              cpf_cnpj: customerData.cpf_cnpj
            };
          }
        }
      } else {
        // Direct customer object from webhook
        customerInfo = {
          asaas_id: payment.customer.id,
          name: payment.customer.name,
          email: payment.customer.email,
          cpf_cnpj: payment.customer.cpfCnpj,
          phone: payment.customer.phone || payment.customer.mobilePhone
        };
        
        // Check if this customer exists in our database
        const { data: existingCustomer, error: customerError } = await supabase
          .from("asaas_customers")
          .select("*")
          .eq("asaas_id", payment.customer.id)
          .maybeSingle();
          
        if (customerError) {
          console.error("Error checking for existing customer:", customerError);
        } else if (!existingCustomer) {
          console.log("Customer not found in database, creating new record");
          
          // Create profile first if it doesn't exist
          const { data: userProfile, error: profileError } = await supabase.auth.admin.createUser({
            email: payment.customer.email,
            email_confirm: true,
            user_metadata: {
              full_name: payment.customer.name,
              phone: payment.customer.phone || payment.customer.mobilePhone,
              cpf: payment.customer.cpfCnpj
            },
            password: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
          });
          
          if (profileError) {
            console.error("Error creating user profile:", profileError);
          } else {
            console.log("Created new user profile:", userProfile);
            
            // Now create asaas_customer record
            const { error: insertError } = await supabase
              .from("asaas_customers")
              .insert({
                asaas_id: payment.customer.id,
                user_id: userProfile.user.id,
                email: payment.customer.email,
                cpf_cnpj: payment.customer.cpfCnpj
              });
              
            if (insertError) {
              console.error("Error creating asaas_customer record:", insertError);
            } else {
              console.log("Created new asaas_customer record");
            }
          }
        } else {
          console.log("Found existing customer in database:", existingCustomer);
        }
      }
    }
    
    // Create a well-formatted payment details object with enhanced information
    const paymentDetails = {
      payment_id: payment.id,
      payment_link: payment.paymentLink,
      status: payment.status,
      value: payment.value, 
      net_value: payment.netValue,
      description: payment.description,
      billing_type: payment.billingType,
      installment_count: payment.installmentNumber || 1,
      total_installments: payment.installmentCount || 1,
      due_date: payment.dueDate,
      payment_date: payment.clientPaymentDate,
      credit_date: payment.creditDate,
      invoice_url: payment.invoiceUrl,
      receipt_url: payment.transactionReceiptUrl,
      bank_slip_url: payment.bankSlipUrl,
      external_reference: payment.externalReference,
      customer: customerInfo,
      processed_at: new Date().toISOString(),
      event: event,
      // Add more detailed payment information
      payment_method: {
        type: payment.billingType,
        card_info: payment.creditCard ? {
          brand: payment.creditCard.brand,
          last_digits: payment.creditCard.creditCardNumber?.slice(-4) || '',
          holder_name: payment.creditCard.holderName
        } : null
      },
      // Add a comprehensive event history
      event_history: [{
        event: event,
        timestamp: new Date().toISOString(),
        status: payment.status,
        value: payment.value
      }]
    };
    
    console.log("Structured payment details:", JSON.stringify(paymentDetails, null, 2));

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

    // If no subscription found by payment_id, try to find by payment link or external reference
    if (!subscription) {
      console.log(`No subscription found for payment_id ${payment.id}, trying to find by alternative methods`);
      
      let subscriptionByAlt;
      
      if (payment.paymentLink) {
        console.log(`Searching by payment link: ${payment.paymentLink}`);
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("asaas_payment_link", payment.paymentLink)
          .maybeSingle();
          
        if (!error && data) {
          subscriptionByAlt = data;
          console.log(`Found subscription by payment link: ${data.id}`);
        }
      }
      
      if (!subscriptionByAlt && payment.externalReference) {
        console.log(`Searching by external reference: ${payment.externalReference}`);
        const { data: refData, error: refError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("external_reference", payment.externalReference)
          .maybeSingle();
        
        if (refError) {
          console.error("Error finding subscription by external reference:", refError);
        }
        
        if (!refError && refData) {
          subscriptionByAlt = refData;
          console.log(`Found subscription by external reference: ${payment.externalReference}`);
        }
      }
      
      if (subscriptionByAlt) {
        // Get or create customer if we have one in the payment
        if (customerInfo && customerInfo.asaas_id) {
          // Update the subscription with customer data if available
          const { data: asaasCustomer, error: customerError } = await supabase
            .from("asaas_customers")
            .select("*")
            .eq("asaas_id", customerInfo.asaas_id)
            .maybeSingle();
          
          if (customerError) {
            console.error("Error finding asaas_customer:", customerError);
          } else if (asaasCustomer) {
            console.log("Updating subscription with asaas_customer_id:", asaasCustomer.asaas_id);
            
            // Update the user_id in the subscription if not set
            if (!subscriptionByAlt.user_id && asaasCustomer.user_id) {
              subscriptionByAlt.user_id = asaasCustomer.user_id;
            }
            
            subscriptionByAlt.asaas_customer_id = asaasCustomer.asaas_id;
          }
        }
        
        // Enhance existing payment details if present
        let updatedPaymentDetails = paymentDetails;
        if (subscriptionByAlt.payment_details) {
          // Merge existing history with new event
          if (subscriptionByAlt.payment_details.event_history) {
            updatedPaymentDetails.event_history = [
              ...subscriptionByAlt.payment_details.event_history,
              ...updatedPaymentDetails.event_history
            ];
          }
          
          // Preserve any custom fields from existing details
          updatedPaymentDetails = {
            ...subscriptionByAlt.payment_details,
            ...updatedPaymentDetails
          };
        }
        
        // Update the payment_id in the subscription along with payment details
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({ 
            payment_id: payment.id,
            payment_status: payment.status,
            payment_details: updatedPaymentDetails,
            asaas_customer_id: customerInfo?.asaas_id || subscriptionByAlt.asaas_customer_id,
            updated_at: new Date().toISOString() 
          })
          .eq("id", subscriptionByAlt.id);
        
        if (updateError) {
          console.error("Error updating payment_id in subscription:", updateError);
          throw updateError;
        } else {
          console.log(`Payment ID and details updated in subscription ${subscriptionByAlt.id}`);
          
          // Continue processing with the found subscription
          return await processPaymentUpdate(supabase, event, payment, subscriptionByAlt, updatedPaymentDetails, corsHeaders);
        }
      } else if (customerInfo && customerInfo.asaas_id) {
        // If no subscription was found, but we have customer info, create a new one
        console.log("Attempting to create a new subscription record based on customer and payment information");
        
        // Try to extract plan information from description
        const planMatch = payment.description ? payment.description.match(/.*Solução completa.*|.*Plano Básico.*|.*Plano Pro.*/i) : null;
        let planId = "basic_plan"; // Default plan
        
        if (planMatch) {
          if (planMatch[0].includes("Básico")) {
            planId = "basic_plan";
          } else if (planMatch[0].includes("Pro")) {
            planId = "pro_plan";
          } else {
            planId = "enterprise_plan";
          }
          
          console.log(`Identified plan from payment description: ${planId}`);
        }
        
        // Get customer record
        const { data: asaasCustomer, error: customerError } = await supabase
          .from("asaas_customers")
          .select("*")
          .eq("asaas_id", customerInfo.asaas_id)
          .maybeSingle();
          
        if (customerError) {
          console.error("Error finding asaas_customer:", customerError);
        } else if (asaasCustomer) {
          console.log("Found asaas_customer record:", asaasCustomer);
          
          // Create new subscription record
          const subscriptionData = {
            user_id: asaasCustomer.user_id,
            plan_id: planId,
            status: "active", // Set to active since payment was successful
            asaas_customer_id: asaasCustomer.asaas_id,
            asaas_payment_link: payment.paymentLink,
            payment_id: payment.id,
            payment_status: payment.status,
            payment_details: paymentDetails,
            external_reference: payment.externalReference,
            installments: payment.installmentCount || 1
          };
          
          const { data: newSub, error: createError } = await supabase
            .from("subscriptions")
            .insert(subscriptionData)
            .select()
            .single();
            
          if (createError) {
            console.error("Error creating new subscription:", createError);
          } else {
            console.log(`New subscription created: ${newSub.id}`);
            return await processPaymentUpdate(supabase, event, payment, newSub, paymentDetails, corsHeaders);
          }
        } else {
          console.log("Could not find asaas_customer record for ID:", customerInfo.asaas_id);
        }
      }
      
      console.log("No matching subscription found, returning generic success response");
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Payment event received, but no matching subscription found",
          paymentId: payment.id,
          paymentLink: payment.paymentLink || 'none',
          externalReference: payment.externalReference || 'none',
          paymentDetails: paymentDetails,
          jwtVerificationDisabled: true
        }),
        {
          status: 200, // Return 200 to prevent retries
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } else {
      // Process the payment event for the found subscription
      // Merge existing payment details with new information
      let updatedPaymentDetails = paymentDetails;
      if (subscription.payment_details) {
        // Merge existing history with new event
        if (subscription.payment_details.event_history) {
          updatedPaymentDetails.event_history = [
            ...subscription.payment_details.event_history,
            ...updatedPaymentDetails.event_history
          ];
        }
        
        // Keep original payment creation information
        if (subscription.payment_details.created_at) {
          updatedPaymentDetails.created_at = subscription.payment_details.created_at;
        }
        
        // Preserve custom fields and add new information
        updatedPaymentDetails = {
          ...subscription.payment_details,
          ...updatedPaymentDetails
        };
      }
      
      // Update customer data if we have it
      if (customerInfo && customerInfo.asaas_id && !subscription.asaas_customer_id) {
        subscription.asaas_customer_id = customerInfo.asaas_id;
      }
      
      return await processPaymentUpdate(supabase, event, payment, subscription, updatedPaymentDetails, corsHeaders);
    }
  } catch (error) {
    console.error("Error in handlePaymentEvent:", error);
    throw error;
  }
}

// Helper function to process payment status updates
async function processPaymentUpdate(supabase: any, event: string, payment: any, subscription: any, paymentDetails: any, corsHeaders: any) {
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

  // Enhanced logging for status changes
  if (newStatus !== subscription.status) {
    console.log(`Updating subscription ${subscription.id} status from ${subscription.status} to ${newStatus}`);
  }

  // Always update payment_details to keep the most current information
  const updateData = { 
    status: newStatus, 
    payment_status: payment.status,
    payment_details: paymentDetails,
    updated_at: new Date().toISOString(),
    asaas_customer_id: payment.customer || subscription.asaas_customer_id
  };

  const { error: updateError } = await supabase
    .from("subscriptions")
    .update(updateData)
    .eq("id", subscription.id);
  
  if (updateError) {
    console.error("Error updating subscription:", updateError);
    throw updateError;
  }

  console.log("Webhook processed successfully");
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: "Webhook processed successfully",
      subscription: subscription.id,
      paymentId: payment.id,
      newStatus: newStatus,
      paymentDetails: paymentDetails,
      jwtVerificationDisabled: true
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
