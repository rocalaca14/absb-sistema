# ARCHITECTURE — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 3.0
**Status:** Vigente
**Idioma:** Português (Brasil)

---

## 1. Propósito deste documento

Este documento é o **ponto de entrada** da documentação técnica do projeto. Define stack, princípios arquiteturais e índice de toda a documentação oficial. Nenhuma decisão de implementação deve existir fora dos documentos referenciados aqui.

Toda a documentação deste projeto é **fonte única de verdade**. Em caso de divergência entre código e documento, o documento prevalece até revisão aprovada.

Este documento é a versão canônica em inglês do antigo `ARQUITETURA.md`. O conteúdo é equivalente e atualizado para refletir as decisões D1, D2 e a nova identidade visual.

---

## 2. Documentação Oficial

| Documento | Conteúdo | Categoria |
|---|---|---|
| `ARCHITECTURE.md` | Visão geral, stack, princípios, índice (este documento) | Arquitetura |
| `CORE_ARCHITECTURE.md` | Infraestrutura, bootstrap, providers, sessão, cache, Supabase, importação | Arquitetura |
| `COMPONENT_LIBRARY.md` | Biblioteca de componentes, API, variantes, exemplos de uso | Componentes |
| `DESIGN_SYSTEM.md` | Tokens visuais: cor, tipografia, espaçamento, raio, sombra, animação, ícones, estados | Design |
| `UI_SPECIFICATION.md` | Especificação pixel a pixel de cada componente | Design |
| `DESIGN_RULES.md` | Regras obrigatórias de design e protocolo de conflito | Design |
| `DEVELOPMENT_RULES.md` | Regras de código, git, testes, CI/CD, padrões TypeScript | Desenvolvimento |
| `CONSTANTS.md` | Constantes centralizadas do sistema | Referência |
| `DATABASE_SPECIFICATION.md` | Modelagem do banco Supabase | Dados |
| `PERMISSIONS.md` | Perfis, permissões e matriz de acesso | Segurança |
| `SYSTEM_FLOWS.md` | Fluxos funcionais (login, importação, edição, etc.) | Comportamento |
| `PWA_SPECIFICATION.md` | Manifest, service worker, instalação, offline | PWA |
| `ROADMAP.md` | Planejamento de versões e módulos | Planejamento |
| `REVISION_NOTES.md` | Histórico de mudanças e decisões aplicadas | Governança |
| `AUDIT_REPORT.md` | Auditoria da especificação | Governança |
| `DOCUMENTATION_VALIDATION_REPORT.md` | Validação da documentação após mudanças | Governança |

**Regra:** qualquer alteração nestas áreas deve ser feita via atualização da documentação correspondente antes de tocar no código.

---

## 3. Visão Geral do Produto

Aplicação PWA destinada à gestão da Associação dos Bugueiros de São Bento. Foco em celular, suporte a Android e iPhone, também funcional em desktop. Interface 100% em Português (Brasil).

### 3.1 Identidade Visual

- **Cor primária:** `#00BAB9` (teal).
- **Cor accent:** `#FFA600` (laranja).
- **Fonte:** Inter.
- **Padrão de referência:** Apple Wallet + Notion + Stripe Dashboard (premium, minimalista, clean, sofisticado, mobile first).
- **Princípios:** hierarquia visual clara, bastante espaço em branco, poucos elementos simultâneos, animações suaves, feedback visual para ações.

### 3.2 Escopo por Fase

| Fase | Escopo | Status |
|---|---|---|
| Fundação | Estrutura, Design System, Auth, Navegação, Esquema de banco, Importação | Documentado |
| 1.0 | Dashboard, Mensalidades, Associados, Configurações | Em roadmap |
| 1.1 | Relatórios, Prestação de Contas | Em roadmap |
| 1.2 | Notificações, Auditoria | Em roadmap |
| 2.0 | Multi-tenant, aplicativo nativo | Em roadmap |

Detalhamento completo em `ROADMAP.md`.

---

## 4. Stack Técnica (Decidida)

| Camada | Tecnologia | Versão alvo | Justificativa |
|---|---|---|---|
| Framework | React | 18.x | Requisito do cliente |
| Linguagem | TypeScript (strict) | 5.x | Segurança de tipo, base profissional |
| Build | Vite | 5.x | Performance, DX |
| Roteamento | React Router | 6.x | Padrão, suporte a PWA |
| Estilização | CSS Modules + Variáveis CSS | — | Sem dependência de UI lib; controle total de tokens |
| Ícones | lucide-react | última estável | Requisito do cliente |
| Fontes | Inter (via `@fontsource/inter`) | — | Requisito do cliente, sem dependência de CDN |
| Banco de Dados | Supabase (Postgres) | — | Requisito do cliente |
| Autenticação | Supabase Auth | — | Requisito do cliente |
| Cliente HTTP | `@supabase/supabase-js` | 2.x | Cliente oficial |
| PWA | `vite-plugin-pwa` | última compatível | Geração de SW e manifest |
| Validação | Zod | 3.x | Validação de schema, formulários, planilha |
| Máscaras | lib custom (`utils/format.ts`) | — | Sem dependência externa |
| Datas | date-fns | 3.x | Leve, tree-shakeable |
| Hospedagem | GitHub Pages | — | Requisito do cliente |
| CI/CD | GitHub Actions | — | Build e deploy automatizado |

**Sem dependências opcionais.** Toda biblioteca adicional precisa de justificativa registrada em ata antes de ser adicionada.

### 4.1 Princípios Arquiteturais

