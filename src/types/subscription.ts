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

// Adicione estas novas interfaces no arquivo existente
interface PaymentOptions {
  creditPaymentUrl: string;
  cashPaymentUrl: string;
}

interface ContactOptions {
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
