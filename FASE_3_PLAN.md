# FASE_3_PLAN.md — Plano da Fase 3

**Projeto:** App ABSB — Associação dos Bugueiros de São Bento
**Data:** 22/07/2026
**Status:** Aguardando aprovação do cliente
**Versão:** 1.0

---

## 1. Objetivos da Fase 3

A Fase 3 foca em **funcionalidades avançadas** que resolvem problemas reais de negócio:

| Objetivo | Problema resolvido |
|---|---|
| Importação de dados | Cadastro manual de associados é lento e propenso a erros |
| Relatórios gerenciais | Gestão não tem visibilidade sobre financeiro e associados |
| Exportação de dados | Impossível extrair listagens para uso externo |
| Notificações | Associados não lembram do vencimento |
| Tema escuro | Usuários em ambientes com pouca luz têm dificuldade de leitura |
| Testes automatizados | Regressões passam despercebidas |

---

## 2. Funcionalidades Propostas

### 2.1 Importação de Associados (Google Sheets)

| Campo | Detalhe |
|---|---|
| **Objetivo** | Importar lista de associados de planilha Google Sheets |
| **Usuário beneficiado** | Admin, Diretor |
| **Tabelas envolvidas** | `associados`, `importacoes` |
| **Componentes** | `Button`, `Modal`, `Table`, `Badge`, `EmptyState`, `SectionTitle` |
| **Permissões** | `importacao.executar`, `importacao.read` |
| **Dependências** | Google Sheets API key, planilha fornecida pelo cliente |
| **Regras** | Validação de colunas obrigatórias, duplicatas por CPF, log de importação |

### 2.2 Relatório de Associados

| Campo | Detalhe |
|---|---|
| **Objetivo** | Gerar relatório de associados (ativos/inativos, por categoria) |
| **Usuário beneficiado** | Admin, Tesoureiro, Diretor |
| **Tabelas envolvidas** | `associados` |
| **Componentes** | `Table`, `Badge`, `Button`, `SectionTitle` |
| **Permissões** | `relatorios.view` |
| **Dependências** | Nenhuma |
| **Regras** | Filtros por status, categoria, período; formatação para impressão |

### 2.3 Relatório Financeiro

| Campo | Detalhe |
|---|---|
| **Objetivo** | Resumo financeiro: recebido, em aberto, vencido, por período |
| **Usuário beneficiado** | Admin, Tesoureiro |
| **Tabelas envolvidas** | `mensalidades`, `pagamentos` |
| **Componentes** | `Card`, `Badge`, `Table`, `SectionTitle`, `Skeleton` |
| **Permissões** | `relatorios.view` |
| **Dependências** | Definição de regras financeiras (INFO-01 a INFO-07) |
| **Regras** | Período selecionável, totais por status, deteccão de inadimplência |

### 2.4 Exportação de Dados

| Campo | Detalhe |
|---|---|
| **Objetivo** | Exportar listagens como CSV ou PDF |
| **Usuário beneficiado** | Admin, Tesoureiro, Diretor |
| **Tabelas envolvidas** | `associados`, `mensalidades`, `pagamentos` |
| **Componentes** | `Button` (ação de exportar) |
| **Permissões** | `relatorios.view` (associados), `pagamentos.read` (financeiro) |
| **Dependências** | Nenhuma |
| **Regras** | Respeitar filtros aplicados, encoding UTF-8, separador vírgula |

### 2.5 Notificações de Vencimento

| Campo | Detalhe |
|---|---|
| **Objetivo** | Enviar lembrete de vencimento de mensalidade |
| **Usuário beneficiado** | Associados (recebedores), Admin (configurador) |
| **Tabelas envolvidas** | `mensalidades`, `associados`, `configuracoes` |
| **Componentes** | `Switch`, `Input`, `SectionTitle` (configuração) |
| **Permissões** | `configuracoes.manage` (configuração) |
| **Dependências** | Email transacional (SendGrid, Mailgun, etc.), definição de regras |
| **Regras** | Dias antes do vencimento configuráveis, template de email, opt-out |

### 2.6 Tema Escuro (Dark Mode)

| Campo | Detalhe |
|---|---|
| **Objetivo** | Alternar entre tema claro e escuro |
| **Usuário beneficiado** | Todos os usuários |
| **Tabelas envolvidas** | Nenhuma |
| **Componentes** | `Button` (toggle), tokens CSS |
| **Permissões** | Nenhuma (preferência pessoal) |
| **Dependências** | Design tokens expandidos para dark mode |
| **Regras** | Respeitar `prefers-color-scheme`, persistir escolha no localStorage |

### 2.7 Testes Automatizados

| Campo | Detalhe |
|---|---|
| **Objetivo** | Cobrir fluxos críticos com testes |
| **Usuário beneficiado** | Equipe de desenvolvimento |
| **Tabelas envolvidas** | N/A |
| **Componentes** | Todos (testes de integração) |
| **Permissões** | N/A |
| **Dependências** | Framework de teste (Vitest + React Testing Library) |
| **Regras** | Cobrir: login, CRUD associados, registro pagamento, permissões |

