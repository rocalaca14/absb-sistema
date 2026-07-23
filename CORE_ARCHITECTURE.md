# CORE_ARCHITECTURE — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Idioma:** Português (Brasil)

---

## 1. Propósito

Este documento define a **infraestrutura técnica completa** do projeto. Tudo o que diz respeito a bootstrap, providers, roteamento, sessão, cache, comunicação com Supabase, importação de planilha e versionamento está registrado aqui. Nenhuma decisão estrutural deve existir fora deste documento.

---

## 2. Estrutura Completa de Pastas

```
app-absb/
├── public/
│   ├── favicon.ico
│   ├── logo-absb-192.png
│   ├── logo-absb-512.png
│   ├── logo-absb-maskable-512.png
│   └── robots.txt
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── routePaths.ts
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
│   │   └── Configuracoes/
│   │       └── ConfiguracoesPage.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── AppShell.module.css
│   │   │   ├── AppHeader.tsx
│   │   │   ├── AppHeader.module.css
│   │   │   ├── BottomNav.tsx
│   │   │   ├── BottomNav.module.css
│   │   │   ├── PageContainer.tsx
│   │   │   └── PageContainer.module.css
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Card.module.css
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Input.module.css
│   │   │   │   └── index.ts
│   │   │   ├── SectionTitle/
│   │   │   │   ├── SectionTitle.tsx
│   │   │   │   ├── SectionTitle.module.css
│   │   │   │   └── index.ts
│   │   │   ├── Skeleton/
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   ├── Skeleton.module.css
│   │   │   │   └── index.ts
│   │   │   ├── Icon/
│   │   │   │   ├── Icon.tsx
│   │   │   │   ├── Icon.module.css
│   │   │   │   └── index.ts
│   │   │   └── Toast/
│   │   │       ├── Toast.tsx
│   │   │       ├── Toast.module.css
│   │   │       └── index.ts
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── LoginForm.module.css
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useToast.ts
│   │   ├── useDebounce.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── associados.service.ts
│   │   ├── mensalidades.service.ts
│   │   └── importacao.service.ts
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
│   ├── design-system/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   └── typography.css
│   │
│   ├── types/
│   │   ├── database.types.ts
│   │   ├── domain.types.ts
│   │   └── env.d.ts
│   │
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validators.ts
│   │   ├── csv.ts
│   │   └── textos.ts
│   │
│   └── constants/
│       ├── index.ts
│       ├── layout.ts
│       ├── spacing.ts
│       ├── typography.ts
│       ├── radius.ts
│       ├── shadow.ts
│       ├── animation.ts
│       ├── breakpoints.ts
│       ├── zindex.ts
│       ├── routes.ts
│       └── permissions.ts
│
├── supabase/
│   ├── migrations/
│   │   ├── 0001_init_schema.sql
│   │   ├── 0002_rls_policies.sql
│   │   └── 0003_seed_roles.sql
│   └── README.md
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 3. Bootstrap da Aplicação

### 3.1 `index.html`

- `lang="pt-BR"`.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1">`.
- `<meta name="theme-color" content="var(--color-primary)">` (definido em runtime via tag injetada).
- `<link rel="manifest" href="/manifest.webmanifest">`.
- Tags PWA iOS: `apple-mobile-web-app-capable`, `apple-mobile-web-app-title`, `apple-mobile-web-app-status-bar-style`.
- Fonte Inter pré-carregada via `@fontsource/inter` (sem `<link>` externo).

### 3.2 `main.tsx`

Sequência de bootstrap, nesta ordem estrita:

1. Importar `design-system/tokens.css`.
2. Importar `design-system/reset.css`.
3. Importar `design-system/typography.css`.
4. Renderizar `<App />` dentro de `<React.StrictMode>`.
5. Registrar Service Worker apenas em produção (`import.meta.env.PROD`).

### 3.3 `App.tsx`

Hierarquia de providers, de fora para dentro:

```
<ErrorBoundary>
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
</ErrorBoundary>
```

`ErrorBoundary` captura erros de renderização e exibe fallback padronizado (componente `ErrorFallback` ainda não implementado nesta fase, apenas a estrutura).

---

## 4. Providers (Contexts)

### 4.1 `AuthProvider` (`contexts/AuthContext.tsx`)

**Responsabilidade:** expor estado de autenticação para toda a aplicação.

**API exposta:**

```ts
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: Role | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AppError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
```

**Comportamento:**

- No mount, chama `supabase.auth.getSession()`.
- Se houver sessão, busca `profile` na tabela `profiles`.
- Escuta `supabase.auth.onAuthStateChange()` para reagir a login/logout/token refresh.
- Define `loading = true` enquanto o estado inicial é resolvido.
- Logout limpa cache em memória (ver seção 9).

