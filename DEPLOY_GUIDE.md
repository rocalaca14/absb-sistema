# DEPLOY_GUIDE.md — Guia de Implantação ABSB

**Projeto:** Associação dos Bugueiros de São Bento (ABSB)  
**Objetivo:** Documentar o processo completo de implantação do sistema em ambiente de produção.  
**Última atualização:** 23/07/2026

---

## 1. Visão Geral

Este guia descreve como implantar o PWA ABSB em produção usando:

- **Frontend:** Vite + React + TypeScript
- **Hospedagem:** GitHub Pages
- **Backend/Banco:** Supabase (PostgreSQL + Auth)
- **CI/CD:** GitHub Actions
- **PWA:** vite-plugin-pwa + workbox

---

## 2. Pré-requisitos

### 2.1 Contas e Serviços

| Item | Obrigatório | Observação |
|---|---|---|
| Conta GitHub | Sim | Repositório já configurado |
| Conta Supabase | Sim | Projeto gratuito ou pago |
| GitHub Pages habilitado | Sim | Configurar em Settings > Pages |
| GitHub Actions habilitado | Sim | Já habilitado por padrão |

### 2.2 Ferramentas Locais

| Ferramenta | Versão Mínima | Comando de Verificação |
|---|---|---|
| Node.js | 20.x | `node --version` |
| npm | 10.x | `npm --version` |
| Git | 2.x | `git --version` |
| Supabase CLI | 1.190.x | `supabase --version` |

### 2.3 Instalação do Supabase CLI

```bash
# macOS/Linux
npm install -g supabase

# Windows (PowerShell)
npm install -g supabase

# Verificar
supabase --version
```

### 2.4 Instalação Local do Projeto

```bash
# Clone do repositório
git clone https://github.com/<usuario>/<repo>.git
cd <repo>

# Instalar dependências
npm install

# Verificar ambiente
npm run typecheck
npm run lint
npm run build
npm run test
```

---

## 3. Estrutura do Ambiente

### 3.1 Repositório

```
app-absb/
├── .github/workflows/      # CI/CD
│   ├── ci.yml
│   └── deploy.yml
├── src/                    # Código fonte React
├── public/                 # Assets estáticos
│   ├── icons/              # Ícones PWA
│   ├── favicon.svg
│   └── robots.txt
├── supabase/
│   ├── migrations/         # Migrations SQL
│   │   ├── 0001_init_schema.sql
│   │   ├── 0002_rls_policies.sql
│   │   └── 0003_seed_roles.sql
│   └── scripts/
│       └── create_first_admin.sql
├── tests/                  # Setup de testes
├── dist/                   # Build de produção
├── .env.example
├── index.html
├── vite.config.ts
├── package.json
└── tsconfig*.json
```

### 3.2 Variáveis de Ambiente

Copiar `.env.example` para `.env`:

```bash
cp .env.example .env
```

Preencher:

| Variável | Descrição | Origem |
|---|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | Dashboard > Project Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima pública | Dashboard > Project Settings > API |
| `VITE_APP_VERSION` | Versão exibida no app | Exemplo: `0.1.0` |
| `VITE_GH_PAGES_BASE` | Base path do GitHub Pages | Exemplo: `/app-absb/` |

> ⚠️ **Nunca commite o arquivo `.env`.** Ele já está no `.gitignore`.

### 3.3 Variáveis no GitHub Actions

Para o deploy funcionar com Supabase, adicione em **Settings > Secrets and variables > Actions > Repository secrets**:

| Secret | Valor |
|---|---|
| `VITE_SUPABASE_URL` | URL do Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key do Supabase |

> Observação: o workflow atual (`deploy.yml`) não injeta essas variáveis no build. Isso é um risco documentado no `FASE_4_DEPLOY_REPORT.md`.

---

## 4. Preparação do Supabase

### 4.1 Criar Projeto

1. Acesse https://supabase.com/dashboard
2. Clique em **New Project**
3. Escolha organização e nome do projeto
4. Defina região (recomendado: mais próxima dos usuários)
5. Aguarde a criação do projeto

### 4.2 Aplicar Migrations

#### Opção A: Supabase CLI (recomendado)

```bash
# Login
supabase login

# Vincular projeto
supabase link --project-ref <PROJECT_REF>

# Aplicar migrations
supabase db push
```

#### Opção B: SQL Editor (manual)

1. Acesse **SQL Editor** no dashboard.
2. Execute os arquivos na ordem:
   1. `supabase/migrations/0001_init_schema.sql`
   2. `supabase/migrations/0002_rls_policies.sql`
   3. `supabase/migrations/0003_seed_roles.sql`

### 4.3 Verificar Aplicação

