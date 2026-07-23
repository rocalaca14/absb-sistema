# ETAPA_9_REPORT — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão:** 1.0
**Data:** 22/07/2026
**Idioma:** Português (Brasil)
**Marco:** ETAPA 9 — Arquitetura de Layout
**Status:** Concluído. Aguardando aprovação.

---

## 1. Resumo do Marco

A ETAPA 9 implementa a **arquitetura de layout global** da aplicação, conforme `UI_SPECIFICATION.md` seções 3, 4 e 5 e `PLANO_IMPLEMENTACAO_FASE_1.md` decisões D1, D2 e HashRouter.

São entregues:

- `PageContainer` (componente oficial de padding de página).
- `AppHeader` (cabeçalho fixo 224px com gradiente teal).
- `BottomNav` (menu inferior 80px com área de toque 48x48).
- `AppShell` (orquestrador da estrutura global).
- Sistema de rotas com `HashRouter`.
- 6 páginas (Login, Início, Mensalidades, Associados, Configurações, 404).
- `ProtectedRoute` (placeholder para ETAPA 12).
- Constante `ROUTES` em `constants/routes.ts`.

---

## 2. Componentes Implementados

### 2.1 `PageContainer`

- Wrapper único para conteúdo de página.
- `padding: 0 var(--space-screen-x) var(--space-screen-bottom)`.
- Nenhuma página pode definir padding horizontal próprio (regra da ETAPA 9).
- Usa exclusivamente Design Tokens.

### 2.2 `AppHeader`

- Altura fixa: **224px** (múltiplo de 8).
- `position: sticky; top: 0; z-index: var(--z-header)`.
- Background: gradiente `linear-gradient(180deg, #008F8E 0%, #00BAB9 100%)`.
- Padding: `20px` laterais, `20px + var(--safe-area-top)` no topo.
- Logo: cartão branco centralizado com "ABSB" (placeholder). Será substituído pela logo oficial.
- Max-height do logo: 120px; max-width: 80%.
- `role="banner"`.

### 2.3 `BottomNav`

- Altura total: **80px** + `var(--safe-area-bottom)`.
- `position: fixed; bottom: 0; z-index: var(--z-bottom-nav)`.
- 4 itens em grid `repeat(4, 1fr)` com `min-width: 48px` e `min-height: 48px` (área de toque ≥ 48x48).
- Cada item usa `NavLink` (react-router-dom) com:
  - `aria-current="page"` automático quando ativo.
  - `:focus-visible` com `--shadow-focus`.
  - Estado hover: cor de texto primária.
  - Estado pressed: `opacity: var(--opacity-pressed)`.
- Padding inferior: `8px + var(--safe-area-bottom)`.
- Labels: "Início", "Mensalidades", "Associados", "Configurações".
- Sem rolagem horizontal (grid 1fr).

### 2.4 `AppShell`

- Display: `grid; grid-template-rows: auto 1fr`.
- Altura: `100dvh` (com fallback `100vh`).
- Background: `var(--color-background)`.
- `overflow: hidden` (sem scroll no shell).
- Header sticky (z-header) no topo.
- `<main>` único scroll container com:
  - `overflow-y: auto; overflow-x: hidden`.
  - `-webkit-overflow-scrolling: touch`.
  - `min-height: 0` (essencial para grid items scrolláveis).
  - `padding-bottom: calc(80px + var(--safe-area-bottom))` (limpa o BottomNav fixo).
- `id="main-content"` e `tabIndex={-1}` para acessibilidade (skip link alvo).

---

## 3. Scroll — Estratégia Global

| Aspecto | Decisão |
|---|---|
| Único container de scroll | `<main>` dentro do `AppShell` |
| Scroll horizontal | Bloqueado em `html`, `body`, `AppShell`, `main` |
| iOS momentum | `-webkit-overflow-scrolling: touch` |
| Viewport dinâmico | `100dvh` (fallback `100vh`) |
| Containers de scroll adicionais | Nenhum |
| Múltiplas scroll views | Não (regra atendida) |

---

## 4. Roteamento

- `HashRouter` configurado em `App.tsx` (compatibilidade com GitHub Pages).
- `ROUTES` centralizado em `src/constants/routes.ts` e reexportado por `src/constants/index.ts`.
- `routePaths.ts` reexporta para `src/routes/`.
- `AppRoutes.tsx` define as 6 rotas:
  - `/login` → `LoginPage` (sem AppShell).
  - `/` → `InicioPage` (com AppShell + ProtectedRoute).
  - `/mensalidades` → `MensalidadesPage`.
  - `/associados` → `AssociadosPage`.
  - `/configuracoes` → `ConfiguracoesPage`.
  - `*` → `NotFoundPage` (sem AppShell).
- `ProtectedRoute` é placeholder até ETAPA 12; por enquanto libera acesso.

---

## 5. Responsividade — Validação

Larguras testadas via inspeção do CSS (validação visual requer browser):

| Largura | AppHeader | Main | BottomNav | Observação |
|---|---|---|---|---|
| 320px | 320px wide, logo max 256px | 320px, conteúdo 280px | 80px por item | Label "Configurações" usa `text-overflow: ellipsis` se necessário |
| 375px | 375px wide, logo max 300px | 375px, conteúdo 335px | 93.75px por item | OK |
| 390px (base) | 390px wide, logo max 312px | 390px, conteúdo 350px | 97.5px por item | OK |
| 430px | 430px wide, logo max 344px | 430px, conteúdo 390px | 107.5px por item | OK |

