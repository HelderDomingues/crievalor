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

// Mapping of payment links to plan details
const PAYMENT_LINK_MAP = {
  // Plano Essencial MAR
  "vydr3n77kew5fd4s": { planId: "basic_plan", paymentType: "credit", description: "Plano Essencial MAR - Parcelado" },
  "fy15747uacorzbla": { planId: "basic_plan", paymentType: "pix", description: "Plano Essencial MAR - À Vista" },
  
  // Plano Profissional MAR
  "4fcw2ezk4je61qon": { planId: "pro_plan", paymentType: "credit", description: "Plano Profissional MAR - Parcelado" },
  "pqnkhgvic7c25ufq": { planId: "pro_plan", paymentType: "pix", description: "Plano Profissional MAR - À Vista" },
  
  // Plano Empresarial MAR
  "z4vate6zwonrwoft": { planId: "enterprise_plan", paymentType: "credit", description: "Plano Empresarial MAR - Parcelado" },
  "3pdwf46bs80mpk0s": { planId: "enterprise_plan", paymentType: "pix", description: "Plano Empresarial MAR - À Vista" }
};

// Get plan ID from payment link or description
function getPlanInfoFromPayment(payment: any): { planId: string, paymentType: string } {
  console.log("Identifying plan from payment:", payment.paymentLink);
  
  // First try to get plan from payment link
  if (payment.paymentLink && PAYMENT_LINK_MAP[payment.paymentLink]) {
    console.log(`Plan identified by payment link: ${PAYMENT_LINK_MAP[payment.paymentLink].planId}`);
    return PAYMENT_LINK_MAP[payment.paymentLink];
  }
  
  // If no payment link match, try to identify by description
  const description = payment.description || "";
  
  if (description.includes("Essencial MAR")) {
    return { planId: "basic_plan", paymentType: description.includes("À Vista") ? "pix" : "credit" };
  } else if (description.includes("Profissional MAR")) {
    return { planId: "pro_plan", paymentType: description.includes("À Vista") ? "pix" : "credit" };
  } else if (description.includes("Empresarial MAR")) {
    return { planId: "enterprise_plan", paymentType: description.includes("À Vista") ? "pix" : "credit" };
  }
  
  // Default to basic plan if we can't identify
  console.log("Could not identify plan from payment, defaulting to basic_plan");
  return { planId: "basic_plan", paymentType: "credit" };
}

