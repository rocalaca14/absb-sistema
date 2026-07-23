# FASE_2_PLAN — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão:** 1.0
**Data:** 22/07/2026
**Idioma:** Português (Brasil)
**Marco:** Fase 2 — Telas de Negócio (v1.0)
**Status:** Aguardando aprovação

---

## 1. Visão Geral

A Fase 2 implementa as **telas de negócio** da versão 1.0. Após a fundação técnica (Fase 1) e o refinamento (Fase 1.1), o sistema está pronto para receber:

- **Dashboard** com visão geral.
- **Mensalidades** com listagem, criação e registro de pagamento.
- **Associados** com CRUD completo.
- **Configurações** com perfil, gestão de usuários (admin) e configuração da associação.

A Fase 2 **NÃO** implementa:
- Relatórios (v1.1).
- Notificações push (v1.2).
- Auditoria UI (v1.2).
- Multi-tenant (v2.0).
- Aplicativo nativo (v2.0).

---

## 2. Telas Previstas

### 2.1 Dashboard (rota `/`)

**Objetivo:** visão geral rápida do estado da associação.

**Componentes:**

- Saudação: "Olá, {nome}".
- 4 cards de resumo (2 colunas em mobile, 4 em desktop):
  - **Associados Ativos**: número total.
  - **Mensalidades em Aberto**: quantidade + valor total.
  - **Pagas no Mês**: quantidade + valor total.
  - **Inadimplentes**: quantidade (vencidas há mais de X dias).
- Lista de "Próximos Vencimentos" (5 mensalidades com vencimento nos próximos 7 dias).
- Ações rápidas (condicionadas a permissões): "Adicionar Associado", "Gerar Mensalidades do Mês".

### 2.2 Mensalidades (rota `/mensalidades`)

**Objetivo:** gerenciar mensalidades e pagamentos.

**Componentes:**

- Header com mês de referência atual (navegação entre meses).
- Filtros: status (pendente, pago, vencido), associado.
- Lista de mensalidades (Card ou linha).
- Botão "Gerar Mensalidades do Mês" (admin/diretor).
- Cada item mostra: associado, valor, vencimento, status, ações.
- Ações por item:
  - "Registrar Pagamento" (admin/tesoureiro).
  - "Ver Detalhes" (todos).
  - "Editar" (admin/tesoureiro, se pendente).
  - "Excluir" (admin).

### 2.3 Associados (rota `/associados`)

**Objetivo:** CRUD completo de associados.

**Componentes:**

- Header com busca global (nome, CPF, placa) + filtros (status, categoria).
- Lista de Cards (modo grid) ou linhas (modo tabela).
- Botão "+ Adicionar" (admin/diretor).
- Cada item: nome, CPF mascarado, categoria (cor), status.
- Detalhe do associado (rota `/associados/:id`):
  - Dados pessoais e veiculares.
  - Histórico de mensalidades.
  - Ações: editar, desativar, excluir.

### 2.4 Configurações (rota `/configuracoes`)

**Objetivo:** gerenciar conta, usuários e sistema.

**Componentes:**

- Card "Conta": nome, email, role atual.
- Card "Associação" (admin): nome, CNPJ, valor padrão da mensalidade.
- Seção "Usuários" (admin): lista de usuários com convidar, alterar role, desativar.
- Seção "Importação" (admin): botão para abrir fluxo de importação de planilha.
- Botão "Sair da conta" (todos).

---

## 3. Ordem de Implementação

| # | Etapa | Dependências | Justificativa |
|---|---|---|---|
| 2.1 | **Services de dados** (associados, mensalidades, pagamentos) | Supabase client (✓), Migrations aplicadas (cliente) | Base para todas as telas |
| 2.2 | **Componentes auxiliares** (Modal, Table, Badge, EmptyState) | UI library (✓) | Necessários para telas complexas |
| 2.3 | **Dashboard** (Início) | services/dashboard (resumos) | Tela mais simples, valida arquitetura |
| 2.4 | **Associados (CRUD + lista)** | services/associados | Maior complexidade, base para mensalidades |
| 2.5 | **Mensalidades (lista + criação + pagamento)** | services/mensalidades, services/pagamentos | Depende de associados |
| 2.6 | **Configurações (perfil + gestão de usuários)** | services/profiles | Última tela, usa componentes já estáveis |