### 4.2 `ToastProvider` (`contexts/ToastContext.tsx`)

**Responsabilidade:** feedback de ações.

**API exposta:**

```ts
interface ToastContextValue {
  show: (toast: ToastInput) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}
```

Tipos de toast: `success`, `error`, `warning`, `info`. Cada um usa a cor de token correspondente.

---

## 5. Hooks

| Hook | Responsabilidade |
|---|---|
| `useAuth` | Acesso seguro ao `AuthContext`; lança erro se usado fora do provider |
| `useToast` | Acesso ao `ToastContext`; lança erro se usado fora do provider |
| `useDebounce<T>` | Debounce genérico (delay configurável via constante) |
| `useMediaQuery` | Compara largura atual com os breakpoints definidos em `constants/breakpoints.ts` |

Todos os hooks customizados ficam em `src/hooks/`. Nenhum hook é criado sem necessidade comprovada.

---

## 6. Roteamento

### 6.1 Paths

Definidos em `constants/routes.ts` e reexportados por `routes/routePaths.ts`.

| Path | Página | Protegida |
|---|---|---|
| `/login` | Login | Não |
| `/` | Início | Sim |
| `/mensalidades` | Mensalidades | Sim |
| `/associados` | Associados | Sim |
| `/configuracoes` | Configurações | Sim |
| `*` | NotFound | Não |

### 6.2 `AppRoutes`

- Define `<Routes>` com todas as rotas acima.
- Rotas protegidas usam `<ProtectedRoute>` que redireciona para `/login` se não houver sessão.

### 6.3 `ProtectedRoute`

Componente de ordem superior que:

- Lê `user` e `loading` do `AuthContext`.
- Se `loading`, exibe `<Skeleton />` de página cheia.
- Se `!user`, redireciona para `/login` preservando o destino em `state.from`.
- Caso contrário, renderiza `<Outlet />`.

### 6.4 Navegação inferior (`BottomNav`)

- 4 botões: **Início**, **Mensalidades**, **Associados**, **Configurações**.
- Ícones: `Home`, `Wallet`, `Users`, `Settings` (todos do `lucide-react`, 24px, stroke 2).
- Rota ativa detectada por `useLocation().pathname`.
- Navegação via `<NavLink>` do React Router.

---

## 7. Autenticação

### 7.1 Estratégia

- **Provedor:** Supabase Auth.
- **Método inicial:** e-mail e senha.
- **Persistência:** sessão persistida em `localStorage` (default do Supabase).
- **Renovação de token:** automática via `onAuthStateChange`.
- **Métodos futuros (não nesta versão):** magic link, OAuth Google.

### 7.2 Fluxo de Login

1. Usuário preenche `LoginForm`.
2. `signIn(email, password)` chama `supabase.auth.signInWithPassword()`.
3. Em caso de sucesso, o `onAuthStateChange` dispara, atualiza o `AuthContext` e o `ProtectedRoute` libera a navegação.
4. Em caso de erro, retorna `AppError` normalizado (sem expor mensagem técnica ao usuário).
5. Toast de sucesso é exibido. Toast de erro idem.

### 7.3 Fluxo de Logout

1. Usuário aciona botão em `Configuracoes`.
2. `signOut()` chama `supabase.auth.signOut()`.
3. `AuthContext` limpa `user`, `session`, `profile`, `role`.
4. `memoryCache.clear()`.
5. Redirecionamento para `/login`.

### 7.4 Sessão

- Sessão é a única fonte de verdade sobre autenticação.
- `profile` é carregado sob demanda e cacheado em memória durante a sessão.
- Se a sessão expirar durante uso, listener de `onAuthStateChange` limpa o estado e o `ProtectedRoute` redireciona.

---

## 8. Estratégia de Atualização de Dados

| Cenário | Estratégia |
|---|---|
| Dados de listagem | `select` com cache em memória por chave de query (TTL 60s) |
| Dados de detalhe | `select` por id, cache em memória (TTL 300s) |
| Mutação | Invalidação da(s) chave(s) de cache correspondente(s) |
| Erro de rede | Toast de erro + retentativa manual (sem retry automático) |
| Sessão expirada | Listener do Supabase limpa estado e redireciona para login |

TTL são valores definidos em `constants/animation.ts` (seção `time`) — na verdade, em `constants/cache.ts` (a ser criado). Todos os TTLs são centralizados.

---

## 9. Persistência e Cache

### 9.1 Cache em Memória (`core/cache/memoryCache.ts`)