// Generate a temporary password
function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Helper function to process payment events
export async function handlePaymentEvent(supabase: any, event: string, payment: any, corsHeaders: any) {
  try {
    // Enhanced logging for debugging
    console.log(`Processing ${event} event for payment ${payment.id}`);
    console.log("Payment full details:", JSON.stringify(payment, null, 2));
    
    // Get plan information based on payment link or description
    const planInfo = getPlanInfoFromPayment(payment);
    
    // Extract useful customer information if available
    let customerInfo = null;
    let asaasCustomerId = null;
    let userAccount = null;
    
    if (payment.customer) {
      asaasCustomerId = typeof payment.customer === 'string' 
        ? payment.customer 
        : payment.customer.id;
      
      console.log(`Customer ID provided: ${asaasCustomerId}`);
      
      // First, try to get customer details from Asaas
      try {
        const { data, error } = await supabase.functions.invoke("asaas", {
          body: {
            action: "get-customer",
            data: {
              customerId: asaasCustomerId
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
            const tempPassword = generateTemporaryPassword();
            
            const { data: userProfile, error: profileError } = await supabase.auth.admin.createUser({
              email: data.customer.email,
              email_confirm: true,
              user_metadata: {
                full_name: data.customer.name,
                phone: data.customer.phone || data.customer.mobilePhone,
                cpf: data.customer.cpfCnpj
              },
              password: tempPassword
            });
            
            if (profileError) {
              console.error("Error creating user profile:", profileError);
            } else {
              console.log("Created new user profile:", userProfile);
              userAccount = userProfile.user;
              
              // Send password reset email to allow user to set their own password
              const { error: resetError } = await supabase.auth.admin.generateLink({
                type: 'recovery',
                email: data.customer.email,
                options: {
                  redirectTo: 'https://app.crievalor.com.br/auth?action=reset_password'
                }
              });
              
              if (resetError) {
                console.error("Error sending password reset email:", resetError);
              } else {
                console.log("Password reset email sent to user");
              }
              
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
            
            // Get user account information
            const { data: userData, error: userError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", existingCustomer.user_id)
              .maybeSingle();
              
            if (userError) {
              console.error("Error fetching user profile:", userError);
            } else if (userData) {
              console.log("Found user profile:", userData);
              userAccount = { id: userData.id };
            }
          }
        }
      } catch (error) {
        console.error("Error retrieving customer details from Asaas:", error);
        
        // Try to get customer details from our database
        const { data: customerData, error: customerError } = await supabase
          .from("asaas_customers")
          .select("*")
          .eq("asaas_id", asaasCustomerId)
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
          
          // Get user account information
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", customerData.user_id)
            .maybeSingle();
            
          if (userError) {
            console.error("Error fetching user profile:", userError);
          } else if (userData) {
            console.log("Found user profile:", userData);
            userAccount = { id: userData.id };
          }
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
      plan_id: planInfo.planId,
      plan_payment_type: planInfo.paymentType,
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
      } else if (asaasCustomerId) {
        // If no subscription was found, but we have customer info, create a new one
        console.log("Attempting to create a new subscription record based on customer and payment information");
        
        // Get customer record
        const { data: asaasCustomer, error: customerError } = await supabase
          .from("asaas_customers")
          .select("*")
          .eq("asaas_id", asaasCustomerId)
          .maybeSingle();
          
        if (customerError) {
          console.error("Error finding asaas_customer:", customerError);
        } else if (asaasCustomer) {
          console.log("Found asaas_customer record:", asaasCustomer);
          
          // Create new subscription record
          const subscriptionData = {
            user_id: asaasCustomer.user_id,
            plan_id: planInfo.planId,
            status: ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"].includes(payment.status) ? "active" : "pending",
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
        } else if (userAccount) {
          // Customer record not found but we have user account, create a new asaas_customer record
          console.log("Creating new asaas_customer record for user:", userAccount.id);
          
          const { data: newCustomer, error: newCustomerError } = await supabase
            .from("asaas_customers")
            .insert({
              asaas_id: asaasCustomerId,
              user_id: userAccount.id,
              email: customerInfo?.email,
              cpf_cnpj: customerInfo?.cpf_cnpj
            })
            .select()
            .single();
            
          if (newCustomerError) {
            console.error("Error creating new asaas_customer record:", newCustomerError);
          } else {
            console.log("Created new asaas_customer record:", newCustomer);
            
            // Now create subscription
            const subscriptionData = {
              user_id: userAccount.id,
              plan_id: planInfo.planId,
              status: ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"].includes(payment.status) ? "active" : "pending",
              asaas_customer_id: asaasCustomerId,
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
          }
        } else {
          // No user account, create one based on payment information
          console.log("Customer has no user account, creating new account");
          
          // Extract potential email from payment description or other fields
          let email = null;
          
          if (payment.customer && typeof payment.customer === 'object' && payment.customer.email) {
            email = payment.customer.email;
          } else if (customerInfo && customerInfo.email) {
            email = customerInfo.email;
          }
          
          if (!email) {
            console.log("No email found, cannot create user account");
          } else {
            // Create new user account
            const tempPassword = generateTemporaryPassword();
            
            const { data: newUser, error: newUserError } = await supabase.auth.admin.createUser({
              email: email,
              email_confirm: true,
              password: tempPassword
            });
            
            if (newUserError) {
              console.error("Error creating new user account:", newUserError);
            } else {
              console.log("Created new user account:", newUser);
              
              // Send password reset email
              const { error: resetError } = await supabase.auth.admin.generateLink({
                type: 'recovery',
                email: email,
                options: {
                  redirectTo: 'https://app.crievalor.com.br/auth?action=reset_password'
                }
              });
              
              if (resetError) {
                console.error("Error sending password reset email:", resetError);
              } else {
                console.log("Password reset email sent to user");
              }
              
              // Create asaas_customer record
              const { data: newCustomer, error: customerError } = await supabase
                .from("asaas_customers")
                .insert({
                  asaas_id: asaasCustomerId,
                  user_id: newUser.user.id,
                  email: email,
                  cpf_cnpj: customerInfo?.cpf_cnpj
                })
                .select()
                .single();
                
              if (customerError) {
                console.error("Error creating asaas_customer record:", customerError);
              } else {
                console.log("Created new asaas_customer record:", newCustomer);
                
                // Create subscription
                const subscriptionData = {
                  user_id: newUser.user.id,
                  plan_id: planInfo.planId,
                  status: ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"].includes(payment.status) ? "active" : "pending",
                  asaas_customer_id: asaasCustomerId,
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
              }
            }
          }
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
      if (asaasCustomerId && !subscription.asaas_customer_id) {
        subscription.asaas_customer_id = asaasCustomerId;
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
    
    // If becoming active and subscription is new, send welcome or recovery email
    if (newStatus === "active" && (subscription.status === "pending" || subscription.status === "inactive")) {
      console.log("New active subscription, checking if we need to send welcome email");
      
      // Get user information
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", subscription.user_id)
        .maybeSingle();
        
      if (userError) {
        console.error("Error fetching user profile for welcome email:", userError);
      } else if (userData) {
        console.log("User profile for welcome email:", userData);
        
        // Get user auth data to check if they've reset their password
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(subscription.user_id);
        
        if (authError) {
          console.error("Error fetching auth user data:", authError);
        } else if (authUser) {
          console.log("Auth user data:", authUser);
          
          // If this is a fresh user account, send password reset email
          if (authUser.user.created_at === authUser.user.updated_at) {
            console.log("New user needs to set password, sending reset email");
            
            // Send password reset email
            const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
              type: 'recovery',
              email: authUser.user.email,
              options: {
                redirectTo: 'https://app.crievalor.com.br/auth?action=reset_password'
              }
            });
            
            if (resetError) {
              console.error("Error sending password reset email:", resetError);
            } else {
              console.log("Password reset email sent to user:", resetData);
            }
          }
        }
      }
    }
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
