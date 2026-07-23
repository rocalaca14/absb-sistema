# ROADMAP — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Idioma:** Português (Brasil)

---

## 1. Propósito

Este documento define o planejamento de versões e o escopo de cada módulo. Toda entrega é versionada e documentada. Mudanças de escopo exigem atualização deste documento.

---

## 2. Linha do Tempo (planejada)

| Versão | Foco | Status |
|---|---|---|
| Fundação | Estrutura, Design System, Auth, Navegação, Banco | Em documentação |
| 1.0 | Dashboard, Mensalidades, Associados, Configurações | Planejada |
| 1.1 | Relatórios, Prestação de Contas | Planejada |
| 1.2 | Notificações, Auditoria, PWA Offline completo | Planejada |
| 2.0 | Multi-tenant, App nativo | Planejada |

---

## 3. Fundação (etapa atual)

### 3.1 Escopo

- Documentação completa (este conjunto de documentos).
- Inicialização do projeto Vite + React + TypeScript.
- Design System com tokens e componentes base.
- PWA configurado (manifest + service worker).
- Layout global (header 224px + bottom nav 80px).
- 4 rotas placeholder com navegação funcional.
- Tela de Login funcional com Supabase Auth.
- Schema inicial do Supabase com RLS e migrations versionadas.
- Módulo de importação de planilha estruturado (sem dados).
- Variáveis de ambiente e configuração de deploy no GitHub Pages.
- README com setup.

### 3.2 Entregas

- 9 documentos oficiais.
- Código de infraestrutura sem regras de negócio.
- Build de produção publicado em GitHub Pages.
- Login funcionando com 1 `admin` provisionado.

### 3.3 Fora do Escopo

- Dashboard.
- Mensalidades (apenas estrutura de banco).
- Relatórios.
- Funcionalidades de gestão.

---

## 4. Versão 1.0 — Operações Base

### 4.1 Escopo Funcional

#### 4.1.1 Dashboard (tela Início)

- Saudação ao usuário logado.
- Card de resumo: total de associados ativos.
- Card de resumo: mensalidades em aberto (quantidade e valor).
- Card de resumo: mensalidades pagas no mês (quantidade e valor).
- Card de resumo: associados inadimplentes.
- Cards por categoria (cores da identidade).
- Ações rápidas condicionadas por permissão.

#### 4.1.2 Mensalidades

- Listagem de mensalidades com filtros (mês, status, associado).
- Criação manual de mensalidade (em lote por mês de referência).
- Edição de mensalidade (valor, vencimento, observação).
- Marcação de pagamento (registro em `pagamentos`).
- Estorno/exclusão de pagamento.
- Geração de mensalidades para o mês corrente (job manual ou botão).
- Aplicação de juros/multa por atraso (regra em `configuracoes`).

#### 4.1.3 Associados

- Listagem com busca por nome, CPF, placa.
- Filtro por status (ativo/inativo) e categoria.
- Detalhe do associado.
- Criação manual de associado.
- Edição de associado.
- Desativação/reativação de associado.
- Exclusão (apenas `admin`).
- Visualização de histórico de mensalidades do associado.

#### 4.1.4 Configurações

- Visualização do perfil do usuário logado.
- Logout.
- Versão do app.
- Gerenciamento de usuários (apenas `admin`):
  - Listar usuários.
  - Convidar novo usuário.
  - Alterar papel.
  - Ativar/desativar usuário.
- Configurações da associação (apenas `admin`):
  - Nome, CNPJ.
  - Valor da mensalidade.
  - Dia de vencimento.
  - Juros e multa.
  - E-mail e telefone de suporte.
- Importação de planilha (apenas `admin`).
- Logout.

#### 4.1.5 Importação de Planilha (já estruturada na fundação)

- Tela para colar URL da planilha.
- Execução de importação com `upsert` em `associados`.
- Relatório de importação (inseridos, atualizados, erros).
- Histórico de importações anteriores.

### 4.2 Entregáveis da 1.0

