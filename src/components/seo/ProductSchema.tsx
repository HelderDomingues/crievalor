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
    "@type": isDigital ? "DigitalProduct" : "Product",
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

  // For digital products, add delivery method
  if (isDigital) {
    schemaData.offers.deliveryMethod = "https://schema.org/OnlineOnly";
    schemaData.category = "Digital Service";
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
