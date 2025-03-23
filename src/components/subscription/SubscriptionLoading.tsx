
import React from "react";
import { Loader2 } from "lucide-react";

const SubscriptionLoading = () => {
  return (
    <div className="flex-grow py-16 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg">Carregando dados da assinatura...</p>
      </div>
    </div>
  );
};

export default SubscriptionLoading;
