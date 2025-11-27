# System Snapshot - 2025-11-27

Este documento registra o estado atual do sistema "Crie Valor" para fins de backup e referência antes de novas alterações.

## 1. Visão Geral e Tech Stack

*   **Framework Principal:** React (v18)
*   **Build Tool:** Vite
*   **Linguagem:** TypeScript
*   **Estilização:** Tailwind CSS + tailwindcss-animate
*   **Componentes UI:** Radix UI (Shadcn/UI), Lucide React (ícones)
*   **Gerenciamento de Estado:** @tanstack/react-query (Server State), Context API (Auth)
*   **Roteamento:** react-router-dom (v6)
*   **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
*   **Formulários:** react-hook-form + zod
*   **Outras Dependências:** framer-motion (animações), recharts (gráficos), sonner (toasts), react-helmet-async (SEO).

## 2. Estrutura de Diretórios (`src/`)

*   **`pages/`**: Contém as visualizações da aplicação.
    *   *Públicas*: Index, Sobre, Contato, Projetos, Mar, Mentorias, Palestra.
    *   *Admin*: Dashboard, PortfolioAdmin, AdminMaterials, ClientLogosAdminPage, TestimonialsAdmin, EventLeadsAdmin, LecturesAdmin.
    *   *Legal*: PrivacyPolicy, RefundPolicy, TermsOfService.
    *   *Auth/User*: Auth, Profile, Subscription, Checkout.
*   **`routes/`**: Configuração de rotas em `index.tsx`.
*   **`components/`**: Componentes reutilizáveis (UI, Layout, Features).
*   **`integrations/supabase/`**: Cliente Supabase (`client.ts`) e tipagem gerada (`types.ts`).
*   **`services/`**: Lógica de negócios e chamadas de API.
*   **`context/`**: Provedores globais (AuthContext, AnalyticsProvider).
*   **`hooks/`**: Hooks customizados.

## 3. Mapeamento de Rotas

As rotas estão definidas em `src/routes/index.tsx`:

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Index | Home Page |
| `/mar` | Mar | Método MAR |
| `/sobre` | Sobre | Sobre a empresa |
| `/contato` | Contato | Página de contato |
| `/projetos` | Projetos | Portfólio de projetos |
| `/oficina-de-lideres` | OficinaLideres | Landing page Oficina |
| `/mentorias` | Mentorias | Landing page Mentorias |
| `/palestra` | Palestra | Landing page Palestras |
| `/subscription` | Subscription | Planos de assinatura |
| `/checkout` | Checkout | Checkout de pagamento |
| `/auth` | Auth | Login/Cadastro |
| `/profile` | Profile | Perfil do usuário |
| `/admin-dashboard` | AdminDashboard | Painel principal Admin |
| `/admin-setup` | AdminSetup | Configuração inicial |
| `/admin-portfolio` | PortfolioAdmin | Gestão de portfólio |
| `/admin-materials` | AdminMaterialsPage | Gestão de materiais |
| `/admin-logos` | ClientLogosAdminPage | Gestão de logos de clientes |
| `/admin-testimonials` | TestimonialsAdmin | Gestão de depoimentos |
| `/admin-lectures` | LecturesAdmin | Gestão de palestras |
| `/admin-event-leads` | EventLeadsAdmin | Gestão de leads de eventos |

## 4. Estrutura do Banco de Dados (Supabase)

O banco de dados possui 26 tabelas no esquema `public`.

### Domínios Principais

#### Usuários e Acesso
*   `profiles`: Dados estendidos de usuários.
*   `user_roles`: Controle de permissões.
*   `subscriptions`: Assinaturas e planos.

#### Conteúdo
*   `materials`: Materiais educativos.
*   `material_accesses`: Logs de acesso a materiais.
*   `authors`: Autores.
*   `client_logos`: Logos de parceiros/clientes.
*   `testimonials`: Depoimentos.
*   `image_placeholders`: Imagens padrão do sistema.
*   `onboarding_content`: Conteúdo de boas-vindas.

#### Quiz e Avaliação
*   `quiz_modules`: Módulos.
*   `quiz_questions`: Perguntas.
*   `quiz_options`: Opções.
*   `quiz_answers`: Respostas corretas.
*   `quiz_submissions`: Submissões de usuários.
*   `quiz_submission_details`: Detalhes das respostas.

#### CRM e Eventos
*   `lectures`: Palestras.
*   `event_leads`: Leads capturados em palestras.
*   `leads`: Leads gerais.
*   `diagnostic_requests`: Pedidos de diagnóstico.

#### Comunicação
*   `whatsapp_conversations`: Conversas.
*   `whatsapp_messages`: Mensagens.

#### Sistema
*   `system_settings`: Configurações globais.

## 5. Status de Migrações

Últimas migrações aplicadas (até 27/11/2025):
*   ...
*   20251104034308 (Mais recente)

## 6. Scripts Disponíveis

*   `dev`: Inicia servidor de desenvolvimento.
*   `build`: Build de produção.
*   `lint`: Executa verificação de código.
*   `preview`: Visualiza build de produção.
