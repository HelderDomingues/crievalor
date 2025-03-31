
import { supabase } from "@/integrations/supabase/client";
import { RegistrationFormData } from "@/components/checkout/form/RegistrationFormSchema";

export const asaasCustomerService = {
  async createOrRetrieveCustomer(profileData: any) {
    try {
      console.log("Creating or retrieving customer with data:", profileData);
      
      // First check for existing customer
      const existingCustomer = await this.findExistingCustomer(profileData.id);
      if (existingCustomer) {
        return { 
          customerId: existingCustomer.asaas_id, 
          isNew: false 
        };
      }
      
      // Process CPF/CNPJ
      const cpfCnpj = this.formatCpfCnpj(profileData.cpf || profileData.cnpj);
      
      if (!cpfCnpj) {
        throw new Error("CPF ou CNPJ é obrigatório");
      }
      
      // Check if customer exists by CPF/CNPJ
      const existingAsaasCustomer = await this.findCustomerByCpfCnpj(cpfCnpj);
      if (existingAsaasCustomer) {
        // Register in local database if we have a user ID
        if (profileData.id) {
          await this.registerLocalCustomer(profileData.id, existingAsaasCustomer);
        }
        
        return { 
          customerId: existingAsaasCustomer.id, 
          isNew: false 
        };
      }
      
      // Create new customer with better error handling
      const newCustomer = await this.createNewCustomer(profileData, cpfCnpj);
      
      return { 
        customerId: newCustomer.id, 
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
      localStorage.removeItem('cachedCustomerData');
      
      const profileData = {
        id: userId || null,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cpf: formData.cpf
      };
      
      return await this.createOrRetrieveCustomer(profileData);
    } catch (error) {
      console.error("Erro ao registrar cliente a partir do formulário:", error);
      throw error;
    }
  },
  
  async findExistingCustomer(userId: string) {
    try {
      const { data: existingCustomer, error: existingError } = await supabase
        .from("asaas_customers")
        .select("asaas_id")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (existingError) {
        console.error("Erro ao verificar cliente existente:", existingError);
      }
      
      if (existingCustomer?.asaas_id) {
        console.log("Cliente existente encontrado:", existingCustomer.asaas_id);
        return existingCustomer;
      }
      
      return null;
    } catch (error) {
      console.error("Error finding existing customer:", error);
      return null;
    }
  },
  
  formatCpfCnpj(value: string): string {
    if (!value) return "";
    return value.replace(/[^\d]/g, '');
  },
  
  async findCustomerByCpfCnpj(cpfCnpj: string) {
    try {
      // Format CPF/CNPJ to ensure consistency
      const formattedCpfCnpj = this.formatCpfCnpj(cpfCnpj);
      
      console.log(`Verificando cliente por CPF/CNPJ: ${formattedCpfCnpj}`);
      
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-customer-by-cpf-cnpj",
          data: {
            cpfCnpj: formattedCpfCnpj
          },
        },
      });
      
      if (response.error) {
        console.error("Erro ao verificar cliente no Asaas:", response.error);
        // Instead of throwing an error, return null to allow the flow to continue to customer creation
        console.log("Continuando com a criação de novo cliente devido a erro na verificação");
        return null;
      }
      
      return response.data?.customer || null;
    } catch (error) {
      console.error("Error finding customer by CPF/CNPJ:", error);
      // Instead of re-throwing the error, return null to allow the flow to continue
      console.log("Continuando com a criação de novo cliente devido a exceção");
      return null;
    }
  },
  
  async createNewCustomer(profileData: any, cpfCnpj: string) {
    try {
      // Log the raw input data for debugging
      console.log("Raw input for customer creation:", {
        fullName: profileData.full_name,
        email: profileData.email, 
        phone: profileData.phone,
        cpf: cpfCnpj
      });
      
      // Ensure we have fresh data, not cached values
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('cachedCustomerData');
      }
      
      // Normalize phone number - remove any non-numeric characters
      const phone = profileData.phone ? profileData.phone.replace(/\D/g, '') : '';
      
      // Double check if data looks reasonable
      if (!profileData.full_name || !profileData.email || !phone || !cpfCnpj) {
        console.error("Missing required customer data:", {
          name: profileData.full_name,
          email: profileData.email,
          phone,
          cpfCnpj
        });
      }
      
      // Prepare customer data with formatted data
      const customerData = {
        name: profileData.full_name,
        email: profileData.email,
        phone: phone,
        mobilePhone: phone,
        cpfCnpj: cpfCnpj,
        address: profileData.company_address || "",
        postalCode: "",
        externalReference: profileData.id || `temp-${Date.now()}`
      };
      
      console.log("Creating customer with formatted data:", customerData);
      
      const createResponse = await supabase.functions.invoke("asaas", {
        body: {
          action: "create-customer",
          data: customerData,
          timestamp: Date.now() // Add timestamp to prevent caching
        },
      });
      
      if (createResponse.error) {
        console.error("Erro ao criar cliente no Asaas:", createResponse.error);
        throw new Error(`Erro ao criar cliente: ${createResponse.error.message}`);
      }
      
      const customer = createResponse.data?.customer;
      if (!customer || !customer.id) {
        console.error("Resposta inválida do Asaas:", createResponse.data);
        throw new Error("Falha ao criar cliente no Asaas: resposta inválida");
      }
      
      console.log("Novo cliente criado no Asaas:", customer);
      
      // Register in local database if we have a user ID
      if (profileData.id) {
        // Register in local database
        await this.registerLocalCustomer(profileData.id, customer);
        
        // Update flag in profile
        await this.updateProfileHasCustomer(profileData.id, true);
      }
      
      return customer;
    } catch (error) {
      console.error("Error creating new customer:", error);
      throw error;
    }
  },
  
  async registerLocalCustomer(userId: string, customer: any) {
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
        asaas_id: customer.id,
        cpf_cnpj: customer.cpfCnpj,
        email: customer.email,
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
  
  async deleteAllCustomerData() {
    try {
      console.log("Iniciando processo de exclusão de dados do cliente");
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Get Asaas customer ID
      const asaasCustomer = await this.findExistingCustomer(user.id);
      
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
