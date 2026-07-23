# PLANO DE IMPLEMENTAÇÃO — FASE 1 (FUNDAÇÃO)

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Data:** 22/07/2026
**Idioma:** Português (Brasil)
**Status:** Aguardando aprovação
**Documentação de referência:** toda a documentação oficial validada em `DOCUMENTATION_VALIDATION_REPORT.md`

---

## 1. Objetivo da Fase 1

Implementar a **fundação técnica** do projeto ABSB: estrutura de código, Design System em tokens CSS, biblioteca de componentes oficial, autenticação, navegação, PWA, migrations de banco e CI/CD — **sem regras de negócio**.

Ao final desta fase, o sistema deve estar:

- Construível e publicável em produção.
- Pronto para receber os módulos funcionais da versão 1.0 (Dashboard, Mensalidades, Associados, Configurações).
- Com todos os 12 componentes da `COMPONENT_LIBRARY.md` implementados e reutilizáveis.
- Com login funcional, layout montado e navegação entre 4 abas.
- Com PWA instalável.
- Com schema do Supabase aplicado e RLS ativo.

**Fora do escopo desta fase:**

- Tela de Dashboard com dados.
- Telas funcionais de Mensalidades, Associados, Configurações (apenas placeholders).
- Importação de planilha (estrutura apenas, sem mapeamento).
- Relatórios, auditoria funcional, notificações push.
- Testes automatizados (estrutura preparada, sem testes nesta fase).

---

## 2. Estrutura Inicial de Pastas

