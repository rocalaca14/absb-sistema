-- =============================================================================
-- Migration: 0002_rls_policies
-- =============================================================================
-- Objetivo:        Habilitar Row Level Security (RLS) e criar todas as policies
--                  de acesso baseadas em papéis (admin, tesoureiro, diretor,
--                  visualizador). Claims JWT sincronizadas com profiles.role
--                  via trigger (definido em 0003).
-- Tabelas afetadas: profiles, associados, mensalidades, pagamentos,
--                  importacoes, audit_log, configuracoes
-- Campos novos:     Nenhum
-- Impacto:          Bloqueia acesso anônimo a todas as tabelas. Apenas usuários
--                  autenticados e com o papel correto acessam dados.
-- Reversível:       Não (DROP manual de policies necessário se reversão).
-- =============================================================================

-- Habilitar RLS em todas as tabelas ------------------------------------------

alter table public.profiles enable row level security;
alter table public.associados enable row level security;
alter table public.mensalidades enable row level security;
alter table public.pagamentos enable row level security;
alter table public.importacoes enable row level security;
alter table public.audit_log enable row level security;
alter table public.configuracoes enable row level security;

-- Função utilitária: obter role do JWT ----------------------------------------
-- Lê a claim customizada 'role' injetada em app_metadata via trigger
-- (definido em 0003). Fallback para 'visualizador' se a claim não existir.

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role'),
    'visualizador'
  );
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;

-- =============================================================================
-- PROFILES
-- =============================================================================

-- SELECT: usuário lê o próprio profile; admin lê todos.
drop policy if exists pol_profiles_select on public.profiles;
create policy pol_profiles_select on public.profiles
  for select to authenticated
  using (
    id = auth.uid()
    or public.current_user_role() = 'admin'
  );

-- UPDATE: usuário pode atualizar apenas o próprio nome; admin pode atualizar qualquer um.
drop policy if exists pol_profiles_update on public.profiles;
create policy pol_profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.current_user_role() = 'admin')
  with check (id = auth.uid() or public.current_user_role() = 'admin');

-- INSERT: apenas via trigger (handle_new_user em 0003). Bloqueado por RLS.
-- DELETE: apenas admin.
drop policy if exists pol_profiles_delete on public.profiles;
create policy pol_profiles_delete on public.profiles
  for delete to authenticated
  using (public.current_user_role() = 'admin');

-- =============================================================================
-- ASSOCIADOS
-- =============================================================================

-- SELECT: todos autenticados podem ler.
drop policy if exists pol_associados_select on public.associados;
create policy pol_associados_select on public.associados
  for select to authenticated
  using (true);

-- INSERT: admin ou diretor.
drop policy if exists pol_associados_insert on public.associados;
create policy pol_associados_insert on public.associados
  for insert to authenticated
  with check (public.current_user_role() in ('admin', 'diretor'));

-- UPDATE: admin ou diretor.
drop policy if exists pol_associados_update on public.associados;
create policy pol_associados_update on public.associados
  for update to authenticated
  using (public.current_user_role() in ('admin', 'diretor'))
  with check (public.current_user_role() in ('admin', 'diretor'));

-- DELETE: apenas admin.
drop policy if exists pol_associados_delete on public.associados;
create policy pol_associados_delete on public.associados
  for delete to authenticated
  using (public.current_user_role() = 'admin');

-- =============================================================================
-- MENSALIDADES
-- =============================================================================

-- SELECT: todos autenticados.
drop policy if exists pol_mensalidades_select on public.mensalidades;
create policy pol_mensalidades_select on public.mensalidades
  for select to authenticated
  using (true);

-- INSERT: admin ou tesoureiro.
drop policy if exists pol_mensalidades_insert on public.mensalidades;
create policy pol_mensalidades_insert on public.mensalidades
  for insert to authenticated
  with check (public.current_user_role() in ('admin', 'tesoureiro'));

