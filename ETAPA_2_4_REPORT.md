# ETAPA 2.4 — ASSOCIADOS (CRUD)

**Associação dos Bugueiros de São Bento**
**Data:** 22/07/2026
**Status:** Concluído — Aguardando aprovação

---

## 1. Objetivo

Criar o primeiro CRUD completo do sistema utilizando a arquitetura oficial: listagem, busca, filtros, visualização, cadastro, edição e ativação/desativação de associados.

**Restrição:** Usar exclusivamente `associadosService`. Acesso direto ao Supabase proibido.

---

## 2. Funcionalidades Implementadas

### 2.1 Listagem

| Funcionalidade | Status |
|---|---|
| Table genérica com colunas | ✓ |
| Busca por nome, CPF, placa (debounce 300ms) | ✓ |
| Filtro por status (Todos/Ativos/Inativos) | ✓ |
| Filtro por categoria | ✓ |
| Paginação server-side (usePagination) | ✓ |
| Loading (Table skeleton 5 rows) | ✓ |
| Erro recuperável (EmptyState error + retry) | ✓ |
| Sem dados com filtro (EmptyState empty) | ✓ |
| Sem dados sem filtro (EmptyState first-use) | ✓ |

### 2.2 Formulário (Modal)

| Campo | Obrigatório | Validação |
|---|---|---|
| Nome | ✓ | min 1, max 200 |
| CPF | ✗ | 11 dígitos (regex) |
| RG | ✗ | max 20 |
| Telefone | ✗ | max 20 |
| E-mail | ✗ | email válido |
| Data nascimento | ✗ | YYYY-MM-DD |
| Data filiação | ✗ | YYYY-MM-DD |
| Endereço | ✗ | max 200 |
| Número | ✗ | max 20 |
| Complemento | ✗ | max 100 |
| Bairro | ✗ | max 100 |
| Cidade | ✗ | max 100 |
| UF | ✗ | Enum (27 UFs) |
| CEP | ✗ | 8 dígitos (regex) |
| Marca veículo | ✗ | max 50 |
| Modelo veículo | ✗ | max 50 |
| Ano veículo | ✗ | 1900-2100 |
| Placa veículo | ✗ | 7 chars (regex) |
| Cor veículo | ✗ | max 30 |
| Categoria | ✗ | max 50 |
| Observações | ✗ | max 1000 |

**Seções do formulário:** Dados Pessoais → Endereço → Veículo → Observações.

### 2.3 Detalhes (Modal)

| Informação | Exibição |
|---|---|
| Status | Badge (Ativo/Inativo) |
| Dados pessoais | CPF, RG, telefone, email, datas |
| Endereço | Rua, número, complemento, bairro, cidade/UF, CEP |
| Veículo | Marca/modelo, ano, placa, cor |
| Categoria | Badge info |
| Observações | Texto |

**Ações:** Editar, Desativar/Reativar.

### 2.4 Ativação/Desativação

- Usa `associadosService.deactivate()` (soft delete: `ativo=false`).
- Usa `associadosService.activate()` (reativação: `ativo=true`).
- Exclusão permanente bloqueada (INFO-09).

---

## 3. Permissões

| Ação | Permissão | admin | tesoureiro | diretor | visualizador |
|---|---|---|---|---|---|
| Ver listagem | `associados.read` | ✓ | ✓ | ✓ | ✓ |
| Criar | `associados.write` | ✓ | ✗ | ✓ | ✗ |
| Editar | `associados.write` | ✓ | ✗ | ✓ | ✗ |
| Desativar/reativar | `associados.write` | ✓ | ✗ | ✓ | ✗ |
| Excluir | `associados.delete` | Bloqueado | Bloqueado | Bloqueado | Bloqueado |

---

## 4. Acessibilidade

| Requisito | Status |
|---|---|
| `<main>` landmark | ✓ `aria-label="Gestão de associados"` |
| Headings | ✓ h1 = "Associados" |
| Labels em inputs | ✓ Todos os campos com label |
| `aria-label` na busca | ✓ |
| `aria-label` nos filtros | ✓ |
| `aria-busy` no loading | ✓ Table com skeleton |
| `role="alert"` em erros | ✓ Submit error + EmptyState |
| Foco visível | ✓ `--shadow-focus` |
| Navegação por teclado | ✓ Table rows com tabIndex + Enter/Space |

