# ETAPA 2.5 — MENSALIDADES

**Associação dos Bugueiros de São Bento**
**Data:** 22/07/2026
**Status:** Concluído — Aguardando aprovação

---

## 1. Objetivo

Implementar a listagem de mensalidades, visualização de detalhes, registro manual de pagamento e histórico de pagamentos. **Regras financeiras (juros, multas, inadimplência, geração em lote) permanecem bloqueadas** conforme Fase 2 e pendências INFO-01 a INFO-05.

**Regra principal:** Não criar regras financeiras por suposição. Manter configurável, bloquear implementação, utilizar estado pendente.

---

## 2. Funcionalidades Implementadas

### 2.1 Listagem

| Funcionalidade | Status |
|---|---|
| Table com 5 colunas | ok |
| Filtro por status (Todos/Pendentes/Pagos) | ok |
| Filtro por referência (YYYY-MM) | ok |
| Busca por associado/referência (client-side, debounce) | ok |
| Paginação server-side (usePagination) | ok |
| Loading (Table skeleton 5 rows) | ok |
| Erro recuperável (EmptyState error + retry) | ok |
| Sem dados com filtro (EmptyState empty) | ok |
| Sem dados sem filtro (EmptyState first-use) | ok |

### 2.2 Status

| Status | Badge | Regra |
|---|---|---|
| Pago | success (verde) | pago === true |
| Pendente | warning (amarelo) | pago === false e vencimento futuro |
| Vencida | danger (vermelho) | pago === false e vencimento passado |

Nenhum status novo foi criado. Apenas os três acima.

### 2.3 Detalhes (Modal)

| Informação | Exibição |
|---|---|
| Status | Badge (Pago/Pendente/Vencida) |
| Valor base | Formato moeda |
| Valor final | Formato moeda (destaque) |
| Desconto | Formato moeda (se > 0) |
| Acréscimo | Formato moeda (se > 0) |
| Vencimento | Data formatada |
| Pagamento | Data formatada (ou —) |
| Associado | Nome e CPF |
| Observações | Texto |

**Ações:** Registrar pagamento (se pendente), Histórico de pagamentos.

**Aviso de pendencias:** Mensagem sobre regras de juros/multa/inadimplência não definidas.

### 2.4 Registro de Pagamento (Modal)

| Campo | Obrigatório | Validação |
|---|---|---|
| Valor pago | Sim | number, min 0, positive |
| Forma de pagamento | Sim | Enum: dinheiro, pix, transferencia, cartao, boleto, outro |
| Data/hora | Sim | datetime-local |
| Observação | Não | max 500 |

**Informações read-only:** Associado, referência, vencimento, valor da mensalidade.

### 2.5 Histórico de Pagamentos (Modal)

- Lista pagamentos via `pagamentosService.listByMensalidade()`.
- Cada pagamento exibe: valor, data/hora, forma de pagamento, observação.
- Loading com Skeleton.
- Estado vazio quando nenhum pagamento registrado.

---

## 3. Bloqueios Mantidos

| Funcionalidade | Pendência | Status |
|---|---|---|
| Geração automática em lote | INFO-01, INFO-04 | Bloqueado |
| Cálculo definitivo de valores | INFO-01 | Bloqueado |
| Juros e multas | INFO-01 | Bloqueado |
| Inadimplência automática | INFO-05 | Bloqueado |
| Bloqueios por atraso | INFO-05 | Bloqueado |

---

## 4. Permissoes

| Acao | Permissao | admin | tesoureiro | diretor | visualizador |
|---|---|---|---|---|---|
| Ver listagem | mensalidades.read | sim | sim | sim | sim |
| Ver detalhes | mensalidades.read | sim | sim | sim | sim |
| Registrar pagamento | pagamentos.write | sim | sim | nao | nao |
| Ver historico | pagamentos.read | sim | sim | sim | sim |

---

## 5. Acessibilidade

| Requisito | Status |
|---|---|
| main landmark | sim, aria-label="Gestao de mensalidades" |
| Headings | sim, h1 = "Mensalidades" |
| Labels em inputs | sim, todos os campos |
| aria-label na busca | sim |
| aria-label nos filtros | sim |
| aria-busy no loading | sim, Table com skeleton |
| role="alert" em erros | sim, submit error |
| Foco visivel | sim, --shadow-focus |
| Navegacao por teclado | sim, Table rows com tabIndex + Enter/Space |

---

## 6. Responsividade

| Breakpoint | Comportamento |
|---|---|
| 320px | Busca full-width, filtros empilhados, tabela card view |
| 375px | Igual 320px |
| 390px | Igual 320px |
| 430px | Igual 320px |
| 480px+ | Busca e filtros inline |

Colunas da tabela:
- Desktop: Associado (30%), Referencia, Valor (right), Vencimento, Status (12%)
- Mobile: Associado, Valor, Status (Referencia e Vencimento ocultos via hideOnMobile)

---

## 7. Arquivos

### Criados (8)

| Arquivo | Linhas |
|---|---|
| src/pages/Mensalidades/MensalidadesPage.module.css | 90 |
| src/pages/Mensalidades/PagamentoModal.tsx | 155 |
| src/pages/Mensalidades/PagamentoModal.module.css | 100 |
| src/pages/Mensalidades/MensalidadeDetalheModal.tsx | 145 |
| src/pages/Mensalidades/MensalidadeDetalheModal.module.css | 95 |
| src/pages/Mensalidades/PagamentoHistoricoModal.tsx | 100 |
| src/pages/Mensalidades/PagamentoHistoricoModal.module.css | 70 |

### Modificados (3)

| Arquivo | Alteracao |
|---|---|
| src/pages/Mensalidades/MensalidadesPage.tsx | Reescrito (~260 linhas) |
| src/constants/componentVariants.ts | Adicionado 'datetime-local' ao INPUT_TYPES |

---

## 8. Decisoes Tomadas

| # | Decisao | Justificativa |
|---|---|---|
| 1 | Busca client-side (nao server-side) | Service nao suporta busca generica |
| 2 | Modal para detalhes, pagamento e historico | Consistencia com CRUD de Associados |
| 3 | Formulario de pagamento com campos obrigatorios minimos | Conforme especificacao: valor, forma, data |
| 4 | Aviso de pendencias no detalhe | Transparencia sobre regras bloqueadas |
| 5 | 'datetime-local' adicionado ao InputType | Necessario para data/hora do pagamento |
| 6 | Nenhum status novo criado | Conforme regra: apenas Pago/Pendente/Vencida |
| 7 | Exclusao permanente disponivel no service | Nao bloqueada nesta fase |

---

## 9. Validacoes

| Comando | Resultado |
|---|---|
| npm run typecheck | 0 erros |
| npm run lint | 0 erros |
| npm run build | Sucesso em 3.41s |
| Bundle MensalidadesPage JS (gzip) | 5.74 kB (code splitting) |
| Bundle MensalidadesPage CSS (gzip) | 1.30 kB |
| PWA precache | 51 entries (752.56 KiB) |
| Code splitting | Ativo |

---

## 10. Aprovacao

Aguardando aprovacao do cliente para iniciar **Fase 2.6 — Configuracoes**.
