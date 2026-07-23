-- =============================================================================
-- Migration: 0001_init_schema
-- =============================================================================
-- Objetivo:        Criar a estrutura inicial do banco (tabelas, enums, índices,
--                  constraints, triggers de `updated_at`).
-- Tabelas criadas: profiles, associados, mensalidades, pagamentos,
--                  importacoes, audit_log, configuracoes
-- Campos novos:     Ver DATABASE_SPECIFICATION.md seção 8
-- Impacto:          Cria o schema completo da aplicação. Não há DROP.
-- Reversível:       Não (DROP manual necessário se reversão for exigida).
-- =============================================================================

-- Extensões necessárias ------------------------------------------------------

create extension if not exists "pgcrypto";

-- Enums ------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum (
      'admin',
      'tesoureiro',
      'diretor',
      'visualizador'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'forma_pagamento_tipo') then
    create type forma_pagamento_tipo as enum (
      'dinheiro',
      'pix',
      'transferencia',
      'cartao',
      'boleto',
      'outro'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'audit_operacao') then
    create type audit_operacao as enum (
      'insert',
      'update',
      'delete'
    );
  end if;
end$$;

-- Função utilitária: set_updated_at -------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Tabela: profiles -----------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  role user_role not null default 'visualizador',
  ativo boolean not null default true,
  ultimo_acesso_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles (role);

drop trigger if exists tg_profiles_updated_at on public.profiles;
create trigger tg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Tabela: associados ---------------------------------------------------------

create table if not exists public.associados (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf text,
  rg text,
  telefone text,
  email text,
  endereco text,
  numero text,
  complemento text,
  bairro text,
  cidade text,
  uf char(2),
  cep text,
  veiculo_marca text,
  veiculo_modelo text,
  veiculo_ano int,
  veiculo_placa text,
  veiculo_cor text,
  categoria text,
  data_nascimento date,
  data_filiacao date,
  observacoes text,
  ativo boolean not null default true,
  origem text not null default 'importacao',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

-- Unique parcial em cpf (somente quando não nulo)
create unique index if not exists uq_associados_cpf
  on public.associados (cpf) where cpf is not null;

create index if not exists idx_associados_nome on public.associados (nome);
create index if not exists idx_associados_ativo on public.associados (ativo);
create index if not exists idx_associados_veiculo_placa on public.associados (veiculo_placa);
create index if not exists idx_associados_categoria on public.associados (categoria);

-- Constraints
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'ck_associados_uf'
  ) then
    alter table public.associados
      add constraint ck_associados_uf
      check (uf is null or uf in (
        'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
        'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
        'RS','RO','RR','SC','SP','SE','TO'
      ));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'ck_associados_veiculo_ano'
  ) then
    alter table public.associados
      add constraint ck_associados_veiculo_ano
      check (veiculo_ano is null or (veiculo_ano between 1900 and 2100));
  end if;
end$$;

drop trigger if exists tg_associados_updated_at on public.associados;
create trigger tg_associados_updated_at
  before update on public.associados
  for each row execute function public.set_updated_at();

-- Tabela: mensalidades --------------------------------------------------------

create table if not exists public.mensalidades (
  id uuid primary key default gen_random_uuid(),
  associado_id uuid not null references public.associados(id) on delete cascade,
  referencia text not null,
  valor numeric(10,2) not null,
  desconto numeric(10,2) not null default 0,
  acrescimo numeric(10,2) not null default 0,
  valor_final numeric(10,2),
  vencimento_em date not null,
  pago boolean not null default false,
  pago_em timestamptz,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create unique index if not exists uq_mensalidades_associado_referencia
  on public.mensalidades (associado_id, referencia);

create index if not exists idx_mensalidades_associado_id on public.mensalidades (associado_id);
create index if not exists idx_mensalidades_referencia on public.mensalidades (referencia);
create index if not exists idx_mensalidades_pago on public.mensalidades (pago);
create index if not exists idx_mensalidades_vencimento on public.mensalidades (vencimento_em);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ck_mensalidades_referencia') then
    alter table public.mensalidades
      add constraint ck_mensalidades_referencia
      check (referencia ~ '^\d{4}-\d{2}$');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ck_mensalidades_valor') then
    alter table public.mensalidades
      add constraint ck_mensalidades_valor check (valor >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ck_mensalidades_desconto') then
    alter table public.mensalidades
      add constraint ck_mensalidades_desconto check (desconto >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ck_mensalidades_acrescimo') then
    alter table public.mensalidades
      add constraint ck_mensalidades_acrescimo check (acrescimo >= 0);
  end if;
end$$;

-- Trigger: calcular valor_final
create or replace function public.tg_mensalidades_valor_final()
returns trigger
language plpgsql
as $$
begin
  new.valor_final := new.valor - coalesce(new.desconto, 0) + coalesce(new.acrescimo, 0);
  return new;
end;
$$;

drop trigger if exists tg_mensalidades_set_valor_final on public.mensalidades;
create trigger tg_mensalidades_set_valor_final
  before insert or update on public.mensalidades
  for each row execute function public.tg_mensalidades_valor_final();

drop trigger if exists tg_mensalidades_updated_at on public.mensalidades;
create trigger tg_mensalidades_updated_at
  before update on public.mensalidades
  for each row execute function public.set_updated_at();

-- Tabela: pagamentos ---------------------------------------------------------

create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  mensalidade_id uuid not null references public.mensalidades(id) on delete cascade,
  valor_pago numeric(10,2) not null,
  pago_em timestamptz not null default now(),
  forma_pagamento forma_pagamento_tipo not null,
  comprovante_url text,
  observacoes text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_pagamentos_mensalidade_id on public.pagamentos (mensalidade_id);
create index if not exists idx_pagamentos_pago_em on public.pagamentos (pago_em);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ck_pagamentos_valor') then
    alter table public.pagamentos
      add constraint ck_pagamentos_valor check (valor_pago > 0);
  end if;
end$$;

-- Tabela: importacoes --------------------------------------------------------

create table if not exists public.importacoes (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,
  arquivo_origem text not null,
  total_linhas int not null,
  total_inseridos int not null,
  total_atualizados int not null,
  total_erros int not null,
  relatorio_erros jsonb,
  executada_por uuid not null references auth.users(id) on delete set null,
  executada_em timestamptz not null default now()
);

create index if not exists idx_importacoes_executada_em on public.importacoes (executada_em desc);
create index if not exists idx_importacoes_tipo on public.importacoes (tipo);

-- Tabela: audit_log ----------------------------------------------------------

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  tabela text not null,
  registro_id uuid not null,
  operacao audit_operacao not null,
  antes jsonb,
  depois jsonb,
  usuario_id uuid references auth.users(id) on delete set null,
  executada_em timestamptz not null default now()
);

create index if not exists idx_audit_log_tabela on public.audit_log (tabela);
create index if not exists idx_audit_log_registro_id on public.audit_log (registro_id);
create index if not exists idx_audit_log_executada_em on public.audit_log (executada_em desc);

-- Tabela: configuracoes -----------------------------------------------------

create table if not exists public.configuracoes (
  id uuid primary key default gen_random_uuid(),
  chave text not null unique,
  valor jsonb not null,
  descricao text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create unique index if not exists uq_configuracoes_chave on public.configuracoes (chave);

drop trigger if exists tg_configuracoes_updated_at on public.configuracoes;
create trigger tg_configuracoes_updated_at
  before update on public.configuracoes
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Fim da migration 0001
-- =============================================================================
