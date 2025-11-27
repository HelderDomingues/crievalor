# Plano de Implementação: Nova Estrutura de Preços

Este plano detalha a criação de uma página dedicada de preços e a reestruturação das ofertas do site "Crie Valor", centralizando todas as informações de investimento.

## Objetivo
Centralizar a estrutura de preços em uma nova página `/planos` (ou `/precos`), implementar a nova arquitetura de ofertas (Produtos Individuais e Combos) e remover componentes de preço dispersos nas páginas individuais.

## User Review Required
> [!IMPORTANT]
> A página `Mar.tsx` terá sua seção de preços removida. Ela passará a ter um CTA direcionando para a nova página de preços.
> A página `OficinaLideres.tsx` terá o texto de investimento atualizado ou removido em favor de um link para a página centralizada.

## Proposed Changes

### 1. Estrutura de Dados (`src/components/pricing/pricingData.ts`)
Atualizar a estrutura de dados para suportar a nova arquitetura de ofertas.
#### [MODIFY] [pricingData.ts](file:///Users/helderdomingues/Documents/GitHub/crievalor/src/components/pricing/pricingData.ts)
- Criar interfaces para `Product` e `Combo`.
- Exportar constantes `individualProducts` e `combos` com os dados fornecidos (MAR, LUMIA, Mentor de Propósito, etc.).

### 2. Novos Componentes de UI (`src/components/pricing/`)
Criar componentes visuais para exibir os produtos e combos.
#### [NEW] [ProductCard.tsx](file:///Users/helderdomingues/Documents/GitHub/crievalor/src/components/pricing/ProductCard.tsx)
- Card para exibir produtos individuais.
#### [NEW] [ComboCard.tsx](file:///Users/helderdomingues/Documents/GitHub/crievalor/src/components/pricing/ComboCard.tsx)
- Card com destaque visual para os combos (Essencial, Avançado, Transformação).
- Suporte para exibir "De/Por", economia e bônus.

### 3. Nova Página de Preços (`src/pages/Pricing.tsx`)
Criar a página dedicada que listará todas as ofertas.
#### [NEW] [Pricing.tsx](file:///Users/helderdomingues/Documents/GitHub/crievalor/src/pages/Pricing.tsx)
- Layout com Header e Footer.
- Seção de destaque para os **Combos** (prioritários).
- Seção secundária para **Produtos Individuais**.
- Design alinhado com a identidade visual (Aurora Background, Glassmorphism).

### 4. Roteamento (`src/routes/index.tsx`)
Adicionar a nova rota.
#### [MODIFY] [index.tsx](file:///Users/helderdomingues/Documents/GitHub/crievalor/src/routes/index.tsx)
- Adicionar rota `/planos` apontando para `Pricing.tsx`.

### 5. Limpeza e Integração (`src/pages/`)
Remover preços das páginas individuais e adicionar links para a página de preços.
#### [MODIFY] [Mar.tsx](file:///Users/helderdomingues/Documents/GitHub/crievalor/src/pages/Mar.tsx)
- Remover `<PricingSection />`.
- Adicionar CTA "Ver Planos e Preços" que leva para `/planos`.
#### [MODIFY] [OficinaLideres.tsx](file:///Users/helderdomingues/Documents/GitHub/crievalor/src/pages/OficinaLideres.tsx)
- Atualizar seção de investimento para direcionar para a página de preços.

## Verification Plan

### Automated Tests
- Build check (`npm run build`) para garantir que não há erros de tipagem ou importação.

### Manual Verification
- Acessar `/planos` e verificar se todos os combos e produtos estão listados corretamente com os preços novos.
- Verificar se a página `Mar` não exibe mais a seção de preços antiga.
- Verificar responsividade dos novos cards.