```
app-absb/
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   ├── logo-absb-192.png            (placeholder até logo oficial)
│   ├── logo-absb-512.png            (placeholder)
│   ├── logo-absb-maskable-512.png   (placeholder)
│   └── logo-absb-180.png            (placeholder, Apple touch icon)
│
├── supabase/
│   └── migrations/
│       ├── 0001_init_schema.sql
│       ├── 0002_rls_policies.sql
│       └── 0003_seed_roles.sql
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   │
│   ├── design-system/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   └── typography.css
│   │
│   ├── constants/
│   │   ├── index.ts
│   │   ├── grid.ts
│   │   ├── layout.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   ├── radius.ts
│   │   ├── shadow.ts
│   │   ├── animation.ts
│   │   ├── opacity.ts
│   │   ├── zindex.ts
│   │   ├── breakpoints.ts
│   │   ├── colors.ts
│   │   ├── icons.ts
│   │   ├── routes.ts
│   │   ├── permissions.ts
│   │   ├── componentVariants.ts
│   │   ├── storage.ts
│   │   ├── supabase.ts
│   │   ├── errors.ts
│   │   ├── time.ts
│   │   ├── cache.ts
│   │   ├── importacao.ts
│   │   ├── pwa.ts
│   │   └── textos.ts
│   │
│   ├── types/
│   │   ├── env.d.ts
│   │   ├── database.types.ts
│   │   └── domain.types.ts
│   │
│   ├── core/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   ├── sheets/
│   │   │   ├── client.ts
│   │   │   ├── parser.ts
│   │   │   └── mapeamento.ts
│   │   ├── cache/
│   │   │   └── memoryCache.ts
│   │   ├── errors/
│   │   │   └── AppError.ts
│   │   └── logger/
│   │       └── logger.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── associados.service.ts
│   │   ├── mensalidades.service.ts
│   │   └── importacao.service.ts
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useToast.ts
│   │   ├── useDebounce.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validators.ts
│   │   ├── csv.ts
│   │   └── textos.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   ├── Input/
│   │   │   ├── SectionTitle/
│   │   │   ├── Skeleton/
│   │   │   ├── Icon/
│   │   │   └── Toast/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── AppShell.module.css
│   │   │   ├── AppHeader.tsx
│   │   │   ├── AppHeader.module.css
│   │   │   ├── BottomNav.tsx
│   │   │   ├── BottomNav.module.css
│   │   │   ├── PageContainer.tsx
│   │   │   └── PageContainer.module.css
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── LoginForm.module.css
│   │
│   ├── pages/
│   │   ├── Login/
│   │   │   └── LoginPage.tsx
│   │   ├── Inicio/
│   │   │   └── InicioPage.tsx
│   │   ├── Mensalidades/
│   │   │   └── MensalidadesPage.tsx
│   │   ├── Associados/
│   │   │   └── AssociadosPage.tsx
│   │   ├── Configuracoes/
│   │   │   └── ConfiguracoesPage.tsx
│   │   └── NotFound/
│   │       └── NotFoundPage.tsx
│   │
│   └── routes/
│       ├── AppRoutes.tsx
│       ├── ProtectedRoute.tsx
│       └── routePaths.ts
│
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── index.html
├── package.json
├── package-lock.json            (gerado)
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 3. Arquivos a Criar

### 3.1 Configuração de Projeto (raiz)

| Arquivo | Propósito |
|---|---|
| `package.json` | Dependências e scripts. |
| `tsconfig.json` | TypeScript strict. |
| `tsconfig.node.json` | TS para `vite.config.ts`. |
| `vite.config.ts` | Vite + `vite-plugin-pwa` + path alias `@`. |
| `index.html` | HTML root com meta tags PWA e iOS. |
| `.env.example` | Placeholders de variáveis de ambiente. |
| `.gitignore` | Exclusões (node_modules, dist, .env). |
| `.eslintrc.cjs` | ESLint com React + TypeScript. |
| `.prettierrc` | Prettier padrão. |
| `README.md` | Setup, scripts, deploy, links para docs. |

### 3.2 PWA e Assets (`public/`)

| Arquivo | Propósito |
|---|---|
| `favicon.ico` | Favicon padrão. |
| `robots.txt` | Permite indexação básica. |
| `logo-absb-192.png` | Ícone PWA 192. Placeholder até logo oficial. |
| `logo-absb-512.png` | Ícone PWA 512. Placeholder. |
| `logo-absb-maskable-512.png` | Ícone maskable. Placeholder. |
| `logo-absb-180.png` | Apple touch icon. Placeholder. |

### 3.3 Design System (`src/design-system/`)

| Arquivo | Conteúdo principal |
|---|---|
| `tokens.css` | Todas as variáveis CSS (cores, tipografia, espaçamentos, raio, sombra, animação, opacidade, z-index, breakpoints, safe area). |
| `reset.css` | Reset CSS (box-sizing, margin, font). |
| `typography.css` | Estilos base de tipografia (Inter, escala, line-height). |

### 3.4 Constantes (`src/constants/`)

22 arquivos conforme `CONSTANTS.md`. Cada arquivo exporta as constantes documentadas. `index.ts` reexporta tudo.

### 3.5 Types (`src/types/`)

| Arquivo | Conteúdo |
|---|---|
| `env.d.ts` | Tipagem de `import.meta.env`. |
| `database.types.ts` | Tipos gerados do Supabase (estrutura inicial, placeholder até geração real). |
| `domain.types.ts` | Tipos de domínio (Role, CardCategory, ButtonVariant, ToastVariant, etc.). |

### 3.6 Core (`src/core/`)

| Arquivo | Conteúdo |
|---|---|
| `supabase/client.ts` | Cliente `createClient<Database>` com config auth. |
| `supabase/types.ts` | Re-exports de `database.types.ts`. |
| `sheets/client.ts` | `fetchCSV(url)` — busca CSV de planilha pública. |
| `sheets/parser.ts` | Wrapper de `papaparse` para CSV → array de objetos. |
| `sheets/mapeamento.ts` | Estrutura vazia de mapeamento (aguarda planilha). |
| `cache/memoryCache.ts` | Singleton LRU com TTL. |
| `errors/AppError.ts` | Classe de erro padronizada. |
| `logger/logger.ts` | Logger com níveis e comportamento por ambiente. |

### 3.7 Services (`src/services/`)

| Arquivo | Conteúdo |
|---|---|
| `auth.service.ts` | `signIn`, `signOut`, `getCurrentUser`, `getProfile`. |
| `associados.service.ts` | Estrutura com `list`, `get`, `create`, `update`, `delete` retornando `{ data, error }` com `AppError`. Implementação real na v1.0. |
| `mensalidades.service.ts` | Estrutura. Implementação real na v1.0. |
| `importacao.service.ts` | Estrutura. Implementação real após planilha. |

### 3.8 Contexts e Hooks

| Arquivo | Conteúdo |
|---|---|
| `contexts/AuthContext.tsx` | Provider de auth. |
| `contexts/ToastContext.tsx` | Provider de toast. |
| `hooks/useAuth.ts` | Hook de acesso ao `AuthContext`. |
| `hooks/useToast.ts` | Hook de acesso ao `ToastContext`. |
| `hooks/useDebounce.ts` | Hook genérico de debounce. |
| `hooks/useMediaQuery.ts` | Hook de comparação com breakpoints. |

### 3.9 Utils (`src/utils/`)

| Arquivo | Conteúdo |
|---|---|
| `format.ts` | `formatCpf`, `formatPhone`, `formatCurrency`, `formatDate`. |
| `validators.ts` | Schemas Zod (auth, associados, etc.). |
| `csv.ts` | Helpers de CSV. |
| `textos.ts` | Strings de UI centralizadas. |

### 3.10 Componentes UI (`src/components/ui/`)

12 componentes conforme `UI_SPECIFICATION.md` e `COMPONENT_LIBRARY.md`. Cada componente em pasta própria com `.tsx`, `.module.css`, `index.ts`.

Componentes:

- `Button` (3 variantes: primary, secondary, tertiary).
- `Card` (4 categorias).
- `Input` (com label, helper, error).
- `SectionTitle` (com subtitle opcional).
- `Skeleton` (pulse).
- `Icon` (wrapper de lucide).
- `Toast` (4 variantes).

### 3.11 Componentes de Layout (`src/components/layout/`)

- `AppShell` (grid 224/1fr/80).
- `AppHeader` (224px, logo centralizada, gradient).
- `BottomNav` (80px, 4 itens, 48x48 touch area, safe area).
- `PageContainer` (padding 20px + safe area).

### 3.12 Componentes de Auth (`src/components/auth/`)

- `LoginForm` (e-mail + senha + botão submit).

### 3.13 Pages (`src/pages/`)

| Página | Conteúdo |
|---|---|
| `LoginPage` | Tela de login com `LoginForm` centralizado. |
| `InicioPage` | Placeholder com `SectionTitle` e `Skeleton` de cards. |
| `MensalidadesPage` | Placeholder. |
| `AssociadosPage` | Placeholder. |
| `ConfiguracoesPage` | Placeholder com botão "Sair" funcional. |
| `NotFoundPage` | 404. |

### 3.14 Rotas (`src/routes/`)

| Arquivo | Conteúdo |
|---|---|
| `AppRoutes.tsx` | Definição de rotas com `Routes` e `Route`. |
| `ProtectedRoute.tsx` | Guarda de rota autenticada. |
| `routePaths.ts` | Re-export de `ROUTES`. |

### 3.15 Bootstrap (`src/`)

| Arquivo | Conteúdo |
|---|---|
| `main.tsx` | Importa CSS, renderiza `<App />` em StrictMode, registra SW em produção. |
| `App.tsx` | Hierarquia de providers + `<AppRoutes />`. |
| `vite-env.d.ts` | Tipagem de `import.meta.env.VITE_*`. |

### 3.16 Supabase (`supabase/`)

| Arquivo | Conteúdo |
|---|---|
| `migrations/0001_init_schema.sql` | Extensões, enums, tabelas, índices, constraints, triggers de `updated_at`. |
| `migrations/0002_rls_policies.sql` | Habilita RLS e cria todas as policies. |
| `migrations/0003_seed_roles.sql` | Função `handle_new_user` e claims JWT. |

### 3.17 CI/CD (`.github/workflows/`)

| Arquivo | Conteúdo |
|---|---|
| `deploy.yml` | Pipeline de build + deploy para gh-pages. |

---

## 4. Arquivos a Modificar

**Nenhum.** Esta fase cria a base. Não há código pré-existente a modificar.

Documentação poderá ser atualizada conforme a implementação revelar detalhes adicionais (ex: arquivos adicionais não previstos). Mudanças serão registradas em `REVISION_NOTES.md`.

---

## 5. Componentes da COMPONENT_LIBRARY.md a Implementar

Todos os 12 componentes da biblioteca são implementados nesta fase. Ordem de implementação (do mais simples ao mais complexo):

### 5.1 UI Base

| # | Componente | Justificativa da ordem |
|---|---|---|
| 1 | `Icon` | Sem dependências. Usado por todos os outros. |
| 2 | `Skeleton` | Sem dependências de UI. |
| 3 | `Button` | Usado em `LoginForm` e em todas as telas. |
| 4 | `Input` | Usado em `LoginForm` e em formulários. |
| 5 | `SectionTitle` | Sem dependências. |
| 6 | `Card` | Depende de tokens visuais; usado em dashboards futuros. |
| 7 | `Toast` | Depende de `ToastContext`. |

### 5.2 Layout

| # | Componente | Justificativa |
|---|---|---|
| 8 | `PageContainer` | Depende de tokens. Usado por todas as páginas. |
| 9 | `AppHeader` | Depende de tokens. |
| 10 | `BottomNav` | Depende de tokens e `Icon`. Mais complexo (4 itens, 48x48). |
| 11 | `AppShell` | Depende dos 3 anteriores. |

### 5.3 Auth

| # | Componente | Justificativa |
|---|---|---|
| 12 | `LoginForm` | Depende de `Button`, `Input` e `auth.service`. |

### 5.4 Páginas Placeholder

Não estão em `COMPONENT_LIBRARY.md` mas são necessárias para a navegação:

- `LoginPage`
- `InicioPage`, `MensalidadesPage`, `AssociadosPage`, `ConfiguracoesPage` (placeholders)
- `NotFoundPage`

---

## 6. Ordem de Desenvolvimento

A ordem abaixo garante que cada etapa tenha suas dependências prontas. Cada passo deve ser validado antes de avançar.

### Etapa 1 — Inicialização do Projeto

1. Criar `package.json` com dependências.
2. Criar `tsconfig.json`, `tsconfig.node.json`.
3. Criar `vite.config.ts`.
4. Criar `index.html`.
5. Criar `.gitignore`, `.env.example`, `.eslintrc.cjs`, `.prettierrc`.
6. Criar `README.md`.
7. `npm install` para validar dependências.
8. Verificar: `npm run dev` sobe servidor vazio.

### Etapa 2 — Design System (CSS)

1. Criar `src/design-system/tokens.css` (todas as variáveis).
2. Criar `src/design-system/reset.css`.
3. Criar `src/design-system/typography.css`.
4. Importar em `main.tsx` (ordem: tokens → reset → typography).
5. Verificar: `npm run dev` renderiza com background `--color-background`.

### Etapa 3 — Constantes TypeScript

1. Criar arquivos em `src/constants/` na ordem:
   - `grid.ts` (GRID_ALLOWED_VALUES)
   - `layout.ts`
   - `spacing.ts`
   - `typography.ts`
   - `radius.ts`
   - `shadow.ts`
   - `animation.ts`
   - `opacity.ts`
   - `zindex.ts`
   - `breakpoints.ts`
   - `colors.ts`
   - `icons.ts`
   - `routes.ts`
   - `permissions.ts`
   - `componentVariants.ts`
   - `storage.ts`
   - `supabase.ts`
   - `errors.ts`
   - `time.ts`
   - `cache.ts`
   - `importacao.ts`
   - `pwa.ts`
2. Criar `textos.ts` (strings de UI).
3. Criar `index.ts` (reexporta tudo).
4. Verificar: `tsc --noEmit` passa.

### Etapa 4 — Types

1. Criar `src/types/env.d.ts`.
2. Criar `src/types/domain.types.ts` (Role, CardCategory, etc.).
3. Criar `src/types/database.types.ts` (estrutura inicial vazia, será gerada após Supabase).
4. Verificar: `tsc --noEmit` passa.

### Etapa 5 — Core

1. Criar `src/core/errors/AppError.ts`.
2. Criar `src/core/logger/logger.ts`.
3. Criar `src/core/cache/memoryCache.ts`.
4. Criar `src/core/supabase/types.ts` (reexport de `database.types.ts`).
5. Criar `src/core/supabase/client.ts` (apenas estrutura, init protegido se `VITE_SUPABASE_URL` ausente).
6. Criar `src/core/sheets/{client,parser,mapeamento}.ts` (estrutura).
7. Verificar: `tsc --noEmit` passa.

### Etapa 6 — Utils

1. Criar `src/utils/format.ts`.
2. Criar `src/utils/validators.ts` (Zod schemas).
3. Criar `src/utils/csv.ts`.
4. Verificar: `tsc --noEmit` passa.

### Etapa 7 — Hooks

1. Criar `src/hooks/useAuth.ts` (estrutura).
2. Criar `src/hooks/useToast.ts` (estrutura).
3. Criar `src/hooks/useDebounce.ts`.
4. Criar `src/hooks/useMediaQuery.ts`.
5. Verificar: `tsc --noEmit` passa.

### Etapa 8 — Componentes UI (ordem do mais simples ao mais complexo)

1. `Icon` (wrapper de lucide).
2. `Skeleton`.
3. `Button`.
4. `Input`.
5. `SectionTitle`.
6. `Card`.
7. `Toast`.

Cada componente: `.tsx` + `.module.css` + `index.ts`. Implementar estados, acessibilidade, tokens.

Verificar após cada componente: `tsc --noEmit` passa, `npm run build` passa.

### Etapa 9 — Layout Components

1. `PageContainer`.
2. `AppHeader` (com placeholder de logo).
3. `BottomNav` (com `Icon`).
4. `AppShell` (compõe os 3 anteriores).

### Etapa 10 — Services e Auth

1. Criar `src/services/auth.service.ts`.
2. Criar `src/services/{associados,mensalidades,importacao}.service.ts` (estrutura).
3. Criar `src/contexts/AuthContext.tsx`.
4. Criar `src/contexts/ToastContext.tsx`.
5. Criar `src/components/auth/LoginForm.tsx`.

### Etapa 11 — Pages

1. `LoginPage`.
2. `InicioPage`, `MensalidadesPage`, `AssociadosPage`, `ConfiguracoesPage` (placeholders com `SectionTitle`).
3. `NotFoundPage`.

### Etapa 12 — Rotas

1. `src/routes/routePaths.ts`.
2. `src/routes/ProtectedRoute.tsx`.
3. `src/routes/AppRoutes.tsx`.

### Etapa 13 — Bootstrap

1. `src/App.tsx` com hierarquia de providers.
2. `src/main.tsx` com imports de CSS e registro de SW.

### Etapa 14 — PWA

1. Configurar `vite.config.ts` com `VitePWA`.
2. Validar `manifest.webmanifest` gerado.
3. Validar SW em build de produção.

### Etapa 15 — Supabase Migrations

1. `0001_init_schema.sql` (tabelas, enums, triggers).
2. `0002_rls_policies.sql` (policies).
3. `0003_seed_roles.sql` (handle_new_user, claims).

### Etapa 16 — CI/CD

1. `.github/workflows/deploy.yml`.

### Etapa 17 — Validação Final

1. `npm run lint` passa.
2. `npm run typecheck` passa.
3. `npm run build` passa.
4. `npm run preview` funciona.
5. Lighthouse audit.
6. Verificar manualmente BottomNav com 48x48.
7. Verificar safe area iOS.
8. Verificar `prefers-reduced-motion`.

---

## 7. Dependências

### 7.1 Dependências de Produção

| Pacote | Versão alvo | Justificativa |
|---|---|---|
| `react` | ^18.3.0 | Requisito. |
| `react-dom` | ^18.3.0 | Requisito. |
| `react-router-dom` | ^6.26.0 | Roteamento. |
| `@supabase/supabase-js` | ^2.45.0 | Cliente Supabase. |
| `@fontsource/inter` | ^5.0.0 | Fonte Inter (sem CDN). |
| `lucide-react` | última estável | Ícones. |
| `papaparse` | ^5.4.0 | Parse de CSV. |
| `zod` | ^3.23.0 | Validação. |
| `date-fns` | ^3.6.0 | Datas. |

### 7.2 Dependências de Desenvolvimento

| Pacote | Versão alvo | Justificativa |
|---|---|---|
| `typescript` | ^5.5.0 | Linguagem. |
| `vite` | ^5.4.0 | Build. |
| `@vitejs/plugin-react` | ^4.3.0 | Plugin React para Vite. |
| `vite-plugin-pwa` | ^0.20.0 | PWA. |
| `workbox-window` | ^7.1.0 | SW registration. |
| `@types/react` | ^18.3.0 | Tipos React. |
| `@types/react-dom` | ^18.3.0 | Tipos React DOM. |
| `@types/papaparse` | ^5.3.0 | Tipos papaparse. |
| `eslint` | ^8.57.0 | Lint. |
| `@typescript-eslint/eslint-plugin` | ^7.18.0 | Regras TS. |
| `@typescript-eslint/parser` | ^7.18.0 | Parser TS. |
| `eslint-plugin-react` | ^7.35.0 | Regras React. |
| `eslint-plugin-react-hooks` | ^4.6.0 | Regras hooks. |
| `eslint-plugin-react-refresh` | ^0.4.0 | Regras Vite. |
| `prettier` | ^3.3.0 | Formatação. |
| `gh-pages` | ^6.1.0 | Deploy. |

### 7.3 Não-Incluídos (com justificativa)

- **Vitest, Testing Library**: estrutura preparada, sem testes nesta fase.
- **Tailwind/Material UI/etc.**: proibidos por `DEVELOPMENT_RULES.md`.
- **Date-fns-tz**: timezone via configuração futura.
- **i18next**: sistema preparado para multi-idioma, mas apenas pt-BR nesta fase.

---

## 8. Critérios de Validação após Conclusão

### 8.1 Build e Code Quality

- [ ] `npm run dev` sobe servidor sem erros.
- [ ] `npm run build` produz bundle de produção.
- [ ] `npm run preview` serve o build corretamente.
- [ ] `npm run lint` passa com 0 erros.
- [ ] `npm run typecheck` passa com 0 erros.
- [ ] Nenhum `console.log` em produção.
- [ ] Nenhum `any` em TypeScript.
- [ ] Nenhum valor hardcoded fora de tokens.
- [ ] Nenhum `!important` em CSS (exceto `prefers-reduced-motion`).

### 8.2 Estrutura e Documentação

- [ ] Todos os 12 componentes de `COMPONENT_LIBRARY.md` implementados.
- [ ] Estrutura de pastas conforme `CORE_ARCHITECTURE.md` seção 2.
- [ ] README com instruções de setup.
- [ ] `.env.example` completo.
- [ ] `.gitignore` exclui `node_modules`, `dist`, `.env`.

### 8.3 PWA

- [ ] `manifest.webmanifest` válido (validado em `https://manifest-validator.appspot.com/` ou similar).
- [ ] Service Worker registra em produção.
- [ ] App é instalável (Chrome, iOS Safari).
- [ ] Lighthouse PWA score: 100.

