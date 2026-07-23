# SYSTEM_FLOWS — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Idioma:** Português (Brasil)

---

## 1. Propósito

Este documento descreve os **fluxos funcionais** do sistema. Cada fluxo é apresentado com:

- Ator.
- Pré-condições.
- Trigger.
- Passos numerados.
- Caminho feliz.
- Caminhos de erro.
- Pós-condições.
- Notificações (toasts).
- Auditoria (se aplicável).

Todos os fluxos são executados exclusivamente por usuários autenticados, exceto o fluxo de Login.

---

## 2. Fluxo de Login

**Ator:** Usuário não autenticado.
**Pré-condição:** aplicação carregada, sem sessão ativa.
**Trigger:** usuário acessa qualquer rota protegida.

### 2.1 Caminho Feliz

1. Usuário acessa `/login`.
2. `LoginPage` exibe `LoginForm` com campos e-mail e senha.
3. Usuário preenche e-mail e senha.
4. Usuário clica em "Entrar" (botão primário, 48px de altura).
5. `LoginForm` valida campos com Zod (e-mail válido, senha não vazia).
6. `LoginForm` chama `authService.signIn(email, password)`.
7. `authService` chama `supabase.auth.signInWithPassword()`.
8. Supabase retorna `session` e `user`.
9. `AuthContext` ouve `onAuthStateChange` e atualiza estado.
10. `AuthContext` busca `profile` em `profiles` por `id = user.id`.
11. `LoginForm` exibe toast de sucesso.
12. `ProtectedRoute` redireciona para `/` (Início).
13. `AppShell` renderiza com `AppHeader` e `BottomNav`.

### 2.2 Caminhos de Erro

| Erro | Detecção | Mensagem ao usuário |
|---|---|---|
| E-mail inválido (formato) | Validação Zod no client | "Informe um e-mail válido." (toast warning) |
| Senha vazia | Validação Zod no client | "Informe a senha." (toast warning) |
| Credenciais inválidas | Supabase retorna erro | "E-mail ou senha inválidos." (toast error) |
| Sem conexão | `NetworkError` | "Sem conexão. Verifique sua internet." (toast error) |
| Erro interno do Supabase | `INTERNAL` | "Não foi possível entrar. Tente novamente." (toast error) |
| Conta desabilitada | `auth.users` banido | "Conta desabilitada. Contate o administrador." (toast error) |

### 2.3 Pós-condições

- Sessão persistida em `localStorage` (gerenciado pelo Supabase).
- Cache em memória limpo (estado anterior não vaza).
- Usuário é levado para a página de origem (preservada em `state.from`) ou `/` (Início).

### 2.4 Auditoria

Login não é registrado em `audit_log` nesta fase. Pode ser adicionado em fase futura (log de autenticação separado).

---

## 3. Fluxo de Logout

**Ator:** Usuário autenticado.
**Pré-condição:** usuário logado.
**Trigger:** usuário clica em "Sair" em `/configuracoes`.

### 3.1 Caminho Feliz

1. Usuário acessa `/configuracoes`.
2. `ConfiguracoesPage` exibe lista de opções, incluindo "Sair".
3. Usuário clica em "Sair".
4. Modal de confirmação aparece: "Deseja realmente sair?".
5. Usuário confirma.
6. `authService.signOut()` é chamado.
7. `supabase.auth.signOut()` invalida sessão.
8. `AuthContext` ouve `onAuthStateChange` e limpa `user`, `session`, `profile`, `role`.
9. `memoryCache.clear()` é chamado.
10. `ProtectedRoute` redireciona para `/login`.

### 3.2 Caminhos de Erro

| Erro | Mensagem |
|---|---|
| Erro de rede ao fazer logout | "Não foi possível sair. Tente novamente." (toast error) |

> Mesmo em caso de erro, o estado local é limpo e o usuário é redirecionado.

### 3.3 Pós-condições

- Sessão removida do `localStorage`.
- Cache em memória limpo.
- `localStorage` de auth limpo (gerenciado pelo Supabase).

---

## 4. Fluxo de Sessão Expirada

**Ator:** Usuário autenticado.
**Pré-condição:** token de sessão expirou durante uso.
**Trigger:** listener `onAuthStateChange` detecta expiração.

### 4.1 Caminho

1. Token JWT expira.
2. Supabase emite `SIGNED_OUT` via `onAuthStateChange`.
3. `AuthContext` limpa estado.
4. Componente atual exibe toast: "Sua sessão expirou. Faça login novamente." (warning).
5. Redirecionamento para `/login` com `state.from` preservado.
6. Usuário entra novamente e é redirecionado para a página original.

### 4.2 Pós-condições

