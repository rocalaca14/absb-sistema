# DATABASE_SPECIFICATION — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Idioma:** Português (Brasil)

---

## 1. Propósito

Este documento define a **modelagem completa** do banco de dados Supabase. Nenhuma tabela, coluna, índice, constraint ou política RLS pode existir sem estar aqui documentada.

### 1.1 Princípios

- O banco Supabase é a **única fonte oficial** de dados.
- A planilha Google Sheets é apenas ferramenta de **importação inicial**. Após a primeira carga válida, o sistema **nunca** consulta a planilha.
- Toda carga inicial preserva: acentuação, capitalização, ordem original.
- Tabelas são em pt-BR quando o nome tem significado de negócio. Nomes de tabelas técnicas podem ser em inglês quando é convenção.
- Nomes de colunas são em `snake_case` em inglês (convenção SQL/Supabase) e são expostos ao front como `camelCase` via tipagem.

---

## 2. Convenções

### 2.1 Nomenclatura

| Elemento | Convenção | Exemplo |
|---|---|---|
| Tabelas | `snake_case` (inglês) | `associados`, `mensalidades` |
| Colunas | `snake_case` (inglês) | `created_at`, `nome_completo` |
| Chaves estrangeiras | `<tabela_referenciada_singular>_id` | `associado_id` |
| Índices | `idx_<tabela>_<coluna>` | `idx_associados_nome` |
| Constraints unique | `uq_<tabela>_<coluna>` | `uq_associados_cpf` |
| Constraints check | `ck_<tabela>_<coluna>_<regra>` | `ck_associados_ativo_bool` |
| Triggers | `tg_<tabela>_<evento>` | `tg_associados_updated_at` |
| Policies | `pol_<tabela>_<ação>_<papel>` | `pol_associados_select_admin` |
| Enums | `snake_case` (inglês) | `user_role` |

### 2.2 Colunas Padrão

Toda tabela de negócio contém:

