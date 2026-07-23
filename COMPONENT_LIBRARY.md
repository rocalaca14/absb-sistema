# COMPONENT_LIBRARY — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 2.0
**Idioma:** Português (Brasil)

---

## 1. Propósito

Este documento cataloga a **biblioteca oficial de componentes** do projeto. Nenhum componente fora desta biblioteca pode ser criado sem aprovação. Toda UI da aplicação é composta exclusivamente por componentes listados aqui.

Cada componente é descrito com:

- Nome e caminho do arquivo.
- Props tipadas.
- Variantes permitidas.
- Estados suportados.
- Tokens consumidos.
- Acessibilidade (ARIA, foco).
- Exemplo de uso.

---

## 2. Inventário Oficial

| Componente | Arquivo | Categoria | Status |
|---|---|---|---|
| `AppShell` | `components/layout/AppShell.tsx` | Layout | Documentado |
| `AppHeader` | `components/layout/AppHeader.tsx` | Layout | Documentado |
| `BottomNav` | `components/layout/BottomNav.tsx` | Layout | Documentado |
| `PageContainer` | `components/layout/PageContainer.tsx` | Layout | Documentado |
| `Button` | `components/ui/Button/Button.tsx` | UI | Documentado |
| `Card` | `components/ui/Card/Card.tsx` | UI | Documentado |
| `Input` | `components/ui/Input/Input.tsx` | UI | Documentado |
| `SectionTitle` | `components/ui/SectionTitle/SectionTitle.tsx` | UI | Documentado |
| `Skeleton` | `components/ui/Skeleton/Skeleton.tsx` | UI | Documentado |
| `Icon` | `components/ui/Icon/Icon.tsx` | UI | Documentado |
| `Toast` | `components/ui/Toast/Toast.tsx` | UI | Documentado |
| `Modal` | `components/ui/Modal/Modal.tsx` | UI | Documentado (Fase 2.2) |
| `Table` | `components/ui/Table/Table.tsx` | UI | Documentado (Fase 2.2) |
| `Badge` | `components/ui/Badge/Badge.tsx` | UI | Documentado (Fase 2.2) |
| `EmptyState` | `components/ui/EmptyState/EmptyState.tsx` | UI | Documentado (Fase 2.2) |
| `Tabs` | `components/ui/Tabs/Tabs.tsx` | UI | Documentado (Fase 2.2) |
| `LoginForm` | `components/auth/LoginForm.tsx` | Auth | Documentado |

> **Implementação:** os componentes acima estão **especificados** em `UI_SPECIFICATION.md` e devem ser implementados seguindo fielmente aquela especificação. Este documento é o **índice**; `UI_SPECIFICATION.md` é a **especificação técnica**.

---

## 3. Convenções da Biblioteca

### 3.1 Estrutura de Arquivos

Cada componente fica em sua própria pasta:

```
components/ui/Button/
├── Button.tsx
├── Button.module.css
└── index.ts
```

`index.ts` reexporta o componente para permitir import limpo:

```ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

### 3.2 Nomenclatura

- Componente em `PascalCase`.
- Props em `camelCase`.
- Arquivo do componente em `PascalCase.tsx`.
- CSS Module em `PascalCase.module.css`.
- Pasta em `PascalCase/`.

### 3.3 Props

- Tipadas com `interface NomeDoComponenteProps`.
- Props booleanas têm `default` explícito.
- Props opcionais marcadas com `?`.
- Props com união restrita usam tipos derivados de constantes.

Exemplo:

```ts
interface ButtonProps {
  variant?: ButtonVariant;        // 'primary' | 'secondary' | 'tertiary'
  size?: ButtonSize;              // 'md' (apenas md nesta fase)
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}
```

### 3.4 Estados Obrigatórios

Todo componente interativo deve implementar (quando aplicável):

- `default`
- `hover`
- `pressed`
- `focus-visible`
- `disabled`
- `loading` (quando aplicável)
- `selected` (quando aplicável)
- `error` (quando aplicável, ex: Input)

### 3.5 Acessibilidade Obrigatória

- Foco visível via `--shadow-focus` e `:focus-visible`.
- `aria-label` em botões só com ícone.
- `aria-hidden` em ícones decorativos.
- `aria-busy` em estado de loading.
- `aria-current="page"` em item ativo de navegação.
- `aria-invalid` em input com erro.
- Navegação completa por teclado.
- Respeito a `prefers-reduced-motion`.

---

## 4. Componentes de Layout

### 4.1 `AppShell`

Container raiz. Define grid de 3 linhas: header / main / bottom-nav. Aplica safe area.

**Especificação:** `UI_SPECIFICATION.md` seção 3.1.

### 4.2 `AppHeader`

Cabeçalho fixo de 224px. Logo centralizada sobre degradê teal.

**Especificação:** `UI_SPECIFICATION.md` seção 4.

### 4.3 `BottomNav`

Menu inferior fixo de 80px. 4 itens: Início, Mensalidades, Associados, Configurações. Cada item com 48x48px de área de toque garantida.

**Especificação:** `UI_SPECIFICATION.md` seção 5.

### 4.4 `PageContainer`

Wrapper de conteúdo. Aplica padding de tela e safe area.

**Especificação:** `UI_SPECIFICATION.md` seção 3.2.

---

## 5. Componentes de UI

### 5.1 `Button`

Botão padrão. 3 variantes: `primary`, `secondary`, `tertiary`. Altura fixa 48px.

**Props principais:**

```ts
interface ButtonProps {
  variant?: ButtonVariant; // 'primary' | 'secondary' | 'tertiary'
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
}
```

**Especificação completa:** `UI_SPECIFICATION.md` seção 6.

### 5.2 `Card`

Card com borda colorida inferior. 4 categorias de cor. Altura mínima 112px.

**Props principais:**

```ts
interface CardProps {
  category?: CardCategory; // 'blue' | 'green' | 'red' | 'yellow'
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  selected?: boolean;
  children: React.ReactNode;
  ariaLabel?: string;
}
```

**Especificação completa:** `UI_SPECIFICATION.md` seção 7.

### 5.3 `Input`

Campo de texto. 48px de altura, raio 12px. Suporta label, helper text, error message.

**Props principais:**

```ts
interface InputProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'search';
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
}
```

**Especificação completa:** `UI_SPECIFICATION.md` seção 8.

### 5.4 `SectionTitle`

Título de seção. 24px semi-bold. Subtítulo opcional.

**Props principais:**

```ts
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  as?: 'h1' | 'h2' | 'h3';
}
```

**Especificação completa:** `UI_SPECIFICATION.md` seção 9.

### 5.5 `Skeleton`

Placeholder de carregamento. Pulse animation (desabilitada com `prefers-reduced-motion`).

**Props principais:**

```ts
interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'pill';
  count?: number;
}
```

**Especificação completa:** `UI_SPECIFICATION.md` seção 10.

### 5.6 `Icon`

Wrapper de ícone do `lucide-react`. 24px, stroke 2, cor via `currentColor`.

**Props principais:**

```ts
interface IconProps {
  name: IconName; // restrito ao catálogo
  size?: 24; // fixo
  strokeWidth?: 2; // fixo
  ariaLabel?: string;
  ariaHidden?: boolean;
  className?: string;
}
```

**Especificação completa:** `UI_SPECIFICATION.md` seção 11.

### 5.7 `Toast`

Notificação temporária. 4 variantes: `success`, `error`, `warning`, `info`. Anuncia via `aria-live="polite"`.

**Props principais:**

```ts
interface ToastProps {
  variant: ToastVariant;
  message: string;
  duration?: number; // ms, default 3000
  onClose?: () => void;
}
```

**Especificação completa:** `UI_SPECIFICATION.md` seção 12.

---

## 6. Componentes Auxiliares (Fase 2.2)

### 6.1 `Modal`

Diálogo sobreposto para confirmações, formulários e detalhes.

**Arquivo:** `src/components/ui/Modal/`

**API:**

```ts
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';  // default 'md'
  children: ReactNode;
  footer?: ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  closeOnBackdropClick?: boolean;       // default true
  closeOnEscape?: boolean;              // default true
}

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}
```

**Acessibilidade WCAG AA:**

- `role="dialog"` + `aria-modal="true"`.
- `aria-labelledby` aponta para o título.
- `aria-describedby` aponta para descrição (se houver).
- Foco inicial no primeiro elemento focável interno.
- Trap de foco: `Tab` e `Shift+Tab` percorrem apenas elementos internos.
- `Escape` fecha o modal.
- Foco é restaurado para o elemento que abriu o modal ao fechar.
- `body` scroll bloqueado enquanto aberto.

**Tokens utilizados:**

- `--z-modal-backdrop` (500), `--z-modal` (600).
- `--color-overlay-strong`, `--color-card`, `--color-border`, `--color-background`.
- `--space-3`, `--space-4`, `--space-5`, `--space-icon-text`.
- `--radius-xl`, `--radius-md`, `--shadow-modal`.
- `--duration-base`, `--duration-slow`, `--easing-standard`, `--easing-enter`.
- `@media (prefers-reduced-motion: reduce)` desativa animações.

**Estados:** `open` (controlado) → modal visível ou não. Nenhum estado interno.

---

### 6.2 `Table`

Tabela de dados com suporte a loading, empty state e responsividade.

**Arquivo:** `src/components/ui/Table/`

**API:**

```ts
interface TableProps<T> {
  columns: ReadonlyArray<TableColumn<T>>;
  rows: ReadonlyArray<T>;
  loading?: boolean;
  empty?: ReactNode;
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  footer?: ReactNode;  // slot para paginação
  className?: string;
}

