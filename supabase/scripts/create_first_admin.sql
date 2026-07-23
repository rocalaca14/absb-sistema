-- =============================================================================
-- Script: create_first_admin.sql
-- =============================================================================
-- Objetivo:  Criar o primeiro usuário administrador no ambiente Supabase real.
-- Uso:       Executar no SQL Editor do Supabase Dashboard após aplicar as
--            migrations (0001, 0002, 0003).
-- Segurança: Substitua os placeholders antes de executar. Nunca commite senhas.
-- =============================================================================

-- =============================================================================
-- 1. Criar usuário em auth.users
-- =============================================================================

-- ATENÇÃO: anote o UUID retornado para usar no passo 2.
insert into auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  '__ADMIN_EMAIL__',  -- Substituir: exemplo: admin@absb.org.br
  crypt('__ADMIN_PASSWORD__', gen_salt('bf')),  -- Substituir: senha segura
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"nome":"Administrador Principal"}',
  now(),
  now(),
  'authenticated',
  '',
  '',
  '',
  ''
)
returning id;

-- =============================================================================
-- 2. Promover o perfil para admin
-- =============================================================================

-- Substituir __ADMIN_UUID__ pelo UUID retornado no passo 1.
update public.profiles
set role = 'admin'
where id = '__ADMIN_UUID__';

-- =============================================================================
-- 3. Verificação
-- =============================================================================

select
  u.email,
  p.id,
  p.nome,
  p.role,
  p.ativo,
  u.created_at
from auth.users u
join public.profiles p on p.id = u.id
where u.email = '__ADMIN_EMAIL__';
