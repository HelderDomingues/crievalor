import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// This component is now responsible only for tracking route changes
// The GTM script itself is loaded via index.html or CookieConsent
export const GoogleTagManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'virtual_page_view',
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
};

// Utility functions for GTM data layer
export const pushToDataLayer = (data: Record<string, any>) => {
  if (window.dataLayer) {
    window.dataLayer.push(data);
  }
};

// Track custom events
export const trackGTMEvent = (
  eventName: string,
  eventData?: Record<string, any>
) => {
  pushToDataLayer({
    event: eventName,
    ...eventData,
  });
};

// E-commerce tracking
export const trackPurchase = (transaction: {
  transactionId: string;
  affiliation?: string;
  value: number;
  currency?: string;
  tax?: number;
  shipping?: number;
  items: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>;
}) => {
  pushToDataLayer({
    event: 'purchase',
    ecommerce: {
      transaction_id: transaction.transactionId,
      affiliation: transaction.affiliation || 'Crie Valor',
      value: transaction.value,
      currency: transaction.currency || 'BRL',
      tax: transaction.tax || 0,
      shipping: transaction.shipping || 0,
      items: transaction.items,
    },
  });
};

// Lead tracking
export const trackLead = (leadData: {
  form_name: string;
  lead_type?: string;
  value?: number;
}) => {
  pushToDataLayer({
    event: 'generate_lead',
    form_name: leadData.form_name,
    lead_type: leadData.lead_type || 'contact',
    value: leadData.value || 0,
  });
};

// User properties
export const setUserProperties = (userProperties: Record<string, any>) => {
  pushToDataLayer({
    event: 'set_user_properties',
    user_properties: userProperties,
  });
};

// TypeScript declaration
declare global {
  interface Window {
    dataLayer?: any[];
  }
}
