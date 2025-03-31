
import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const LocationInfoCard: React.FC = () => {
  return (
    <div className="bg-card rounded-xl border border-border p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Nossos Escritórios</h2>
      
      <div className="space-y-8">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Santa Catarina</h3>
            <p className="text-muted-foreground">
              Navegantes, SC<br />
              Brasil
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Mato Grosso do Sul</h3>
            <p className="text-muted-foreground">
              Campo Grande, MS<br />
              Brasil
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Telefone</h3>
            <p className="text-muted-foreground">
              (XX) XXXX-XXXX
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