1. **Mobile first.** Toda decisão visual parte da largura 390px.
2. **Grid 8pt (D1).** Valores de espaçamento pertencem ao conjunto permitido: `{4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80}`.
3. **Touch target 48x48 (D2).** Todo elemento interativo tem área de toque mínima de 48x48px.
4. **Sem improvisação.** Nenhum valor "aproximado". Toda medida está em `CONSTANTS.md`.
5. **Componentização máxima.** Componentes são as unidades visuais reutilizáveis. Lista oficial em `COMPONENT_LIBRARY.md`.
6. **Tokenização total.** Cores, espaçamentos, raios, sombras e animações são tokens. Nunca valores soltos no código.
7. **Camadas separadas.** UI nunca acessa Supabase diretamente. Sempre via `services/`.
8. **Sem dados fictícios.** Banco não é populado em ambiente de desenvolvimento com dados fictícios.
9. **Fonte da verdade é o banco.** Planilha Google Sheets é apenas ferramenta de importação inicial.
10. **i18n restrito a pt-BR.** Strings centralizadas, mas sistema preparado para multi-idioma futuro.
11. **Acessibilidade WCAG AA.** Toda a interface respeita WCAG 2.1 nível AA. Detalhes em `DESIGN_SYSTEM.md` seção 21.
12. **Safe Area iOS.** Toda a interface respeita `env(safe-area-inset-*)`. Detalhes em `DESIGN_SYSTEM.md` seção 18.

---

## 5. Princípios de Não Interpretação

As seguintes regras são **invioláveis** e estão detalhadas em `DESIGN_RULES.md` e `DEVELOPMENT_RULES.md`:

- Não interpretar requisitos ambíguos.
- Não improvisar componentes.
- Não substituir componentes por alternativas similares.
- Não alterar medidas, espaçamentos, cores, tipografia ou grids.
- Não criar variantes sem autorização.
- Não adicionar dependências sem justificativa.
- Não usar valores hardcoded fora dos tokens.
- Não usar emojis ou imagens no lugar de ícones.
- Não usar CSS inline.
- Não criar soluções temporárias.
- Não usar valores fora do Grid 8pt (exceções documentadas em `DESIGN_SYSTEM.md`).

**Em caso de dúvida, conflito ou informação ausente: parar a implementação e solicitar autorização explícita.**

---

## 6. Princípios de Qualidade

| Aspecto | Regra | Documento |
|---|---|---|
| TypeScript | `strict: true`, sem `any` implícito, sem `@ts-ignore` sem justificativa | `DEVELOPMENT_RULES.md` |
| Lint | ESLint com regras padrão React + TypeScript | `DEVELOPMENT_RULES.md` |
| Formatação | Prettier (configuração padrão) | `DEVELOPMENT_RULES.md` |
| Commits | Conventional Commits em Português | `DEVELOPMENT_RULES.md` |
| Branches | `main` (produção), `develop` (homologação), `feature/*`, `hotfix/*`, `docs/*` | `DEVELOPMENT_RULES.md` |
| Pastas | Estrutura única, sem duplicação | `CORE_ARCHITECTURE.md` |
| Comentários | Apenas quando agregam informação não óbvia | `DEVELOPMENT_RULES.md` |
| DRY | Código duplicado é proibido | `DESIGN_RULES.md` |
| Tamanho de arquivo | Máximo 300 linhas | `DEVELOPMENT_RULES.md` |
| Componentes | Função pura + props tipadas | `DEVELOPMENT_RULES.md` |
| Testes | Vitest + React Testing Library | `DEVELOPMENT_RULES.md` |
| CI/CD | GitHub Actions: lint, typecheck, build, deploy | `DEVELOPMENT_RULES.md` |

---

## 7. Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sim | Chave pública (anon) do Supabase |
| `VITE_APP_VERSION` | Não | Versão da aplicação (injetada no build) |
| `VITE_GH_PAGES_BASE` | Não | Base path do GitHub Pages (ex: `/app-absb/`) |

`.env.example` deve existir com placeholders. `.env` real adicionado ao `.gitignore`. Nenhum secret pode ser commitado.

---

## 8. Bloqueios para Implementação

Os seguintes itens bloqueiam o início da implementação:

| # | Bloqueio | Documento afetado |
|---|---|---|
| 1 | Logo oficial da ABSB (arquivo de imagem) | `DESIGN_SYSTEM.md`, `UI_SPECIFICATION.md` |
| 2 | Planilha Google Sheets (link ou amostra) | `DATABASE_SPECIFICATION.md`, `SYSTEM_FLOWS.md` |
| 3 | Credenciais Supabase (URL, anon key) | `CORE_ARCHITECTURE.md` |
| 4 | Domínio final do GitHub Pages | `CORE_ARCHITECTURE.md`, `PWA_SPECIFICATION.md` |
| 5 | Decisão sobre primeiro usuário administrador | `PERMISSIONS.md` |
| 6 | 4 tons de categoria (oficiais confirmados) | `DESIGN_SYSTEM.md` (criados como semânticos, aguardam validação) |

Estes bloqueios não invalidam a documentação — apenas impedem que ela seja **executada** até serem resolvidos.

---

## 9. Aprovações

Toda alteração neste documento ou em qualquer documento referenciado exige aprovação explícita do solicitante antes de ser implementada. Mudanças visuais, arquiteturais ou de banco seguem o mesmo protocolo.

Mudanças são registradas em `REVISION_NOTES.md` e validadas em `DOCUMENTATION_VALIDATION_REPORT.md`.

---

## 10. Histórico de Versões

| Versão | Data | Descrição |
|---|---|---|
| 1.0 | 22/07/2026 | Versão inicial como `ARQUITETURA.md` |
| 2.0 | 22/07/2026 | Revisão completa. Adicionados índices, princípios e regras |
| 3.0 | 22/07/2026 | Renomeado para `ARCHITECTURE.md`. Atualizado com decisões D1, D2, nova identidade. Índice expandido com 5 novos documentos |
