# ETAPA_14_REPORT — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão:** 1.0
**Data:** 22/07/2026
**Idioma:** Português (Brasil)
**Marco:** ETAPA 14 — Integrações Externas
**Status:** Concluído. Aguardando aprovação.

---

## 1. Resumo do Marco

A ETAPA 14 entrega a infraestrutura completa de integrações externas, conforme `PLANO_IMPLEMENTACAO_FASE_1.md` decisão HashRouter e `PWA_SPECIFICATION.md`:

- 3 migrations Supabase validadas e geradas.
- PWA instalável com manifest, service worker, ícones e estratégias de cache.
- CI/CD com GitHub Actions (lint, typecheck, build, deploy).
- Estrutura de importação de planilha Google Sheets (esqueleto).

**Nenhuma tela de negócio foi criada.** Toda entrega é infraestrutura.

---

## 2. Validação e Documentação (Novos Documentos)

| Documento | Conteúdo |
|---|---|
| `MIGRATIONS_PLAN.md` | Validação de estrutura, relacionamentos, índices, RLS, auditoria antes da criação das migrations. Checklist de validação 100% atendido. |
| `SHEETS_FORMAT.md` | Formato esperado da planilha, validação Zod, tratamento de duplicatas (chave cpf ou nome+data_nascimento), preview (10 linhas), relatório de erros (até 50). |
| `supabase/README.md` | Instruções passo-a-passo para aplicar migrations via Supabase CLI ou SQL Editor. Procedimento para criar o primeiro admin. |

---

## 3. Migrations Supabase

### 3.1 `0001_init_schema.sql`

- Extensão `pgcrypto`.
- Enums: `user_role`, `forma_pagamento_tipo`, `audit_operacao`.
- Função `set_updated_at()` (genérica).
- 7 tabelas: `profiles`, `associados`, `mensalidades`, `pagamentos`, `importacoes`, `audit_log`, `configuracoes`.
- 12 índices (incluindo `uq_associados_cpf` UNIQUE parcial).
- 8 constraints CHECK e UNIQUE.
- Triggers de `updated_at` em 5 tabelas.
- Trigger `tg_mensalidades_valor_final` (calcula `valor_final = valor - desconto + acrescimo`).
- **Nenhum dado fictício** ou seed criado.

### 3.2 `0002_rls_policies.sql`

- RLS habilitada em todas as 7 tabelas.
- Função `current_user_role()` (lê `app_metadata.role` do JWT, fallback `visualizador`, `SECURITY DEFINER`).
- 18 policies cobrindo SELECT, INSERT, UPDATE, DELETE para todas as tabelas conforme matriz de `PERMISSIONS.md`:
  - `profiles`: admin RW todos, self R/U próprio, admin D
  - `associados`: todos R, admin/diretor W, admin D
  - `mensalidades`: todos R, admin/tesoureiro W, admin D
  - `pagamentos`: todos R, admin/tesoureiro W, admin D
  - `importacoes`: admin RW, sem update
  - `audit_log`: admin/diretor R, sem I/U/D (apenas trigger)
  - `configuracoes`: todos R, admin W/D

### 3.3 `0003_seed_roles.sql`

- Função `handle_new_user()` (cria profile automaticamente em `auth.users`, `SECURITY DEFINER`).
- Função `sync_user_role()` (sincroniza `profiles.role` com `auth.users.raw_app_meta_data.role`).
- Função `audit_trigger()` (genérica, captura INSERT/UPDATE/DELETE, `SECURITY DEFINER`).
- 4 triggers de auditoria: `associados`, `mensalidades`, `pagamentos`, `configuracoes`.
- Triggers de sync de role em `profiles` (insert + update).
- Comentários de documentação em todas as funções.

---

## 4. PWA

### 4.1 Configuração

- `vite-plugin-pwa@^0.20.5` + `workbox-window@^7.1.0` adicionados a `devDependencies`.
- `vite.config.ts` atualizado com plugin `VitePWA`:
  - `registerType: 'autoUpdate'`
  - `includeAssets`: `favicon.svg`, `icons/*.svg`, `robots.txt`
  - `manifest` completo (name, theme_color, icons, display, etc.)
  - Estratégias de cache (workbox):
    - `NetworkFirst` para `*.supabase.co/rest/*` (TTL 60s)
    - `NetworkOnly` para `*.supabase.co/auth/*` (nunca cachear)
    - `CacheFirst` para `*.supabase.co/storage/*` (TTL 7 dias)
    - `CacheFirst` para assets estáticos (TTL 30 dias)