```sql
-- Tabelas criadas
select tablename from pg_tables where schemaname = 'public';

-- RLS habilitado
select tablename, rowsecurity from pg_tables where schemaname = 'public';

-- Policies
select schemaname, tablename, policyname from pg_policies where schemaname = 'public';

-- Triggers
select trigger_name, event_object_table from information_schema.triggers
where trigger_schema = 'public';

-- Funções
select routine_name from information_schema.routines
where routine_schema = 'public' and routine_type = 'FUNCTION';
```

### 4.4 Criar Primeiro Administrador

Use o script `supabase/scripts/create_first_admin.sql`:

1. Substitua os placeholders `__ADMIN_EMAIL__`, `__ADMIN_PASSWORD__` e `__ADMIN_UUID__`.
2. Execute no SQL Editor do Supabase.
3. Verifique o login com as credenciais criadas.

---

## 5. Configuração do GitHub Pages

### 5.1 Habilitar GitHub Pages

1. Vá em **Settings > Pages**.
2. Em **Source**, selecione **Deploy from a branch**.
3. Selecione branch `gh-pages` e pasta `/ (root)`.
4. Salve.

### 5.2 Configurar Workflow (alternativa)

O repositório já possui `.github/workflows/deploy.yml` que usa `peaceiris/actions-gh-pages`. Também é possível migrar para deploy nativo via GitHub Actions artifacts, se desejado.

### 5.3 Configurar Base Path

O projeto usa `HashRouter` e `base: './'` no Vite, funcionando tanto em domínio raiz quanto em subdiretório.

Se o repositório for `https://<usuario>.github.io/<repo>/`, a configuração atual já funciona. Se for domínio customizado, também funciona.

---

## 6. Build e Deploy

### 6.1 Build Local

```bash
npm run build
```

Saída em `dist/`.

### 6.2 Preview Local

```bash
npm run preview
```

### 6.3 Deploy Manual (via gh-pages)

```bash
npm run deploy
```

### 6.4 Deploy Automático

A cada push na branch `main`, o workflow `.github/workflows/deploy.yml` executa:

1. Quality gate (lint, typecheck, build)
2. Build de produção
3. Deploy para `gh-pages`

---

## 7. Checklist de Implantação

### 7.1 Pré-implantação

- [ ] Node.js 20+ instalado
- [ ] Git configurado
- [ ] Supabase CLI instalado
- [ ] Conta Supabase criada
- [ ] Projeto Supabase criado
- [ ] Repositório GitHub configurado
- [ ] GitHub Pages habilitado
- [ ] `.env` configurado localmente
- [ ] Secrets do GitHub configurados (se necessário)

### 7.2 Supabase

- [ ] Migrations aplicadas (`0001`, `0002`, `0003`)
- [ ] Tabelas criadas
- [ ] RLS habilitado
- [ ] Policies criadas
- [ ] Triggers criados
- [ ] Funções criadas
- [ ] Índices criados
- [ ] Primeiro administrador criado
- [ ] Login com admin testado

### 7.3 GitHub Pages

- [ ] Branch `gh-pages` existe
- [ ] GitHub Pages aponta para `gh-pages`
- [ ] Workflow `deploy.yml` configurado
- [ ] Deploy automático testado
- [ ] URL pública acessível
- [ ] HashRouter funcionando
- [ ] PWA instalável
- [ ] Service Worker registrado

### 7.4 Pós-implantação

- [ ] Login funciona em produção
- [ ] CRUD Associados validado
- [ ] CRUD Mensalidades validado
- [ ] Registro de Pagamento validado
- [ ] Permissões por papel validadas
- [ ] Exportação CSV testada
- [ ] Dark Mode testado
- [ ] PWA instalado em Android
- [ ] PWA instalado em iOS
- [ ] PWA offline testado

---

## 8. Troubleshooting

### 8.1 Build falha no GitHub Actions

- Verificar se `package-lock.json` está sincronizado com `package.json`.
- Verificar logs do workflow em **Actions**.

### 8.2 Página em branco no GitHub Pages

- Verificar se o `base` do Vite está correto.
- Verificar se os caminhos dos assets são relativos.
- Verificar se o `manifest.webmanifest` não está com caminho absoluto.

### 8.3 Supabase não conecta

- Verificar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
- Verificar se as secrets estão sendo injetadas no build.
- Verificar se o projeto não está em modo de manutenção.

### 8.4 Permissões não funcionam

- Verificar se as policies foram aplicadas.
- Verificar se `profiles.role` está sincronizado com `app_metadata.role`.
- Verificar se o usuário está autenticado.

---

## 9. Referências

- `FASE_4_DEPLOY_REPORT.md` — relatório completo da Fase 4
- `PRODUCTION_CHECKLIST.md` — checklist de produção
- `FASE_3_4_REPORT.md` — integração real
- `supabase/migrations/` — schema do banco
- `.github/workflows/deploy.yml` — pipeline de deploy