Singleton de cache com:

- `get<T>(key: string): T | null`
- `set<T>(key: string, value: T, ttlSeconds: number): void`
- `invalidate(key: string): void`
- `invalidateByPrefix(prefix: string): void`
- `clear(): void` (usado no logout)

**Limites:**

- Máximo 100 chaves (LRU).
- TTL máximo: 600s.
- Sem persistência em `localStorage` (apenas em memória). Reset acontece ao recarregar a aba.

### 9.2 Por que não outras estratégias nesta fase

- `localStorage`/`sessionStorage` para dados de aplicação é proibido nesta fase (exceto para o que o Supabase Auth já usa).
- IndexedDB não é necessário nesta fase.
- Service Worker já faz cache de assets estáticos, separado do cache de aplicação.

---

## 10. Comunicação com Supabase

### 10.1 Cliente

Arquivo único: `core/supabase/client.ts`.

```ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);
```

### 10.2 Tipos

`core/supabase/types.ts` espelha `src/types/database.types.ts` (gerado via `supabase gen types typescript`).

### 10.3 Camada de Serviços

Nenhuma página ou componente acessa `supabase` diretamente. Toda chamada passa por `services/*.service.ts`. Cada serviço:

- Recebe parâmetros tipados.
- Retorna `{ data, error }` onde `error` é instância de `AppError`.
- Aplica validação de entrada com Zod quando há dados do usuário.
- Documenta permissões necessárias no JSDoc.

### 10.4 Tratamento de Erros

`core/errors/AppError.ts`:

```ts
class AppError extends Error {
  code: string;
  userMessage: string;
  technicalMessage: string;
  originalError?: unknown;
}
```

Códigos padronizados:

| Código | Significado |
|---|---|
| `AUTH_INVALID_CREDENTIALS` | E-mail ou senha inválidos |
| `AUTH_SESSION_EXPIRED` | Sessão expirada |
| `NETWORK_OFFLINE` | Sem conexão |
| `PERMISSION_DENIED` | RLS bloqueou acesso |
| `VALIDATION_FAILED` | Dados de entrada inválidos |
| `NOT_FOUND` | Registro inexistente |
| `CONFLICT` | Conflito de chave única |
| `INTERNAL` | Erro inesperado |

Mensagens para usuário ficam em `utils/textos.ts`.

---

## 11. Importação de Planilha Google Sheets

### 11.1 Visão

A planilha Google Sheets é **apenas ferramenta de importação inicial**. Após a primeira carga válida, o Supabase é a única fonte de verdade. Em produção, o sistema **nunca** consulta a planilha.

### 11.2 Pipeline

1. Usuário autenticado (permissão: `importacao.executar`) acessa tela de importação.
2. Informa URL pública da planilha (formato `/pub?output=csv`).
3. `core/sheets/client.ts` faz `fetch` do CSV (apenas valores, sem fórmulas).
4. `core/sheets/parser.ts` converte CSV em array de objetos usando `papaparse`.
5. `core/sheets/mapeamento.ts` aplica mapeamento de colunas da planilha para colunas da tabela `associados`.
6. `services/importacao.service.ts` insere via `upsert` em `associados` (preserva acentuação, capitalização, ordem).
7. Grava um registro em `importacoes` com `total_registros` e `executada_por`.
8. Toast de sucesso com total importado.
9. Em caso de erro de validação, exibe relatório por linha (até 50 erros) sem interromper a importação dos registros válidos.

### 11.3 Regras Invioláveis

- **Nunca** interpretar fórmulas. Google Sheets entrega valores calculados no CSV.
- **Nunca** eliminar registros.
- **Nunca** alterar acentuação.
- **Nunca** alterar capitalização.
- **Nunca** alterar ordem de exibição dos registros importados.
- Conflitos de chave única: `upsert` por chave definida em `DATABASE_SPECIFICATION.md`.
- Toda execução fica registrada em `importacoes` (auditoria).

### 11.4 Mapeamento de Colunas

`mapeamento.ts` é gerado quando a planilha real chegar. Estrutura:

```ts
export const MAPEAMENTO_ASSOCIADOS: ColumnMap = {
  // 'coluna_planilha': 'coluna_banco',
};
```

Sem mapeamento, a importação **não é habilitada**.

---

## 12. PWA

### 12.1 Manifest

Arquivo `public/manifest.webmanifest` (gerado pelo `vite-plugin-pwa`):

