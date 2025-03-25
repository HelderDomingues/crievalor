
-- Rename Stripe columns to Asaas names
ALTER TABLE public.subscriptions 
RENAME COLUMN stripe_customer_id TO asaas_customer_id;

ALTER TABLE public.subscriptions 
RENAME COLUMN stripe_subscription_id TO asaas_subscription_id;

-- Add necessary columns for Asaas integration
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS asaas_payment_link text;

ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS installments integer DEFAULT 1;
