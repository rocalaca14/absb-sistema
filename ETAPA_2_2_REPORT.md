# ETAPA 2.2 — COMPONENTES AUXILIARES

**Associação dos Bugueiros de São Bento**
**Data:** 22/07/2026
**Status:** Concluído — Aguardando aprovação

---

## 1. Objetivo

Implementar componentes auxiliares de UI para apoiar a construção das telas de negócio (Fase 2.3+). Todos os componentes seguem Design Tokens, WCAG AA, Grid 8pt e a restrição da Fase 2: **sem regras de negócio, cálculos financeiros, ou workflows de aprovação**.

---

## 2. Componentes Implementados

### 2.1 Modal

**Arquivo:** `src/components/ui/Modal/Modal.tsx` (223 linhas)
**CSS:** `src/components/ui/Modal/Modal.module.css` (136 linhas)

| Requisito | Status |
|---|---|
| `role="dialog"` | ✓ |
| `aria-modal="true"` | ✓ |
| `aria-labelledby` (título) | ✓ |
| `aria-describedby` (descrição opcional) | ✓ |
| Focus trap (Tab / Shift+Tab) | ✓ |
| Foco inicial no primeiro elemento focável | ✓ |
| Fechamento por ESC | ✓ |
| Fechamento por botão X | ✓ |
| Fechamento por backdrop click (configurável) | ✓ |
| Restauração de foco ao fechar | ✓ |
| Body scroll lock | ✓ |
| `prefers-reduced-motion` | ✓ |

**Sizes:** `sm` (400px), `md` (600px), `lg` (800px), `full` (960px).

**Ações:** `primaryAction` e `secondaryAction` com `label`, `onClick`, `variant`, `disabled`, `loading`.

**Tokens utilizados:** `--z-modal-backdrop`, `--z-modal`, `--color-overlay-strong`, `--color-card`, `--color-border`, `--color-background`, `--space-*`, `--radius-xl`, `--radius-md`, `--shadow-modal`, `--duration-base`, `--duration-slow`, `--easing-standard`, `--easing-enter`.

---

### 2.2 Table

**Arquivo:** `src/components/ui/Table/Table.tsx` (171 linhas)
**CSS:** `src/components/ui/Table/Table.module.css` (132 linhas)

| Requisito | Status |
|---|---|
| Genérica (`Table<T>`) | ✓ |
| Loading (5 skeleton rows) | ✓ |
| Empty state (slot `empty`) | ✓ |
| Responsividade mobile (card view) | ✓ |
| Sem scroll horizontal | ✓ |
| `<table>` semântico | ✓ |
| `<th scope="col">` | ✓ |
| Linhas clicáveis com `tabIndex` + `onKeyDown` | ✓ |
| Hover / focus-within | ✓ |
| Slot `footer` para paginação | ✓ |

**Desktop:** tabela tradicional com `<thead>` e `<tbody>`.

**Mobile (≤767px):** cada vira um card empilhado. `data-label` é exibido antes do valor via CSS `::before`. Colunas com `hideOnMobile` são ocultadas.

**Props:** `columns`, `rows`, `getRowKey`, `loading`, `empty`, `onRowClick`, `footer`, `className`.

---

### 2.3 Badge

**Arquivo:** `src/components/ui/Badge/Badge.tsx` (35 linhas)
**CSS:** `src/components/ui/Badge/Badge.module.css` (47 linhas)

| Variante | Background Token | Texto Token |
|---|---|---|
| `success` | `--color-success-bg` | `--color-success` |
| `warning` | `--color-warning-bg` | `--color-warning` |
| `danger` | `--color-danger-bg` | `--color-danger` |
| `info` | `--color-info-bg` | `--color-primary` |
| `neutral` | `--color-neutral-bg` | `--color-text-secondary` |

**Características:** pill (`--radius-pill`), padding 4px 10px, font caption semibold, dot opcional (6px, `currentColor`).

**Nenhuma cor fora dos tokens.** Todas as 5 variantes usam tokens existentes ou os novos tokens de background.

---

### 2.4 EmptyState

**Arquivo:** `src/components/ui/EmptyState/EmptyState.tsx` (88 linhas)
**CSS:** `src/components/ui/EmptyState/EmptyState.module.css` (57 linhas)

| Variante | Ícone padrão | Cor do ícone | Tom |
|---|---|---|---|
| `empty` | `Search` | `--color-primary` (info-bg) | Neutro |
| `first-use` | `Plus` | `--color-success` (success-bg) | Convidativo |
| `error` | `AlertTriangle` | `--color-danger` (danger-bg) | Erro |

