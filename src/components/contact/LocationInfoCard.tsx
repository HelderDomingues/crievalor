
import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LocationInfoCard: React.FC = () => {
  const handleOpenMap = (location: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  return (
    <div className="bg-card rounded-xl border border-border p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Nossos Escritórios</h2>
      
      <div className="space-y-8">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-1">Santa Catarina</h3>
            <p className="text-muted-foreground mb-3">
              Rua Senador Carlos Gomes de Oliveira, 214<br />
              Meia Praia, Navegantes/SC<br />
              Brasil
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => handleOpenMap("Rua Senador Carlos Gomes de Oliveira, 214, Meia Praia, Navegantes, SC, Brasil")}
            >
              <MapPin className="h-4 w-4" />
              Ver no mapa
            </Button>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-1">Mato Grosso do Sul</h3>
            <p className="text-muted-foreground mb-3">
              Rua Roque Tertuliano de Andrade, 836<br />
              Vila Morumbi, Campo Grande/MS<br />
              Brasil
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => handleOpenMap("Rua Roque Tertuliano de Andrade, 836, Vila Morumbi, Campo Grande, MS, Brasil")}
            >
              <MapPin className="h-4 w-4" />
              Ver no mapa
            </Button>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Telefone</h3>
            <p className="text-muted-foreground">
              (47) 99215-0289 (SC)<br />
              (67) 99654-2991 (MS)
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Email</h3>
            <p className="text-muted-foreground">
              contato@crievalor.com.br
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Horário de Atendimento</h3>
            <p className="text-muted-foreground">
              Segunda a Sexta: 9h às 18h<br />
              Sábado e Domingo: Fechado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