- Estado consistente.
- Nenhuma operação em andamento é perdida (a aplicação não tenta mutações com token inválido).

---

## 5. Fluxo de Importação de Planilha

**Ator:** Usuário com permissão `importacao.executar` (apenas `admin` nesta fase).
**Pré-condição:** usuário autenticado em `/configuracoes`.
**Trigger:** usuário acessa "Importar planilha" e cola URL.

### 5.1 Caminho Feliz

1. Usuário acessa `/configuracoes`.
2. Usuário clica em "Importar planilha".
3. Modal exibe campo de URL e botão "Importar".
4. Usuário cola URL pública da planilha (formato `https://docs.google.com/spreadsheets/d/<id>/edit?usp=sharing`).
5. Sistema valida formato da URL.
6. Usuário clica em "Importar".
7. `importacaoService.executar(url)` é chamado.
8. Loading state no botão.
9. Sistema converte URL para formato CSV: `https://docs.google.com/spreadsheets/d/<id>/export?format=csv&gid=0`.
10. `fetch` baixa o CSV (apenas valores, sem fórmulas).
11. `papaparse` converte CSV em array de objetos.
12. `mapeamento.ts` aplica mapeamento de colunas da planilha para `associados`.
13. Para cada linha:
    a. Sistema valida com Zod.
    b. Se válido, faz `upsert` em `associados` com chave única (`cpf` ou `nome + data_nascimento`).
    c. Se inválido, adiciona à lista de erros.
14. Sistema registra em `importacoes`:
    - `tipo: 'associados'`
    - `arquivo_origem: <url>`
    - `total_linhas: <n>`
    - `total_inseridos: <n>`
    - `total_atualizados: <n>`
    - `total_erros: <n>`
    - `relatorio_erros: <lista>`
    - `executada_por: <user_id>`
    - `executada_em: now()`
15. Toast de sucesso: "Importação concluída. N inseridos, M atualizados, K erros."
16. Modal exibe detalhes (lista de erros se houver).

### 5.2 Caminhos de Erro

| Erro | Mensagem |
|---|---|
| URL inválida | "URL inválida. Use o formato de compartilhamento do Google Sheets." (toast warning) |
| Planilha privada | "Não foi possível acessar a planilha. Verifique se ela é pública." (toast error) |
| Planilha vazia | "A planilha não contém dados." (toast warning) |
| Sem conexão | "Sem conexão. Tente novamente." (toast error) |
| Erro de validação parcial | Importação prossegue com linhas válidas. Erros são listados no relatório. |
| Erro de gravação no banco | Importação interrompida. Toast: "Erro ao gravar. Contate o suporte." |

### 5.3 Pós-condições

- Registros válidos em `associados` (preservando acentuação, capitalização, ordem).
- Registro de auditoria em `importacoes`.
- Relatório de erros disponível para download (futuro).

### 5.4 Auditoria

Registro em `importacoes` é obrigatório. Linhas de `associados` criadas/atualizadas geram entradas em `audit_log`.

---

## 6. Fluxo de Listagem de Associados

**Ator:** Usuário autenticado com permissão `associados.read`.
**Pré-condição:** usuário logado.
**Trigger:** usuário acessa `/associados`.

### 6.1 Caminho Feliz

1. Usuário acessa `/associados`.
2. `AssociadosPage` exibe `Skeleton` durante carregamento.
3. `associadosService.list()` busca registros com `select` em `associados` where `ativo = true`.
4. Resultado é cacheado em `memoryCache` com TTL 60s.
5. Lista renderizada como grid de `Card`.
6. Usuário pode filtrar por categoria, status, buscar por nome/CPF/placa.
7. Filtros aplicam novos `select` com `where` apropriado.
8. Cada card mostra: nome, status, categoria (cor da linha inferior).
9. Usuário clica em um card → `/associados/<id>` (fase 1.0).

### 6.2 Caminhos de Erro

| Erro | Mensagem |
|---|---|
| Sem conexão | "Sem conexão. Exibindo dados em cache." (toast warning) + estado offline |
| Erro de leitura | "Não foi possível carregar. Tente novamente." (toast error) |

### 6.3 Pós-condições

- Lista exibida.
- Cache atualizado.

---

## 7. Fluxo de Cadastro de Associado (fase 1.0, documentado para fundação)

**Ator:** Usuário com permissão `associados.write`.
**Pré-condição:** usuário logado.
**Trigger:** usuário clica em "+" (FAB ou botão) em `/associados`.

### 7.1 Caminho Feliz