**Props:** `variant`, `icon` (override), `title`, `description?`, `action?` ({ label, onClick, variant? }), `className`.

**Layout:** card centralizado, borda dashed, ícone circular 64px, min-height 240px, `role="status"`.

---

### 2.5 Tabs (opcional)

**Arquivo:** `src/components/ui/Tabs/Tabs.tsx` (76 linhas)
**CSS:** `src/components/ui/Tabs/Tabs.module.css`

| Requisito | Status |
|---|---|
| `role="tablist"` | ✓ |
| `role="tab"` | ✓ |
| `aria-selected` | ✓ |
| `aria-controls` | ✓ |
| Roving tabIndex (ativa=0, demais=-1) | ✓ |
| `aria-label` | ✓ |

**Props:** `items` (key, label, icon?, badge?), `value`, `onChange`, `className`, `aria-label`.

**Visual:** underline teal para tab ativa, scroll horizontal em mobile, badge opcional numérico.

---

## 3. Tokens Adicionados em `tokens.css`

| Token | Valor | Uso |
|---|---|---|
| `--color-success-bg` | `rgba(16, 185, 129, 0.12)` | Badge success, EmptyState first-use |
| `--color-warning-bg` | `rgba(245, 158, 11, 0.12)` | Badge warning |
| `--color-danger-bg` | `rgba(239, 68, 68, 0.12)` | Badge danger, EmptyState error |
| `--color-info-bg` | `rgba(0, 186, 185, 0.12)` | Badge info, EmptyState empty |
| `--color-neutral-bg` | `rgba(107, 114, 128, 0.12)` | Badge neutral |
| `--color-overlay-strong` | `rgba(0, 0, 0, 0.64)` | Modal backdrop |

---

## 4. Barrel Export

`src/components/ui/index.ts` atualizado com todos os 12 componentes UI:

```
Button, Card, Icon, Input, SectionTitle, Skeleton, Toast,
Modal, Table, Badge, EmptyState, Tabs
```

---

## 5. Validações

| Comando | Resultado |
|---|---|
| `npm run typecheck` | ✓ 0 erros |
| `npm run lint` | ✓ 0 erros |
| `npm run build` | ✓ Sucesso em 3.73s |
| Bundle JS (gzip) | 61.30 kB (sem variação) |
| Bundle CSS (gzip) | 3.18 kB (+0.08 kB) |
| PWA precache | 41 entries (684.17 KiB) |
| Code splitting | ✓ Ativo |

---

## 6. Arquivos Criados / Modificados

### Criados (15 arquivos)

| Arquivo | Linhas |
|---|---|
| `src/components/ui/Modal/Modal.tsx` | 223 |
| `src/components/ui/Modal/Modal.module.css` | 136 |
| `src/components/ui/Modal/index.ts` | 1 |
| `src/components/ui/Table/Table.tsx` | 171 |
| `src/components/ui/Table/Table.module.css` | 132 |
| `src/components/ui/Table/index.ts` | 1 |
| `src/components/ui/Badge/Badge.tsx` | 35 |
| `src/components/ui/Badge/Badge.module.css` | 47 |
| `src/components/ui/Badge/index.ts` | 1 |
| `src/components/ui/EmptyState/EmptyState.tsx` | 88 |
| `src/components/ui/EmptyState/EmptyState.module.css` | 57 |
| `src/components/ui/EmptyState/index.ts` | 1 |
| `src/components/ui/Tabs/Tabs.tsx` | 76 |
| `src/components/ui/Tabs/Tabs.module.css` | ~60 |
| `src/components/ui/Tabs/index.ts` | 1 |

### Modificados (3 arquivos)

| Arquivo | Alteração |
|---|---|
| `src/components/ui/index.ts` | Barrel export expandido (7 → 12 componentes) |
| `src/design-system/tokens.css` | 6 novos tokens de background/overlay |
| `COMPONENT_LIBRARY.md` | Seções 6-7 documentadas, numeração corrigida |

---

## 7. Pendências Nesta Fase

Nenhuma. Todos os componentes foram implementados conforme especificado.

---

## 8. Dependências para Próxima Fase (Fase 2.3 — Dashboard)

| Pendência | Descrição |
|---|---|
| Pré-apresentação | Objetivo, dados, componentes, permissões, regras de negócio |
| `dashboardService.getResumo` | Já implementado (retorna totais brutos) |
| Cards de resumo | Componentes Card existentes, prontos para uso |
| Filtros de período | Pode usar Input + Button existentes |

---

## 9. Aprovação

Aguardando aprovação do cliente para iniciar **Fase 2.3 — Dashboard**.
