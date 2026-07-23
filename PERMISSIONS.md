# PERMISSIONS — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Idioma:** Português (Brasil)

---

## 1. Propósito

Este documento define toda a estrutura de **perfis, permissões e controle de acesso** do projeto. Mesmo que na primeira versão apenas o papel `admin` seja utilizado, toda a infraestrutura é preparada para os demais papéis desde a fundação.

---

## 2. Princípios

1. **Menor privilégio**: cada papel tem apenas o necessário para sua função.
2. **Defesa em profundidade**: permissões são aplicadas em três camadas:
   - Banco (RLS no Postgres).
   - Serviço (verificações explícitas antes de mutações críticas).
   - UI (esconder/mostrar elementos sensíveis).
3. **Sem papel implícito**: nenhum usuário sem `profile.role` definido pode executar ação.
4. **Auditoria**: ações sensíveis são registradas em `audit_log`.
5. **Sem hardcode de papel em UI**: a UI consome a permissão (`can('associados.write')`), nunca o papel diretamente.

---

## 3. Papéis (Roles)

Definidos no enum `user_role` do banco e em `src/constants/permissions.ts`.

| Papel | Código | Descrição |
|---|---|---|
| Administrador | `admin` | Acesso total. Único papel que gerencia usuários e configurações sensíveis. |
| Tesoureiro | `tesoureiro` | Gerencia mensalidades, pagamentos, relatórios financeiros. |
| Diretor | `diretor` | Gerencia associados e operações gerais. Sem acesso a financeiro. |
| Visualizador | `visualizador` | Apenas leitura. Sem permissão de mutação. |

### 3.1 Hierarquia

Não há hierarquia implícita. Cada papel é definido por suas permissões individuais.

### 3.2 Quantidade Inicial

| Papel | Quantidade esperada na v1.0 |
|---|---|
| `admin` | 1 a 3 |
| `tesoureiro` | 1 a 2 |
| `diretor` | 1 a 2 |
| `visualizador` | 0 a 5 |

> Apenas `admin` será efetivamente provisionado na primeira execução. Demais papéis são preparados em código, schema e UI.

---

## 4. Permissões

Catálogo central. Cada permissão tem um código único, descrição e papel(is) autorizado(s).

| Código | Descrição | admin | tesoureiro | diretor | visualizador |
|---|---|---|---|---|---|
| `associados.read` | Ler cadastro de associados | ✓ | ✓ | ✓ | ✓ |
| `associados.write` | Criar/editar associados | ✓ | ✗ | ✓ | ✗ |
| `associados.delete` | Excluir associados | ✓ | ✗ | ✗ | ✗ |
| `mensalidades.read` | Ler mensalidades | ✓ | ✓ | ✓ | ✓ |
| `mensalidades.write` | Criar/editar mensalidades | ✓ | ✓ | ✗ | ✗ |
| `mensalidades.delete` | Excluir mensalidades | ✓ | ✗ | ✗ | ✗ |
| `pagamentos.read` | Ler pagamentos | ✓ | ✓ | ✓ | ✓ |
| `pagamentos.write` | Registrar/editar pagamentos | ✓ | ✓ | ✗ | ✗ |
| `pagamentos.delete` | Excluir pagamentos | ✓ | ✗ | ✗ | ✗ |
| `importacao.executar` | Importar planilha | ✓ | ✗ | ✗ | ✗ |
| `importacao.read` | Ver histórico de importações | ✓ | ✗ | ✗ | ✗ |
| `relatorios.view` | Acessar relatórios | ✓ | ✓ | ✓ | ✗ |
| `usuarios.manage` | Gerenciar usuários e papéis | ✓ | ✗ | ✗ | ✗ |
| `configuracoes.manage` | Alterar configurações do sistema | ✓ | ✗ | ✗ | ✗ |
| `audit.view` | Consultar log de auditoria | ✓ | ✗ | ✗ | ✗ |

