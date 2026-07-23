# ETAPA 2.3 — DASHBOARD

**Associação dos Bugueiros de São Bento**
**Data:** 22/07/2026
**Status:** Concluído — Aguardando aprovação

---

## 1. Objetivo

Criar a primeira tela real do sistema integrando:

- AppShell (layout global)
- AuthProvider (usuário autenticado)
- Services (dashboardService)
- Component Library (Card, Badge, Skeleton, EmptyState)
- Design System (tokens, Grid 8pt, WCAG AA)

**Restrição:** Nenhum dado fictício. Apenas dados vindos do `dashboardService.getResumo()`.

---

## 2. Estados Implementados

| Estado | Trigger | UI |
|---|---|---|
| **Loading** | `loading === true` | 6 Card skeleton + Skeleton lines, `aria-busy="true"` |
| **Sucesso** | `resumo !== null && isBackendConfigured` | 4 Cards de resumo + 2 Cards de ação rápida |
| **Sem dados** | `resumo` com todos valores = 0 | EmptyState first-use: "Nenhum dado encontrado" |
| **Erro** | `catch` no fetchData | EmptyState error: mensagem + "Tentar novamente" |
| **Backend off** | `BACKEND_NOT_CONFIGURED` | EmptyState first-use: "Backend não configurado" |

---

## 3. Componentes Utilizados

| Componente | Uso | Props-chave |
|---|---|---|
| `Card` | 4 cards de resumo + 2 ações rápidas | `category`, `title`, `value`, `ariaLabel`, `onClick` |
| `Badge` | Valor monetário dentro dos cards | `variant`, `showDot` |
| `Skeleton` | Loading state nos cards | `height`, `width` |
| `EmptyState` | Estados empty e error | `variant`, `title`, `description`, `action` |
| `SectionTitle` | Títulos de seção (h1, h2) | `as`, `title`, `subtitle` |

---

## 4. Dados do Dashboard

`DashboardResumo` (via `dashboardService.getResumo()`):

| Campo | Card | Categoria | Badge |
|---|---|---|---|
| `totalAssociadosAtivos` | Associados ativos | blue | — |
| `totalPagasNoMes` + `valorPagoNoMes` | Pagas no mês | green | success (R$) |
| `totalMensalidadesEmAberto` + `valorEmAberto` | Em aberto | yellow | warning (R$) |
| `totalVencidas` | Vencidas | red | — |

---

## 5. Permissões (usePermission)

| Papel | `associados.write` | `mensalidades.write` | Cards visíveis |
|---|---|---|---|
| admin | ✓ | ✓ | Todos (6) |
| tesoureiro | ✗ | ✓ | Pagas, Em aberto, Vencidas, Ações (4) |
| diretor | ✓ | ✗ | Associados, Ações (2) |
| visualizador | ✗ | ✗ | Ações rápidas (2) |

---

## 6. Acessibilidade

| Requisito | Implementação |
|---|---|
| Landmark `<main>` | `<main aria-label="Dashboard">` |
| Headings hierárquicos | h1 = "Olá, {nome}"; h2 = "Resumo", "Ações rápidas" |
| `aria-busy` | Loading section com `aria-busy="true"` |
| `aria-label` | Cada Card tem `ariaLabel` descritivo |
| `role="status"` | EmptyState usa `role="status"` |
| Foco visível | `--shadow-focus` em todos os interativos |
| Contraste | Tokens oficiais (WCAG AA) |
| Touch target | Cards com min-height 112px; ações ≥48px |

---

## 7. Responsividade

| Breakpoint | Grid | Cards por linha |
|---|---|---|
| 320px | `repeat(2, 1fr)` | 2 |
| 375px | `repeat(2, 1fr)` | 2 |
| 390px | `repeat(2, 1fr)` | 2 |
| 430px | `repeat(2, 1fr)` | 2 |
| ≥480px | `repeat(3, 1fr)` | 3 |

- Sem scroll horizontal.
- Espaçamentos via tokens: `--space-card` (16px), `--space-section` (24px).
- Cards adaptáveis com `width: 100%`.

---

## 8. Arquivos

### Criados (1)

| Arquivo | Linhas |
|---|---|
| `src/pages/Inicio/InicioPage.module.css` | 33 |

### Modificados (1)

| Arquivo | Linhas | Alteração |
|---|---|---|
| `src/pages/Inicio/InicioPage.tsx` | ~190 | Reescrito — Dashboard completo |

---

## 9. Validações

| Comando | Resultado |
|---|---|
| `npm run typecheck` | ✓ 0 erros |
| `npm run lint` | ✓ 0 erros |
| `npm run build` | ✓ Sucesso em 3.49s |
| Bundle InicioPage JS (gzip) | 2.62 kB (code splitting) |
| Bundle InicioPage CSS (gzip) | 0.72 kB |
| Bundle total JS (gzip) | 61.33 kB (+0.03 kB) |
| PWA precache | 42 entries (692.99 KiB) |
| Code splitting | ✓ Ativo |

---

## 10. Decisões Tomadas

| # | Decisão | Justificativa |
|---|---|---|
| 1 | Sem dados fictícios | Conforme regra obrigatória — apenas dashboardService |
| 2 | EmptyState para backend off | `BACKEND_NOT_CONFIGURED` tratado como estado visual |
| 3 | Badges dentro dos Cards | Valor monetário integrado ao card (não componente separado) |
| 4 | Permissões condicionam cards | `usePermission`控制 quais cards aparecem |
| 5 | CSS Module para grid | Evita CSS inline; segue convenções do projeto |
| 6 | `window.location.assign` para navegação | Sem useNavigate — manter dashboard isolado |
| 7 | Grid 2→3 colunas | Adaptável de 320px a desktop |

---

## 11. Pendências Nesta Fase

Nenhuma. Todos os requisitos foram implementados.

---

## 12. Dependências para Próxima Fase (Fase 2.4 — Associados)

| Item | Status |
|---|---|
| `associadosService` | ✓ Implementado (Fase 2.1) |
| `Table` component | ✓ Implementado (Fase 2.2) |
| `Modal` component | ✓ Implementado (Fase 2.2) |
| `EmptyState` component | ✓ Implementado (Fase 2.2) |
| `usePagination` hook | ✓ Implementado (Fase 2.1) |
| Zod validators | ✓ Implementado (Fase 2.1) |

---

## 13. Aprovação

Aguardando aprovação do cliente para iniciar **Fase 2.4 — Associados**.
