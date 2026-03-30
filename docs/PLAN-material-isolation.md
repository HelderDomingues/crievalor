# PLAN-material-isolation.md

## Objetivo

Implementar o isolamento de pastas e materiais por produto (Oficina de Líderes,
Lumia, Mentorias, etc.) para garantir que os usuários vejam apenas o conteúdo
correspondente ao seu nível de acesso/assinatura.

## 🛑 Socratic Gate (Fase 0)

Antes de prosseguir com a implementação, precisamos de clareza sobre os
seguintes pontos:

1. **Quais são os produtos exatos?** Além de `lumia`, `oficina_lideres` e
   `mentorias`, teremos outros? O tipo `geral` continuará existindo para o que
   todos podem ver?
2. **Regra de Acesso para Mentorias:** Como o sistema identifica quem tem acesso
   às mentorias? É por um plano específico (ex: `plan_id = 'mentoria'`) ou
   através daquela tabela `user_products`?
3. **Pastas Compartilhadas:** Uma pasta (ou material) pode pertencer a mais de
   um produto ao mesmo tempo, ou cada item é restrito a apenas um?
4. **Visibilidade Geral:** O conteúdo `geral` deve ser visível para qualquer
   usuário logado ou apenas para quem tem pelo menos uma assinatura ativa?

## Mudanças Propostas

### 1. Banco de Dados (Supabase)

- **Migração de Schema**: Atualizar a restrição `CHECK` nas tabelas `materials`
  e `material_folders` para incluir novos tipos de produtos.
- **Função de Segurança**: Atualizar `public.get_user_accessible_products()`
  para mapear corretamente as assinaturas e produtos do usuário para os tipos de
  material.
- **Políticas RLS**: Refinar as políticas existentes para garantir que `SELECT`
  seja restrito pelo `product_type`.

### 2. Painel Administrativo (Frontend)

- **MaterialForm.tsx**: Adicionar um campo de seleção (`Select`) para definir o
  `productType` do material.
- **FolderTreeManager / useMaterialFolders**: Garantir que ao criar ou editar
  pastas, o `product_type` seja respeitado e propagado.

### 3. Área de Membros (Frontend)

- **MaterialExclusivo.tsx**: Adaptar a listagem para filtrar materiais de acordo
  com o produto ativo no contexto atual (ex: se o usuário está na área da
  Oficina de Líderes, ele vê apenas materiais de `oficina_lideres` ou `geral`).

## Plano de Verificação

- [x] Testar criação de material com cada tipo de produto como Admin.
- [ ] Testar acesso com usuário que tem assinatura Lumia (não deve ver Oficina
      de Líderes).
- [ ] Testar acesso com usuário que tem assinatura Oficina de Líderes (não deve
      ver Lumia).
- [ ] Testar acesso com usuário "Geral" / Sem assinatura.
