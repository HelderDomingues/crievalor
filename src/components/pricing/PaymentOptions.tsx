
import React from "react";
import { BadgePercent, Calendar, CreditCard } from "lucide-react";

const PaymentOptions = () => {
  return (
    <div className="mt-12 bg-card border border-border rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">Opções de Pagamento</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary/10 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <BadgePercent className="text-green-500 h-6 w-6 mr-2" />
            <h4 className="font-semibold">Pagamento à vista</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Ganhe 10% de desconto pagando o valor integral em uma única parcela.
          </p>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-1" />
              <span>Cartão de crédito</span>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 14.25h18M3 18.75h13.5M3 9.75h18M7.5 5.25h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Boleto bancário</span>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 10l8 3 8-3-8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 22l8-4 8 4M4 16l8-4 8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>PIX</span>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/10 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <Calendar className="text-primary h-6 w-6 mr-2" />
            <h4 className="font-semibold">Parcelamento</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Divida o valor em até 12x mensais no cartão de crédito.
          </p>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-1" />
              <span>Visa, Mastercard, Elo, Amex</span>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M15 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Sem juros em até 12x</span>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>Aprovação instantânea</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Tem perguntas sobre os planos ou formas de pagamento?
          <a href="#contato" className="text-primary hover:text-primary/80 ml-1">
            Entre em contato com nossa equipe
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentOptions;