### 3.1 Marcos de Aprovação

Cada bloco acima gera relatório. Aprovações não são necessárias para cada sub-etapa, mas validações intermediárias podem ser solicitadas.

---

## 4. Componentes Utilizados

### 4.1 Existentes (12)

| Componente | Uso nas telas |
|---|---|
| `Button` | Ações (salvar, cancelar, excluir) |
| `Input` | Formulários, busca |
| `Card` | Resumo, lista, detalhe |
| `Icon` | Ícones em botões, indicadores, navegação |
| `Skeleton` | Loading states |
| `Toast` | Feedback de ações (sucesso/erro/info) |
| `SectionTitle` | Títulos de seção |
| `AppHeader` | Header global (via AppShell) |
| `BottomNav` | Navegação (via AppShell) |
| `PageContainer` | Container de página |
| `Stack` (novo) | Layout vertical/horizontal em todas as telas |
| `Container` (novo) | Centralização de conteúdo |
| `Spacer` (novo) | Espaçamentos dinâmicos |

### 4.2 Novos (a criar)

| Componente | API | Uso |
|---|---|---|
| `Modal` | `open`, `onClose`, `title`, `children`, `size`, `footer` | Confirmações, formulários |
| `Table` | `columns`, `rows`, `loading`, `empty`, `onRowClick` | Listagens tabulares |
| `Badge` | `variant` (success/error/warning/info/neutral), `children` | Status pills |
| `EmptyState` | `icon`, `title`, `description`, `action` | Listas vazias |
| `Tabs` | `items`, `value`, `onChange`, `children` | Detalhes do associado |
| `Select` (opcional) | `options`, `value`, `onChange`, `placeholder` | Filtros dropdown |
| `DatePicker` (opcional) | nativo ou biblioteca leve | Datas em mensalidades |

### 4.3 Decisões sobre Componentes Externos

- **DatePicker**: usar input nativo `type="date"` (sem dependência) na Fase 2. Avaliar lib externa em v1.1.
- **Virtualização de lista**: `react-window` será adicionado quando necessário. Inicialmente, listas usarão paginação client-side.

---

## 5. Tabelas Envolvidas

| Tela | Tabelas principais | Tabelas relacionadas |
|---|---|---|
| Dashboard | `associados`, `mensalidades` | `pagamentos` (para "pagas no mês") |
| Mensalidades | `mensalidades` | `associados`, `pagamentos` |
| Associados | `associados` | `mensalidades` (histórico) |
| Configurações | `profiles` | `configuracoes`, `importacoes` (admin) |

### 5.1 Queries Principais

**Dashboard (resumo):**

```ts
// Associados ativos
supabase.from('associados').select('id', { count: 'exact', head: true }).eq('ativo', true)

// Mensalidades em aberto
supabase.from('mensalidades').select('valor_final', { count: 'exact' }).eq('pago', false)

// Pagas no mês
supabase.from('mensalidades').select('valor_final', { count: 'exact' })
  .eq('pago', true)
  .eq('referencia', 'YYYY-MM')

// Vencidas (vencidas há mais de 30 dias)
supabase.from('mensalidades').select('id', { count: 'exact', head: true })
  .eq('pago', false).lt('vencimento_em', 'YYYY-MM-DD')
```

**Mensalidades (lista):**

```ts
supabase.from('mensalidades')
  .select('id, valor_final, vencimento_em, pago, associado:associados(id, nome)')
  .eq('referencia', 'YYYY-MM')
  .order('vencimento_em')
```

**Associados (lista):**

```ts
supabase.from('associados')
  .select('id, nome, cpf, categoria, ativo, veiculo_placa')
  .order('nome')
  .range(0, 49) // paginação
```

### 5.2 Permissões por Operação

| Operação | admin | tesoureiro | diretor | visualizador |
|---|---|---|---|---|
| Listar associados | ✓ | ✓ | ✓ | ✓ |
| Criar associado | ✓ | ✗ | ✓ | ✗ |
| Editar associado | ✓ | ✗ | ✓ | ✗ |
| Desativar associado | ✓ | ✗ | ✓ | ✗ |
| Excluir associado | ✓ | ✗ | ✗ | ✗ |
| Listar mensalidades | ✓ | ✓ | ✓ | ✓ |
| Criar mensalidades em lote | ✓ | ✓ | ✗ | ✗ |
| Editar mensalidade | ✓ | ✓ | ✗ | ✗ |
| Registrar pagamento | ✓ | ✓ | ✗ | ✗ |
| Ver dashboard completo | ✓ | ✓ | ✓ | ✓ (resumo apenas) |
| Gerenciar usuários | ✓ | ✗ | ✗ | ✗ |
| Editar configurações | ✓ | ✗ | ✗ | ✗ |
| Importar planilha | ✓ | ✗ | ✗ | ✗ |

