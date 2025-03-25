
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { AsaasCustomer } from "@/types/subscription";

export const asaasCustomerService = {
  async createCustomer(profile: UserProfile): Promise<AsaasCustomer> {
    try {
      console.log("Creating Asaas customer for profile:", profile);
      
      // Make sure either CPF or CNPJ is provided
      const cpfCnpj = profile.cnpj || profile.cpf || "";
      
      if (!cpfCnpj) {
        throw new Error("CPF ou CNPJ é obrigatório");
      }
      
      // Prepare customer data according to Asaas API requirements
      const customerData = {
        name: profile.full_name || profile.username || "Cliente",
        email: profile.email,
        phone: profile.phone || "",
        cpfCnpj: cpfCnpj,
        mobilePhone: profile.phone || "", // Adding mobile phone as it may be required
        address: profile.company_address || "",
        postalCode: "", // This could be added to profile if needed
        externalReference: profile.id // Using user ID as external reference
      };
      
      console.log("Sending customer data to Asaas:", customerData);
      
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "create-customer",
          data: customerData,
        },
      });

      if (response.error) {
        console.error("Error creating Asaas customer:", response.error);
        throw new Error(`Error creating customer: ${response.error.message}`);
      }

      return response.data.customer;
    } catch (error: any) {
      console.error("Error in createCustomer:", error);
      throw error;
    }
  },
  
  // Get an existing customer by ID
  async getCustomer(customerId: string): Promise<AsaasCustomer | null> {
    try {
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-customer",
          data: {
            customerId,
          },
        },
      });

      if (response.error) {
        console.error("Error fetching Asaas customer:", response.error);
        return null;
      }

      return response.data?.customer || null;
    } catch (error) {
      console.error("Error in getCustomer:", error);
      return null;
    }
  }
};
