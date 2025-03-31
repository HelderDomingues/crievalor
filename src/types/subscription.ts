
import { Json } from "@/integrations/supabase/types";
import { PaymentType } from "@/components/pricing/PaymentOptions";

// Define subscription types
export interface Subscription {
  id: string;
  user_id: string;
  asaas_customer_id: string | null;
  asaas_subscription_id: string | null;
  asaas_payment_link: string | null;
  plan_id: string;
  status: string;
  installments: number;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
  contract_accepted?: boolean;
  contract_accepted_at?: string | null;
  payment_status?: string | null;
  payment_id?: string | null;
  external_reference?: string | null;
  payment_details?: PaymentDetails | null;
}

export interface PaymentDetails {
  payment_id?: string;
  payment_link?: string;
  status?: string;
  value?: number;
  net_value?: number;
  description?: string;
  billing_type?: string;
  installment_count?: number;
  total_installments?: number;
  due_date?: string;
  payment_date?: string;
  credit_date?: string;
  invoice_url?: string;
  receipt_url?: string;
  bank_slip_url?: string;
  external_reference?: string;
  customer?: {
    asaas_id?: string;
    name?: string;
    email?: string;
    cpf_cnpj?: string;
    phone?: string;
  };
  processed_at?: string;
  event?: string;
}

// Define plan types more explicitly
export interface RegularPlan {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  totalPrice: number;
  cashPrice: number;
  features: string[];
}

export interface CustomPricePlan {
  id: string;
  name: string;
  customPrice: boolean;
  features: string[];
}

export type Plan = RegularPlan | CustomPricePlan;

export interface CreateCheckoutOptions {
  planId: string;
  successUrl: string;
  cancelUrl: string;
  installments?: number;
  paymentType?: PaymentType;
  customerId?: string | null;
}

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
