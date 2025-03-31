
// CORS headers para permitir requisições cross-origin
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Retorna a URL base da API Asaas dependendo do ambiente (sandbox ou produção)
 */
export function getAsaasApiUrl(useSandbox: boolean = true): string {
  return useSandbox 
    ? 'https://sandbox.asaas.com/api/v3'
    : 'https://api.asaas.com/api/v3';
}

/**
 * Tenta fazer o parse de um texto JSON, retornando null em caso de erro
 */
export function safeJsonParse(jsonText: string): any {
  try {
    return JSON.parse(jsonText);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return null;
  }
}

/**
 * Valida URLs de callback para garantir que são URLs válidas
 */
export function validateUrls(successUrl: string, cancelUrl: string): void {
  try {
    if (successUrl) new URL(successUrl);
    if (cancelUrl) new URL(cancelUrl);
  } catch (e) {
    throw new Error(`Invalid URL provided: ${e.message}`);
  }
}

/**
 * Formata número de telefone para o formato esperado pelo Asaas
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Formata CPF/CNPJ para o formato esperado pelo Asaas
 */
export function formatCpfCnpj(cpfCnpj: string): string {
  if (!cpfCnpj) return '';
  return cpfCnpj.replace(/\D/g, '');
}

/**
 * Gera um ID de referência externa único
 */
export function generateExternalReference(prefix: string = 'ref'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Verifica se o servidor Asaas está acessível
 */
export async function checkAsaasConnection(apiKey: string): Promise<boolean> {
  try {
    const baseUrl = getAsaasApiUrl(true);
    const response = await fetch(`${baseUrl}/customers?limit=1`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking Asaas connection:', error);
    return false;
  }
}
