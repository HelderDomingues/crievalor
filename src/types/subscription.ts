
import { ElementType } from "react";

export interface DocumentType {
  icon: ElementType;
  name: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice?: string;
  annualPrice?: string;
  annualDiscount?: boolean;
  description: string;
  features: string[];
  documents?: DocumentType[];
  cta: string;
  ctaUrl: string;
  popular?: boolean;
  comingSoon?: boolean;
  customPrice?: boolean;
}

// Payment-related interfaces
export interface PaymentOptions {
  creditPaymentUrl: string;
  cashPaymentUrl: string;
}

export interface ContactOptions {
  whatsappUrl: string;
}

export interface Plan {
  id: string;
  name: string;
  [key: string]: any;
}

export interface RegularPlan extends Plan {
  price: number;
  priceLabel: string;
  totalPrice: number;
  cashPrice: number;
  features: string[];
  paymentOptions: PaymentOptions;
}

export interface CustomPricePlan extends Plan {
  customPrice: boolean;
  features: string[];
  contactOptions: ContactOptions;
}

// Add the missing subscription types needed by components
export interface PaymentDetails {
  billing_type?: string;
  value?: number;
  net_value?: number;
  original_value?: number;
  interest_value?: number;
  invoice_url?: string;
  installment_count?: number;
  total_installments?: number;
  installment_value?: number;
  due_date?: string;
  payment_date?: string;
  receipt_url?: string;
  transaction_receipt_url?: string;
}

export interface CreateCheckoutOptions {
  planId: string;
  successUrl?: string;
  cancelUrl?: string;
  installments?: number;
  paymentType?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_end?: string;
  asaas_customer_id?: string;
  asaas_subscription_id?: string;
  asaas_payment_link?: string;
  payment_id?: string;
  payment_status?: string;
  payment_details?: PaymentDetails;
  external_reference?: string;
  installments?: number;
  created_at?: string;
  updated_at?: string;
  contract_accepted?: boolean;
  contract_accepted_at?: string;
}
