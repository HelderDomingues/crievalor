import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface GoogleTagManagerProps {
  gtmId: string;
}

export const GoogleTagManager: React.FC<GoogleTagManagerProps> = ({ gtmId }) => {
  const location = useLocation();

  useEffect(() => {
    // Push page view to dataLayer on route change
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: {
          path: location.pathname,
          search: location.search,
          url: window.location.href,
          title: document.title,
        },
      });
    }
  }, [location]);

  return (
    <>
      <Helmet>
        {/* Google Tag Manager - Head */}
        <script>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </script>
      </Helmet>

      {/* Google Tag Manager - Body (noscript fallback) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
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
