import React from "react";
import { Helmet } from "react-helmet-async";

interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string; // ISO 8601 format: PT3M8S for 3 minutes 8 seconds
  contentUrl?: string;
  embedUrl: string;
}

export const VideoSchema: React.FC<VideoSchemaProps> = ({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl
}) => {
  const schemaData: any = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "duration": duration,
    "embedUrl": embedUrl
  };

  if (contentUrl) {
    schemaData.contentUrl = contentUrl;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};
