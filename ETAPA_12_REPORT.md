# ETAPA_12_REPORT — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão:** 1.0
**Data:** 22/07/2026
**Idioma:** Português (Brasil)
**Marco:** ETAPA 12 — Camada de Autenticação
**Status:** Concluído. Aguardando aprovação.

---

## 1. Resumo do Marco

A ETAPA 12 implementa a **camada de autenticação real e isolada**, com integração preparada para Supabase Auth, gerenciamento de sessão, restauração automática, login, logout, ProtectedRoute funcional e estados de loading/erro.

Aplicação construída para funcionar em dois modos:

- **Modo conectado** — `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` configuradas. Autenticação real.
- **Modo demonstração** — sem credenciais. App exibe banner informativo e bloqueia ações sensíveis, sem quebrar.

---

## 2. Componentes e Módulos Entregues

### 2.1 Core

| Arquivo | Responsabilidade |
|---|---|
| `src/core/errors/AppError.ts` | Classe `AppError` com códigos tipados, mensagens para usuário e técnicas separadas. 10 códigos: AUTH_*, NETWORK_*, PERMISSION_DENIED, VALIDATION_FAILED, NOT_FOUND, CONFLICT, INTERNAL, BACKEND_NOT_CONFIGURED. |
| `src/core/logger/logger.ts` | Logger com níveis (`debug`, `info`, `warn`, `error`). Sanitiza automaticamente campos sensíveis (password, token, secret, authorization) com `[REDACTED]`. Em produção, `debug` e `info` são suprimidos. |
| `src/core/supabase/types.ts` | Tipo `Database` do Supabase. Apenas a tabela `profiles` por enquanto (estrutura será expandida quando migrations forem aplicadas). |
| `src/core/supabase/client.ts` | Cliente Supabase **defensivo**. Se credenciais ausentes ou inválidas, `supabase = null` e `isSupabaseConfigured = false`. App continua funcionando. |

### 2.2 Constants

| Arquivo | Mudança |
|---|---|
| `src/constants/permissions.ts` | Adicionados: `ROLES` (admin, tesoureiro, diretor, visualizador), `PERMISSIONS` (15 permissões), `ROLE_LABELS` (rótulos em pt-BR), `ROLE_PERMISSIONS` (matriz), `roleHasPermission`, `rolePermissions`. |
| `src/constants/breakpoints.ts` | Novo. `BREAKPOINTS` com 8 chaves (xs a 4xl) e tipo `BreakpointKey`. |
| `src/constants/index.ts` | Reexporta `breakpoints` e `permissions`. |

### 2.3 Services

| Arquivo | API |
|---|---|
| `src/services/auth.service.ts` | `signIn(email, password): Promise<AuthState>`, `signOut(): Promise<void>`, `getCurrentSession(): Promise<Session \| null>`, `getProfile(userId): Promise<Profile \| null>`, `onAuthStateChange(callback)`. Mapeia erros do Supabase para `AppError`. Verifica `profile.ativo` e desloga contas desabilitadas. |

### 2.4 Contexts

| Arquivo | API exposta |
|---|---|
| `src/contexts/AuthContext.tsx` | `AuthProvider` com: `user`, `session`, `profile`, `role`, `loading`, `initialized`, `isBackendConfigured`, `signIn`, `signOut`, `refreshProfile`. Restauração de sessão no mount via `getCurrentSession`. Subscription a `onAuthStateChange`. Detecção de expiração de sessão com `toast.warning` (apenas uma vez por sessão expirada). |
| `src/contexts/authContext.types.ts` | Tipo `AuthContextValue` e criação do `AuthContext` (separado para evitar warning de fast-refresh). |
| `src/contexts/ToastContext.tsx` | `ToastProvider` com `show`, `success`, `error`, `warning`, `info`. Auto-dismiss em 3s com animação de saída. Renderiza container fixo no topo. |
| `src/contexts/toastContextValue.ts` | Tipo `ToastContextValue` e `ToastContext`. |