### 8.4 Acessibilidade

- [ ] Lighthouse Accessibility score ≥ 95.
- [ ] Todos os componentes interativos têm `:focus-visible`.
- [ ] Botões só com ícone têm `aria-label`.
- [ ] `prefers-reduced-motion` desabilita animações.
- [ ] Tab order é lógico.
- [ ] Navegação por teclado completa.
- [ ] `aria-current="page"` em BottomNav ativo.
- [ ] `aria-busy` em loading.
- [ ] `aria-invalid` em input com erro.

### 8.5 Responsividade

- [ ] BottomNav: 80px de altura, 48x48 de área de toque por item (verificado com DevTools).
- [ ] AppHeader: 224px em todas as larguras.
- [ ] Padding lateral de 20px em todas as páginas.
- [ ] Sem overflow horizontal em 320px, 390px, 480px, 768px, 1024px, 1280px, 1920px.
- [ ] Safe area iOS respeitada (notch, home indicator).
- [ ] Layout fluido entre breakpoints.

### 8.6 Performance

- [ ] Lighthouse Performance ≥ 90 (mobile).
- [ ] LCP < 2.5s.
- [ ] FID < 100ms.
- [ ] CLS < 0.1.
- [ ] Bundle inicial < 250KB gzip.

### 8.7 Auth e Navegação

