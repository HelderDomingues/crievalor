
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
  const getPlanBadgeColor = (planLevel: string) => {
    switch (planLevel) {
      case "basic_plan":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "pro_plan":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "enterprise_plan":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPlanName = (planLevel: string) => {
    switch (planLevel) {
      case "basic_plan":
        return "Básico";
      case "pro_plan":
        return "Profissional";
      case "enterprise_plan":
        return "Empresarial";
      default:
        return "Todos";
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md">
      <div className="h-48 overflow-hidden bg-gray-100">
        {material.thumbnail_url ? (
          <img 
            src={material.thumbnail_url} 
            alt={material.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
            <span className="text-xl font-semibold text-gray-500">{material.title.charAt(0)}</span>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{material.title}</CardTitle>
          <Badge variant="outline" className={getPlanBadgeColor(material.plan_level)}>
            {getPlanName(material.plan_level)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
          {material.description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <div className="flex items-center mr-4">
            <Eye className="mr-1 h-3 w-3" />
            <span>{material.access_count} acessos</span>
          </div>
          <span>Adicionado em {formatDate(material.created_at)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          className="w-full" 
          onClick={onAccess}
        >
          <Download className="mr-2 h-4 w-4" />
          Acessar Material
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MaterialCard;
