# MIGRATIONS_PLAN — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão:** 1.0
**Data:** 22/07/2026
**Status:** Vigente — base para criação das migrations definitivas

---

## 1. Propósito

Este documento **valida** a estrutura completa do banco de dados Supabase antes da criação das migrations SQL. Serve como validação de:

- Estrutura de tabelas
- Relacionamentos
- Índices
- Regras RLS
- Campos obrigatórios
- Auditoria de alterações

Após validação, as migrations são geradas em `supabase/migrations/`.

---

## 2. Validação por Tabela

### 2.1 `profiles`

| Aspecto | Decisão | Justificativa |
|---|---|---|
| PK | `id uuid` (FK `auth.users.id` ON DELETE CASCADE) | Integração nativa com Supabase Auth |
| Campos obrigatórios | `nome`, `role`, `ativo`, `created_at`, `updated_at` | Mínimo necessário para aplicação |
| `role` | enum `user_role` com default `'visualizador'` | Default mais restritivo; admin promove manualmente |
| `ativo` | boolean com default `true` | Soft disable sem deletar histórico |
| Trigger `set_updated_at` | Sim | Consistência de timestamp |
| Trigger `handle_new_user` | Cria profile ao criar `auth.users` | Automação, sem ação manual |

### 2.2 `associados`

| Aspecto | Decisão | Justificativa |
|---|---|---|
| PK | `id uuid` gerado | Padrão |
| Campos obrigatórios | `nome`, `ativo`, `origem`, `created_at`, `updated_at` | Nome é essencial; demais opcionais |
| `cpf` | `text` UNIQUE (quando não nulo), normalizado para apenas dígitos | Identificador natural quando disponível |
| `uf` | `char(2)` com CHECK | Validação de UF brasileira |
| `veiculo_ano` | `int` com CHECK (1900-2100) | Sanidade de dados |
| `origem` | `text` default `'importacao'` | Rastreabilidade de proveniência |
| `created_by`/`updated_by` | uuid FK `auth.users.id` | Auditoria |
| Trigger `set_updated_at` | Sim | |
| Trigger `audit_trigger` | Sim | Grava em `audit_log` |

### 2.3 `mensalidades`

| Aspecto | Decisão | Justificativa |
|---|---|---|
| PK | `id uuid` | |
| `associado_id` | FK `associados(id)` ON DELETE CASCADE | Se associado for excluído, mensalidades vão junto |
| `referencia` | `text` no formato `YYYY-MM` | Identificador natural mensal |
| `valor_final` | `numeric(10,2)` GERADO via trigger | Consistência: `valor - desconto + acrescimo` |
| `vencimento_em` | `date` NOT NULL | Data crítica |
| UNIQUE | `(associado_id, referencia)` | Não permite duas mensalidades do mesmo mês para o mesmo associado |
| Trigger `tg_mensalidades_valor_final` | BEFORE INSERT/UPDATE | Calcula `valor_final` automaticamente |
| Trigger `set_updated_at` | Sim | |
| Trigger `audit_trigger` | Sim | |

### 2.4 `pagamentos`

| Aspecto | Decisão | Justificativa |
|---|---|---|
| PK | `id uuid` | |
| `mensalidade_id` | FK `mensalidades(id)` ON DELETE CASCADE | |
| `forma_pagamento` | enum `forma_pagamento_tipo` | Padronização |
| `valor_pago` | `numeric(10,2)` > 0 | Validação |
| Trigger `audit_trigger` | Sim | |

### 2.5 `importacoes`

| Aspecto | Decisão | Justificativa |
|---|---|---|
| PK | `id uuid` | |
| `tipo` | `text` ('associados', futuras) | |
| `relatorio_erros` | `jsonb` | Flexibilidade para relatório |
| `executada_por` | FK `auth.users.id` | Auditoria |
| **Sem trigger de update** | Sim | Importação é imutável após execução |

### 2.6 `audit_log`

