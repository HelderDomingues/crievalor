
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Subscription } from "@/services/subscriptionService";

interface ContractDetailsProps {
  subscription: Subscription;
  contractAccepted: boolean;
  setContractAccepted: (checked: boolean) => void;
  handleAcceptContract: () => Promise<void>;
  isUpdatingContract: boolean;
}

const ContractDetails = ({
  subscription,
  contractAccepted,
  setContractAccepted,
  handleAcceptContract,
  isUpdatingContract
}: ContractDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrato de Serviço</CardTitle>
        <CardDescription>Termos e condições do serviço contratado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {subscription.contract_accepted ? (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Contrato Aceito</AlertTitle>
            <AlertDescription>
              Você aceitou os termos do contrato em {subscription.contract_accepted_at ? formatDate(subscription.contract_accepted_at) : "N/A"}.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
              <h3 className="font-bold text-lg mb-2">Contrato de Prestação de Serviços</h3>
              
              <p className="mb-2">Por este instrumento particular, a empresa CrieValor, inscrita no CNPJ sob o nº XX.XXX.XXX/0001-XX, com sede à Rua XXXXX, nº XXX, Bairro XXXXX, Cidade XXXXX, Estado XXXXX, doravante denominada CONTRATADA, e CONTRATANTE, conforme cadastro realizado na plataforma, celebram o presente contrato mediante as seguintes cláusulas e condições:</p>
              
              <h4 className="font-semibold mt-4 mb-1">CLÁUSULA PRIMEIRA - DO OBJETO</h4>
              <p>O presente contrato tem como objeto a prestação de serviços conforme o plano contratado pelo CONTRATANTE através da plataforma online da CONTRATADA.</p>
              
              <h4 className="font-semibold mt-4 mb-1">CLÁUSULA SEGUNDA - DO PRAZO</h4>
              <p>O presente contrato vigorará pelo prazo determinado de acordo com o ciclo de cobrança do plano escolhido pelo CONTRATANTE, sendo renovado automaticamente por iguais períodos, salvo manifestação contrária de qualquer das partes.</p>
              
              <h4 className="font-semibold mt-4 mb-1">CLÁUSULA TERCEIRA - DO PREÇO E PAGAMENTO</h4>
              <p>Pelos serviços objeto deste contrato, o CONTRATANTE pagará à CONTRATADA o valor correspondente ao plano escolhido, conforme as opções disponíveis na plataforma no momento da contratação. O pagamento será realizado de forma recorrente através dos meios de pagamento disponibilizados pela plataforma.</p>
              
              <h4 className="font-semibold mt-4 mb-1">CLÁUSULA QUARTA - DAS OBRIGAÇÕES DAS PARTES</h4>
              <p>São obrigações da CONTRATADA:</p>
              <ul className="list-disc pl-5 mb-2">
                <li>Prestar os serviços conforme detalhado na descrição do plano contratado;</li>
                <li>Manter o sigilo e a confidencialidade de todas as informações recebidas;</li>
                <li>Disponibilizar suporte técnico conforme previsto no plano contratado.</li>
              </ul>
              
              <p>São obrigações do CONTRATANTE:</p>
              <ul className="list-disc pl-5 mb-2">
                <li>Pagar pontualmente o valor correspondente ao plano escolhido;</li>
                <li>Utilizar os serviços contratados de acordo com a legislação vigente e nos termos deste contrato;</li>
                <li>Fornecer informações verdadeiras durante o cadastro e toda a relação contratual.</li>
              </ul>
              
              <h4 className="font-semibold mt-4 mb-1">CLÁUSULA QUINTA - DA RESCISÃO</h4>
              <p>O presente contrato poderá ser rescindido por qualquer das partes, a qualquer tempo, mediante comunicação por escrito com antecedência mínima de 30 (trinta) dias, respeitando-se os serviços em andamento.</p>
              
              <h4 className="font-semibold mt-4 mb-1">CLÁUSULA SEXTA - DAS DISPOSIÇÕES GERAIS</h4>
              <p>As partes elegem o foro da Comarca de São Paulo, Estado de São Paulo, para dirimir quaisquer dúvidas ou controvérsias oriundas do presente contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>
              
              <p className="mt-4">E, por estarem assim justas e contratadas, as partes firmam o presente instrumento em meio eletrônico, mediante aceite do CONTRATANTE na plataforma.</p>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox 
                id="contract-acceptance" 
                checked={contractAccepted}
                onCheckedChange={(checked) => setContractAccepted(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="contract-acceptance">
                  Declaro que li e aceito os termos e condições do contrato de prestação de serviços
                </Label>
              </div>
            </div>

            <Button 
              onClick={handleAcceptContract}
              disabled={!contractAccepted || isUpdatingContract}
              className="w-full sm:w-auto"
            >
              {isUpdatingContract ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Aceitar Contrato"
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractDetails;