- [ ] Login funcional com Supabase Auth.
- [ ] Logout limpa sessão e cache.
- [ ] Sessão expirada redireciona para login.
- [ ] Rotas protegidas bloqueiam acesso não autenticado.
- [ ] Navegação entre 4 abas funciona.
- [ ] Rota 404 funciona.

### 8.8 Banco de Dados

- [ ] 3 migrations aplicadas com sucesso no Supabase.
- [ ] RLS ativo em todas as tabelas.
- [ ] Trigger `handle_new_user` cria profile automaticamente.
- [ ] Claims JWT sincronizadas com `profile.role`.

### 8.9 Conformidade com Documentação

- [ ] Cada componente corresponde à `UI_SPECIFICATION.md`.
- [ ] Cada token CSS corresponde a `DESIGN_SYSTEM.md`.
- [ ] Cada constante corresponde a `CONSTANTS.md`.
- [ ] Cada endpoint de service segue padrão de `SYSTEM_FLOWS.md`.

---

## 9. Possíveis Riscos Técnicos

### 9.1 Risco: Path do GitHub Pages

**Problema:** SPA em subpath de GitHub Pages requer `base: './'` no Vite e tratamento de rotas com `BrowserRouter` (quebrará em deep links).

**Mitigação:**

- Usar `HashRouter` em vez de `BrowserRouter` (sem necessidade de configurar rewrites no GH Pages).
- OU configurar `BrowserRouter` com `basename` e adicionar arquivo `404.html` que redireciona para `/`.
- **Decisão pendente:** HashRouter vs BrowserRouter. Padrão profissional é `BrowserRouter` com `404.html` trick. Recomendação: `HashRouter` por simplicidade nesta fase.