- `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `created_at timestamptz NOT NULL DEFAULT now()`
- `updated_at timestamptz NOT NULL DEFAULT now()`

Trigger `tg_<tabela>_updated_at` atualiza `updated_at` em cada `UPDATE`.

### 2.3 Soft Delete

Quando aplicável, a coluna `deleted_at timestamptz` é usada. Tabelas que não usam `deleted_at` estão documentadas.

### 2.4 Auditoria

Tabelas críticas (`mensalidades`, `importacoes`, `usuarios`) possuem colunas de auditoria adicionais:

- `created_by uuid REFERENCES auth.users(id)`
- `updated_by uuid REFERENCES auth.users(id)`

---

## 3. Tabelas — Visão Geral

| Tabela | Descrição | Categoria |
|---|---|---|
| `profiles` | Extensão de `auth.users` com `role` e `nome` | Segurança |
| `associados` | Cadastro de associados | Negócio |
| `mensalidades` | Cobranças mensais por associado | Negócio |
| `pagamentos` | Registro de pagamentos por mensalidade | Negócio |
| `importacoes` | Histórico de importações de planilha | Auditoria |
| `audit_log` | Log de auditoria geral | Auditoria |
| `configuracoes` | Configurações gerais do sistema | Negócio |

---

## 4. Tabela `profiles`

Extensão da tabela `auth.users` (Supabase Auth).

### 4.1 Colunas

| Coluna | Tipo | Nulo | Default | Descrição |
|---|---|---|---|---|
| `id` | `uuid` | Não | — | PK; FK para `auth.users(id)` ON DELETE CASCADE |
| `nome` | `text` | Não | — | Nome completo do usuário |
| `role` | `user_role` | Não | `'visualizador'` | Papel do usuário |
| `ativo` | `boolean` | Não | `true` | Se o usuário pode logar |
| `ultimo_acesso_em` | `timestamptz` | Sim | — | Última vez que o usuário entrou |
| `created_at` | `timestamptz` | Não | `now()` | Criação |
| `updated_at` | `timestamptz` | Não | `now()` | Atualização |

### 4.2 Enum `user_role`

```sql
CREATE TYPE user_role AS ENUM (
  'admin',
  'tesoureiro',
  'diretor',
  'visualizador'
);
```

### 4.3 Índices

- `idx_profiles_role` em `(role)`.

### 4.4 Policies (RLS)

| Operação | Policy | Regra |
|---|---|---|
| SELECT | `pol_profiles_select_self_admin` | Usuário lê o próprio `profile`; `admin` lê todos |
| UPDATE | `pol_profiles_update_self` | Usuário atualiza apenas `nome` do próprio `profile` |
| INSERT | (via trigger) | Criado automaticamente em `onAuthStateChange` |
| DELETE | `pol_profiles_delete_admin` | Apenas `admin` |

### 4.5 Trigger de Criação

Trigger `tg_auth_user_create_profile` em `auth.users` (evento `AFTER INSERT`) cria automaticamente um `profile` com `role = 'visualizador'` e `nome = coalesce(new.raw_user_meta_data->>'nome', 'Usuário')`.

---

## 5. Tabela `associados`

### 5.1 Colunas

| Coluna | Tipo | Nulo | Default | Descrição |
|---|---|---|---|---|
| `id` | `uuid` | Não | `gen_random_uuid()` | PK |
| `nome` | `text` | Não | — | Nome completo. Acentos preservados |
| `cpf` | `text` | Sim | — | CPF (apenas dígitos) |
| `rg` | `text` | Sim | — | RG |
| `telefone` | `text` | Sim | — | Telefone |
| `email` | `text` | Sim | — | E-mail |
| `endereco` | `text` | Sim | — | Logradouro |
| `numero` | `text` | Sim | — | Número |
| `complemento` | `text` | Sim | — | Complemento |
| `bairro` | `text` | Sim | — | Bairro |
| `cidade` | `text` | Sim | — | Cidade |
| `uf` | `char(2)` | Sim | — | UF |
| `cep` | `text` | Sim | — | CEP |
| `veiculo_marca` | `text` | Sim | — | Marca do veículo |
| `veiculo_modelo` | `text` | Sim | — | Modelo do veículo |
| `veiculo_ano` | `int` | Sim | — | Ano do veículo |
| `veiculo_placa` | `text` | Sim | — | Placa |
| `veiculo_cor` | `text` | Sim | — | Cor do veículo |
| `categoria` | `text` | Sim | — | Categoria interna livre (ex: 'ouro', 'prata', 'bronze') |
| `data_nascimento` | `date` | Sim | — | Data de nascimento |
| `data_filiacao` | `date` | Sim | — | Data de filiação |
| `observacoes` | `text` | Sim | — | Notas livres |
| `ativo` | `boolean` | Não | `true` | Se o associado está ativo |
| `origem` | `text` | Não | `'importacao'` | 'importacao', 'manual', 'site' |
| `created_at` | `timestamptz` | Não | `now()` | Criação |
| `updated_at` | `timestamptz` | Não | `now()` | Atualização |
| `created_by` | `uuid` | Sim | — | FK `auth.users(id)` |
| `updated_by` | `uuid` | Sim | — | FK `auth.users(id)` |

> **Colunas pendentes de confirmação** quando a planilha chegar. As acima representam uma estimativa razoável com base em associações típicas. Ajustes serão registrados em nova versão deste documento.

### 5.2 Constraints

- `uq_associados_cpf` UNIQUE em `cpf` quando não nulo.
- `ck_associados_uf` CHECK em `uf` com lista de UFs válidas.
- `ck_associados_veiculo_ano` CHECK em `veiculo_ano` entre `1900` e `2100`.

### 5.3 Índices

- `idx_associados_nome` em `(nome)`.
- `idx_associados_cpf` em `(cpf)`.
- `idx_associados_ativo` em `(ativo)`.
- `idx_associados_veiculo_placa` em `(veiculo_placa)`.
- `idx_associados_categoria` em `(categoria)`.

### 5.4 Policies (RLS)

| Operação | `admin` | `tesoureiro` | `diretor` | `visualizador` |
|---|---|---|---|---|
| SELECT | ✓ | ✓ | ✓ | ✓ |
| INSERT | ✓ | ✗ | ✓ | ✗ |
| UPDATE | ✓ | ✗ | ✓ | ✗ |
| DELETE | ✓ | ✗ | ✗ | ✗ |

Policies concretas:

- `pol_associados_select_all` — todos os papéis autenticados podem SELECT.
- `pol_associados_insert_admin_diretor` — `admin` ou `diretor` podem INSERT.
- `pol_associados_update_admin_diretor` — `admin` ou `diretor` podem UPDATE.
- `pol_associados_delete_admin` — apenas `admin` pode DELETE.

### 5.5 View `v_associados_ativos`

View materializada (não, apenas regular nesta fase) que filtra `ativo = true`. Usada em listagens.

---

## 6. Tabela `mensalidades`

### 6.1 Colunas

| Coluna | Tipo | Nulo | Default | Descrição |
|---|---|---|---|---|
| `id` | `uuid` | Não | `gen_random_uuid()` | PK |
| `associado_id` | `uuid` | Não | — | FK `associados(id)` ON DELETE CASCADE |
| `referencia` | `text` | Não | — | 'YYYY-MM' |
| `valor` | `numeric(10,2)` | Não | — | Valor nominal |
| `desconto` | `numeric(10,2)` | Não | `0` | Desconto aplicado |
| `acrescimo` | `numeric(10,2)` | Não | `0` | Acréscimo aplicado |
| `valor_final` | `numeric(10,2)` | Não | — | Valor final (gerado) |
| `vencimento_em` | `date` | Não | — | Data de vencimento |
| `pago` | `boolean` | Não | `false` | Status pago |
| `pago_em` | `timestamptz` | Sim | — | Data do pagamento |
| `observacoes` | `text` | Sim | — | Notas |
| `created_at` | `timestamptz` | Não | `now()` | Criação |
| `updated_at` | `timestamptz` | Não | `now()` | Atualização |
| `created_by` | `uuid` | Sim | — | FK `auth.users(id)` |
| `updated_by` | `uuid` | Sim | — | FK `auth.users(id)` |

### 6.2 Constraints

- `uq_mensalidades_associado_referencia` UNIQUE em `(associado_id, referencia)`.
- `ck_mensalidades_referencia` CHECK em `referencia ~ '^\d{4}-\d{2}$'`.
- `ck_mensalidades_valor` CHECK em `valor >= 0`.

### 6.3 Índices

- `idx_mensalidades_associado_id` em `(associado_id)`.
- `idx_mensalidades_referencia` em `(referencia)`.
- `idx_mensalidades_pago` em `(pago)`.
- `idx_mensalidades_vencimento` em `(vencimento_em)`.

### 6.4 Policies (RLS)

| Operação | `admin` | `tesoureiro` | `diretor` | `visualizador` |
|---|---|---|---|---|
| SELECT | ✓ | ✓ | ✓ | ✓ |
| INSERT | ✓ | ✓ | ✗ | ✗ |
| UPDATE | ✓ | ✓ | ✗ | ✗ |
| DELETE | ✓ | ✗ | ✗ | ✗ |

### 6.5 Trigger

`tg_mensalidades_valor_final` BEFORE INSERT/UPDATE: define `valor_final = valor - desconto + acrescimo`.

---

## 7. Tabela `pagamentos`

### 7.1 Colunas

| Coluna | Tipo | Nulo | Default | Descrição |
|---|---|---|---|---|
| `id` | `uuid` | Não | `gen_random_uuid()` | PK |
| `mensalidade_id` | `uuid` | Não | — | FK `mensalidades(id)` ON DELETE CASCADE |
| `valor_pago` | `numeric(10,2)` | Não | — | Valor efetivamente pago |
| `pago_em` | `timestamptz` | Não | `now()` | Data/hora do pagamento |
| `forma_pagamento` | `forma_pagamento_tipo` | Não | — | Enum |
| `comprovante_url` | `text` | Sim | — | Link de comprovante (futuro) |
| `observacoes` | `text` | Sim | — | Notas |
| `created_at` | `timestamptz` | Não | `now()` | Criação |
| `created_by` | `uuid` | Não | — | FK `auth.users(id)` |

### 7.2 Enum `forma_pagamento_tipo`

```sql
CREATE TYPE forma_pagamento_tipo AS ENUM (
  'dinheiro',
  'pix',
  'transferencia',
  'cartao',
  'boleto',
  'outro'
);
```

### 7.3 Constraints

- `ck_pagamentos_valor` CHECK em `valor_pago > 0`.

### 7.4 Índices

- `idx_pagamentos_mensalidade_id` em `(mensalidade_id)`.
- `idx_pagamentos_pago_em` em `(pago_em)`.

### 7.5 Policies (RLS)

| Operação | `admin` | `tesoureiro` | `diretor` | `visualizador` |
|---|---|---|---|---|
| SELECT | ✓ | ✓ | ✓ | ✓ |
| INSERT | ✓ | ✓ | ✗ | ✗ |
| UPDATE | ✓ | ✓ | ✗ | ✗ |
| DELETE | ✓ | ✗ | ✗ | ✗ |

---

## 8. Tabela `importacoes`

### 8.1 Colunas

| Coluna | Tipo | Nulo | Default | Descrição |
|---|---|---|---|---|
| `id` | `uuid` | Não | `gen_random_uuid()` | PK |
| `tipo` | `text` | Não | — | 'associados' (futuros: 'mensalidades') |
| `arquivo_origem` | `text` | Não | — | URL ou nome do arquivo |
| `total_linhas` | `int` | Não | — | Linhas processadas |
| `total_inseridos` | `int` | Não | — | Registros inseridos |
| `total_atualizados` | `int` | Não | — | Registros atualizados |
| `total_erros` | `int` | Não | — | Linhas com erro |
| `relatorio_erros` | `jsonb` | Sim | — | Lista de erros |
| `executada_por` | `uuid` | Não | — | FK `auth.users(id)` |
| `executada_em` | `timestamptz` | Não | `now()` | Data/hora |

### 8.2 Índices

- `idx_importacoes_executada_em` em `(executada_em DESC)`.
- `idx_importacoes_tipo` em `(tipo)`.

### 8.3 Policies (RLS)

| Operação | `admin` | `tesoureiro` | `diretor` | `visualizador` |
|---|---|---|---|---|
| SELECT | ✓ | ✗ | ✗ | ✗ |
| INSERT | ✓ | ✗ | ✗ | ✗ |
| UPDATE | ✗ (imutável) | ✗ | ✗ | ✗ |
| DELETE | ✓ (somente admin e somente após backup) | ✗ | ✗ | ✗ |

---

## 9. Tabela `audit_log`

### 9.1 Colunas

| Coluna | Tipo | Nulo | Default | Descrição |
|---|---|---|---|---|
| `id` | `uuid` | Não | `gen_random_uuid()` | PK |
| `tabela` | `text` | Não | — | Tabela afetada |
| `registro_id` | `uuid` | Não | — | ID do registro |
| `operacao` | `audit_operacao` | Não | — | Enum |
| `antes` | `jsonb` | Sim | — | Estado anterior |
| `depois` | `jsonb` | Sim | — | Estado novo |
| `usuario_id` | `uuid` | Sim | — | FK `auth.users(id)` |
| `executada_em` | `timestamptz` | Não | `now()` | Data/hora |

### 9.2 Enum `audit_operacao`

```sql
CREATE TYPE audit_operacao AS ENUM (
  'insert',
  'update',
  'delete'
);
```

### 9.3 Triggers

Trigger genérica `tg_audit_log` é instalada em cada tabela de negócio. Grava automaticamente em `audit_log` o estado anterior e o novo.

### 9.4 Policies (RLS)

- SELECT: `admin`, `diretor`.
- INSERT: trigger apenas.
- UPDATE/DELETE: nunca.

---

## 10. Tabela `configuracoes`

### 10.1 Colunas

| Coluna | Tipo | Nulo | Default | Descrição |
|---|---|---|---|---|
| `id` | `uuid` | Não | `gen_random_uuid()` | PK |
| `chave` | `text` | Não | — | Chave da configuração |
| `valor` | `jsonb` | Não | — | Valor |
| `descricao` | `text` | Sim | — | Descrição |
| `updated_at` | `timestamptz` | Não | `now()` | Atualização |
| `updated_by` | `uuid` | Sim | — | FK `auth.users(id)` |

### 10.2 Constraints

- `uq_configuracoes_chave` UNIQUE em `(chave)`.

### 10.3 Chaves Reservadas

| Chave | Tipo | Descrição |
|---|---|---|
| `associacao.nome` | `string` | Nome da associação |
| `associacao.cnpj` | `string` | CNPJ |
| `financeiro.valor_mensalidade` | `number` | Valor padrão da mensalidade |
| `financeiro.dia_vencimento` | `number` | Dia do mês de vencimento |
| `financeiro.juros_percentual` | `number` | Juros por dia de atraso |
| `financeiro.multa_percentual` | `number` | Multa por atraso |
| `app.suporte_email` | `string` | E-mail de suporte |
| `app.suporte_telefone` | `string` | Telefone de suporte |

### 10.4 Policies (RLS)

| Operação | `admin` | demais |
|---|---|---|
| SELECT | ✓ | ✓ (somente chaves permitidas) |
| INSERT/UPDATE/DELETE | ✓ | ✗ |

---

## 11. Funções e Triggers Globais

### 11.1 `set_updated_at()`

Função genérica `BEFORE UPDATE` que atualiza `updated_at = now()`.

Aplicada em todas as tabelas que possuem a coluna.

### 11.2 `handle_new_user()`

Trigger em `auth.users` que cria `profile` automaticamente.

### 11.3 `audit_trigger()`

Função genérica de auditoria instalada em tabelas marcadas.

---

## 12. Estratégia de Importação

### 12.1 Visão

- Planilha é fornecida como Google Sheets pública via URL `/pub?output=csv`.
- Aplicação faz `fetch` do CSV (apenas valores, sem fórmulas).
- Cada linha é convertida em objeto respeitando o mapeamento de colunas.
- Aplicação faz `upsert` em `associados` (chave de unicidade: `cpf` quando existir, senão `nome + data_nascimento`).
- Cada execução registra em `importacoes`.

### 12.2 Regras Invioláveis

- Acentos preservados.
- Capitalização preservada.
- Ordem de inserção: ordem da planilha.
- Nenhuma linha é descartada por motivo de validação fraca. Erros viram entrada em `relatorio_erros` em `importacoes`, e a importação segue com as linhas válidas.
- `cpf` é normalizado para apenas dígitos antes de gravar.
- Strings vazias viram `NULL` em campos opcionais (exceto quando o destino é `text` não-nulo com default).

### 12.3 Idempotência

- A importação pode ser executada mais de uma vez.
- A cada execução, registros existentes são **atualizados** (não duplicados) com base na chave de upsert.

---

## 13. Versionamento de Migrations

- Migrations em `supabase/migrations/`.
- Nomeação: `NNNN_descricao.sql` (ex: `0001_init_schema.sql`).
- Cada migration é executada uma única vez.
- Migrations aplicadas são imutáveis.
- Alteração de migration já aplicada exige nova migration corretiva.

### 13.1 Migrations Planejadas (nesta documentação)

| Arquivo | Conteúdo |
|---|---|
| `0001_init_schema.sql` | Extensões, enums, tabelas, índices, constraints, triggers de `updated_at` |
| `0002_rls_policies.sql` | Habilita RLS em todas as tabelas e cria todas as policies |
| `0003_seed_roles.sql` | Seeds mínimos: enum `user_role`, função `handle_new_user` |

---

## 14. Backup e Retenção

- Backup automático do Supabase (plano) cobre produção.
- Política de retenção: backups por 30 dias.
- Antes de qualquer migration destrutiva, snapshot manual do banco.

---

## 15. Bloqueios

- **Planilha real**: ainda não recebida. Colunas de `associados` podem precisar de ajuste.
- **Regras de negócio de mensalidades**: pendentes para fase 1.0.
- **Chaves reais de `configuracoes`**: dependem de definição com cliente.
- **Confirmação de endereço/CEP na planilha**: dependente da planilha real.
