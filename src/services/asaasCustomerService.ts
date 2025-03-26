
import { supabase } from "@/integrations/supabase/client";

export const asaasCustomerService = {
  async createOrRetrieveCustomer(profileData: any) {
    try {
      // Primeiro verifica se já existe um cliente para este usuário
      const { data: existingCustomer, error: existingError } = await supabase
        .from("asaas_customers")
        .select("asaas_id")
        .eq("user_id", profileData.id)
        .maybeSingle();
        
      if (existingError) {
        console.error("Erro ao verificar cliente existente:", existingError);
      }
      
      // Se já existe, retorna o ID
      if (existingCustomer?.asaas_id) {
        console.log("Cliente existente encontrado:", existingCustomer.asaas_id);
        return { 
          customerId: existingCustomer.asaas_id, 
          isNew: false 
        };
      }
      
      // Preparar CPF/CNPJ - remove caracteres especiais
      let cpfCnpj = profileData.cpf || profileData.cnpj || "";
      cpfCnpj = cpfCnpj.replace(/[^\d]/g, '');
      
      if (!cpfCnpj) {
        throw new Error("CPF ou CNPJ é obrigatório");
      }
      
      // Verifica se já existe um cliente com este CPF/CNPJ no Asaas
      const checkResponse = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-customer-by-cpf-cnpj",
          data: {
            cpfCnpj: cpfCnpj
          },
        },
      });
      
      if (checkResponse.error) {
        console.error("Erro ao verificar cliente no Asaas:", checkResponse.error);
        throw new Error(`Erro ao verificar cliente: ${checkResponse.error.message}`);
      }
      
      // Se encontrou cliente existente no Asaas
      if (checkResponse.data?.customer) {
        const customer = checkResponse.data.customer;
        console.log("Cliente encontrado no Asaas:", customer);
        
        // Registrar no banco local
        await this.registerLocalCustomer(profileData.id, customer);
        
        return { 
          customerId: customer.id, 
          isNew: false 
        };
      }
      
      // Se não existe, cria um novo cliente
      const createResponse = await supabase.functions.invoke("asaas", {
        body: {
          action: "create-customer",
          data: {
            name: profileData.full_name,
            email: profileData.email,
            phone: profileData.phone,
            mobilePhone: profileData.phone,
            cpfCnpj: cpfCnpj,
            address: profileData.company_address,
            postalCode: "",
            externalReference: profileData.id
          },
        },
      });
      
      if (createResponse.error) {
        console.error("Erro ao criar cliente no Asaas:", createResponse.error);
        throw new Error(`Erro ao criar cliente: ${createResponse.error.message}`);
      }
      
      const customer = createResponse.data?.customer;
      if (!customer || !customer.id) {
        throw new Error("Falha ao criar cliente no Asaas");
      }
      
      console.log("Novo cliente criado no Asaas:", customer);
      
      // Registrar no banco local
      await this.registerLocalCustomer(profileData.id, customer);
      
      // Atualizar flag no perfil
      await this.updateProfileHasCustomer(profileData.id, true);
      
      return { 
        customerId: customer.id, 
        isNew: true 
      };
    } catch (error) {
      console.error("Erro em createOrRetrieveCustomer:", error);
      throw error;
    }
  },
  
  async registerLocalCustomer(userId: string, customer: any) {
    try {
      // Verificar se já existe um registro para este usuário
      const { data: existingCustomer, error: existingError } = await supabase
        .from("asaas_customers")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (existingError) {
        console.error("Erro ao verificar cliente local existente:", existingError);
      }
      
      // Preparar dados para inserção/atualização
      const customerData = {
        user_id: userId,
        asaas_id: customer.id,
        cpf_cnpj: customer.cpfCnpj,
        email: customer.email,
        updated_at: new Date().toISOString()
      };
      
      if (existingCustomer) {
        // Atualizar registro existente
        const { error: updateError } = await supabase
          .from("asaas_customers")
          .update(customerData)
          .eq("user_id", userId);
          
        if (updateError) {
          console.error("Erro ao atualizar cliente local:", updateError);
          throw updateError;
        }
      } else {
        // Criar novo registro
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
      
      // Obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Obter o ID do cliente Asaas
      const { data: asaasCustomer, error: customerError } = await supabase
        .from("asaas_customers")
        .select("asaas_id")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (customerError) {
        console.error("Erro ao buscar cliente Asaas:", customerError);
        throw new Error("Erro ao buscar cliente Asaas");
      }
      
      if (!asaasCustomer?.asaas_id) {
        console.log("Nenhum cliente Asaas encontrado para o usuário");
        return { 
          success: true, 
          message: "Nenhum dado de pagamento encontrado para excluir" 
        };
      }
      
      // Chamar a função Edge para excluir o cliente no Asaas
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
      
      // Verificar se a exclusão foi bem-sucedida
      if (!response.data?.success) {
        throw new Error(response.data?.error || "Erro ao excluir cliente no Asaas");
      }
      
      console.log("Cliente excluído no Asaas com sucesso");
      
      // Excluir registro local do cliente
      const { error: deleteCustomerError } = await supabase
        .from("asaas_customers")
        .delete()
        .eq("user_id", user.id);
        
      if (deleteCustomerError) {
        console.error("Erro ao excluir registro local do cliente:", deleteCustomerError);
        // Continuar com o processo mesmo se houver erro aqui
      }
      
      // Excluir registros de assinatura
      const { error: deleteSubscriptionError } = await supabase
        .from("subscriptions")
        .delete()
        .eq("user_id", user.id);
        
      if (deleteSubscriptionError) {
        console.error("Erro ao excluir assinaturas:", deleteSubscriptionError);
        // Continuar com o processo mesmo se houver erro aqui
      }
      
      // Atualizar flag no perfil
      await this.updateProfileHasCustomer(user.id, false);
      
      console.log("Todos os dados de pagamento foram excluídos com sucesso");
      
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
  }
};