### 9.2 Risco: Credenciais Supabase Ausentes

**Problema:** sem `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, o app não conecta ao Supabase.

**Mitigação:**

- Cliente Supabase é criado de forma defensiva: se vars ausentes, cliente é `null` e auth exibe mensagem informativa.
- App builda e roda em modo "offline" sem backend.
- README orienta configuração.
- Login exibe toast: "Backend não configurado. Configure VITE_SUPABASE_URL." em vez de quebrar.

### 9.3 Risco: Logo Não Fornecida

**Problema:** ícones PWA e logo do header dependem da logo oficial.

**Mitigação:**

- Placeholders com fundo teal e texto "ABSB" centralizado.
- Ícones PWA gerados a partir do placeholder.
- Documentado em `PWA_SPECIFICATION.md` seção 3.2.

### 9.4 Risco: iOS PWA Quirks

**Problema:** PWA em iOS tem peculiaridades (status bar, splash, instalação manual).

**Mitigação:**

- Meta tags iOS completas (já documentadas).
- `apple-touch-icon` em 180x180.
- `viewport-fit=cover` para safe area.
- Testes em iPhone físico recomendado (não há iOS Simulator nesta fase).

### 9.5 Risco: Strict Mode + Service Worker

**Problema:** `React.StrictMode` em dev monta componentes 2x, o que pode causar registro duplo de SW.

**Mitigação:**

- Registro de SW apenas em produção (`import.meta.env.PROD`).
- `registerSW` com `immediate: true` (configuração `vite-plugin-pwa`).

### 9.6 Risco: Variáveis CSS em `color-mix`

**Problema:** `color-mix(in srgb, var(--color-primary) 8%, transparent)` requer navegador moderno. Safari < 16.2 não suporta.

**Mitigação:**

- Definir `fallback` em CSS: `:root { --button-hover: #d6eef0; }` com base no teal pré-calculado.
- Usar `color-mix` apenas onde suportado (`@supports`).
- **Decisão:** documentar e usar `color-mix` com fallback. Suporte mínimo: Chrome 111+, Safari 16.2+, Firefox 113+.

### 9.7 Risco: TypeScript Strict + Tipos do Supabase

**Problema:** tipos gerados do Supabase podem ser complexos e gerar erros de `strictNullChecks`.

**Mitigação:**

- Gerar tipos após migrations aplicadas.
- Usar `Database['public']['Tables']['associados']['Row']` para tipos de linha.
- Tratar `null` explicitamente em services.

### 9.8 Risco: Cache LRU com Tamanho Fixo

**Problema:** `memoryCache.clear()` em logout deve limpar tudo, mas cache LRU pode ter chaves órfãs.

**Mitigação:**

- Singleton com `clear()` que limpa `Map` interno.
- Teste manual em logout.

### 9.9 Risco: Bundle Size com PWA + Supabase + lucide

**Problema:** bundle pode exceder 250KB gzip.

**Mitigação:**

- Tree-shaking do lucide (importar ícones específicos).
- Code splitting por rota.
- Compressão gzip/brotli.
- Lighthouse audit em CI.

### 9.10 Risco: Migrations não Aplicadas

**Problema:** migrations existem em `supabase/migrations/` mas não estão aplicadas no projeto Supabase real.

**Mitigação:**

- README orienta aplicação manual via CLI do Supabase.
- OU deploy automático via GitHub Action.
- **Decisão:** nesta fase, migrations são documentadas e aplicadas manualmente pelo cliente. CLI `supabase db push` é a forma padrão.

---

## 10. Decisões Pendentes Identificadas

Durante o planejamento, identificamos 3 decisões pequenas que podem ser tomadas pelo implementador sem aprovação explícita, **mas que devem ser registradas em `REVISION_NOTES.md`**:

| # | Decisão | Padrão recomendado |
|---|---|---|
| 1 | HashRouter vs BrowserRouter | HashRouter (compatibilidade GH Pages sem 404.html) |
| 2 | Estratégia de fallback de cores sem `color-mix` | Variável CSS pré-calculada |
| 3 | Aplicação de migrations | Manual via CLI ou dashboard Supabase |

---

## 11. Resumo de Saída (ao final da Fase 1)

Ao final desta fase, o cliente recebe:

- Código-fonte completo no repositório.
- Build de produção publicado em GitHub Pages (URL a definir).
- Login funcional com 1 admin provisionado.
- 4 telas placeholder acessíveis.
- PWA instalável.
- Schema do banco aplicado no Supabase (se credenciais fornecidas).
- Documentação atualizada (se necessário).
- Relatório de validação dos critérios da seção 8.

---

## 12. Próximo Passo

Aguardando aprovação deste plano para iniciar a **Etapa 1 — Inicialização do Projeto** (configuração de build, dependências, HTML root).

Após Etapa 1, nova aprovação antes de Etapa 2.

**Sugestão de granularidade:** aprovação por etapa macro (cada uma das 17 etapas) ou aprovação apenas do plano macro (seção 6) e relatórios consolidados nas etapas-chave (5, 9, 12, 14, 17).

---

## 13. Histórico

| Versão | Data | Descrição |
|---|---|---|
| 1.0 | 22/07/2026 | Primeira versão do plano de implementação da Fase 1 (Fundação) |
