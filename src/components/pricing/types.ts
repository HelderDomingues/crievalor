
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
  description: string;
  features: string[];
  documents?: DocumentType[];
  cta: string;
  ctaUrl: string;
  popular?: boolean;
  comingSoon?: boolean;
}
