# ETAPA_2_1_REPORT — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão:** 1.0
**Data:** 22/07/2026
**Idioma:** Português (Brasil)
**Marco:** Fase 2.1 — Services e Estrutura Base
**Status:** Concluído. Aguardando aprovação.

---

## 1. Resumo do Marco

A Fase 2.1 implementa a **camada de services** e **hooks utilitários** que servirão de base para as telas de negócio. Conforme decisão do cliente em 22/07/2026:

> "Durante a Fase 2: pode implementar somente estruturas neutras: componentes visuais, services preparados, hooks, layouts, estados vazios, tabelas sem regras específicas, interfaces TypeScript preparadas. Não implementar cálculos financeiros definitivos, regras de cobrança, bloqueios por inadimplência, exclusões permanentes, workflows de aprovação."

**Esta fase entrega apenas estruturas neutras.** Operações que dependem de regras de negócio estão documentadas mas lançam `AppError` com mensagem amigável apontando para a pendência.

---

## 2. Validações

| Validação | Resultado |
|---|---|
| `npm run typecheck` | ✓ 0 erros |
| `npm run lint` | ✓ 0 erros |
| `npm run build` | ✓ Sucesso em 3.74s |
| Bundle JS (gzip) | 61.30 kB |
| Bundle CSS (gzip) | 3.10 kB |
| PWA precache | 41 entries (683.92 KiB) |
| Code splitting ainda ativo | ✓ (sem regressão) |

---

## 3. Arquivos Criados/Modificados

### Criados (11)

- `src/services/mappers.ts` — funções de conversão snake_case → camelCase
- `src/services/associados.service.ts` — CRUD de associados
- `src/services/mensalidades.service.ts` — CRUD de mensalidades
- `src/services/pagamentos.service.ts` — registro de pagamentos
- `src/services/profiles.service.ts` — gestão de usuários (admin)
- `src/services/configuracoes.service.ts` — chave/valor do sistema
- `src/services/dashboard.service.ts` — agregações para dashboard
- `src/services/index.ts` — barrel export
- `src/utils/validators.ts` — schemas Zod
- `src/hooks/usePermission.ts` — checagem de permissões
- `src/hooks/usePagination.ts` — paginação client-side

### Modificados (2)

- `src/core/supabase/types.ts` — schema completo das 7 tabelas
- `src/types/domain.types.ts` — tipos de domínio expandidos

---

## 4. Services — Detalhamento

### 4.1 `associadosService`

| Método | Status | Notas |
|---|---|---|
| `list(params)` | ✓ Ativo | Paginação + busca + filtros |
| `get(id)` | ✓ Ativo | Retorna null se não encontrado |
| `create(input)` | ✓ Ativo | Origem default: "manual" |
| `update(id, input)` | ✓ Ativo | Soft update (não bloqueia) |
| `deactivate(id)` | ✓ Ativo | Soft delete via `ativo=false` |
| `activate(id)` | ✓ Ativo | Reativação |
| `delete(id)` | ⚠️ Bloqueado | INFO-09 pendente |

### 4.2 `mensalidadesService`

| Método | Status | Notas |
|---|---|---|
| `list(params)` | ✓ Ativo | Join com `associado` para listas |
| `get(id)` | ✓ Ativo | — |
| `create(input)` | ✓ Ativo | `valorFinal` via trigger do banco |
| `update(id, input)` | ✓ Ativo | — |
| `gerarLote(referencia)` | ⚠️ Bloqueado | INFO-01, INFO-04 pendentes |
| `delete(id)` | ✓ Ativo | Hard delete (uso restrito) |

### 4.3 `pagamentosService`

| Método | Status | Notas |
|---|---|---|
| `create(input)` | ✓ Ativo | Marca mensalidade como paga |
| `listByMensalidade(id)` | ✓ Ativo | Histórico |
| `estornar(id)` | ⚠️ Bloqueado | INFO-01, INFO-09 pendentes |

### 4.4 `profilesService`

| Método | Status | Notas |
|---|---|---|
| `list(params)` | ✓ Ativo | Combina `profiles` + `auth.users` |
| `get(id)` | ✓ Ativo | — |
| `updateRole(id, role)` | ✓ Ativo | Apenas admin via RLS |
| `setAtivo(id, ativo)` | ✓ Ativo | Ativar/desativar |
| `invite(email, nome, role)` | ⚠️ Bloqueado | INFO-09 pendente |

### 4.5 `configuracoesService`

| Método | Status | Notas |
|---|---|---|
| `get(chave)` | ✓ Ativo | Por chave |
| `list()` | ✓ Ativo | Todas |
| `upsert(chave, input)` | ✓ Ativo | Cria ou atualiza |

Constantes pré-definidas (`CONFIGURACAO_CHAVES`):

```ts
ASSOCIACAO_NOME = 'associacao.nome'
ASSOCIACAO_CNPJ = 'associacao.cnpj'
MENSALIDADE_VALOR_PADRAO = 'financeiro.mensalidade_valor_padrao'
MENSALIDADE_VENCIMENTO_DIA = 'financeiro.vencimento_dia'
SUPORTE_EMAIL = 'app.suporte_email'
SUPORTE_TELEFONE = 'app.suporte_telefone'
```

### 4.6 `dashboardService`