---

## 3. Dependências Bloqueantes

### 3.1 Pode Implementar Agora

| Funcionalidade | Motivo |
|---|---|
| Relatório de Associados | Dados disponíveis, sem dependência externa |
| Exportação de Dados | Dados disponíveis, sem dependência externa |
| Tema Escuro | Tokens já preparados, sem dependência externa |
| Testes Automatizados | Infraestrutura técnica disponível |

### 3.2 Aguarda Definição do Cliente

| Funcionalidade | Dependência | O que precisa |
|---|---|---|
| Importação Google Sheets | Planilha + API key | Fornecer URL da planilha e credenciais |
| Relatório Financeiro | Regras financeiras | INFO-01 a INFO-07 definidos |
| Notificações | Email transacional | Provider escolhido, credenciais, templates |

---

## 4. Resolução de Pendências (INFO-01 a INFO-10)

### 4.1 Cálculo de Mensalidade (INFO-01)

**Pergunta:** Qual é o valor padrão da mensalidade?

**Opções:**
- A) Valor fixo configurável (ex: R$ 50,00)
- B) Variável por categoria de associado
- C) Variável por veículo (marca/modelo/ano)

**Impacto:** Define o campo `valor` na tabela `mensalidades` e o comportamento de `mensalidadeCreateSchema`.

### 4.2 Desconto e Acréscimo (INFO-02)

**Pergunta:** Quais descontos e acréscimos são permitidos?

**Opções:**
- A) Sem descontos/acréscimos
- B) Desconto fixo por regra (ex: pagamento antecipado)
- C) Desconto/acréscimo manual com justificativa

**Impacto:** Define se `desconto` e `acrescimo` são editáveis ou calculados automaticamente.

### 4.3 Formas de Pagamento (INFO-03)

**Pergunta:** Quais formas de pagamento são aceitas?

**Atuais:** dinheiro, pix, transferencia, cartao, boleto, outro

**Pergunta adicional:** É necessário validação de comprovante para alguma forma?

**Impacto:** Define se `comprovante_url` é obrigatório para alguma forma.

### 4.4 Geração em Lote (INFO-04)

**Pergunta:** As mensalidades são geradas automaticamente ou manualmente?

**Opções:**
- A) Manualmente, uma a uma
- B) Em lote, com seleção de associados e período
- C) Automática, todo mês para todos ativos

**Impacto:** Define a funcionalidade `gerarLote` no `mensalidadesService`.

### 4.5 Inadimplência (INFO-05)

**Pergunta:** Quais ações são tomadas quando a mensalidade vence sem pagamento?

**Opções:**
- A) Nenhuma ação automática
- B) Marcar como vencida (já implementado)
- C) Enviar notificação
- D) Bloquear acesso a funcionalidades
- E) Excluir associado

**Impacto:** Define regras de status e bloqueios automáticos.

### 4.6 Multas e Juros (INFO-06)

**Pergunta:** Há cobrança de multa/juros por atraso?

**Opções:**
- A) Sem multa/juros
- B) Multa fixa (ex: R$ 5,00)
- C) Multa percentual (ex: 2% ao mês)
- D) Juros progressivos

**Impacto:** Define cálculos no `pagamentosService` e regras de `acrescimo`.

### 4.7 Relatórios Financeiros (INFO-07)

**Pergunta:** Quais métricas financeiras são necessárias?

**Sugestões:**
- Total recebido no mês
- Total em aberto
- Total vencido
- Histórico de recebimento por período
- Ranking de associados em dia

**Impacto:** Define os endpoints de `dashboardService` e `relatoriosService`.

### 4.8 Exportação de Dados (INFO-08)

**Pergunta:** Quais dados podem ser exportados e em que formato?

**Opções:**
- A) Apenas listagem de associados (CSV)
- B) Associados + mensalidades (CSV)
- C) Relatórios completos (CSV + PDF)
- D) Tudo exportável

**Impacto:** Define escopo do `exportService`.

### 4.9 Convite de Usuários (INFO-09)

**Pergunta:** Como novos usuários são criados?

**Opções:**
- A) Admin cria via interface (já parcialmente implementado)
- B) Convite por email com link de cadastro
- C) Criação direta no Supabase Dashboard

**Impacto:** Define se `profilesService.invite` é habilitado e como.

### 4.10 Campos Obrigatórios do Associado (INFO-10)

**Pergunta:** Quais campos são obrigatórios além de `nome`?

**Sugestões:**
- CPF obrigatório?
- Telefone obrigatório?
- Email obrigatório?
- Veículo obrigatório?

**Impacto:** Define validação no `associadoCreateSchema`.

---

## 5. Melhorias Técnicas Recomendadas

### 5.1 Testes Automatizados