### 2.5 Hooks

| Arquivo | Função |
|---|---|
| `src/hooks/useAuth.ts` | Acesso seguro ao `AuthContext`. Lança erro se usado fora de `AuthProvider`. |
| `src/hooks/useToast.ts` | Acesso seguro ao `ToastContext`. |
| `src/hooks/useDebounce.ts` | Debounce genérico com delay configurável. |
| `src/hooks/useMediaQuery.ts` | Compara largura com breakpoints definidos. |

### 2.6 Componentes

| Arquivo | Comportamento |
|---|---|
| `src/components/auth/LoginForm.tsx` | Formulário de login. Validação com Zod. Usa exclusivamente `Button`, `Input` oficiais. Exibe aviso de "backend não configurado" quando aplicável. Estados: inicial, digitando, loading (spinner no botão), sucesso (redirect), erro (toast). |
| `src/components/auth/LoginForm.module.css` | Estilos do LoginForm. |
| `src/components/auth/index.ts` | Reexport. |

### 2.7 Páginas e Rotas (modificadas)

| Arquivo | Mudança |
|---|---|
| `src/pages/Login/LoginPage.tsx` | Agora usa `LoginForm` real. Card centralizado com sombra. Mantém link "Acessar como visitante". |
| `src/pages/Inicio/InicioPage.tsx` | Mostra dados reais do usuário (nome, email, papel) via `useAuth`. |
| `src/pages/Configuracoes/ConfiguracoesPage.tsx` | Mostra perfil, status do backend, botão "Sair da conta" funcional. |
| `src/routes/ProtectedRoute.tsx` | Implementação real. Carregando → Skeleton. Sem sessão → redirect para `/login` com `state.from`. Com sessão → libera. Suporta `children` (rotas aninhadas) e `<Outlet />` (rotas declaradas sem wrapper). |
| `src/App.tsx` | Providers aninhados: `HashRouter` > `ToastProvider` > `AuthProvider` > `AppRoutes`. Toast vem antes de Auth porque Auth usa useToast. |

---

## 3. Segurança

- **Nenhuma senha em localStorage.** Gerenciada exclusivamente pelo Supabase Auth.
- **Nenhum token manipulado manualmente.** Supabase gerencia via `persistSession: true` e `autoRefreshToken: true`.
- **`storageKey: 'absb.auth'`** — chave de storage dedicada no localStorage, evita colisão.
- **PII sanitizada no logger.** Campos com padrão `password|token|secret|authorization` são substituídos por `[REDACTED]`.
- **Mensagens técnicas nunca expostas ao usuário.** `AppError.userMessage` é o que vai para o toast; `technicalMessage` vai para o logger.
- **Detecção de conta desabilitada.** Se `profile.ativo === false`, signOut imediato após signIn.

---

## 4. Permissões

Estrutura para 4 papéis implementada, mesmo que apenas `admin` esteja provisionado:

| Papel | Permissões |
|---|---|
| `admin` | Todas as 15 permissões |
| `tesoureiro` | associados.read, mensalidades.*, pagamentos.*, relatorios.view |
| `diretor` | associados.read, associados.write, mensalidades.read, relatorios.view |
| `visualizador` | apenas leituras (associados, mensalidades, pagamentos) |

Função `roleHasPermission(role, permission)` disponível para uso em `usePermission` (hook futuro) e em `<Can permission="...">` (componente futuro, não implementado nesta fase).

---

## 5. Estados de Login Implementados

