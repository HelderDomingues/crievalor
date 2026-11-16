# Goal: restaurar main (portfólio), publicar /portfolio (v3 estrutural) + P1 da auditoria

## Objetivo
1. Reparar origin/main: os commits de hardening foram feitos sobre 1ac73e7 e empurrados, perdendo os PRs do portfólio (fcd6285..93817a4). Branch fix/restore-main-portfolio = 93817a4 + cherry-picks (eeb11cc, 123dbb4) com types.ts regenerado do banco live.
2. Implementar v3 estrutural: rota pública /portfolio (galeria real do Supabase), canonical/og, menu, sitemap/robots/llms/noscript, fix WhatsApp Header (wa.me/5567996542991), workaround descrição duplicada.
3. P1: NotFound pt-BR+noindex; sitemap (remover noindexadas + /llms.txt; adicionar 14 posts); /lumia Helmet.
4. Push único no fim → deploy Netlify → verificação em produção.

## Fora de escopo (aguardam decisão/inputs do Helder)
FAQ+FAQPage do /portfolio e copy do v3 (Doc 401 — não inventar); /mar, /projetos-1, CTA /material-exclusivo, aggregateRating, blog subdomínio, prerender, ServicesSection, imagens pesadas.

## Não pode quebrar
/admin-portfolio (persistência), leitura pública do portfólio, rotas existentes, robots intencionais, GTM.

## Aceite
typecheck 0 erros; build exit 0 antes de cada commit; produção com /portfolio 200 + gallery do banco; commits 1-por-item.
