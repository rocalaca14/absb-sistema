# FASE_3_2_REPORT.md — Dark Mode

**Data:** 22/07/2026
**Status:** Concluído (aguardando aprovação).

---

## 1. Funcionalidade Implementada

### Dark Mode

| Componente | Descrição |
|---|---|
| Tokens | 20+ tokens redefinidos sob `[data-theme="dark"]` |
| ThemeToggle | Componente com 3 opções (Claro/Escuro/Sistema) |
| Persistência | localStorage com chave `absb-theme` |
| Sistema | Fallback para `prefers-color-scheme` |
| Inicialização | Tema aplicado antes do render (sem flash) |

### Tokens Implementados

| Categoria | Tokens redefinidos |
|---|---|
| Superfície | `background`, `card`, `border`, `border-hover`, `overlay` |
| Texto | `text-primary`, `text-secondary`, `text-disabled`, `text-on-*` |
| Semânticos | `success-bg`, `warning-bg`, `danger-bg`, `info-bg`, `neutral-bg`, `overlay-strong` |
| Sombras | `shadow-card`, `shadow-raised`, `shadow-modal`, `shadow-focus`, `shadow-focus-danger` |

### Cores de Marca (inalteradas)

- `--color-primary: #00BAB9`
- `--color-secondary: #FFA600`
- `--color-accent: #FFA600`
- `--color-success: #1E8E3E`
- `--color-warning: #E0A800`
- `--color-danger: #C9302C`

---

## 2. Componentes Validados

| Componente | Tokens usados | Dark mode funciona |
|---|---|---|
| Button | `--color-primary`, `--color-card`, `--color-border` | ✓ |
| Input | `--color-card`, `--color-border`, `--color-text-primary` | ✓ |
| Card | `--color-card`, `--color-border`, category colors | ✓ |
| Badge | `--color-*-bg`, `--color-text-primary` | ✓ |
| Modal | `--color-card`, `--color-overlay-strong`, `--shadow-modal` | ✓ |
| Table | `--color-card`, `--color-border`, `--color-text-primary` | ✓ |
| EmptyState | `--color-text-primary`, `--color-text-secondary` | ✓ |
| Toast | `--color-card`, `--shadow-modal` | ✓ |
| AppHeader | `--color-header-gradient-*` (inalteradas) | ✓ |
| BottomNav | `--color-card`, `--color-border`, `--color-primary` | ✓ |
| SectionTitle | `--color-text-primary` | ✓ |
| Skeleton | `--color-border` | ✓ |
| ThemeToggle | `--color-primary`, `--color-card` | ✓ |

---

## 3. Persistência

| Aspecto | Implementação |
|---|---|
| Storage key | `absb-theme` |
| Opções | `light`, `dark`, `system` |
| Default | `system` |
| Restauração | `localStorage.getItem()` no carregamento |
| Sistema | `window.matchMedia('(prefers-color-scheme: dark)')` |
| Escuta de mudanças | `change` listener no media query |
| Flash prevention | `data-theme` aplicado antes do render em `main.tsx` |

---

## 4. Acessibilidade

| Critério | Status |
|---|---|
| Contraste WCAG AA | ✓ Tokens com contraste adequado |
| Foco visível | ✓ `--shadow-focus` mantido |
| Toggle acessível | ✓ `role="group"`, `aria-label`, `aria-pressed` |
| Navegação por teclado | ✓ Botões focusable |
| Estado comunicado | ✓ `aria-pressed` no botão ativo |

---

## 5. Arquivos Criados / Modificados

| Arquivo | Alteração |
|---|---|
| `src/design-system/tokens.css` | Adicionados tokens dark mode sob `[data-theme="dark"]` |
| `src/hooks/useTheme.ts` | Novo — hook de gerenciamento de tema |
| `src/components/ui/ThemeToggle/ThemeToggle.tsx` | Novo — componente de toggle |
| `src/components/ui/ThemeToggle/ThemeToggle.module.css` | Novo — estilos |
| `src/components/ui/ThemeToggle/index.ts` | Novo — barrel export |
| `src/components/ui/index.ts` | Adicionado export do ThemeToggle |
| `src/pages/Configuracoes/ConfiguracoesPage.tsx` | Adicionada seção "Aparência" com ThemeToggle |
| `src/main.tsx` | Inicialização de tema antes do render |

---

## 6. Validações

| Validação | Resultado |
|---|---|
| `npm run typecheck` | ✓ 0 erros |
| `npm run lint` | ✓ 0 erros |
| `npm run build` | ✓ 3.90s |
| PWA precache | 60 entries (772.58 KiB) |

---

## 7. Próximo Marco

**Fase 3.3** — Exportação CSV de Mensalidades + Relatório Financeiro.
Requer: definições de INFO-01 a INFO-07.

---

**Aguardando aprovação do cliente.**
