
import { supabase } from "@/integrations/supabase/client";
import { RegistrationFormData } from "@/components/checkout/form/RegistrationFormSchema";

export const asaasCustomerService = {
  async createOrRetrieveCustomer(profileData: any) {
    try {
      // With our simplified approach, we don't need to create customers in Asaas ahead of time
      // We'll simply store form data for the checkout and let Asaas collect the rest
      console.log("Storing customer data for checkout:", JSON.stringify(profileData));
      
      // Clear any stale cached data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cachedCustomerData');
      }
      
      // Store form data locally for checkout process
      if (profileData.email) {
        localStorage.setItem('customerEmail', profileData.email);
      }
      
      if (profileData.phone) {
        localStorage.setItem('customerPhone', profileData.phone);
      }
      
      if (profileData.full_name) {
        localStorage.setItem('customerName', profileData.full_name);
      }
      
      if (profileData.cpf) {
        localStorage.setItem('customerCPF', profileData.cpf);
      }
      
      localStorage.setItem('formDataTimestamp', Date.now().toString());
      
      // Return a placeholder - we'll get the actual customer ID after payment
      return { 
        customerId: null, 
        isNew: true 
      };
    } catch (error) {
      console.error("Erro em createOrRetrieveCustomer:", error);
      throw error;
    }
  },
  
  async registerCustomerFromForm(formData: RegistrationFormData, userId?: string) {
    try {
      console.log("Registering customer from form data:", formData);
      
      // Clear any cached customer data to ensure fresh data is used
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cachedCustomerData');
        localStorage.removeItem('lastFormSubmission');
      }
      
      // Store form data locally for checkout process
      localStorage.setItem('customerEmail', formData.email);
      localStorage.setItem('customerPhone', formData.phone);
      localStorage.setItem('customerName', formData.fullName);
      localStorage.setItem('customerCPF', formData.cpf);
      localStorage.setItem('formDataTimestamp', Date.now().toString());
      
      // With simplified approach, we don't create customers in Asaas ahead of time
      return { customerId: null, isNew: true };
    } catch (error) {
      console.error("Erro ao registrar cliente a partir do formulário:", error);
      throw error;
    }
  },
  
  formatCpfCnpj(value: string): string {
    if (!value) return "";
    return value.replace(/[^\d]/g, '');
  },
  
  async registerLocalCustomer(userId: string, asaasCustomer: any) {
    try {
      // Check if a record already exists for this user
      const { data: existingCustomer, error: existingError } = await supabase
        .from("asaas_customers")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (existingError) {
        console.error("Erro ao verificar cliente local existente:", existingError);
      }
      
      // Prepare data for insertion/update
      const customerData = {
        user_id: userId,
        asaas_id: asaasCustomer.id,
        cpf_cnpj: asaasCustomer.cpfCnpj,
        email: asaasCustomer.email,
        updated_at: new Date().toISOString()
      };
      
      if (existingCustomer) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("asaas_customers")
          .update(customerData)
          .eq("user_id", userId);
          
        if (updateError) {
          console.error("Erro ao atualizar cliente local:", updateError);
          throw updateError;
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from("asaas_customers")
          .insert({
            ...customerData,
            created_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error("Erro ao inserir cliente local:", insertError);
          throw insertError;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Erro em registerLocalCustomer:", error);
      throw error;
    }
  },
  
  async updateProfileHasCustomer(userId: string, hasCustomer: boolean) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          has_asaas_customer: hasCustomer,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
        
      if (error) {
        console.error("Erro ao atualizar flag no perfil:", error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Erro em updateProfileHasCustomer:", error);
      throw error;
    }
  },
  
  async lookupCustomerById(asaasCustomerId: string) {
    try {
      if (!asaasCustomerId) {
        return null;
      }
      
      // First check our local database
      const { data: localCustomer, error: localError } = await supabase
        .from("asaas_customers")
        .select("*")
        .eq("asaas_id", asaasCustomerId)
        .maybeSingle();
        
      if (localError) {
        console.error("Error looking up local customer:", localError);
      }
      
      if (localCustomer) {
        console.log("Found customer in local database:", localCustomer);
        return localCustomer;
      }
      
      // If not found locally, try to get from Asaas
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-customer",
          data: {
            customerId: asaasCustomerId
          }
        }
      });
      
      if (response.error) {
        console.error("Error fetching customer from Asaas:", response.error);
        return null;
      }
      
      const asaasCustomer = response.data?.customer;
      if (!asaasCustomer) {
        console.log("Customer not found in Asaas:", asaasCustomerId);
        return null;
      }
      
      console.log("Found customer in Asaas:", asaasCustomer);
      return {
        asaas_id: asaasCustomer.id,
        email: asaasCustomer.email,
        cpf_cnpj: asaasCustomer.cpfCnpj
      };
    } catch (error) {
      console.error("Error in lookupCustomerById:", error);
      return null;
    }
  },
  
  async deleteAllCustomerData() {
    try {
      console.log("Iniciando processo de exclusão de dados do cliente");
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Get Asaas customer ID from our database
      const { data: asaasCustomer, error: customerError } = await supabase
        .from("asaas_customers")
        .select("asaas_id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (customerError) {
        console.error("Erro ao buscar cliente Asaas:", customerError);
        throw customerError;
      }
      
      if (!asaasCustomer?.asaas_id) {
        console.log("Nenhum cliente Asaas encontrado para o usuário");
        return { 
          success: true, 
          message: "Nenhum dado de pagamento encontrado para excluir" 
        };
      }
      
      // Call Edge function to delete customer in Asaas
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "delete-customer",
          data: {
            customerId: asaasCustomer.asaas_id
          }
        }
      });
      
      if (response.error) {
        console.error("Erro ao excluir cliente no Asaas:", response.error);
        throw new Error(`Erro ao excluir cliente no Asaas: ${response.error.message}`);
      }
      
      if (!response.data?.success) {
        throw new Error(response.data?.error || "Erro ao excluir cliente no Asaas");
      }
      
      console.log("Cliente excluído no Asaas com sucesso");
      
      // Clean up local database
      await this.cleanupLocalData(user.id);
      
      return { 
        success: true, 
        message: "Todos os dados de pagamento foram excluídos com sucesso" 
      };
    } catch (error: any) {
      console.error("Erro ao excluir dados do cliente:", error);
      return { 
        success: false, 
        message: error.message || "Ocorreu um erro ao excluir dados de pagamento" 
      };
    }
  },
  
  async cleanupLocalData(userId: string) {
    try {
      // Delete local customer record
      const { error: deleteCustomerError } = await supabase
        .from("asaas_customers")
        .delete()
        .eq("user_id", userId);
        
      if (deleteCustomerError) {
        console.error("Erro ao excluir registro local do cliente:", deleteCustomerError);
        // Continue with the process even if there's an error here
      }
      
      // Delete subscription records
      const { error: deleteSubscriptionError } = await supabase
        .from("subscriptions")
        .delete()
        .eq("user_id", userId);
        
      if (deleteSubscriptionError) {
        console.error("Erro ao excluir assinaturas:", deleteSubscriptionError);
        // Continue with the process even if there's an error here
      }
      
      // Update flag in profile
      await this.updateProfileHasCustomer(userId, false);
      
      console.log("Todos os dados de pagamento foram excluídos com sucesso");
      
      return true;
    } catch (error) {
      console.error("Error cleaning up local data:", error);
      throw error;
    }
  }
};