- `main.tsx` registra SW em produção apenas.

### 4.2 Manifesto Gerado

`dist/manifest.webmanifest`:

```json
{
  "name": "ABSB — Associação dos Bugueiros de São Bento",
  "short_name": "ABSB",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#F4F5F7",
  "lang": "pt-BR",
  "scope": "./",
  "theme_color": "#00BAB9",
  "icons": [
    { "src": "icons/icon-192.svg", "sizes": "192x192", "type": "image/svg+xml", "purpose": "any" },
    { "src": "icons/icon-512.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "any" },
    { "src": "icons/icon-maskable-512.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "maskable" }
  ]
}
```

### 4.3 Ícones Placeholder (SVG)

| Arquivo | Tamanho | Uso |
|---|---|---|
| `public/favicon.svg` | 32x32 | Favicon do navegador |
| `public/icons/icon-192.svg` | 192x192 | PWA ícone padrão |
| `public/icons/icon-512.svg` | 512x512 | PWA ícone alta resolução |
| `public/icons/icon-maskable-512.svg` | 512x512 | PWA ícone com safe zone para Android |
| `public/icons/apple-touch-icon-180.svg` | 180x180 | iOS apple-touch-icon |

**Nota:** todos os ícones são SVG com o texto "ABSB" sobre fundo teal `#00BAB9`. Quando a logo oficial for fornecida, devem ser regenerados como PNG para máxima compatibilidade com iOS e Android.

### 4.4 Cache Strategies — Sem Dados Sensíveis

- Auth (`*.supabase.co/auth/*`): **NetworkOnly**. Nunca cacheado.
- REST (`*.supabase.co/rest/*`): NetworkFirst com TTL curto (60s). Cache invalidado por versão do app.
- Storage: CacheFirst apenas para comprovantes/imagens públicas.
- Limite: max 50 entradas por cache, max 100 para assets estáticos.

---

## 5. CI/CD (GitHub Actions)

### 5.1 `ci.yml`

- **Trigger:** push em `main`/`develop` e PRs.
- **Job:** `quality` (Lint, Typecheck, Build).
- **Node:** 20 com cache npm.
- **Concurrency:** cancela execuções anteriores no mesmo ref.

### 5.2 `deploy.yml`

- **Trigger:** push em `main` ou manual (`workflow_dispatch`).
- **Jobs:**
  - `quality` (gate): lint, typecheck, build (somente em push para main).
  - `deploy`: build + deploy para `gh-pages` via `peaceiris/actions-gh-pages`.
- **Environment:** `github-pages`.
- **Concurrency:** não cancela (deploys são sequenciais para main).

---

## 6. Estrutura de Importação de Planilha

### 6.1 Arquivos Criados

| Arquivo | Função |
|---|---|
| `src/core/sheets/client.ts` | `SheetsClient` com `toCsvUrl(url)` e `fetchCsv(url)`. Converte URLs do Google Sheets em URLs de exportação CSV. Timeout 30s, validação de tamanho (10MB). |
| `src/core/sheets/parser.ts` | `parseCsv(csv)` usando PapaParse. Retorna headers e rows estruturadas. Ignora linhas vazias. 1-indexed. |
| `src/core/sheets/mapeamento.ts` | `MAPEAMENTO_ASSOCIADOS` (vazio, aguardando planilha real). Tipo `ColumnMapping`. |
| `src/core/sheets/types.ts` | Tipos: `AssociadoRow`, `ImportError`, `ImportPreview`, `ImportResult`. |
| `src/services/importacao.service.ts` | Stub com `preview(url)` e `executar(url)`. Lança AppError com mensagem clara até a planilha real chegar. |

### 6.2 Estado Atual

