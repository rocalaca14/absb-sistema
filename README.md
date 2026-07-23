# ABSB — Associação dos Bugueiros de São Bento

Aplicação PWA para gestão da Associação dos Bugueiros de São Bento.

## Stack

- **React 18** + **TypeScript 5** (strict)
- **Vite 5** (build e dev server)
- **React Router 6** (HashRouter — preparado para migração futura para BrowserRouter)
- **Supabase** (autenticação e banco de dados Postgres)
- **Lucide Icons** (ícones)
- **Inter** (fonte única)
- **PWA** instalável (configuração prevista, ativação em fase posterior)

## Setup

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com as credenciais do Supabase
# VITE_SUPABASE_URL=https://<projeto>.supabase.co
# VITE_SUPABASE_ANON_KEY=<chave-anon>

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (porta 5173) |
| `npm run build` | Build de produção (TypeScript check + Vite build) |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | ESLint em todo o código |
| `npm run typecheck` | Verificação de tipos TypeScript |
| `npm run format` | Formatação com Prettier |
| `npm run deploy` | Deploy para GitHub Pages |

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sim | Chave pública (anon) do Supabase |
| `VITE_APP_VERSION` | Não | Versão da aplicação (injetada no build) |
| `VITE_GH_PAGES_BASE` | Não | Base path do GitHub Pages |

## Estrutura de Pastas

```
src/
├── main.tsx
├── App.tsx
├── design-system/      # Tokens CSS, reset, typography
├── constants/          # Constantes centralizadas
├── types/              # Tipos TypeScript
├── core/               # Supabase, cache, errors, logger
├── services/           # Lógica de negócio
├── contexts/           # Context API (Auth, Toast)
├── hooks/              # Hooks customizados
├── utils/              # Utilitários puros
├── components/         # Componentes de UI e layout
├── pages/              # Páginas (rotas)
└── routes/             # Definição de rotas
```

## Documentação

Toda a documentação oficial está na raiz do repositório em arquivos `.md`:

- `ARCHITECTURE.md` — visão geral e índice
- `CORE_ARCHITECTURE.md` — infraestrutura e bootstrap
- `COMPONENT_LIBRARY.md` — biblioteca de componentes
- `DESIGN_SYSTEM.md` — tokens visuais
- `UI_SPECIFICATION.md` — especificação pixel a pixel
- `DESIGN_RULES.md` — regras de design
- `DEVELOPMENT_RULES.md` — regras de código
- `DATABASE_SPECIFICATION.md` — modelagem do banco
- `PERMISSIONS.md` — perfis e permissões
- `SYSTEM_FLOWS.md` — fluxos funcionais
- `PWA_SPECIFICATION.md` — especificação PWA
- `CONSTANTS.md` — constantes
- `ROADMAP.md` — versões e escopo
- `REVISION_NOTES.md` — histórico de mudanças
- `AUDIT_REPORT.md` — auditoria da especificação
- `DOCUMENTATION_VALIDATION_REPORT.md` — validação da documentação
- `PLANO_IMPLEMENTACAO_FASE_1.md` — plano de implementação

## Padrão Visual de Referência

- **Apple Wallet** — clareza, hierarquia, espaços generosos
- **Notion** — minimalismo, foco no conteúdo
- **Stripe Dashboard** — sofisticação, transições suaves

## Identidade

- **Cor primária:** `#00BAB9` (teal)
- **Cor accent:** `#FFA600` (laranja)
- **Fonte:** Inter

## Licença

Proprietário. Todos os direitos reservados.
