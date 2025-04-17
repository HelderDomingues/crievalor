
import { ReactNode } from "react";

export interface DocumentType {
  icon: React.ElementType;
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

// Payment interface definitions
export interface PaymentOptions {
  creditPaymentUrl: string;
  cashPaymentUrl: string;
}

export interface ContactOptions {
  whatsappUrl: string;
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

export interface Plan {
  id: string;
  name: string;
  [key: string]: any;
}

// Add subscription types that were missing
export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  payment_status?: string;
  payment_id?: string;
  external_reference?: string;
  contract_accepted?: boolean;
  contract_accepted_at?: string;
  current_period_end?: string;
  asaas_payment_link?: string;
  installments?: number;
  payment_details?: PaymentDetails;
}

export interface PaymentDetails {
  billingType?: string;
  value?: number;
  dueDate?: string;
  installments?: number;
  totalValue?: number;
  netValue?: number;
  description?: string;
  status?: string;
}

export interface CreateCheckoutOptions {
  planId: string;
  successUrl?: string;
  cancelUrl?: string;
  installments?: number;
  paymentType?: string;
}