---

## 5. Implementação

### 5.1 Banco de Dados (RLS)

As policies documentadas em `DATABASE_SPECIFICATION.md` já seguem a matriz da seção 4. Cada policy verifica `auth.jwt() ->> 'role'` (claims) **ou** join com `profiles` para obter o papel.

**Estratégia recomendada:** usar **claims customizadas no JWT** (sincronizadas via trigger de `profiles`). Isso evita `JOIN` em cada policy e mantém performance.

```sql
-- Trigger que sincroniza o role do profile para auth.users.app_metadata
CREATE OR REPLACE FUNCTION sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Em seguida, cada policy compara:

```sql
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
```

### 5.2 Frontend (UI)

#### 5.2.1 Hook `usePermission`

```ts
// src/hooks/usePermission.ts
const { can } = useAuth();
can('associados.write'); // boolean
```

#### 5.2.2 Componente `<Can>`

```tsx
<Can permission="associados.write">
  <Button>Adicionar associado</Button>
</Can>
```

#### 5.2.3 Service Guard

Serviços aplicam checagem adicional para operações sensíveis, mesmo que a UI já tenha escondido o controle.

```ts
if (!can('importacao.executar')) {
  throw new AppError('PERMISSION_DENIED', ...);
}
```

### 5.3 Esconder vs Desabilitar

- **Esconder** quando o usuário nem deve saber que a funcionalidade existe (ex: `usuarios.manage` para `visualizador`).
- **Desabilitar** quando faz parte do contexto do usuário mas ele não pode agir (ex: botão "Pagar" para `diretor`).

Regra:

| Caso | Comportamento |
|---|---|
| Ação fora do papel | Esconder (padrão) |
| Ação dependente de estado (ex: "Pagar" só após vencido) | Desabilitar com tooltip explicativo |
| Ação sensível em item específico | Confirmar via modal antes de executar |

---

## 6. Primeiro Usuário Administrador

### 6.1 Decisão Pendente

| Opção | Descrição |
|---|---|
| A) Via painel Supabase | Cliente cria o usuário manualmente no painel do Supabase e o SQL inicial define `role = 'admin'` para o `id` correspondente. |
| B) Via bootstrap script | Script SQL roda após criação do usuário no painel e ajusta o `role`. |
| C) Seed por planilha | Primeiro usuário vem da própria planilha (não recomendado por segurança). |

**Recomendação:** opção A ou B. Aguardando definição do cliente.

### 6.2 Procedimento A (Recomendado)

1. Cliente acessa painel do Supabase.
2. Cria usuário em `Authentication > Users > Add user`.
3. SQL pontual:
   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE id = '<UUID>';
   ```
4. Cliente informa UUID e credenciais ao desenvolvedor apenas para teste.
5. Em produção, **nenhum** desenvolvedor tem acesso à senha do admin.

---

## 7. Tela de Configurações — Acesso por Papel

Conteúdo visível em `/configuracoes`:

| Item | Quem vê |
|---|---|
| Conta (nome, e-mail) | Todos |
| Sair | Todos |
| Versão do app | Todos |
| Gerenciar usuários | `usuarios.manage` |
| Configurações da associação | `configuracoes.manage` |
| Importar planilha | `importacao.executar` |
| Auditoria | `audit.view` |

---

## 8. Auditoria de Ações Sensíveis

Toda ação abaixo gera entrada em `audit_log`:

- Criar/editar/excluir associado.
- Criar/editar/excluir mensalidade.
- Registrar pagamento.
- Alterar configuração.
- Alterar papel de usuário.
- Executar importação.
- Login/logout (entrada em log separado de autenticação, a definir na fase 1.0).

---

## 9. Bloqueios

- Decisão sobre como será criado o primeiro `admin` (seção 6).
- Confirmação de que os 4 papéis atendem ao uso real da associação.
- Definição de regras para login multi-tenant (não nesta versão).