| Método | Status | Notas |
|---|---|---|
| `getResumo()` | ✓ Ativo | Retorna totais brutos |

**`DashboardResumo` retornado:**

```ts
interface DashboardResumo {
  totalAssociadosAtivos: number;
  totalMensalidadesEmAberto: number;
  valorEmAberto: number;
  totalPagasNoMes: number;
  valorPagoNoMes: number;
  totalVencidas: number;
}
```

**Nota:** "vencidas" considera `vencimento_em < hoje AND pago = false`. Política de quantos dias após vencimento = "inadimplente" (INFO-04) ainda não aplicada.

---

## 5. Hooks — Detalhamento

### 5.1 `usePermission`

```ts
const { can, canAny, canAll } = usePermission();

if (can('associados.write')) { /* mostrar botão */ }
if (canAny(['associados.write', 'associados.delete'])) { /* ... */ }
```

**API:**

```ts
interface UsePermissionResult {
  can: (permission: Permission) => boolean;
  canAny: (permissions: ReadonlyArray<Permission>) => boolean;
  canAll: (permissions: ReadonlyArray<Permission>) => boolean;
}
```

### 5.2 `usePagination`

```ts
const { page, pageSize, setPage, next, previous, range, offset, limit } = usePagination();

const { from, to, totalPages } = range(result.total);

const { data, error } = await client
  .from('associados')
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1);
```

**API:**

```ts
interface UsePaginationResult {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  next: () => void;
  previous: () => void;
  first: () => void;
  range: (total: number) => { from: number; to: number; totalPages: number };
  offset: number;
  limit: number;
}
```

---

## 6. Validadores Zod

### 6.1 `associadoCreateSchema`

- `nome`: obrigatório, 1-200 caracteres.
- `cpf`: regex `^\d{11}$`, aceita vazio → null.
- `cep`: regex `^\d{8}$`, aceita vazio → null.
- `veiculo_placa`: regex `^[A-Z0-9]{7}$`, aceita vazio → null.
- `uf`: enum das 27 UFs brasileiras.
- `email`: formato de e-mail.
- `veiculo_ano`: inteiro 1900-2100.
- Datas: regex `^\d{4}-\d{2}-\d{2}$`.

**Helpers:**
- `emptyToNull` — string vazia vira null (campos opcionais).
- `emptyToUndefined` — string vazia vira undefined (campos opcionais).

### 6.2 `mensalidadeCreateSchema`

- `associado_id`: UUID válido.
- `referencia`: regex `^\d{4}-\d{2}$`.
- `valor`: number >= 0.
- `desconto`/`acrescimo`: number >= 0, default 0.
- `vencimento_em`: regex de data ISO.

### 6.3 `pagamentoCreateSchema`

- `mensalidade_id`: UUID.
- `valor_pago`: number > 0.
- `forma_pagamento`: enum FormaPagamento.
- `pago_em`: ISO datetime (opcional).
- `comprovante_url`: URL válida (opcional).

---

## 7. Conformidade

| Critério | Status |
|---|---|
| TypeScript strict + exactOptionalPropertyTypes | ✓ 0 erros |
| Nenhum `any` | ✓ |
| Services isolados (UI nunca acessa Supabase) | ✓ |
| Mensagens técnicas nunca expostas ao usuário | ✓ (`AppError.userMessage`) |
| Logger com sanitização | ✓ (em todas as operações) |
| Operações bloqueadas com mensagem clara | ✓ |
| Tokens puros (sem hexadecimais em services) | ✓ N/A |
| Componentes oficiais (nada de inline) | ✓ N/A (esta fase é services) |
| Auditoria via trigger do banco | ✓ (não duplicada em service) |

---

## 8. Pendências Mantidas (10)

Todas as pendências do `FASE_2_PLAN.md` seção 8 permanecem aguardando decisão do cliente:

| # | Pendência | Operação bloqueada correspondente |
|---|---|---|
| INFO-01 | Regras de cálculo de mensalidades | `gerarLote`, `estornar` |
| INFO-02 | Dia de vencimento padrão | — |
| INFO-03 | Valor padrão da mensalidade | `gerarLote` |
| INFO-04 | Política de inadimplência | `dashboardService.getResumo` (totais brutos) |
| INFO-05 | Categorias internas | — |
| INFO-06 | Workflow de aprovação | — |
| INFO-07 | Permissões de exclusão | — |
| INFO-08 | Formato de comprovante | `pagamentoCreateSchema` |
| INFO-09 | Soft vs hard delete | `associadosService.delete`, `pagamentosService.estornar`, `profilesService.invite` |
| INFO-10 | Confirmação de campos obrigatórios | `associadoCreateSchema` |

---

## 9. Próximo Marco (Fase 2.2)

Conforme `FASE_2_PLAN.md`:
- Componentes auxiliares: `Modal`, `Table`, `Badge`, `EmptyState`, `Tabs` (opcional).
- Sem dependência de regras de negócio.
- Estrutura visual neutra, baseada em tokens e componentes oficiais.

Aguardando aprovação.

---

## 10. Histórico

| Versão | Data | Descrição |
|---|---|---|
| 1.0 | 22/07/2026 | Camada de services neutros + hooks utilitários + tipos de domínio expandidos |