| Aspecto | Decisão | Justificativa |
|---|---|---|
| PK | `id uuid` | |
| `antes`/`depois` | `jsonb` | Estado completo do registro |
| `operacao` | enum `audit_operacao` | |
| Inserção apenas via trigger | Sim | RLS bloqueia insert direto |

### 2.7 `configuracoes`

| Aspecto | Decisão | Justificativa |
|---|---|---|
| PK | `id uuid` | |
| `chave` | `text` UNIQUE | Identificador |
| `valor` | `jsonb` | Flexibilidade de tipo |

---

## 3. Validação de Relacionamentos

```
auth.users (Supabase gerenciado)
    ↓ 1:1
profiles
    ↓ 1:N
associados (via created_by/updated_by)
    ↓ 1:N
mensalidades
    ↓ 1:N
pagamentos
```

```
auth.users
    ↓ 1:N
importacoes (via executada_por)
```

```
[Nenhuma tabela]
    ↓ 1:N
audit_log (registro genérico via trigger)
```

### 3.1 Integridade Referencial

- `ON DELETE CASCADE`: `profiles`, `associados→mensalidades`, `mensalidades→pagamentos`. Exclusão do pai remove filhos.
- `ON DELETE SET NULL` ou `NO ACTION` (default): FKs de auditoria (`created_by`, `updated_by`, `executada_por`). Não removem registros de negócio se usuário for excluído.

---

## 4. Validação de Índices

| Tabela | Índice | Coluna(s) | Justificativa |
|---|---|---|---|
| profiles | idx_profiles_role | role | Filtros por papel |
| associados | idx_associados_nome | nome | Busca por nome |
| associados | idx_associados_cpf | cpf | Busca por CPF (UNIQUE também ajuda) |
| associados | idx_associados_ativo | ativo | Listagem de ativos |
| associados | idx_associados_veiculo_placa | veiculo_placa | Busca por placa |
| associados | idx_associados_categoria | categoria | Filtro por categoria |
| mensalidades | idx_mensalidades_associado_id | associado_id | JOIN com associados |
| mensalidades | idx_mensalidades_referencia | referencia | Filtros por mês |
| mensalidades | idx_mensalidades_pago | pago | Listagem de pendentes |
| mensalidades | idx_mensalidades_vencimento | vencimento_em | Ordenação |
| pagamentos | idx_pagamentos_mensalidade_id | mensalidade_id | JOIN |
| pagamentos | idx_pagamentos_pago_em | pago_em | Ordenação por data |
| importacoes | idx_importacoes_executada_em | executada_em DESC | Ordenação recente |
| importacoes | idx_importacoes_tipo | tipo | Filtro por tipo |
| audit_log | (sem índice específico) | — | Volume baixo esperado |

---

## 5. Validação de Constraints

| Tabela | Constraint | Regra |
|---|---|---|
| associados | `uq_associados_cpf` | UNIQUE em cpf (parcial, não-nulo) |
| associados | `ck_associados_uf` | CHECK em UF (lista de 27 UFs + DF) |
| associados | `ck_associados_veiculo_ano` | CHECK entre 1900 e 2100 |
| mensalidades | `uq_mensalidades_associado_referencia` | UNIQUE (associado_id, referencia) |
| mensalidades | `ck_mensalidades_referencia` | CHECK formato `^\d{4}-\d{2}$` |
| mensalidades | `ck_mensalidades_valor` | CHECK valor >= 0 |
| mensalidades | `ck_mensalidades_desconto` | CHECK desconto >= 0 |
| mensalidades | `ck_mensalidades_acrescimo` | CHECK acrescimo >= 0 |
| pagamentos | `ck_pagamentos_valor` | CHECK valor_pago > 0 |
| configuracoes | `uq_configuracoes_chave` | UNIQUE em chave |

---

## 6. Validação de RLS (Row Level Security)

### 6.1 Princípios

- RLS **habilitado** em todas as tabelas.
- Policies explícitas por operação (SELECT, INSERT, UPDATE, DELETE).
- Claims JWT sincronizadas com `profiles.role` via trigger.