-- UPDATE: admin ou tesoureiro.
drop policy if exists pol_mensalidades_update on public.mensalidades;
create policy pol_mensalidades_update on public.mensalidades
  for update to authenticated
  using (public.current_user_role() in ('admin', 'tesoureiro'))
  with check (public.current_user_role() in ('admin', 'tesoureiro'));

-- DELETE: apenas admin.
drop policy if exists pol_mensalidades_delete on public.mensalidades;
create policy pol_mensalidades_delete on public.mensalidades
  for delete to authenticated
  using (public.current_user_role() = 'admin');

-- =============================================================================
-- PAGAMENTOS
-- =============================================================================

-- SELECT: todos autenticados.
drop policy if exists pol_pagamentos_select on public.pagamentos;
create policy pol_pagamentos_select on public.pagamentos
  for select to authenticated
  using (true);

-- INSERT: admin ou tesoureiro.
drop policy if exists pol_pagamentos_insert on public.pagamentos;
create policy pol_pagamentos_insert on public.pagamentos
  for insert to authenticated
  with check (public.current_user_role() in ('admin', 'tesoureiro'));

-- UPDATE: admin ou tesoureiro.
drop policy if exists pol_pagamentos_update on public.pagamentos;
create policy pol_pagamentos_update on public.pagamentos
  for update to authenticated
  using (public.current_user_role() in ('admin', 'tesoureiro'))
  with check (public.current_user_role() in ('admin', 'tesoureiro'));

-- DELETE: apenas admin.
drop policy if exists pol_pagamentos_delete on public.pagamentos;
create policy pol_pagamentos_delete on public.pagamentos
  for delete to authenticated
  using (public.current_user_role() = 'admin');

-- =============================================================================
-- IMPORTACOES
-- =============================================================================

-- SELECT: apenas admin.
drop policy if exists pol_importacoes_select on public.importacoes;
create policy pol_importacoes_select on public.importacoes
  for select to authenticated
  using (public.current_user_role() = 'admin');

-- INSERT: apenas admin.
drop policy if exists pol_importacoes_insert on public.importacoes;
create policy pol_importacoes_insert on public.importacoes
  for insert to authenticated
  with check (public.current_user_role() = 'admin');

-- UPDATE: bloqueado (importação é imutável).
-- DELETE: apenas admin (com backup prévio).
drop policy if exists pol_importacoes_delete on public.importacoes;
create policy pol_importacoes_delete on public.importacoes
  for delete to authenticated
  using (public.current_user_role() = 'admin');

-- =============================================================================
-- AUDIT_LOG
-- =============================================================================

-- SELECT: admin ou diretor.
drop policy if exists pol_audit_log_select on public.audit_log;
create policy pol_audit_log_select on public.audit_log
  for select to authenticated
  using (public.current_user_role() in ('admin', 'diretor'));

-- INSERT/UPDATE/DELETE: bloqueados por RLS. Apenas via trigger SECURITY DEFINER.

-- =============================================================================
-- CONFIGURACOES
-- =============================================================================

-- SELECT: todos autenticados.
drop policy if exists pol_configuracoes_select on public.configuracoes;
create policy pol_configuracoes_select on public.configuracoes
  for select to authenticated
  using (true);

-- INSERT/UPDATE/DELETE: apenas admin.
drop policy if exists pol_configuracoes_insert on public.configuracoes;
create policy pol_configuracoes_insert on public.configuracoes
  for insert to authenticated
  with check (public.current_user_role() = 'admin');

drop policy if exists pol_configuracoes_update on public.configuracoes;
create policy pol_configuracoes_update on public.configuracoes
  for update to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists pol_configuracoes_delete on public.configuracoes;
create policy pol_configuracoes_delete on public.configuracoes
  for delete to authenticated
  using (public.current_user_role() = 'admin');

-- =============================================================================
-- Fim da migration 0002
-- =============================================================================
