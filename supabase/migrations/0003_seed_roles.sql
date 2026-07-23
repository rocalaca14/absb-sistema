-- =============================================================================
-- Migration: 0003_seed_roles
-- =============================================================================
-- Objetivo:        Criar triggers de integração com auth.users, função de
--                  auditoria genérica, e trigger de sincronização de role
--                  com a claim JWT (app_metadata.role).
-- Tabelas afetadas: auth.users, public.profiles, public.audit_log
-- Funções criadas:  handle_new_user(), sync_user_role(), audit_trigger()
-- Triggers criados: tg_auth_users_create_profile, tg_profiles_sync_role,
--                  tg_associados_audit, tg_mensalidades_audit,
--                  tg_pagamentos_audit, tg_configuracoes_audit
-- Impacto:          Automação completa de profile, sync de role, e auditoria.
-- Reversível:       Não (DROP manual necessário se reversão for exigida).
-- =============================================================================

-- =============================================================================
-- Função: handle_new_user
-- Cria um profile automaticamente quando um novo usuário é criado em
-- auth.users. SECURITY DEFINER para executar com privilégios do owner.
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome, role, ativo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1)),
    'visualizador',
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists tg_auth_users_create_profile on auth.users;
create trigger tg_auth_users_create_profile
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- Função: sync_user_role
-- Sincroniza o role do profile com a claim app_metadata.role do JWT.
-- Permite policies baseadas em auth.jwt() para performance.
-- =============================================================================

create or replace function public.sync_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  select email into v_email from auth.users where id = new.id;
  update auth.users
    set raw_app_meta_data =
      coalesce(raw_app_meta_data, '{}'::jsonb)
      || jsonb_build_object('role', new.role)
  where id = new.id;
  raise notice 'Role sincronizado para user % (%): %', v_email, new.id, new.role;
  return new;
end;
$$;

drop trigger if exists tg_profiles_sync_role on public.profiles;
create trigger tg_profiles_sync_role
  after insert or update of role on public.profiles
  for each row execute function public.sync_user_role();

-- Trigger adicional em profiles para garantir que novos profiles também
-- sincronizem (caso o handle_new_user seja pulado em algum cenário).
drop trigger if exists tg_profiles_sync_role_after_update on public.profiles;
create trigger tg_profiles_sync_role_after_update
  after update on public.profiles
  for each row
  when (old.role is distinct from new.role)
  execute function public.sync_user_role();

-- =============================================================================
-- Função: audit_trigger
-- Trigger genérico de auditoria. Grava em audit_log em INSERT, UPDATE, DELETE.
-- SECURITY DEFINER para inserir em audit_log mesmo quando RLS bloqueia.
-- =============================================================================

create or replace function public.audit_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_registro_id uuid;
  v_antes jsonb;
  v_depois jsonb;
  v_operacao audit_operacao;
begin
  if (tg_op = 'INSERT') then
    v_operacao := 'insert'::audit_operacao;
    v_registro_id := (to_jsonb(new) ->> 'id')::uuid;
    v_antes := null;
    v_depois := to_jsonb(new);
  elsif (tg_op = 'UPDATE') then
    v_operacao := 'update'::audit_operacao;
    v_registro_id := (to_jsonb(new) ->> 'id')::uuid;
    v_antes := to_jsonb(old);
    v_depois := to_jsonb(new);
  elsif (tg_op = 'DELETE') then
    v_operacao := 'delete'::audit_operacao;
    v_registro_id := (to_jsonb(old) ->> 'id')::uuid;
    v_antes := to_jsonb(old);
    v_depois := null;
  end if;

  insert into public.audit_log (tabela, registro_id, operacao, antes, depois, usuario_id)
  values (tg_table_name, v_registro_id, v_operacao, v_antes, v_depois, auth.uid());

  return coalesce(new, old);
end;
$$;

-- Triggers de auditoria nas tabelas de negócio -------------------------------

drop trigger if exists tg_associados_audit on public.associados;
create trigger tg_associados_audit
  after insert or update or delete on public.associados
  for each row execute function public.audit_trigger();

drop trigger if exists tg_mensalidades_audit on public.mensalidades;
create trigger tg_mensalidades_audit
  after insert or update or delete on public.mensalidades
  for each row execute function public.audit_trigger();

drop trigger if exists tg_pagamentos_audit on public.pagamentos;
create trigger tg_pagamentos_audit
  after insert or update or delete on public.pagamentos
  for each row execute function public.audit_trigger();

drop trigger if exists tg_configuracoes_audit on public.configuracoes;
create trigger tg_configuracoes_audit
  after insert or update or delete on public.configuracoes
  for each row execute function public.audit_trigger();

-- =============================================================================
-- Comentários de documentação
-- =============================================================================

comment on function public.current_user_role() is
  'Retorna o role do usuário atual via JWT app_metadata. Fallback: visualizador.';

comment on function public.handle_new_user() is
  'Cria profile automaticamente em auth.users. SECURITY DEFINER.';

comment on function public.sync_user_role() is
  'Sincroniza profiles.role com auth.users.raw_app_meta_data.role. SECURITY DEFINER.';

comment on function public.audit_trigger() is
  'Trigger genérico de auditoria. Grava em audit_log. SECURITY DEFINER.';

comment on function public.tg_mensalidades_valor_final() is
  'Calcula valor_final = valor - desconto + acrescimo em mensalidades.';

comment on function public.set_updated_at() is
  'Trigger genérico que atualiza updated_at em cada update.';

-- =============================================================================
-- Fim da migration 0003
-- =============================================================================