| Tipo | Ferramenta | Prioridade |
|---|---|---|
| Unitários | Vitest | Alta |
| Componentes | React Testing Library | Alta |
| E2E | Playwright | Média |
| Coverage | c8/istanbul | Média |

**Escopo mínimo:** Login, CRUD associados, registro pagamento, verificação de permissões.

### 5.2 Performance e Lighthouse

| Item | Ação | Prioridade |
|---|---|---|
| Lighthouse audit | Rodar e corrigir score < 90 | Alta |
| Lazy loading de imagens | Implementar se houver imagens | Média |
| Preload de rotas críticas | prefetch de /associados e /mensalidades | Média |
| Compression | Verificar gzip/brotli no deploy | Baixa |

### 5.3 PWA Avançado

| Item | Ação | Prioridade |
|---|---|---|
| Offline mode | Cache de última visualização | Média |
| Push notifications | Para lembretes de vencimento | Baixa |
| Install prompt | Customizar banner de instalação | Baixa |

### 5.4 Observabilidade

| Item | Ação | Prioridade |
|---|---|---|
| Error tracking | Sentry ou similar | Média |
| Analytics | PostHog ou similar (privacidade) | Baixa |
| Logs estruturados | Expandir logger com contexto | Média |

### 5.5 Segurança

| Item | Ação | Prioridade |
|---|---|---|
| Rate limiting | Configurar no Supabase | Média |
| RLS policies | Revisar com dados reais | Alta |
| Audit log | Expandir para todas as ações | Média |

### 5.6 Deploy e CI/CD

| Item | Ação | Prioridade |
|---|---|---|
| Preview deployments | PR preview no GitHub Pages | Média |
| Environment variables | Secrets no GitHub Actions | Alta |
| Smoke tests | Testes pós-deploy | Média |

---

## 6. Ordem de Implementação (Roadmap)

### Fase 3.1 — Fundação Técnica (sem dependência externa)

| # | Funcionalidade | Esforço | Dependências |
|---|---|---|---|
| 3.1.1 | Configurar Vitest + React Testing Library | Médio | Nenhuma |
| 3.1.2 | Escrever testes unitários (services, hooks, formatters) | Médio | 3.1.1 |
| 3.1.3 | Escrever testes de componentes (CRITICAL path) | Alto | 3.1.1 |
| 3.1.4 | Rodar Lighthouse e corrigir score | Médio | Nenhuma |
| 3.1.5 | Expandir logger com contexto | Baixo | Nenhuma |

### Fase 3.2 — Relatórios e Exportação (sem dependência externa)

| # | Funcionalidade | Esforço | Dependências |
|---|---|---|---|
| 3.2.1 | Relatório de Associados (tela + filtros) | Médio | Nenhuma |
| 3.2.2 | Exportação CSV de Associados | Baixo | 3.2.1 |
| 3.2.3 | Relatório Financeiro (quando INFO-01 a INFO-07 definidos) | Alto | Definições do cliente |
| 3.2.4 | Exportação CSV de Mensalidades | Baixo | 3.2.3 |

### Fase 3.3 — Importação (requer planilha)

| # | Funcionalidade | Esforço | Dependências |
|---|---|---|---|
| 3.3.1 | Integração Google Sheets API | Alto | API key + planilha |
| 3.3.2 | Validação de dados importados | Médio | 3.3.1 |
| 3.3.3 | Importação com log de resultado | Médio | 3.3.2 |
| 3.3.4 | Tratamento de duplicatas | Médio | 3.3.3 |

### Fase 3.4 — Notificações (requer email transacional)

| # | Funcionalidade | Esforço | Dependências |
|---|---|---|---|
| 3.4.1 | Configuração de notificações | Médio | Provider de email |
| 3.4.2 | Template de email de vencimento | Baixo | 3.4.1 |
| 3.4.3 | Agendamento de envios | Alto | 3.4.2 |
| 3.4.4 | Histórico de envios | Médio | 3.4.3 |

### Fase 3.5 — Tema Escuro (sem dependência externa)

| # | Funcionalidade | Esforço | Dependências |
|---|---|---|---|
| 3.5.1 | Tokens de dark mode | Médio | Nenhuma |
| 3.5.2 | Toggle de tema | Baixo | 3.5.1 |
| 3.5.3 | Persistência no localStorage | Baixo | 3.5.2 |
| 3.5.4 | Respeitar prefers-color-scheme | Baixo | 3.5.3 |

---

## 7. Resumo

| Categoria | Itens |
|---|---|
| Funcionalidades propostas | 7 |
| Pode implementar agora | 4 (relatório associados, exportação, dark mode, testes) |
| Aguarda cliente | 3 (importação, relatório financeiro, notificações) |
| Pendências INFO | 10 (todas requerem decisão do cliente) |
| Melhorias técnicas | 6 categorias |
| Fases de implementação | 5 (3.1 a 3.5) |

---

**Aguardando aprovação do cliente para iniciar implementação.**
