
import React from 'react';
import { Check, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const ComparisonRow = ({
    feature,
    traditional,
    bi,
    lumia,
    isLast
}: {
    feature: string;
    traditional: string | boolean;
    bi: string | boolean;
    lumia: string | boolean;
    isLast?: boolean
}) => {
    const renderValue = (val: string | boolean, highlight?: boolean) => {
        if (typeof val === 'boolean') {
            return val ? (
                <div className="flex justify-center">
                    <Check className={cn("w-5 h-5", highlight ? "text-violet-400" : "text-slate-500")} />
                </div>
            ) : (
                <div className="flex justify-center">
                    <X className="w-5 h-5 text-slate-700" />
                </div>
            );
        }
        return (
            <span className={cn(
                "text-sm font-medium",
                highlight ? "text-violet-200" : "text-slate-400"
            )}>
                {val}
            </span>
        );
    };

    return (
        <div className={cn(
            "grid grid-cols-4 py-6 border-b border-white/5 items-center",
            isLast && "border-0"
        )}>
            <div className="text-sm font-medium text-slate-300 pr-4">
                {feature}
            </div>
            <div className="text-center px-2">
                {renderValue(traditional)}
            </div>
            <div className="text-center px-2">
                {renderValue(bi)}
            </div>
            <div className="text-center px-2 bg-violet-500/5 rounded-lg py-2">
                {renderValue(lumia, true)}
            </div>
        </div>
    );
};

export const LumiaComparison = () => {
    return (
        <section className="py-24 bg-[#010816] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Por que o Ecossistema LUMIA?
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Comparação direta entre os modelos tradicionais e a nova era da Inteligência Estratégica.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="grid grid-cols-4 pb-8 border-b border-white/10 items-end">
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                            Critério
                        </div>
                        <div className="text-center px-2">
                            <div className="text-slate-300 font-bold mb-1">Consultoria Tradicional</div>
                            <div className="text-[10px] text-slate-500 uppercase">O Modelo Antigo</div>
                        </div>
                        <div className="text-center px-2">
                            <div className="text-slate-300 font-bold mb-1">Softwares de BI</div>
                            <div className="text-[10px] text-slate-500 uppercase">Apenas Dados</div>
                        </div>
                        <div className="text-center px-2">
                            <div className="text-violet-400 font-bold mb-1">Ecossistema LUMIA</div>
                            <div className="text-[10px] text-violet-500 uppercase font-bold">O Futuro</div>
                        </div>
                    </div>

                    {/* Rows */}
                    <ComparisonRow
                        feature="Investimento"
                        traditional="R$ 15k - 50k /mês"
                        bi="R$ 500 - 5k /mês"
                        lumia="Fração do Custo"
                    />
                    <ComparisonRow
                        feature="Tempo de Entrega"
                        traditional="30 - 90 dias"
                        bi="Instantâneo (Setup manual)"
                        lumia="Imediato (Plug & Play)"
                    />
                    <ComparisonRow
                        feature="Disponibilidade"
                        traditional="Horário Comercial"
                        bi="24/7 (Autônomo)"
                        lumia="24/7 (Sempre Ativo)"
                    />
                    <ComparisonRow
                        feature="Ação Direta (Respostas)"
                        traditional={true}
                        bi={false}
                        lumia={true}
                    />
                    <ComparisonRow
                        feature="Raciocínio Estratégico"
                        traditional={true}
                        bi={false}
                        lumia={true}
                    />
                    <ComparisonRow
                        feature="Escalabilidade"
                        traditional="Baixa (Depende de pessoas)"
                        bi="Média (Depende de analistas)"
                        lumia="Total (Sem limites)"
                        isLast={true}
                    />

                    <div className="mt-12 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-violet-400 shrink-0 mt-1" />
                        <p className="text-sm text-slate-400 leading-relaxed">
                            <strong>Nota técnica:</strong> Enquanto softwares de BI exigem que você domine a interpretação de gráficos, o LUMIA utiliza modelos de raciocínio (Reasoning Models) para ler o contexto do seu negócio e sugerir as próximas ações, reduzindo a carga cognitiva do decisor.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