---

## 6. Fluxos do Usuário

### 6.1 Fluxo: Login → Dashboard

1. Usuário acessa `/` sem sessão.
2. `ProtectedRoute` redireciona para `/login`.
3. Usuário preenche e-mail e senha.
4. Submit → `signIn` do Supabase.
5. Sucesso: toast, redirect para `/`.
6. Dashboard carrega resumos (4 cards em paralelo).
7. Skeleton durante loading.

### 6.2 Fluxo: Cadastrar Novo Associado

1. Em `/associados`, clica em "+ Adicionar" (visível apenas para admin/diretor).
2. Modal abre com formulário (campos: nome, CPF, telefone, email, endereço, dados do veículo).
3. Validação inline (Zod) em cada campo.
4. Submit → `associadosService.create(data)`.
5. Toast de sucesso: "Associado cadastrado com sucesso."
6. Modal fecha, lista atualizada (com o novo item no topo).
7. Audit log registra `INSERT` em `associados`.

### 6.3 Fluxo: Registrar Pagamento

1. Em `/mensalidades`, clica em "Pagar" em uma mensalidade pendente.
2. Modal abre com: valor (pré-preenchido), data (default hoje), forma de pagamento (dropdown), observações.
3. Submit → `pagamentosService.create(mensalidadeId, data)`.
4. Backend (via trigger ou service) atualiza `mensalidades.pago = true` e `pago_em`.
5. Toast de sucesso: "Pagamento registrado."
6. Modal fecha, item mostra status "pago" (Badge verde).

### 6.4 Fluxo: Geração em Lote de Mensalidades

1. Em `/mensalidades`, admin/tesoureiro clica em "Gerar Mensalidades do Mês".
2. Modal de confirmação: "Gerar mensalidades de {mês} para todos os {N} associados ativos?"
3. Confirma → `mensalidadesService.gerarLote(referencia)`.
4. Backend cria N mensalidades com `valor_final = valor_padrao` (de `configuracoes`).
5. Toast com contagem: "{N} mensalidades geradas. {M} já existiam."
6. Lista atualizada.

### 6.5 Fluxo: Logout

1. Em `/configuracoes`, clica em "Sair" (todos os roles).
2. Modal de confirmação: "Deseja realmente sair?"
3. Confirma → `authService.signOut()`.
4. Limpa cache de aplicação.
5. Toast de informação: "Você saiu da conta."
6. Redireciona para `/login`.

### 6.6 Fluxo: Gestão de Usuários (apenas admin)

1. Em `/configuracoes`, admin clica em "Gerenciar Usuários".
2. Modal/Página com lista de usuários (Table).
3. Ações: Convidar (formulário), Alterar Role (dropdown), Desativar/Ativar.
4. Cada ação → audit log.
5. Toast de feedback.

---

## 7. Critérios de Aceite

### 7.1 Por Tela

| Tela | Critérios |
|---|---|
| Dashboard | Carrega em < 1s. 4 cards com dados reais. Próximos vencimentos listados. Responsivo (4 colunas → 2 colunas em telas menores). |
| Mensalidades | Filtros funcionam. Lista paginada. Pagamento atualiza status. Geração em lote funciona. Permissões aplicadas. |
| Associados | Busca por nome/CPF/placa funciona. CRUD completo. Detalhe mostra histórico. Validação Zod bloqueia submit inválido. |
| Configurações | Mostra dados do usuário. Logout funciona. Admin vê seções extras. |

### 7.2 Transversais

