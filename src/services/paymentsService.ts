
import { supabase } from "@/integrations/supabase/client";

export const paymentsService = {
  async getPayments() {
    try {
      console.log("Fetching payments...");
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-payments",
          data: {},
        },
      });

      if (response.error) {
        console.error("Error fetching payments:", response.error);
        return [];
      }

      console.log("Payments data received:", response.data);
      return response.data?.payments || [];
    } catch (error) {
      console.error("Error in getPayments:", error);
      return [];
    }
  },

  async getPayment(paymentId: string) {
    try {
      console.log(`Fetching payment: ${paymentId}`);
      const response = await supabase.functions.invoke("asaas", {
        body: {
          action: "get-payment",
          data: {
            paymentId,
          },
        },
      });

      if (response.error) {
        console.error("Error fetching payment:", response.error);
        return null;
      }

      return response.data?.payment || null;
    } catch (error) {
      console.error("Error in getPayment:", error);
      return null;
    }
  },
  
  async requestReceipt(paymentId: string) {
    try {
      console.log(`Requesting receipt for payment: ${paymentId}`);
      const payment = await this.getPayment(paymentId);
      
      if (!payment) {
        throw new Error("Payment not found");
      }
      
      if (payment.invoiceUrl) {
        return { success: true, url: payment.invoiceUrl };
      }
      
      return { success: false, error: "Invoice not available for this payment" };
    } catch (error: any) {
      console.error("Error in requestReceipt:", error);
      return { success: false, error: error.message };
    }
  }
};
