
import React from "react";
import { Helmet } from "react-helmet-async";


interface Review {
  author: string;
  datePublished?: string;
  reviewBody: string;
  reviewRating: number;
}

interface OrganizationSchemaProps {
  url: string;
  logo: string;
  name?: string;
  description?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  reviews?: Review[];
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
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  reviews?: Review[];
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: {
    name: string;
    url: string;
  };
  url?: string;
  areaServed?: string;
  image?: string;
  brand?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability: string;
    url?: string;
    priceValidUntil?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

interface FAQItemProps {
  question: string;
  answer: string;
  // ... other props
}

interface FAQSchemaProps {
  questions: FAQItemProps[];
}

export const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({
  url,
  logo,
  name = "Crie Valor - Inteligência Organizacional",
  description = "Sistema de Inteligência Organizacional que transforma empresas através de produtos proprietários: MAR, Lumia (6 consultores virtuais), Mentor de Propósito e Oficina de Líderes.",
  aggregateRating,
  reviews
}) => {
  const schemaData: any = {
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
      "https://crievalor.com.br/blog"
    ]
  };

  if (aggregateRating) {
    schemaData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount
    };
  }

  if (reviews && reviews.length > 0) {
    schemaData.review = reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.reviewRating
      },
      "reviewBody": review.reviewBody,
      ...(review.datePublished && { "datePublished": review.datePublished })
    }));
  }

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
  geo,
  aggregateRating,
  reviews
}) => {
  const schemaData: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "image": logo,
    "url": url,
    "telephone": telephone,
    "email": email,
    "priceRange": priceRange,
    "address": {
      "@type": "PostalAddress",
      ...address
    }
  };

  if (geo) {
    schemaData.geo = {
      "@type": "GeoCoordinates",
      "latitude": geo.latitude,
      "longitude": geo.longitude
    };
  }

  if (aggregateRating) {
    schemaData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount
    };
  }

  if (reviews && reviews.length > 0) {
    schemaData.review = reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.reviewRating
      },
      "reviewBody": review.reviewBody,
      ...(review.datePublished && { "datePublished": review.datePublished })
    }));
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
  areaServed,
  image,
  brand,
  offers,
  aggregateRating
}) => {
  const schemaData: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": name,
    "name": name,
    "description": description
  };

  if (provider) {
    schemaData["provider"] = {
      "@type": "Organization",
      "name": provider.name,
      "url": provider.url
    };
  }

  if (url) {
    schemaData["url"] = url;
  }

  if (areaServed) {
    schemaData["areaServed"] = areaServed;
  }

  if (image) {
    schemaData["image"] = image;
  }

  if (brand) {
    schemaData["brand"] = {
      "@type": "Brand",
      "name": brand
    };
  }

  if (offers) {
    schemaData["offers"] = {
      "@type": "Offer",
      ...offers
    };
  }

  if (aggregateRating) {
    schemaData["aggregateRating"] = {
      "@type": "AggregateRating",
      ...aggregateRating
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

// Export ProductSchema, BreadcrumbSchema, and VideoSchema from their files
export { ProductSchema } from "./ProductSchema";
export { BreadcrumbSchema } from "./BreadcrumbSchema";
export { VideoSchema } from "./VideoSchema";