- Estrutura completa e tipada.
- Lógica de upsert, validação Zod por linha e gravação em `audit_log`/`importacoes` será implementada após a planilha real chegar.
- Sem chamadas a Supabase ainda (apenas estrutura defensiva).

---

## 7. Arquivos Criados (21)

### Documentação (3)

- `MIGRATIONS_PLAN.md`
- `SHEETS_FORMAT.md`
- `supabase/README.md`

### Migrations (3)

- `supabase/migrations/0001_init_schema.sql`
- `supabase/migrations/0002_rls_policies.sql`
- `supabase/migrations/0003_seed_roles.sql`

### PWA Assets (5)

- `public/favicon.svg`
- `public/icons/icon-192.svg`
- `public/icons/icon-512.svg`
- `public/icons/icon-maskable-512.svg`
- `public/icons/apple-touch-icon-180.svg`
- `public/robots.txt`

### Código (5)

- `src/core/sheets/client.ts`
- `src/core/sheets/parser.ts`
- `src/core/sheets/mapeamento.ts`
- `src/core/sheets/types.ts`
- `src/services/importacao.service.ts`

### CI/CD (2)

- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

### Modificados (3)

- `package.json` (adicionado `vite-plugin-pwa` e `workbox-window`)
- `vite.config.ts` (configurado `VitePWA`)
- `index.html` (manifest, apple-touch-icon, mask-icon)
- `src/main.tsx` (registro de SW em produção)
- `src/vite-env.d.ts` (tipagem de `virtual:pwa-register`)

---

## 8. Validações Executadas

| Validação | Resultado |
|---|---|
| `npm install` | 178 pacotes adicionados |
| `npm run typecheck` | ✓ 0 erros |
| `npm run lint` | ✓ 0 erros |
| `npm run build` | ✓ Sucesso em 3.90s |
| Bundle JS (gzip) | 79.53 kB (workbox + PWA) |
| Bundle CSS (gzip) | 5.18 kB |
| Service Worker gerado | ✓ `dist/sw.js` + `dist/workbox-*.js` |
| Manifesto gerado | ✓ `dist/manifest.webmanifest` com 3 ícones |
| PWA precache | 73 entries (1152.79 KiB) |
| Ícones SVG criados | ✓ 5 arquivos |
| Migrations SQL sintaticamente válidas | ✓ (validação por inspeção) |
| RLS habilitado em todas as tabelas | ✓ |
| Auditoria em tabelas de negócio | ✓ |
| Nenhum dado fictício | ✓ |
| Nenhum secret em código | ✓ |

---

## 9. Conformidade com Decisões

- ✓ HashRouter
- ✓ Migrations manuais via CLI (documentado em `supabase/README.md`)
- ✓ PWA instalável com estratégias de cache controladas
- ✓ Sem cache agressivo de dados sensíveis (auth = NetworkOnly, REST = NetworkFirst 60s)
- ✓ CI/CD com lint, typecheck, build, deploy
- ✓ Nenhuma tela de negócio criada nesta etapa

---

## 10. Pendências Mantidas

| # | Pendência | Origem |
|---|---|---|
| 1 | Aplicar migrations no projeto Supabase real | Cliente (via CLI ou SQL Editor) |
| 2 | Planilha Google Sheets real | Cliente |
| 3 | Logo oficial (PNG) para ícones PWA | Cliente |
| 4 | Domínio GitHub Pages final | Cliente |
| 5 | Primeiro usuário admin | Cliente (criar via Supabase + SQL) |
| 6 | Credenciais Supabase no `.env` | Cliente |
| 7 | Lógica de upsert no `importacao.service` | Após planilha real |
| 8 | Push notifications | Fase 1.2 (futura) |
| 9 | Testes E2E | Fase futura |

---

## 11. Próximo Marco (ETAPA 17 — Validação Final)

- Execução manual de smoke test em diferentes larguras (320, 375, 390, 430).
- Verificação de `prefers-reduced-motion`.
- Lighthouse audit (PWA, Accessibility, Performance).
- Verificação de contraste WCAG AA.
- Verificação de fluxo completo: login → navegação → logout.
- Verificação de instalação PWA em Chrome e Safari iOS.
- Verificação de cache offline.

Aguardando aprovação para iniciar ETAPA 17.
