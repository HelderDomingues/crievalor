
// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get the appropriate API URL based on environment
export function getAsaasApiUrl(): string {
  const isProd = Deno.env.get('ENVIRONMENT') === 'PROD';
  return isProd ? 'https://api.asaas.com/v3' : 'https://sandbox.asaas.com/api/v3';
}

// URL validation for callbacks
export const validateUrls = (successUrl: string, cancelUrl: string) => {
  const allowedDomain = "https://crievalor.lovable.app";
  
  if (!successUrl.startsWith(allowedDomain)) {
    console.error(`Invalid success URL domain: ${successUrl}. Must use: ${allowedDomain}`);
    throw new Error(`Invalid success URL domain. Must use: ${allowedDomain}`);
  }
  
  if (!cancelUrl.startsWith(allowedDomain)) {
    console.error(`Invalid cancel URL domain: ${cancelUrl}. Must use: ${allowedDomain}`);
    throw new Error(`Invalid cancel URL domain. Must use: ${allowedDomain}`);
  }
  
  console.log("URLs validated successfully for domain:", allowedDomain);
  return true;
};

// Safe JSON parser helper
export const safeJsonParse = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return null;
  }
};
