import React from "react";
import { Helmet } from "react-helmet-async";

interface ProductSchemaProps {
  name: string;
  description: string;
  image?: string;
  brand: string;
  offers: {
    price: string;
    priceCurrency: string;
    availability?: string;
    url?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  isDigital?: boolean;
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({
  name,
  description,
  image,
  brand,
  offers,
  aggregateRating,
  isDigital = false
}) => {
  const schemaData: any = {
    "@context": "https://schema.org",
    "@type": isDigital ? "Service" : "Product",
    "name": name,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "offers": {
      "@type": "Offer",
      "price": offers.price,
      "priceCurrency": offers.priceCurrency,
      "availability": offers.availability || "https://schema.org/InStock",
      "url": offers.url
    }
  };

  // For services (digital products), add service-specific properties
  if (isDigital) {
    // deliveryMethod is not well-supported for Service Offers in Google Rich Results
    // Instead, we use specific Service properties
    schemaData.serviceType = "Digital Strategy Consulting";
    // serviceOutput describes the tangible result (e.g. the digital file/roadmap)
    schemaData.serviceOutput = {
      "@type": "Thing",
      "name": "Digital Strategic Roadmap"
    };
    schemaData.category = "Business Consulting";
  }

  if (image) {
    schemaData.image = image;
  }

  if (aggregateRating) {
    schemaData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount
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
