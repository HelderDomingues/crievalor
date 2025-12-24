# Crie Valor - Inteligência Organizacional

## Sobre o Projeto
Este é o repositório oficial da plataforma web Crie Valor, desenvolvido em React com Vite, TypeScript, Tailwind CSS e Shadcn/UI.

A plataforma oferece soluções de planejamento estratégico com IA (MAR), consultores virtuais (Lumia) e jornadas de propósito (Mentor de Propósito) para empresas que buscam profissionalização e crescimento.

## Tecnologias

- **Frontend**: React 18, Vite
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS, Shadcn/UI
- **Backend/Db**: Supabase (PostgreSQL, Edge Functions, Auth)
- **Status Management**: React Query

## Estrutura do Projeto

- `/src`
  - `/components`: Componentes reutilizáveis (UI, Header, Footer, etc)
  - `/pages`: Rotas da aplicação (Home, MAR, Blog, Admin)
  - `/hooks`: Hooks customizados (useProfile, useAuth)
  - `/services`: Serviços de integração (Supabase, API)
  - `/integrations`: Configurações de terceiros (Supabase client)
- `/public`: Assets estáticos e imagens

## Como Rodar Localmente

1. Clone o repositório
```sh
git clone <url-do-repo>
```

2. Instale as dependências
```sh
npm install
```

3. Inicie o servidor de desenvolvimento
```sh
npm run dev
```

## Deploy
O projeto está configurado para deploy via Netlify/Vercel integrado ao GitHub.

## Autores
- Helder Domingues
- Crie Valor Team