| Critério | Descrição |
|---|---|
| **Componentes oficiais** | Zero criação de componentes fora da biblioteca. |
| **CSS inline** | Zero CSS inline em páginas (usa Stack, Container, Spacer). |
| **Tokens** | Zero valores hardcoded. Todos via `var(--*)`. |
| **Acessibilidade** | WCAG AA. Foco visível. ARIA correto. Contraste verificado. |
| **Responsividade** | 320, 375, 390, 430, 768+. Sem overflow horizontal. |
| **Performance** | Lista com 1000 itens renderiza em < 500ms (paginação). Bundle gzip por rota < 50kB. |
| **TypeScript** | `strict: true`, sem `any`, sem `@ts-ignore`. |
| **Lint** | `npm run lint` passa com 0 erros. |
| **Build** | `npm run build` passa. |
| **Auditoria** | Mutações geram entradas em `audit_log`. |
| **Permissões** | UI esconde elementos baseado em `usePermission(role, permission)`. |

### 7.3 Validações a Executar no Final da Fase 2

- `npm run typecheck` — 0 erros.
- `npm run lint` — 0 erros.
- `npm run build` — 0 erros.
- Smoke test em 320, 375, 390, 430, 768px.
- Login com credenciais reais (4 papéis).
- CRUD completo de associado.
- Geração e pagamento de mensalidade.
- Logout e restauração de sessão.
- Lighthouse audit (PWA + Acessibilidade ≥ 90).

---

## 8. Pendências para Iniciar

| # | Item | Origem | Impacto |
|---|---|---|---|
| INFO-01 | Campos completos de `associados` (validação) | Cliente | Garante que formulário tenha todos os campos |
| INFO-02 | Regras de cálculo de mensalidades (juros, multa) | Cliente | Cálculo de `valor_final` ao pagar |
| INFO-03 | Dia de vencimento padrão | Cliente | Default em `configuracoes.vencimento_dia` |
| INFO-04 | Valor padrão da mensalidade | Cliente | Default em `configuracoes.mensalidade_valor` |
| INFO-05 | Política de inadimplência (X dias) | Cliente | Definição de "vencido" |
| INFO-06 | Lista de categorias internas | Cliente | Filtro e cor da categoria |
| INFO-07 | Workflow de aprovação de mensalidades | Cliente | Se há fluxo de aprovação ou geração direta |
| INFO-08 | Quem pode excluir (apenas admin?) | Cliente | Confirma matriz de permissões |
| INFO-09 | Formato de recibo/comprovante | Cliente | Se há geração de PDF, envio por email, etc. |
| INFO-10 | Política de soft delete vs hard delete | Cliente | Exclusão de associado preserva histórico? |

---

## 9. Cronograma Estimado (em etapas internas)

| # | Etapa | Tamanho estimado |
|---|---|---|
| 2.1 | Services de dados | Pequeno (1-2 dias) |
| 2.2 | Componentes auxiliares (Modal, Table, Badge, EmptyState) | Médio (2-3 dias) |
| 2.3 | Dashboard | Pequeno (1 dia) |
| 2.4 | Associados (CRUD) | Grande (3-4 dias) |
| 2.5 | Mensalidades | Grande (3-4 dias) |
| 2.6 | Configurações | Médio (2-3 dias) |
| 2.7 | Validações finais | Médio (1-2 dias) |

**Total estimado:** 13-19 dias úteis.

---

## 10. Riscos

| # | Risco | Mitigação |
|---|---|---|
| R1 | Plano de mensalidade com regras complexas não fornecido | Fase 2 começa com regras mínimas; refinamento em v1.1 |
| R2 | Performance de lista de 1000+ associados sem virtualização | Paginação client-side (20 por página) na Fase 2; virtualização em v1.1 |
| R3 | UI escondendo elementos por permissão requer hook não implementado | Implementar `usePermission` + `<Can>` como pré-requisito da Fase 2 |
| R4 | Validações de formulário complexas exigem Zod schemas robustos | Schemas em `utils/validators.ts`, com mensagens em pt-BR |
| R5 | Geração em lote de mensalidades pode demorar | Loading state + chunking (100 por vez) |
| R6 | Modais em mobile precisam de tratamento especial (slide-up) | `Modal` com `size="full"` em mobile, `size="md"` em desktop |

---

## 11. Aprovações

Aprovações de marcos intermediários não são necessárias, mas recomenda-se:

- Aprovação após ETAPA 2.4 (Associados) — base do sistema.
- Aprovação após ETAPA 2.5 (Mensalidades) — fluxo de negócio mais complexo.
- Aprovação final da Fase 2 (após ETAPA 2.7).

**Próximo passo:** aguardando aprovação deste plano para iniciar ETAPA 2.1 (Services de dados).