### 6.2 Matriz de Acesso (de `PERMISSIONS.md`)

| Tabela | admin | tesoureiro | diretor | visualizador |
|---|---|---|---|---|
| profiles | RW | R (próprio) | R (próprio) | R (próprio) |
| associados | RWD | R | RW | R |
| mensalidades | RWD | RW | R | R |
| pagamentos | RWD | RW | R | R |
| importacoes | R | — | — | — |
| audit_log | R | — | R | — |
| configuracoes | RW | R (chaves permitidas) | R | R |

R = SELECT, W = INSERT/UPDATE, D = DELETE.

### 6.3 Implementação

Policies usam `auth.jwt() -> 'app_metadata' -> 'role'` (claim customizada) para performance. A claim é sincronizada pelo trigger `tg_sync_user_role` em `profiles`.

---

## 7. Validação de Auditoria

### 7.1 Trigger Genérico

Função `audit_trigger()` registra em `audit_log`:

- `tabela` — nome da tabela
- `registro_id` — UUID do registro afetado
- `operacao` — INSERT, UPDATE, ou DELETE
- `antes` — jsonb do estado anterior (UPDATE/DELETE) ou NULL (INSERT)
- `depois` — jsonb do estado novo (INSERT/UPDATE) ou NULL (DELETE)
- `usuario_id` — `auth.uid()` no momento da operação
- `executada_em` — `now()`

### 7.2 Tabelas Auditadas

- `associados`
- `mensalidades`
- `pagamentos`
- `configuracoes`

`profiles`, `importacoes`, `audit_log` **NÃO** são auditadas (meta-dados ou auto-gravados).

### 7.3 Segurança da Auditoria

- RLS em `audit_log` permite SELECT para `admin` e `diretor`.
- INSERT apenas via trigger (SECURITY DEFINER).
- UPDATE/DELETE bloqueados por policy.

---

## 8. Plano de Execução das Migrations

| # | Arquivo | Conteúdo | Reversível? |
|---|---|---|---|
| 1 | `0001_init_schema.sql` | Extensões, enums, tabelas, índices, constraints, triggers de `updated_at` | Não |
| 2 | `0002_rls_policies.sql` | Habilita RLS, cria todas as policies | Não |
| 3 | `0003_seed_roles.sql` | Função `handle_new_user`, trigger de sync de role, função `audit_trigger` | Não |

**Regra:** migrations são imutáveis após aplicadas. Correções exigem nova migration.

---

## 9. Riscos Identificados

| Risco | Mitigação |
|---|---|
| Planilha real com colunas diferentes | `mapeamento.ts` é configurável; ajustes ficam isolados |
| Cliente esquecer de aplicar migration | `supabase/README.md` documenta processo passo a passo |
| Trigger `audit_trigger` falhar silenciosamente | `SECURITY DEFINER` com try/catch (futuro) ou log |
| RLS muito restritivo bloquear admin | Policy de admin via `app_metadata.role = 'admin'` é separada |
| Senha/secret commit acidental | `.gitignore` com `.env`; `seed.sql` sem dados fictícios |

---

## 10. Checklist de Validação

- [x] Estrutura de tabelas definida (7 tabelas)
- [x] Relacionamentos mapeados
- [x] Índices especificados
- [x] Constraints e CHECKs especificados
- [x] Triggers de `updated_at` em todas as tabelas com timestamp
- [x] Triggers de auditoria em tabelas de negócio
- [x] RLS habilitada em todas as tabelas
- [x] Policies por papel e operação
- [x] Enum `user_role` e `forma_pagamento_tipo` definidos
- [x] Função `handle_new_user` para sync com `auth.users`
- [x] Função `audit_trigger` para auditoria genérica
- [x] Sem dados fictícios
- [x] Sem seeds com senhas

---

## 11. Próximo Passo

Com a validação concluída, as migrations definitivas podem ser criadas em `supabase/migrations/`.