- 4 telas funcionais (Início, Mensalidades, Associados, Configurações).
- Permissões implementadas conforme `PERMISSIONS.md`.
- Auditoria em `audit_log` para todas as ações sensíveis.
- Build de produção publicado.

### 4.3 Fora do Escopo da 1.0

- Relatórios.
- Notificações push.
- Exportação de dados.
- Backup automatizado.
- Integração com gateways de pagamento.

---

## 5. Versão 1.1 — Relatórios e Prestação de Contas

### 5.1 Escopo Funcional

#### 5.1.1 Relatórios

- Relatório de mensalidades por período.
- Relatório de inadimplência.
- Relatório de pagamentos por forma de pagamento.
- Relatório de associados por categoria.
- Filtros por mês/ano.
- Exportação em PDF.
- Exportação em CSV/Excel.

#### 5.1.2 Prestação de Contas

- Resumo mensal de entradas e saídas.
- Total de mensalidades arrecadadas.
- Total de descontos concedidos.
- Saldo do mês.
- Histórico de prestação de contas (mês a mês).
- Marcação de prestação como "fechada" (imutável após fechamento).

### 5.2 Entregáveis da 1.1

- Módulo de relatórios com 4 relatórios iniciais.
- Módulo de prestação de contas.
- Permissão `relatorios.view` aplicada.

### 5.3 Fora do Escopo da 1.1

- Conciliação bancária.
- Geração de boletos.
- Integração com bancos.

---

## 6. Versão 1.2 — Notificações, Auditoria e Offline

### 6.1 Escopo Funcional

#### 6.2.1 Notificações

- Notificações in-app (toast e central de notificações).
- Notificações push (Web Push) para vencimentos e atualizações.
- Preferências de notificação por usuário.

#### 6.2.2 Auditoria

- Tela de consulta de `audit_log` (apenas `audit.view`).
- Filtros por usuário, tabela, período, operação.
- Exportação do log.

#### 6.2.3 Offline

- Fila de mutações offline.
- Sincronização ao reconectar.
- Indicador visual de estado de conexão.
- Cache de leituras para uso sem rede.

### 6.3 Entregáveis da 1.2

- Central de notificações.
- Push habilitado.
- Tela de auditoria.
- PWA 100% funcional offline.

### 6.4 Fora do Escopo da 1.2

- Sincronização em background automática em SO nativos.

---

## 7. Versão 2.0 — Multi-tenant e Aplicativo Nativo

### 7.1 Escopo Funcional

#### 7.1.1 Multi-tenant

- Suporte a múltiplas associações.
- Isolamento por `tenant_id`.
- Configuração de subdomínio por tenant.
- Painel administrativo de tenants.

#### 7.1.2 Aplicativo Nativo

- Wrapper Capacitor ou React Native.
- Publicação em App Store e Google Play.
- Notificações nativas.
- Integração com biometria.

### 7.2 Entregáveis da 2.0

- Sistema multi-tenant.
- Apps nativos publicados.

### 7.3 Fora do Escopo da 2.0

- White-label.
- Marketplace de plugins.

---

## 8. Critérios de Pronto por Versão

Toda versão só é considerada pronta quando:

- [ ] Toda funcionalidade documentada está implementada.
- [ ] Lint e typecheck passam.
- [ ] Testes automatizados cobrem os fluxos principais.
- [ ] Documentação atualizada.
- [ ] Build de produção publicado.
- [ ] Smoke test manual em iPhone, Android e Desktop.
- [ ] Acessibilidade mínima validada (foco visível, navegação por teclado, contraste).

---

## 9. Política de Mudança de Escopo

- Mudanças de escopo são registradas neste documento.
- Toda mudança passa por aprovação explícita.
- Escopo não aprovado não é implementado.

---

## 10. Bloqueios do Roadmap

- Confirmação dos módulos prioritários da 1.0 com o cliente.
- Confirmação dos papéis e suas permissões.
- Confirmação da estratégia de geração de mensalidades (manual, agendada, ao cadastrar associado).
- Confirmação de regras financeiras (juros, multa, desconto).