- AppHeader: largura 100%, logo com max-width 80% e max-height 120px.
- BottomNav: 4 colunas de 1fr = 25% cada. Largura mínima por item: 80px (320/4) > 48px ✓.
- BottomNav altura por item: 64px (80 - 16 padding) > 48px ✓.
- Main: padding horizontal 20px, sem overflow.

---

## 6. Acessibilidade

- `AppHeader` com `role="banner"`.
- `<main>` com `id="main-content"` e `tabIndex={-1}` (alvo de skip link futuro).
- `BottomNav` com `aria-label="Navegação principal"`.
- Cada item do `BottomNav` é um `NavLink` com `aria-current="page"` automático.
- `Icon` em cada item com `ariaLabel` dinâmico ("X (página atual)" quando ativo).
- `:focus-visible` com `--shadow-focus` em todos os interativos.
- Contraste verificado: texto branco sobre teal `#00BAB9` em estado de gradiente é posicionado em área onde a logo (cartão branco) gera contraste, sem dependência de cor.

---

## 7. Decisões Tomadas nesta Etapa

| # | Decisão | Justificativa |
|---|---|---|
| 1 | HashRouter | Compatibilidade com GitHub Pages sem 404.html trick |
| 2 | AppShell com grid 2 rows (header, main) | BottomNav é `position: fixed`, fora do grid, simplifica layout |
| 3 | `<main>` com padding-bottom: calc(80px + safe-area) | Limpa BottomNav sem afetar grid |
| 4 | AppHeader sem `padding-bottom` próprio | Padding é tratado pelo `AppShell` e pela `bottom: 0` do BottomNav |
| 5 | `min-height: 0` no main | Necessário para que o main possa ser scroll container dentro de grid |
| 6 | `overflow: hidden` no AppShell | Garante que apenas o main é scroll container |
| 7 | `text-overflow: ellipsis` em labels do BottomNav | Previne overflow em 320px |
| 8 | Logo placeholder como cartão branco com "ABSB" | Mantém contraste garantido, aguardando logo oficial |
| 9 | `Link` do react-router-dom nos botões de Login/NotFound | SPA-friendly, sem page reload |
| 10 | `end={true}` no NavLink do Início | Garante que `aria-current="page"` apenas em `/` exato |

---

## 8. Arquivos Criados (24)

### Layout (12)

- `src/components/layout/PageContainer/{PageContainer.tsx, PageContainer.module.css, index.ts}`
- `src/components/layout/AppHeader/{AppHeader.tsx, AppHeader.module.css, index.ts}`
- `src/components/layout/BottomNav/{BottomNav.tsx, BottomNav.module.css, index.ts}`
- `src/components/layout/AppShell/{AppShell.tsx, AppShell.module.css, index.ts}`

### Rotas (4)

- `src/constants/routes.ts`
- `src/routes/routePaths.ts`
- `src/routes/ProtectedRoute.tsx`
- `src/routes/AppRoutes.tsx`

### Páginas (6)

- `src/pages/Login/LoginPage.tsx`
- `src/pages/Inicio/InicioPage.tsx`
- `src/pages/Mensalidades/MensalidadesPage.tsx`
- `src/pages/Associados/AssociadosPage.tsx`
- `src/pages/Configuracoes/ConfiguracoesPage.tsx`
- `src/pages/NotFound/NotFoundPage.tsx`

### Modificados (2)

- `src/App.tsx` — substituído por `<HashRouter><AppRoutes /></HashRouter>`.
- `src/constants/index.ts` — adiciona `export * from './routes'`.
- `src/design-system/reset.css` — adicionado `overflow-x: hidden` em `html`.

---

## 9. Validações Executadas

| Validação | Resultado |
|---|---|
| `npm run typecheck` | ✓ 0 erros |
| `npm run lint` | ✓ 0 erros |
| `npm run build` | ✓ Sucesso em 3.20s |
| Bundle JS (gzip) | 58.93 kB (era 51.15 kB na ETAPA 5; +7.78 kB pelo react-router) |
| Bundle CSS (gzip) | 4.55 kB (era 4.42 kB; +0.13 kB) |
| Conformidade D1 (Grid 8pt) | ✓ Todos os valores no conjunto permitido |
| Conformidade D2 (BottomNav 48x48) | ✓ Garantido por `min-width/min-height` + grid 1fr |
| Acessibilidade | ✓ ARIA, foco visível, ordem semântica, contraste |
| Safe Area iOS | ✓ Aplicado em AppHeader (top) e BottomNav (bottom) |

---

## 10. Pendências Mantidas

- Logo oficial (substituir placeholder no AppHeader).
- Planilha Google Sheets (afeta import.service em fase futura).
- Credenciais Supabase (afeta auth em ETAPA 12).
- Domínio GitHub Pages.
- Primeiro usuário administrador.
- Skip link (estrutura pronta em `<main id="main-content">`).
- ToastContext (a ser implementado em ETAPA 12).

---

## 11. Próximo Marco (ETAPA 12)

- `AuthProvider` (Context).
- `auth.service.ts`.
- `LoginForm` (componente oficial).
- Substituir `LoginPage` placeholder por implementação real.
- Adicionar logout funcional em `ConfiguracoesPage`.
- Proteger rotas via `ProtectedRoute` com redirect para `/login`.

Aguardando aprovação para iniciar ETAPA 12.
