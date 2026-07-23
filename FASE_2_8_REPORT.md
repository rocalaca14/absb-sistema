# FASE_2_8_REPORT.md — Correções de Qualidade Pré-Fase 3

**Data:** 22/07/2026
**Status:** Concluído.

---

## 1. Correções Executadas

### 1.1 Modal Footer Buttons (Crítica)

**Arquivo:** `src/components/ui/Modal/Modal.tsx`

**Antes:**
- Botões raw `<button>` com inline styles (`width: auto`, `height: auto`, `padding: 8px 16px`)
- Height estimado ~32px — violação 48×48
- Background hardcoded `var(--color-primary)` e `var(--color-text-on-primary)`
- Classe `styles.closeButton` reutilizada para botões de ação (naming confuso)

**Depois:**
- Componente `Button` oficial com variant `secondary`/`primary`
- Height automático via Button (48px mínimo garantido)
- Tokens via Button CSS
- Focus visível via `focus-visible` do Button
- Acessibilidade mantida

**Impacto:** Violação 48×48 eliminada. Design system respeitado.

### 1.2 roleSelect Height (Crítica)

**Arquivo:** `src/pages/Configuracoes/ConfiguracoesPage.module.css`

**Antes:**
```css
height: 36px;
```

**Depois:**
```css
height: 48px;
min-height: 48px;
```

Também renomeado `.roleSelect:focus` → `.roleSelect:focus-visible` para alinhar com padrão do projeto.

**Impacto:** Violação 48×48 eliminada.

### 1.3 Navegação SPA (Alta)

**Arquivo:** `src/pages/Inicio/InicioPage.tsx`

**Antes:**
- 3 ocorrências de `window.location.assign('/associados')` e `window.location.assign('/mensalidades')`
- Causava recarrega completo da página, perdendo estado React

**Depois:**
- `useNavigate()` do react-router-dom
- `navigate(ROUTES.ASSOCIADOS)` e `navigate(ROUTES.MENSALIDADES)`
- Navegação SPA preservando estado

**Impacto:** Performance e UX melhoradas. Sem recarregamentos desnecessários.

### 1.4 Utilitários Centralizados (Média)

**Arquivo:** `src/utils/formatters.ts` (novo)

**Funções exportadas:**
- `formatCurrency(value: number)` — formata moeda BRL
- `formatDate(dateStr: string | null)` — formata data pt-BR
- `formatDateTime(dateStr: string | null)` — formata data+hora pt-BR

**Arquivos atualizados (6):**
| Arquivo | Funções removidas | Import adicionado |
|---|---|---|
| `InicioPage.tsx` | `formatCurrency` | `{ formatCurrency }` |
| `MensalidadesPage.tsx` | `formatCurrency`, `formatDate` | `{ formatCurrency, formatDate }` |
| `MensalidadeDetalheModal.tsx` | `formatCurrency`, `formatDate` | `{ formatCurrency, formatDate }` |
| `PagamentoModal.tsx` | `formatCurrency`, `formatDate` | `{ formatCurrency, formatDate }` |
| `PagamentoHistoricoModal.tsx` | `formatCurrency`, `formatDateTime` | `{ formatCurrency, formatDateTime }` |
| `AssociadoDetailModal.tsx` | `formatDate` | `{ formatDate }` |

**Impacto:** 6 cópias de funções eliminadas. Manutenção centralizada.

### 1.5 N+1 Query em profilesService (Média)

**Arquivo:** `src/services/profiles.service.ts`

**Antes:**
```typescript
const items: UserListItem[] = [];
for (const row of data ?? []) {
  // ... await getUserById (sequencial)
  items.push(...);
}
```

**Depois:**
```typescript
const items = await Promise.all(
  (data ?? []).map(async (row) => {
    // ... await getUserById (paralelo)
    return toUserListItem(...);
  }),
);
```

**Impacto:** Queries de auth agora executam em paralelo, reduzindo latência total.

---

## 2. Validações

| Validação | Resultado |
|---|---|
| `npm run typecheck` | ✓ 0 erros |
| `npm run lint` | ✓ 0 erros |
| `npm run build` | ✓ 3.81s |
| Total JS (gzip) | ~83.2 kB |
| Total CSS (gzip) | ~8.0 kB |
| PWA precache | 54 entries (762.99 KiB) |

---

## 3. Melhorias Documentadas para Fase 3

| # | Melhoria | Prioridade | Descrição |
|---|---|---|---|
| 1 | Busca server-side Mensalidades | Alta | Atualmente filtra client-side apenas a página atual |
| 2 | Pagamentos batch update | Média | `pagamentosService.create` deveria usar transaction |
| 3 | CSS morto remanescente | Baixa | `.role` (InicioPage), `.statusActive`/`.statusInactive` (AssociadosPage), `.referenciaCell` (MensalidadesPage) |
| 4 | Ícone "Filter" para "Editar" | Baixa | Usar ícone correto no AssociadoDetailModal |
| 5 | `observacoes` como textarea | Baixa | AssociadoFormModal usa Input para campo longo |

---

## 4. Arquivos Modificados

| Arquivo | Alteração |
|---|---|
| `src/components/ui/Modal/Modal.tsx` | Button oficial no footer, sem inline styles |
| `src/pages/Configuracoes/ConfiguracoesPage.module.css` | roleSelect height 48px |
| `src/pages/Inicio/InicioPage.tsx` | useNavigate, import formatCurrency |
| `src/utils/formatters.ts` | Novo — funções centralizadas |
| `src/pages/Mensalidades/MensalidadesPage.tsx` | Import formatters |
| `src/pages/Mensalidades/MensalidadeDetalheModal.tsx` | Import formatters |
| `src/pages/Mensalidades/PagamentoModal.tsx` | Import formatters |
| `src/pages/Mensalidades/PagamentoHistoricoModal.tsx` | Import formatters |
| `src/pages/Associados/AssociadoDetailModal.tsx` | Import formatters |
| `src/services/profiles.service.ts` | Promise.all em list() |

---

**Fase 2.8 concluída. Pronto para Fase 3.**
