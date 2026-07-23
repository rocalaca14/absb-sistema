# Supabase — Projeto ABSB

Este diretório contém as **migrations SQL** e instruções para configuração do banco de dados Supabase do projeto.

## Estrutura

```
supabase/
├── migrations/
│   ├── 0001_init_schema.sql    # Tabelas, enums, índices, constraints, triggers de updated_at
│   ├── 0002_rls_policies.sql  # Row Level Security e policies por papel
│   └── 0003_seed_roles.sql    # Triggers de profile, sync de role, e auditoria
└── README.md                  # Este arquivo
```

## Como Aplicar as Migrations

### Pré-requisitos

1. **Conta no Supabase** com um projeto criado.
2. **Supabase CLI** instalado. Instruções: <https://supabase.com/docs/guides/cli>

### Aplicação via Supabase CLI (recomendado)

```bash
# 1. Login
supabase login

# 2. Linkar ao projeto
supabase link --project-ref <PROJECT_REF>

# 3. Aplicar migrations
supabase db push

# 4. Verificar status
supabase db diff
```

### Aplicação Manual (via SQL Editor do Dashboard)

1. Acesse o **Dashboard do Supabase** do projeto.
2. Navegue até **SQL Editor**.
3. Abra cada arquivo de migration em ordem (`0001`, `0002`, `0003`).
4. Cole o conteúdo e execute.
5. **Importante:** aplique em ordem. Cada migration depende da anterior.

## Após Aplicar

### 1. Criar o Primeiro Usuário Admin

O Supabase Auth exige a criação de um usuário via `auth.users` (signup). O trigger `handle_new_user` criará automaticamente um `profile` com `role = 'visualizador'`. Para promover a admin, execute:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'admin@absb.local'
);
```

**Substitua `admin@absb.local` pelo e-mail do administrador.**

### 2. Configurar Variáveis de Ambiente no Front-end

Edite o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Obtenha esses valores em **Settings > API** no Dashboard do Supabase.

### 3. Verificar

- Acesse o app.
- Faça login com o usuário admin.
- Verifique em **Configurações** que `isBackendConfigured: true`.

## Reversão (cuidado!)

As migrations **NÃO são reversíveis** automaticamente. Para reverter:

1. Crie uma **nova migration** com a operação inversa (DROP table, DROP policy, etc.).
2. **Nunca** edite uma migration já aplicada.

## Boas Práticas

- Cada mudança no schema = nova migration.
- Migrations são imutáveis após merge em `main`.
- Documente o objetivo no cabeçalho de cada migration.
- Teste em ambiente de desenvolvimento antes de aplicar em produção.

## Documentação Adicional

- `DATABASE_SPECIFICATION.md` (raiz) — especificação completa do banco.
- `MIGRATIONS_PLAN.md` (raiz) — validação da estrutura antes da criação das migrations.
- `SHEETS_FORMAT.md` (raiz) — formato esperado da planilha de importados.
