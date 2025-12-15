
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Material } from "@/pages/MaterialExclusivo";
import { formatDate } from "@/lib/utils";

interface MaterialCardProps {
  material: Material;
  onAccess: () => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onAccess }) => {


  return (
    <Card className="overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md">
      <div className="h-48 overflow-hidden bg-gray-100">
        {material.thumbnail_url ? (
          <img
            src={material.thumbnail_url}
            alt={`Capa do material: ${material.title}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            width="400"
            height="250"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
            <span className="text-xl font-semibold text-gray-500" aria-label={`Primeira letra do título: ${material.title.charAt(0)}`}>
              {material.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{material.title}</CardTitle>

        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
          {material.description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <div className="flex items-center mr-4">
            <Eye className="mr-1 h-3 w-3" aria-hidden="true" />
            <span>{material.access_count} acessos</span>
          </div>
          <span>Adicionado em {formatDate(material.created_at)}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          className="w-full"
          onClick={onAccess}
          aria-label={`Acessar material: ${material.title}`}
        >
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          Acessar Material
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MaterialCard;