interface TableColumn<T> {
  key: string;
  label: string;                 // usado em data-label no mobile
  render: (row: T) => ReactNode;
  header?: ReactNode;            // customização do cabeçalho
  width?: string;
  align?: 'left' | 'center' | 'right';
  hideOnMobile?: boolean;
}
```

**Estados:**

- **Loading**: renderiza 5 linhas de Skeleton.
- **Vazio (rows.length === 0)**: renderiza o slot `empty` (geralmente `EmptyState`).
- **Normal**: tabela com colunas e linhas.
- **Hover**: linha fica com fundo `--color-background` (se `onRowClick`).
- **Foco**: linha focada tem o mesmo fundo de hover (`:focus-within`).

**Responsividade (sem scroll horizontal):**

- **Desktop**: tabela tradicional com `<thead>`, `<tbody>`, `<th scope="col">`.
- **Mobile (≤ 767px)**: cada linha vira um card empilhado. O `data-label` (do `<td>`) é mostrado antes do valor via CSS `::before`. O `border` separa visualmente cada "card".

**Acessibilidade:**

- `<table>` semântica.
- Cabeçalhos com `scope="col"`.
- Linhas clicáveis são `<tr tabIndex={0}>` com `onKeyDown` para Enter/Space.

---

### 6.3 `Badge`

Rótulo semântico para status, categorias e contagens.

**Arquivo:** `src/components/ui/Badge/`

**API:**

```ts
interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  showDot?: boolean;
  children: ReactNode;
  className?: string;
}
```

**Variantes e tokens:**

| Variante | Background | Texto |
|---|---|---|
| `success` | `--color-success-bg` | `--color-success` |
| `warning` | `--color-warning-bg` | `--color-warning` |
| `danger` | `--color-danger-bg` | `--color-danger` |
| `info` | `--color-info-bg` | `--color-primary` |
| `neutral` | `--color-neutral-bg` | `--color-text-secondary` |

**Características:**

- Pill (`border-radius: var(--radius-pill)`).
- Padding: `4px 10px`.
- Fonte: `--font-size-caption`, `--font-weight-semibold`.
- Dot opcional (6px) à esquerda do texto.

---

### 6.4 `EmptyState`

Estado vazio para listas, telas e seções. Suporta três variantes.

**Arquivo:** `src/components/ui/EmptyState/`

**API:**

```ts
interface EmptyStateProps {
  variant?: 'empty' | 'first-use' | 'error';  // default 'empty'
  icon?: IconName;                              // override do ícone padrão
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void; variant?: ButtonVariant };
  className?: string;
}
```

**Variantes e comportamento:**

| Variante | Ícone padrão | Cor do ícone | Tom |
|---|---|---|---|
| `empty` | `Search` | `--color-primary` (info-bg) | Neutro |
| `first-use` | `Plus` | `--color-success` (success-bg) | Convidativo |
| `error` | `AlertTriangle` | `--color-danger` (danger-bg) | Erro |

**Layout:** card centralizado com `min-height: 240px`, borda dashed, ícone circular 64px.

**Tokens:** `--color-card`, `--color-border`, `--color-info-bg`, `--color-success-bg`, `--color-danger-bg`, `--space-*`, `--radius-lg`, `--radius-pill`, `--font-*`.

---

### 6.5 `Tabs` (opcional)

Navegação por abas com estado controlado.

**Arquivo:** `src/components/ui/Tabs/`

**API:**

```ts
interface TabsProps<TKey extends string = string> {
  items: ReadonlyArray<{
    key: TKey;
    label: string;
    icon?: IconName;
    badge?: string | number;
  }>;
  value: TKey;
  onChange: (key: TKey) => void;
  className?: string;
  'aria-label'?: string;
}
```

**Acessibilidade:**

- Container: `role="tablist"` + `aria-label`.
- Cada tab: `role="tab"`, `aria-selected`, `aria-controls`.
- `tabIndex` roving: tab ativa = 0, demais = -1.

**Características:** underline teal para tab ativa, scroll horizontal em mobile, badge opcional.

---

## 7. Componentes de Autenticação

### 7.1 `LoginForm`

Formulário de login com e-mail e senha.

**Especificação:** `UI_SPECIFICATION.md` seção 13.

---

## 8. Catálogo de Ícones

Ícones autorizados (definidos em `CONSTANTS.md` seção 15 e `DESIGN_SYSTEM.md` seção 9.4):

| Nome Lucide | Uso |
|---|---|
| `Home` | Aba Início |
| `Wallet` | Aba Mensalidades |
| `Users` | Aba Associados |
| `Settings` | Aba Configurações |
| `LogOut` | Logout |
| `Eye` / `EyeOff` | Mostrar/ocultar senha |
| `Check` | Confirmação |
| `X` | Fechar, erro |
| `AlertTriangle` | Aviso |
| `Info` | Informação |
| `Plus` | Adicionar |
| `Search` | Busca |
| `Filter` | Filtro |
| `Download` | Importar |
| `RefreshCw` | Recarregar |
| `ChevronRight` | Indicar navegação |
| `ChevronDown` | Expandir |

Novos ícones precisam ser adicionados ao catálogo em `CONSTANTS.md` e `DESIGN_SYSTEM.md` antes de uso.

---

## 9. Regras de Composição

### 9.1 O que pode ser feito

- Reutilizar componentes da biblioteca em qualquer página.
- Passar props tipadas.
- Aninhar componentes (ex: `<Card><SectionTitle>...</SectionTitle></Card>`).
- Compor layouts com `AppShell`, `AppHeader`, `BottomNav`, `PageContainer`.

### 9.2 O que é proibido

- Criar componente novo fora da biblioteca.
- Estilizar componente com CSS inline.
- Sobrescrever tokens dentro de componente.
- Adicionar props novas sem atualizar `UI_SPECIFICATION.md`.
- Importar biblioteca de ícones diferente de `lucide-react`.
- Usar emoji ou imagem no lugar de ícone.

---

## 10. Versionamento da Biblioteca

- Mudanças em componente existente exigem atualização de `UI_SPECIFICATION.md` antes de código.
- Novos componentes passam por aprovação e são adicionados a este índice e à `UI_SPECIFICATION.md`.
- Componentes descontinuados são marcados como `@deprecated` em código e listados em `REVISION_NOTES.md`.

---

## 11. Bloqueios

- Nenhum nesta fase de documentação. Implementação segue `UI_SPECIFICATION.md`.