1. Usuário clica em "Adicionar".
2. Formulário de cadastro abre (modal ou página dedicada).
3. Usuário preenche campos (nome obrigatório, demais opcionais).
4. Validação com Zod em cada campo.
5. Usuário clica em "Salvar".
6. `associadosService.create(data)` insere em `associados`.
7. Sistema atualiza cache da listagem.
8. Toast de sucesso.
9. Formulário fecha, lista atualizada.

### 7.2 Caminhos de Erro

| Erro | Mensagem |
|---|---|
| Validação de campo | Mensagem inline no campo + `aria-invalid="true"` |
| CPF duplicado | "Já existe um associado com este CPF." (toast error) |
| Erro de gravação | "Não foi possível salvar. Tente novamente." (toast error) |

### 7.3 Pós-condições

- Registro criado em `associados`.
- Entrada em `audit_log` com operação `insert`.

---

## 8. Fluxo de Edição de Associado (fase 1.0)

**Ator:** Usuário com permissão `associados.write`.
**Pré-condição:** associado existente.
**Trigger:** usuário clica em card e em "Editar".

### 8.1 Caminho Feliz

1. Formulário de edição abre com dados preenchidos.
2. Usuário altera campos.
3. Validação com Zod.
4. Usuário clica em "Salvar".
5. `associadosService.update(id, data)` atualiza registro.
6. Sistema invalida cache da listagem.
7. Toast de sucesso.
8. Lista atualizada.

### 8.2 Caminhos de Erro

| Erro | Mensagem |
|---|---|
| Validação | Mensagem inline + `aria-invalid` |
| Registro não encontrado | "Associado não encontrado." (toast error) |
| Conflito de chave única | "Já existe outro associado com este CPF." (toast error) |

### 8.3 Pós-condições

- Registro atualizado.
- Entrada em `audit_log` com operação `update` e estado anterior/posterior.

---

## 9. Fluxo de Exclusão de Associado (fase 1.0)

**Ator:** Usuário com permissão `associados.delete` (apenas `admin`).
**Trigger:** usuário clica em "Excluir" no detalhe do associado.

### 9.1 Caminho

1. Confirmação: "Excluir este associado? Esta ação não pode ser desfeita."
2. Usuário confirma.
3. `associadosService.delete(id)` faz `soft delete` (preencher `deleted_at`) ou `hard delete` (a definir).
4. Toast de sucesso.
5. Lista atualizada.

> **Decisão pendente:** soft delete vs hard delete. Recomendação: soft delete + flag `ativo` para preservar histórico de mensalidades.

---

## 10. Fluxo de Listagem de Mensalidades (fase 1.0)

**Ator:** Usuário autenticado.
**Trigger:** usuário acessa `/mensalidades`.

### 10.1 Caminho

1. Lista de mensalidades do mês corrente exibida por padrão.
2. Filtros: mês/ano, status (pago/pendente), associado.
3. Cada item mostra: associado, valor, vencimento, status.
4. Cache TTL 60s.

---

## 11. Fluxo de Registro de Pagamento (fase 1.0)

**Ator:** Usuário com permissão `pagamentos.write` (`admin` ou `tesoureiro`).
**Trigger:** usuário clica em "Registrar pagamento" em mensalidade pendente.

### 11.1 Caminho

1. Formulário abre: valor pago, data, forma de pagamento, observações.
2. Validação com Zod (valor > 0, data <= hoje).
3. Usuário clica em "Confirmar".
4. `pagamentosService.create(mensalidadeId, data)` insere em `pagamentos` e atualiza `mensalidades.pago = true`, `pago_em = now`.
5. Toast de sucesso.
6. Lista atualizada.

### 11.2 Auditoria

Registro em `audit_log` e em `pagamentos.created_by`.

---

## 12. Fluxo de Erro Genérico

Qualquer erro não tratado é capturado por `ErrorBoundary` no topo da aplicação.

### 12.1 Comportamento

1. Erro de renderização capturado.
2. Tela de fallback exibida: "Algo deu errado. Tente recarregar a página."
3. Botão "Recarregar" chama `window.location.reload()`.
4. Erro é logado via `logger.error` para fins de diagnóstico.

---

## 13. Fluxo de Toast

**Ator:** Sistema (feedback de ações).
**Trigger:** resultado de ação do usuário.

### 13.1 Caminho

1. Componente ou serviço chama `toast.success/error/warning/info(message)`.
2. `ToastContext` adiciona toast à fila.
3. Toast aparece com animação de entrada.
4. Permanece visível por 3 segundos (configurável).
5. Some com animação de saída.
6. Anunciado para leitores de tela via `aria-live="polite"`.

---

## 14. Bloqueios

- Fluxos das fases 1.0 em diante serão detalhados em revisões futuras deste documento.
- Fluxo de cadastro/edição/exclusão será refinado quando a planilha real chegar e a modelagem for validada.