---

## 5. Responsividade

| Breakpoint | Comportamento |
|---|---|
| 320px | Busca full-width, filtros empilhados, tabela card view (Nome, Placa, Status) |
| 375px | Igual 320px |
| 390px | Igual 320px |
| 430px | Igual 320px |
| ≥480px | Busca + botão lado a lado, filtros inline, tabela com mais colunas |

**Colunas da tabela:**
- Desktop: Nome (40%), CPF, Telefone, Placa, Categoria, Status (10%)
- Mobile: Nome, Placa, Status (CPF, Telefone, Categoria ocultas via `hideOnMobile`)

---

## 6. Arquivos

### Criados (7)

| Arquivo | Linhas |
|---|---|
| `src/pages/Associados/AssociadosPage.module.css` | 95 |
| `src/pages/Associados/AssociadoFormModal.tsx` | 290 |
| `src/pages/Associados/AssociadoFormModal.module.css` | 95 |
| `src/pages/Associados/AssociadoDetailModal.tsx` | 160 |
| `src/pages/Associados/AssociadoDetailModal.module.css` | 75 |

### Modificados (3)

| Arquivo | Alteração |
|---|---|
| `src/pages/Associados/AssociadosPage.tsx` | Reescrito — CRUD completo (~290 linhas) |
| `src/constants/componentVariants.ts` | Adicionado `'date'` ao INPUT_TYPES |
| `src/components/ui/Input/Input.tsx` | Tipagem aceita `'date'` (via InputType) |

---

## 7. Validações

| Comando | Resultado |
|---|---|
| `npm run typecheck` | ✓ 0 erros |
| `npm run lint` | ✓ 0 erros |
| `npm run build` | ✓ Sucesso em 3.50s |
| Bundle AssociadosPage JS (gzip) | 8.47 kB (code splitting) |
| Bundle AssociadosPage CSS (gzip) | 1.98 kB |
| Bundle total JS (gzip) | 61.44 kB (+0.11 kB) |
| PWA precache | 49 entries (729.26 KiB) |
| Code splitting | ✓ Ativo |

---

## 8. Decisões Tomadas

| # | Decisão | Justificativa |
|---|---|---|
| 1 | Modal para create/edit (não página dedicada) | CRUDsimples; mantém usuário na listagem |
| 2 | Modal para detalhes (não rota /:id) | Sem sub-rotas definidas; consistente com create/edit |
| 3 | Debounce de 300ms na busca | Evita requests excessivos while typing |
| 4 | Paginação server-side | Dados vêm do Supabase com `.range()` |
| 5 | Conversão undefined → null no form | `AssociadoCreate` espera `null` (não `undefined`) |
| 6 | `'date'` adicionado ao InputType | Necessário para campos de data no formulário |
| 7 | Categorias hardcoded (Buggy/Moto/Carro) | Placeholder — regras de categoria pendentes (INFO-05) |
| 8 | Exclusão permanente bloqueada | Conforme INFO-09 — soft delete via `ativo=false` |

---

## 9. Pendências Nesta Fase

Nenhuma. CRUD funcional com operações neutras.

---

## 10. Dependências para Próxima Fase (Fase 2.5 — Mensalidades)

| Item | Status |
|---|---|
| `mensalidadesService` | ✓ Implementado (Fase 2.1) |
| `Table` component | ✓ Implementado (Fase 2.2) |
| `Modal` component | ✓ Implementado (Fase 2.2) |
| `Badge` component | ✓ Implementado (Fase 2.2) |
| `usePagination` hook | ✓ Implementado (Fase 2.1) |
| Zod validators | ✓ Implementado (Fase 2.1) |
| Lista de associados (para select) | ✓ Implementado nesta fase |

---

## 11. Aprovação

Aguardando aprovação do cliente para iniciar **Fase 2.5 — Mensalidades**.