| Estado | Onde |
|---|---|
| 1. Inicial | `LoginForm` ao montar, `submitting=false`, campos vazios |
| 2. Digitando | `LoginForm` com `email` ou `password` preenchidos |
| 3. Loading | `LoginForm` durante `signIn` — `submitting=true`, botão com spinner, inputs desabilitados |
| 4. Sucesso | `signIn` retorna sem erro → toast de sucesso → `navigate(from)` |
| 5. Erro | `signIn` retorna `AppError` → toast com `userMessage` |
| 6. Sessão restaurada | `AuthContext` no mount: `getCurrentSession()` → fetch profile → estado preenchido sem `signIn`. `ProtectedRoute` mostra Skeleton durante a verificação. |

---

## 6. ProtectedRoute — Comportamento

| Situação | Comportamento |
|---|---|
| `initialized=false` ou `loading=true` | `<RouteLoading />` com `Skeleton` (3 linhas + 1 card). `role="status"`, `aria-busy="true"`. |
| Sem `user` | `<Navigate to="/login" replace state={{ from: location.pathname + location.search }} />` |
| Com `user` | Renderiza `children` ou `<Outlet />` |

---

## 7. Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_SUPABASE_URL` | Sim (para auth real) | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sim (para auth real) | Chave pública anon |

Quando ausentes, o app exibe banner no LoginForm e desabilita o botão de submit. **Não quebra o build nem o runtime.**

---

## 8. Validações

| Validação | Resultado |
|---|---|
| `npm run typecheck` | ✓ 0 erros |
| `npm run lint` | ✓ 0 erros |
| `npm run build` | ✓ Sucesso em 3.31s |
| Bundle JS (gzip) | 76.04 kB (+17.11 kB vs ETAPA 9; inclui @supabase/supabase-js) |
| Bundle CSS (gzip) | 5.18 kB (+0.63 kB) |
| TypeScript strict + exactOptionalPropertyTypes | ✓ 0 erros |
| Componentes visuais acessam Supabase diretamente | ✗ Nunca (apenas via `authService`) |
| Toast e Skeleton oficiais usados no LoginForm | ✓ |
| Senha/token em localStorage | ✗ (gerenciado pelo Supabase) |
| Função `roleHasPermission` | ✓ Implementada |
| Matriz 4 papéis | ✓ |
| `aria-current` no BottomNav | ✓ (mantido da ETAPA 9) |

---

## 9. Conformidade com Decisões

- ✓ D1 — Grid 8pt
- ✓ D2 — BottomNav 48x48
- ✓ HashRouter
- ✓ Fallback de cor sem color-mix exclusivo
- ✓ Componentes oficiais (Button, Input, Toast, Skeleton)
- ✓ Nenhum CSS inline em componentes (apenas em LoginForm.module.css)

---

## 10. Pendências Mantidas

| # | Pendência | Próximo marco |
|---|---|---|
| 1 | Credenciais Supabase reais | Cliente (define `.env`) |
| 2 | Logo oficial | ETAPA 14 ou posterior |
| 3 | Planilha Google Sheets | ETAPA 14 ou posterior |
| 4 | Migrations aplicadas no Supabase | ETAPA 14 |
| 5 | Domínio GitHub Pages | ETAPA 17 |
| 6 | Primeiro usuário admin | Cliente (cria via Supabase + SQL inicial) |
| 7 | PWA (manifest, service worker) | ETAPA 14 |
| 8 | Toast de loading persistir em logout | Pode ser adicionado depois |
| 9 | `usePermission` hook + `<Can>` | Pode ser adicionado em qualquer marco |

---

## 11. Próximo Marco (ETAPA 14)

- Migrations do Supabase aplicadas (0001, 0002, 0003) — documentadas em `supabase/migrations/`.
- `vite-plugin-pwa` configurado (manifest, service worker).
- `core/sheets/{client,parser,mapeamento}.ts` estruturado para importação de planilha.
- `services/importacao.service.ts` stub.
- `services/{associados,mensalidades}.service.ts` stubs.
- CI/CD workflow (`.github/workflows/deploy.yml`).
- Variáveis de ambiente finais validadas.

Aguardando aprovação para iniciar ETAPA 14.
