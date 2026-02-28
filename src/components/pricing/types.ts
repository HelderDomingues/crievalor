
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
  hasTrial?: boolean;
  comingSoon?: boolean;
  customPrice?: boolean;
}
