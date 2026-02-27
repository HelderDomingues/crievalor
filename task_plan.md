# LUMIA Integração NetCred e Multi-Tenancy

## Goal
Substituir Asaas por NetCred com fluxo de "Free Trial Sem Cartão" de 7 dias, e preparar a base de dados do sistema LUMIA para lidar com Múltiplos Usuários (Workspaces) respeitando estritamente o `ui-ux-pro-max` e `backend-dev-guidelines`.

## Tasks & Phases

### Phase 1: Faxina Legada & Setup Banco de Dados
- [x] Task 1: Remover arquivos `src/lib/asaas.ts`, `src/app/api/asaas/`, e rastros Asaas do Supabase (views, columns `asaas_customer_id`). → Verify: `npm run typegen` no site and `npm run lint` passa sem erros.
- [/] Task 2: Criar migration SQL `workspaces` (id, name, owner_id, plan_level, seat_limit) e `workspace_members`. Aplicar no Website e no SIO_MAR. → Verify: Tabelas existem via DBeaver/Supabase UI e types compilaram.
- [/] Task 3: Modificar migration `subscriptions` adicionando status `trialing`, `trial_ends_at`, e tabela de logs `netcred_payments`. → Verify: Tipos `database.types.ts` são atualizados.

### Phase 2: Netlify Functions & NetCred API
- [ ] Task 4: Criar `netlify/functions/netcredClient.ts` seguindo arquitetura BaseController para comunicar TokenAuth via GraphQL da Netcred. → Verify: Test script loga o token válido.
- [ ] Task 5: Criar `netlify/functions/lumia-checkout.ts` que valida payload Zod (Email, CPF, Senha), cria auth.users em duplo DB, e insere no `workspaces`. → Verify: Endpoint POST returna sucesso de criação no Sandbox.
- [ ] Task 6: Desenvolver `netlify/functions/netcred-webhook.ts` usando biblioteca local `jsonwebtoken` para assinar o segredo, lendo payloads e invocando React Email via Resend. → Verify: Webhook spoof/Postman test printa sucesso de webhook.
- [ ] Task 7: Setup Netlify Scheduled Function (Cron) para marcar subscriptions vencidas após 7 dias (`past_due`). → Verify: Script roda limpo via netlify cli local.

### Phase 3: UI & Bloqueios do Trial
- [ ] Task 8: Criar página `/lumia/cadastrar` garantindo inputs obrigatórios Netcred (Nome, CPF, Tel) e design Tailwind/Shadcn responsivo e inclusivo de acordo c/ `ui-ux-pro-max`. → Verify: Mobile View no Playwright e Tab-indexing estão perfeitos.
- [ ] Task 9: Criar página de Assinatura "Paywall" pós-trial e Modal/Lógica bloqueadora global no `Layout` (checa data de expiração). → Verify: Renderiza se e somente se data atual > `trial_ends_at`.

### Phase 4: Copy, SEO, GEO e Destaques
- [ ] Task 10: Atualizar cópia da HomePage e página do Lumia enfatizando o "Teste grátis 7 dias sem cartão de crédito". → Verify: Home e Lumia pages refletem a nova oferta.
- [ ] Task 11: Atualizar componentes de Pricing/Planos para destacar a oferta de 7 dias grátis. → Verify: Tabela de preços renderiza blocos de 7 dias trial no frontend.
- [ ] Task 12: Realizar auditoria e atualização de SEO/GEO em todo o site (Meta tags, OpenGraph, title tagging per best practices). → Verify: Meta tags analisadas renderizam corretamente em auditoria Lighthouse.
- [ ] Task 13: Limpeza final de imports. Build Geral do front e funções. → Verify: `npm run build` & `npm run lint` finalizam sem warnings ou tipagens any.

## Done When
- [ ] Legado Asaas erradicado sem quebrar rotas.
- [ ] O banco possui tabelas prontas de Empresas/Assentos.
- [ ] O fluxo cria o usuário de Trial em 2 ambientes simultâneamente sem cartões.
- [ ] Funções REST em background batem no Graphql da NetCred limpas e seguras.
- [ ] Front-end renderiza sem falhas visuais.
- [ ] Textos do site, planos e metatags refletem SEO renovado e a isca de 7 dias sem cartão.

## Notes
* **Sempre parar ao final de CADA FASE.**
* Solicitar aprovação com `notify_user` pedindo autorização para prosseguir para a próxima Fase.
* Ao finalizar qualquer código: SEMPRE rodar o lint/typecheck.