- `name`: "ABSB — Associação dos Bugueiros de São Bento"
- `short_name`: "ABSB"
- `start_url`: "/"
- `display`: "standalone"
- `orientation`: "portrait"
- `theme_color`: token `--color-primary` (lido em build via constante)
- `background_color`: token `--color-background` (lido em build)
- Ícones: 192x192, 512x512, 512x512 maskable
- `lang`: "pt-BR"
- `scope`: "/"
- `prefer_related_applications`: false

### 12.2 Service Worker

Gerado pelo `vite-plugin-pwa` com Workbox:

- `registerType: 'autoUpdate'`
- Estratégias:
  - `NetworkFirst` para `^https://.*\.supabase\.co/`
  - `CacheFirst` para `/assets/`
  - `NetworkFirst` com fallback para `/offline` em navegação
- Página `/offline` deve existir (criada na fase 1.0 se necessário).

### 12.3 Meta Tags iOS

Definidas no `index.html`:

- `apple-mobile-web-app-capable=yes`
- `apple-mobile-web-app-status-bar-style=black-translucent`
- `apple-mobile-web-app-title=ABSB`
- Ícones `apple-touch-icon` em 180x180.

---

## 13. Versionamento

### 13.1 Git

- Branches:
  - `main` — produção
  - `develop` — homologação
  - `feature/<modulo>-<descricao>` — feature
  - `hotfix/<descricao>` — correção urgente
  - `docs/<descricao>` — alterações só em documentação
- Convenção de commit: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`, `build:`, `ci:`).
- Mensagens de commit em português.
- PRs revisados antes de merge.

### 13.2 Versionamento Semântico da Aplicação

- `MAJOR.MINOR.PATCH`
- Definido em `package.json` e exposto em runtime via `import.meta.env.VITE_APP_VERSION`.
- Incremento:
  - `MAJOR`: mudança incompatível
  - `MINOR`: nova funcionalidade compatível
  - `PATCH`: correção compatível

### 13.3 Migrations do Banco

- Versionadas em `supabase/migrations/NNNN_descricao.sql`.
- Aplicadas em ordem.
- Nome do arquivo imutável após merge.
- Sem edição retroativa.

---

## 14. Logging

`core/logger/logger.ts` expõe:

```ts
logger.debug(...);
logger.info(...);
logger.warn(...);
logger.error(...);
```

Comportamento por ambiente:

| Ambiente | Nível mínimo |
|---|---|
| development | `debug` |
| production | `warn` |

Em produção, logs não expõem dados sensíveis (e-mail, CPF, telefone, valores).

---

## 15. CI/CD

`.github/workflows/deploy.yml`:

- Trigger: push em `main`.
- Passos:
  1. Checkout
  2. Setup Node 20
  3. `npm ci`
  4. `npm run lint`
  5. `npm run typecheck`
  6. `npm run build`
  7. `npm run test` (quando houver testes)
  8. `npm run deploy` (gh-pages via `peaceiris/actions-gh-pages`)
- Variáveis injetadas via `repo secrets`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

---

## 16. Scripts `package.json`

| Script | Comando |
|---|---|
| `dev` | `vite` |
| `build` | `tsc && vite build` |
| `preview` | `vite preview` |
| `lint` | `eslint . --ext .ts,.tsx` |
| `typecheck` | `tsc --noEmit` |
| `format` | `prettier --write .` |
| `test` | `vitest run` (quando houver) |
| `deploy` | `gh-pages -d dist` |

---

## 17. Testes (preparação para fase futura)

- Framework: Vitest + React Testing Library.
- Estrutura: `__tests__` ao lado do arquivo testado, ou `src/__tests__/` para testes de integração.
- Sem testes nesta fase, mas estrutura preparada.

---

## 18. Anti-patterns Proibidos

- Componentes com mais de 300 linhas.
- Props booleanas sem default explícito.
- `useEffect` sem dependências listadas corretamente.
- `any` no TypeScript.
- `@ts-ignore` sem justificativa em comentário.
- Classes CSS dinâmicas inline.
- Cores hexadecimais fora de `tokens.css`.
- Magic numbers.
- Strings de texto fora de `utils/textos.ts` (exceto quando o conteúdo for puramente técnico, ex: chaves de storage).
- `console.log` em produção.
- Acesso direto ao `localStorage` fora de hooks/serviços autorizados.
- Fetch direto em componente (sempre via serviço).

---

## 19. Bloqueios desta Documentação

Itens que impedem a execução literal deste documento até serem resolvidos:

1. Logo oficial (cores).
2. Planilha Google Sheets (mapeamento de colunas).
3. Credenciais Supabase.
4. Domínio do GitHub Pages.
5. Decisão sobre primeiro administrador.

A documentação não depende desses itens para estar **completa**. Eles são necessários apenas para a **execução**.
