
import React from "react";
import { Helmet } from "react-helmet-async";

interface OrganizationSchemaProps {
  url: string;
  logo: string;
  name?: string;
  description?: string;
}

interface LocalBusinessSchemaProps {
  name: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  email?: string;
  url: string;
  logo?: string;
  priceRange?: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  url: string;
  areaServed?: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  questions: FAQItemProps[];
}

export const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({ 
  url, 
  logo, 
  name = "Crie Valor - Inteligência Organizacional",
  description = "Sistema de Inteligência Organizacional que transforma empresas através de produtos proprietários: MAR, Lumia (6 consultores virtuais), Mentor de Propósito e Oficina de Líderes."
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "description": description,
    "sameAs": [
      "https://www.facebook.com/crievalorestrategia",
      "https://www.instagram.com/crievalorestrategia/",
      "https://www.linkedin.com/company/crievalor/",
      "https://blog.crievalor.com.br"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({
  name,
  address,
  telephone,
  email,
  url,
  logo,
  priceRange,
  geo
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "addressRegion": address.addressRegion,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    "telephone": telephone,
    "email": email,
    "url": url,
    "logo": logo,
    "priceRange": priceRange
  };

  if (geo) {
    schemaData["geo"] = {
      "@type": "GeoCoordinates",
      "latitude": geo.latitude,
      "longitude": geo.longitude
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export const ServiceSchema: React.FC<ServiceSchemaProps> = ({
  name,
  description,
  provider,
  url,
  areaServed
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": provider.name,
      "url": provider.url
    },
    "url": url
  };

  if (areaServed) {
    schemaData["areaServed"] = areaServed;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export const FAQSchema: React.FC<FAQSchemaProps> = ({ questions }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map((q) => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};
