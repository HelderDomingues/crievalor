
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { v4 as uuidv4 } from "uuid";

export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  cpfCnpj: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  externalReference?: string;
  notificationDisabled?: boolean;
  additionalEmails?: string;
  municipalInscription?: string;
  stateInscription?: string;
  observations?: string;
}

export interface AsaasCustomerRecord {
  id: string;
  user_id: string;
  asaas_id: string;
  cpf_cnpj: string;
  email: string;
}

export const asaasCustomerService = {
  async findCustomerByUserId(userId: string): Promise<AsaasCustomerRecord | null> {
    try {
      console.log(`Buscando cliente Asaas para o usuário: ${userId}`);
      
      const { data, error } = await supabase
        .from("asaas_customers")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (error) {
        console.error("Erro ao buscar cliente Asaas:", error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Erro em findCustomerByUserId:", error);
      return null;
    }
  },
  
  async findCustomerByCpfCnpj(cpfCnpj: string): Promise<AsaasCustomerRecord | null> {
    try {
      console.log(`Buscando cliente Asaas pelo CPF/CNPJ: ${cpfCnpj}`);
      
      // Remover formatação para garantir consistência
      const cleanCpfCnpj = cpfCnpj.replace(/[^\d]/g, '');
      
      const { data, error } = await supabase
        .from("asaas_customers")
        .select("*")
        .eq("cpf_cnpj", cleanCpfCnpj)
        .maybeSingle();
      
      if (error) {
        console.error("Erro ao buscar cliente Asaas pelo CPF/CNPJ:", error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Erro em findCustomerByCpfCnpj:", error);
      return null;
    }
  },
  
  async createOrRetrieveCustomer(profile: UserProfile): Promise<{ customerId: string, isNew: boolean }> {
    try {
      console.log("Verificando/criando cliente Asaas para perfil:", profile);
      
      // Validar dados necessários do perfil
      if (!profile.id) throw new Error("ID do usuário é obrigatório");
      if (!profile.full_name && !profile.username) throw new Error("Nome é obrigatório");
      if (!profile.email) throw new Error("Email é obrigatório");
      if (!profile.cpf && !profile.cnpj) throw new Error("CPF ou CNPJ é obrigatório");
      if (!profile.phone) throw new Error("Telefone é obrigatório");
      
      // Verificar se o usuário já tem um registro de cliente
      const existingCustomer = await this.findCustomerByUserId(profile.id);
      
      if (existingCustomer) {
        console.log("Cliente Asaas já existe localmente:", existingCustomer);
        
        // Verificar se o cliente ainda existe no Asaas
        const asaasCustomer = await this.getCustomerFromAsaas(existingCustomer.asaas_id);
        
        if (asaasCustomer) {
          // Cliente existe tanto localmente quanto no Asaas, retornar ID existente
          console.log("Cliente confirmado na API do Asaas");
          return { 
            customerId: existingCustomer.asaas_id,
            isNew: false
          };
        }
        
        // Cliente existe localmente mas não no Asaas, criar novo cliente
        console.log("Cliente não encontrado na API do Asaas, criando novo");
      }
      
      // Limpar CPF/CNPJ para garantir formato consistente
      const cpfCnpj = (profile.cpf || profile.cnpj || "").replace(/[^\d]/g, '');
      
      // Verificar se existe cliente pelo CPF/CNPJ no Asaas
      const asaasCustomerByCpfCnpj = await this.getCustomerByCpfCnpjFromAsaas(cpfCnpj);
      
      if (asaasCustomerByCpfCnpj) {
        console.log("Cliente já existe no Asaas com este CPF/CNPJ", asaasCustomerByCpfCnpj);
        
        // Salvar localmente para referência futura
        await this.saveCustomerRecord({
          user_id: profile.id,
          asaas_id: asaasCustomerByCpfCnpj.id,
          cpf_cnpj: cpfCnpj,
          email: profile.email || ""
        });
        
        // Atualizar flag no perfil do usuário
        await this.updateProfileHasCustomerFlag(profile.id, true);
        
        return { 
          customerId: asaasCustomerByCpfCnpj.id,
          isNew: false
        };
      }
      
      // Nenhum cliente existente encontrado, criar novo
      const customerData = {
        name: profile.full_name || profile.username || "Cliente",
        email: profile.email || "",
        phone: profile.phone || "",
        cpfCnpj: cpfCnpj,
        mobilePhone: profile.phone || "",
        address: profile.company_address || "",
        postalCode: "",
        externalReference: profile.id
      };
      
      // Criar novo cliente no Asaas
      const newCustomer = await this.createCustomerInAsaas(customerData);
      
      // Salvar registro na tabela local
      await this.saveCustomerRecord({
        user_id: profile.id,
        asaas_id: newCustomer.id,
        cpf_cnpj: cpfCnpj,
        email: profile.email || ""
      });
      
      // Atualizar flag no perfil do usuário
      await this.updateProfileHasCustomerFlag(profile.id, true);
      
      return {
        customerId: newCustomer.id,
        isNew: true
      };
    } catch (error: any) {
      console.error("Erro em createOrRetrieveCustomer:", error);
      throw error;
    }
  },
  
  async createCustomerInAsaas(customerData: any): Promise<AsaasCustomer> {
    try {
      console.log("Criando cliente Asaas com dados:", customerData);
      
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "create-customer",
          data: customerData,
        },
      });
      
      if (response.error) {
        console.error("Erro ao criar cliente Asaas:", response.error);
        throw new Error(`Erro ao criar cliente: ${response.error.message}`);
      }
      
      console.log("Cliente Asaas criado com sucesso:", response.data?.customer);
      return response.data.customer;
    } catch (error: any) {
      console.error("Erro em createCustomerInAsaas:", error);
      throw error;
    }
  },
  
  async getCustomerFromAsaas(customerId: string): Promise<AsaasCustomer | null> {
    try {
      console.log(`Verificando cliente Asaas: ${customerId}`);
      
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-customer",
          data: {
            customerId,
          },
        },
      });
      
      if (response.error) {
        console.error("Erro ao buscar cliente Asaas:", response.error);
        return null;
      }
      
      return response.data?.customer || null;
    } catch (error) {
      console.error("Erro em getCustomerFromAsaas:", error);
      return null;
    }
  },
  
  async getCustomerByCpfCnpjFromAsaas(cpfCnpj: string): Promise<AsaasCustomer | null> {
    try {
      console.log(`Buscando cliente Asaas pelo CPF/CNPJ: ${cpfCnpj}`);
      
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-customer-by-cpf-cnpj",
          data: {
            cpfCnpj,
          },
        },
      });
      
      if (response.error) {
        console.error("Erro ao buscar cliente Asaas pelo CPF/CNPJ:", response.error);
        return null;
      }
      
      return response.data?.customer || null;
    } catch (error) {
      console.error("Erro em getCustomerByCpfCnpjFromAsaas:", error);
      return null;
    }
  },
  
  async saveCustomerRecord(data: Omit<AsaasCustomerRecord, "id">): Promise<AsaasCustomerRecord | null> {
    try {
      console.log("Salvando registro de cliente Asaas:", data);
      
      const { data: insertedData, error } = await supabase
        .from("asaas_customers")
        .insert({
          user_id: data.user_id,
          asaas_id: data.asaas_id,
          cpf_cnpj: data.cpf_cnpj,
          email: data.email
        })
        .select()
        .single();
      
      if (error) {
        // Verificar se é erro de chave única (cliente já existe)
        if (error.code === '23505') {
          console.log("Cliente já registrado na base local, buscando registro...");
          
          const { data: existingData, error: selectError } = await supabase
            .from("asaas_customers")
            .select()
            .eq("user_id", data.user_id)
            .single();
          
          if (selectError) {
            console.error("Erro ao buscar cliente existente:", selectError);
            throw selectError;
          }
          
          return existingData;
        }
        
        console.error("Erro ao salvar registro de cliente:", error);
        throw error;
      }
      
      console.log("Registro de cliente Asaas salvo com sucesso:", insertedData);
      return insertedData;
    } catch (error) {
      console.error("Erro em saveCustomerRecord:", error);
      return null;
    }
  },
  
  async updateProfileHasCustomerFlag(userId: string, hasCustomer: boolean): Promise<void> {
    try {
      console.log(`Atualizando flag has_asaas_customer para usuário ${userId}:`, hasCustomer);
      
      const { error } = await supabase
        .from("profiles")
        .update({ has_asaas_customer: hasCustomer })
        .eq("id", userId);
      
      if (error) {
        console.error("Erro ao atualizar flag de cliente no perfil:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erro em updateProfileHasCustomerFlag:", error);
    }
  }
};
