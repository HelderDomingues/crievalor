
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

// Generate a unique reference for payment tracking
export function generateUniqueReference(userId: string, planId: string): string {
  return `${userId}_${planId}_${Date.now()}_${uuidv4().substring(0, 8)}`;
}

// Track payment attempts to prevent duplicates
export function trackPaymentAttempt(
  attemptsStore: Record<string, { count: number, timestamp: number }>,
  userId: string, 
  planId: string
): boolean {
  const key = `${userId}_${planId}`;
  const now = Date.now();
  const currentAttempt = attemptsStore[key] || { count: 0, timestamp: 0 };
  
  if (now - currentAttempt.timestamp > 5 * 60 * 1000) {
    currentAttempt.count = 0;
  }
  
  currentAttempt.count += 1;
  currentAttempt.timestamp = now;
  attemptsStore[key] = currentAttempt;
  
  return currentAttempt.count <= 3 && (currentAttempt.count === 1 || now - currentAttempt.timestamp > 15000);
}

// Check if a payment link is still valid
export async function checkPaymentLinkValidity(linkUrl: string): Promise<boolean> {
  try {
    const linkId = linkUrl.split('/').pop();
    
    if (!linkId) {
      console.error("ID do link de pagamento não encontrado na URL:", linkUrl);
      return false;
    }
    
    console.log(`Verificando validade do link de pagamento: ${linkId}`);
    
    const response = await supabase.functions.invoke("asaas", {
      body: {
        action: "get-payment-link",
        data: {
          linkId
        },
      },
    });
    
    if (response.error) {
      console.error("Erro ao verificar link de pagamento:", response.error);
      return false;
    }
    
    const linkData = response.data?.paymentLink;
    
    if (!linkData) {
      console.log("Link de pagamento não encontrado");
      return false;
    }
    
    const isValid = linkData.active === true;
    
    console.log(`Link de pagamento ${isValid ? 'é válido' : 'não é válido'}:`, linkData);
    return isValid;
  } catch (error) {
    console.error("Erro ao verificar validade do link de pagamento:", error);
    return false;
  }
}

// Format currency values
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Calculate installment value
export function calculateInstallmentValue(totalValue: number, installments: number): number {
  return Number((totalValue / installments).toFixed(2));
}

// Get current date in YYYY-MM-DD format
export function getCurrentDateFormatted(): string {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

// Get a future date in YYYY-MM-DD format
export function getFutureDateFormatted(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}
