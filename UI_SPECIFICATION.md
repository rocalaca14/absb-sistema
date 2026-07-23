# UI_SPECIFICATION — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Idioma:** Português (Brasil)

---

## 1. Propósito

Este documento define a especificação **pixel a pixel** de cada componente da interface. Cada valor é absoluto. Não existem expressões como "aproximadamente", "em torno de", "pode" ou "preferencialmente".

Todos os valores abaixo referenciam tokens definidos em `DESIGN_SYSTEM.md` e constantes em `CONSTANTS.md`. Nenhum valor aqui é independente do sistema de tokens.

---

## 2. Convenções da Documentação

Para cada componente são especificadas as propriedades:

- **Container**: dimensões externas, padding, margin, raio, sombra, borda.
- **Conteúdo**: tipografia, ícones, alinhamento.
- **Estados**: `default`, `hover`, `pressed`, `focus`, `disabled`, `loading`, `selected`, `error` (quando aplicável).
- **Tokens utilizados**: lista de tokens consumidos.

---

## 3. Página — Estrutura Global

### 3.1 AppShell

Container raiz de toda a tela autenticada.

| Propriedade | Valor |
|---|---|
| Display | `grid` |
| `grid-template-rows` | `224px 1fr 80px` |
| `grid-template-areas` | `"header" "main" "nav"` |
| Largura | `100%` |
| Altura mínima | `100dvh` |
| Background | `var(--color-background)` |
| Overflow horizontal | `hidden` |
| `padding-top` | `var(--safe-area-top)` |
| `padding-bottom` | `var(--safe-area-bottom)` |

### 3.2 PageContainer

Wrapper de conteúdo das páginas (entre header e bottom nav).

| Propriedade | Valor |
|---|---|
| Display | `block` |
| Padding lateral | `var(--space-screen-x)` (20px) |
| Padding superior | `var(--space-screen-top)` (20px) |
| Padding inferior | `var(--space-screen-bottom)` (20px) |
| Largura máxima | `100%` (sem max-width nesta fase) |
| Tokens | `--space-screen-x`, `--space-screen-top`, `--space-screen-bottom` |

---

## 4. Cabeçalho — `AppHeader`

| Propriedade | Valor |
|---|---|
| Altura | `224px` (fixa) |
| Posição | `sticky` no topo |
| `top` | `0` |
| `z-index` | `var(--z-header)` (200) |
| Background | `linear-gradient(180deg, var(--color-header-gradient-start) 0%, var(--color-header-gradient-end) 100%)` |
| Padding interno | `20px` nas laterais e no topo + `var(--safe-area-top)` |
| Display interno | `grid` |
| `grid-template-rows` | `1fr auto` |
| `align-items` | `center` |
| `justify-items` | `center` |

### 4.1 Logo

| Propriedade | Valor |
|---|---|
| Largura | `auto` |
| Altura | `120px` |
| `object-fit` | `contain` |
| `max-width` | `80%` |
| `display` | `block` |
| Posicionamento | `align-self: center`, `justify-self: center` |

**Regra:** nunca distorcer, nunca cortar, nunca exceder altura de 120px.

### 4.2 Estados

`AppHeader` não possui estados interativos nesta fase.

---

## 5. Menu Inferior — `BottomNav`

| Propriedade | Valor |
|---|---|
| Altura | `80px` (fixa) |
| Posição | `fixed` no rodapé |
| `bottom` | `0` |
| `left` / `right` | `0` |
| `z-index` | `var(--z-bottom-nav)` (200) |
| Background | `var(--color-card)` |
| Border-top | `1px solid var(--color-border)` |
| Padding interno | `8px 0` + `var(--safe-area-bottom)` |
| Display interno | `grid` |
| `grid-template-columns` | `repeat(4, 1fr)` |
| `align-items` | `center` |
| `justify-items` | `center` |

### 5.1 Item de Navegação

| Propriedade | Valor |
|---|---|
| Display | `grid` |
| `grid-template-rows` | `auto auto` |
| `align-items` | `center` |
| `justify-items` | `center` |
| `row-gap` | `4px` |
| Largura | `100%` |
| Altura visível | `auto` |
| **Área de toque (mínima)** | **`48x48px`** garantida via `::before` com `position: absolute` cobrindo `inset: 0; min-width: 48px; min-height: 48px;` |
| Cursor | `pointer` |
| Background | `transparent` |
| Cor do ícone | `var(--color-text-secondary)` |
| Cor do texto | `var(--color-text-secondary)` |
| Tipografia | `--font-size-caption` (14px, regular) |
| `aria-current` | `"page"` quando ativo |
| Transição | `color var(--duration-fast) var(--easing-standard)`, `background-color var(--duration-fast) var(--easing-standard)` |
| `:focus-visible` | `box-shadow: var(--shadow-focus)` |

### 5.2 Estado Ativo

| Propriedade | Valor |
|---|---|
| Cor do ícone | `var(--color-primary)` |
| Cor do texto | `var(--color-primary)` |
| Peso do texto | `600` |
| Background | `transparent` |
| `aria-current` | `"page"` |

### 5.3 Estado Hover (itens não ativos)

| Propriedade | Valor |
|---|---|
| Cor do ícone | `var(--color-text-primary)` |
| Cor do texto | `var(--color-text-primary)` |

### 5.4 Estado Pressed

| Propriedade | Valor |
|---|---|
| `opacity` | `var(--opacity-pressed)` (0.85) |

### 5.5 Ícones

Todos via `Icon` (wrapper de `lucide-react`), 24px, stroke 2.

| Item | Ícone | Label | Rota |
|---|---|---|---|
| Início | `Home` | "Início" | `/` |
| Mensalidades | `Wallet` | "Mensalidades" | `/mensalidades` |
| Associados | `Users` | "Associados" | `/associados` |
| Configurações | `Settings` | "Configurações" | `/configuracoes` |

### 5.6 Safe Area

`BottomNav` aplica `padding-bottom: var(--safe-area-bottom)` para que o conteúdo (e a área de toque) respeite o home indicator do iPhone.

---

## 6. Botão — `Button`

### 6.1 Container

| Propriedade | Valor |
|---|---|
| Altura | `48px` (fixa; mínimo de touch target WCAG) |
| Largura | `100%` (padrão), pode receber `width: auto` em variantes controladas |
| `min-width` | `48px` |
| Padding horizontal | `20px` |
| Border radius | `var(--radius-lg)` (16px) |
| Display | `inline-flex` |
| `align-items` | `center` |
| `justify-content` | `center` |
| `column-gap` | `var(--space-icon-text)` (12px) |
| Border | `none` |
| Cursor | `pointer` |
| `user-select` | `none` |
| Transição | `background-color var(--duration-fast) var(--easing-standard)`, `opacity var(--duration-fast) var(--easing-standard)` |
| `:focus-visible` | `box-shadow: var(--shadow-focus)`, `outline: none` |

### 6.2 Tipografia

| Propriedade | Valor |
|---|---|
| `font-size` | `var(--font-size-text)` (16px) |
| `font-weight` | `var(--font-weight-semibold)` (600) |
| `line-height` | `var(--line-height-base)` (1.4) |
| `letter-spacing` | `var(--letter-spacing-normal)` |
| Cor (default) | `var(--color-text-on-primary)` (`#1A1D22`, contraste AA sobre teal) |

### 6.3 Variante Primária

| Estado | Background | Cor do texto |
|---|---|---|
| `default` | `var(--color-primary)` | `var(--color-text-on-primary)` |
| `hover` | `darken(--color-primary, 8%)` | `var(--color-text-on-primary)` |
| `pressed` | `darken(--color-primary, 12%)` + `opacity: var(--opacity-pressed)` | `var(--color-text-on-primary)` |
| `focus` | `var(--color-primary)` + `box-shadow: var(--shadow-focus)` | `var(--color-text-on-primary)` |
| `disabled` | `var(--color-border)` | `var(--color-text-disabled)` |
| `loading` | `var(--color-primary)` com spinner sobreposto | `var(--color-text-on-primary)` |

### 6.4 Variante Secundária

| Estado | Background | Cor do texto | Border |
|---|---|---|---|
| `default` | `transparent` | `var(--color-primary)` | `1px solid var(--color-primary)` |
| `hover` | `color-mix(in srgb, var(--color-primary) 8%, transparent)` | `var(--color-primary)` | `1px solid var(--color-primary)` |
| `pressed` | `color-mix(in srgb, var(--color-primary) 16%, transparent)` + `opacity: var(--opacity-pressed)` | `var(--color-primary)` | `1px solid var(--color-primary)` |
| `focus` | `transparent` | `var(--color-primary)` | `1px solid var(--color-primary)` + `box-shadow: var(--shadow-focus)` |
| `disabled` | `transparent` | `var(--color-text-disabled)` | `1px solid var(--color-border)` |

### 6.5 Variante Terciária (Texto)

| Estado | Background | Cor do texto |
|---|---|---|
| `default` | `transparent` | `var(--color-primary)` |
| `hover` | `color-mix(in srgb, var(--color-primary) 8%, transparent)` | `var(--color-primary)` |
| `pressed` | `color-mix(in srgb, var(--color-primary) 16%, transparent)` + `opacity: var(--opacity-pressed)` | `var(--color-primary)` |
| `focus` | `transparent` + `box-shadow: var(--shadow-focus)` | `var(--color-primary)` |
| `disabled` | `transparent` | `var(--color-text-disabled)` |

### 6.6 Estado Loading

| Propriedade | Valor |
|---|---|
| Conteúdo | Spinner 20px + texto opcional |
| Spinner border | `2px solid currentColor` |
| Spinner border-top | `2px solid transparent` |
| Animação | `spin 0.8s linear infinite` |
| Cursor | `wait` |
| `aria-busy` | `true` |

### 6.7 Contraste e Acessibilidade

A cor primária oficial é `#00BAB9` (teal). Branco sobre teal **não atinge** WCAG AA. Por isso:

- Variante primária usa `--color-text-on-primary` que retorna `#1A1D22` (texto escuro).
- Variantes secundária e terciária usam texto em `--color-primary` (teal) sobre fundo `--color-card` (branco) — contraste verificado.
- Spinner em estado de loading é desenhado em `currentColor` para herdar corretamente a cor do texto.

### 6.7 Tokens Utilizados

- `--color-primary`, `--color-border`, `--color-text-on-primary`, `--color-text-disabled`
- `--radius-lg`
- `--font-size-text`, `--font-weight-semibold`, `--line-height-base`
- `--space-icon-text`
- `--duration-fast`, `--easing-standard`
- `--opacity-pressed`
- `--shadow-focus`

### 6.8 Tamanhos Alternativos

**Não criar.** Apenas altura de 48px é permitida. Variações requerem aprovação.

---

## 7. Card — `Card`

### 7.1 Container

| Propriedade | Valor |
|---|---|
| Altura mínima | `112px` |
| Largura | `100%` |
| Padding interno | `20px` |
| Border radius | `var(--radius-xl)` (20px) |
| Background | `var(--color-card)` (`#FFFFFF`) |
| Sombra | `var(--shadow-card)` |
| Border inferior | `5px solid var(--color-category-{cor})` |
| Display | `grid` |
| `grid-template-rows` | `1fr auto` |
| `row-gap` | `12px` |
| Cursor (clicável) | `pointer` |
| `:focus-visible` | `box-shadow: var(--shadow-focus), var(--shadow-card)`, `outline: none` |
| Transição | `transform var(--duration-fast) var(--easing-standard)`, `box-shadow var(--duration-fast) var(--easing-standard)` |

### 7.2 Tipografia

| Elemento | Token |
|---|---|
| Título | `--font-size-card-title` (18px), `--font-weight-semibold` (600), `--line-height-base` (1.4), `var(--color-text-primary)` |
| Valor financeiro | `--font-size-value` (34px), `--font-weight-bold` (700), `--line-height-tight` (1.2), `var(--color-text-primary)` (34px mantido por regra D1 — exceção de tipografia) |
| Texto | `--font-size-text` (16px), `--font-weight-regular` (400), `--line-height-base` (1.4), `var(--color-text-primary)` |
| Legenda | `--font-size-caption` (14px), `--font-weight-regular` (400), `--line-height-base` (1.4), `var(--color-text-secondary)` |

### 7.3 Estrutura Interna

```
+----------------------------+
| [ícone]  Título            |  <- row 1: header (ícone opcional + título + legenda)
|         Legenda            |
|                            |
|  Valor financeiro          |  <- row 2: valor (34px bold)
+----------------------------+
| linha colorida 5px (cat)   |  <- row 3: borda inferior
+----------------------------+
```

Implementação:

- `display: grid`
- `grid-template-rows: auto 1fr auto`
- Última linha (`auto`) é a borda inferior de 5px.

### 7.4 Estados

| Estado | Comportamento |
|---|---|
| `default` | Sombra padrão, sem transformação |
| `hover` (se clicável) | `transform: translateY(-1px)`, `box-shadow: var(--shadow-raised)` |
| `pressed` (se clicável) | `transform: translateY(0)`, `box-shadow: var(--shadow-card)`, `opacity: var(--opacity-pressed)` |
| `focus` (se clicável) | `box-shadow: var(--shadow-card), var(--shadow-focus)` |
| `disabled` | `opacity: var(--opacity-disabled)`, `cursor: not-allowed` |
| `loading` | Skeleton interno (estrutura do card) |
| `selected` | Borda esquerda ou toda a borda de 2px em `var(--color-primary)` (definido em cada uso) |

### 7.5 Cores de Categoria

Atributo `category` aceita um dos 4 valores:

| Valor | Token |
|---|---|
| `blue` | `var(--color-category-blue)` |
| `green` | `var(--color-category-green)` |
| `red` | `var(--color-category-red)` |
| `yellow` | `var(--color-category-yellow)` |

**Regra:** Nenhum outro valor de categoria é aceito. Tipagem TypeScript restringe a 4 valores.

### 7.6 Tokens Utilizados

- `--color-card`, `--color-text-primary`, `--color-text-secondary`
- `--color-category-{blue|green|red|yellow}`
- `--shadow-card`, `--shadow-raised`, `--shadow-focus`
- `--radius-xl`
- `--font-size-card-title`, `--font-size-value`, `--font-size-text`, `--font-size-caption`
- `--font-weight-semibold`, `--font-weight-bold`, `--font-weight-regular`
- `--line-height-base`, `--line-height-tight`
- `--duration-fast`, `--easing-standard`
- `--opacity-pressed`, `--opacity-disabled`

---

## 8. Input — `Input`

### 8.1 Container

| Propriedade | Valor |
|---|---|
| Largura | `100%` |
| Display | `block` |

### 8.2 Wrapper do Campo

| Propriedade | Valor |
|---|---|
| Altura | `48px` |
| Padding horizontal | `16px` |
| Border radius | `var(--radius-md)` (12px) |
| Border | `1px solid var(--color-border)` |
| Background | `var(--color-card)` |
| Display | `flex` |
| `align-items` | `center` |
| `column-gap` | `var(--space-icon-text)` (12px) |
| Transição | `border-color var(--duration-fast) var(--easing-standard)`, `box-shadow var(--duration-fast) var(--easing-standard)` |
| `:focus-within` | `border-color: var(--color-primary)`, `box-shadow: var(--shadow-focus)` |

### 8.3 Campo (`<input>`)

| Propriedade | Valor |
|---|---|
| `font-size` | `var(--font-size-text)` (16px) |
| `font-weight` | `var(--font-weight-regular)` (400) |
| `line-height` | `var(--line-height-base)` (1.4) |
| Cor | `var(--color-text-primary)` |
| Background | `transparent` |
| Border | `none` |
| Flex | `1` |
| Outline | `none` |
| `::placeholder` | `var(--color-text-secondary)` |

### 8.4 Label

| Propriedade | Valor |
|---|---|
| `font-size` | `var(--font-size-caption)` (14px) |
| `font-weight` | `var(--font-weight-regular)` (400) |
| Cor | `var(--color-text-secondary)` |
| Margem inferior | `var(--space-1)` (4px) |

### 8.5 Helper Text / Error Message

| Propriedade | Valor |
|---|---|
| `font-size` | `var(--font-size-caption)` (14px) |
| Margem superior | `var(--space-1)` (4px) |
| Cor (helper) | `var(--color-text-secondary)` |
| Cor (erro) | `var(--color-danger)` |
| `aria-live` | `polite` (quando erro aparece dinamicamente) |

### 8.6 Estados

| Estado | Borda | Sombra | Outros |
|---|---|---|---|
| `default` | `1px solid var(--color-border)` | `none` | — |
| `hover` | `1px solid var(--color-text-secondary)` | `none` | — |
| `focus` | `1px solid var(--color-primary)` | `box-shadow: var(--shadow-focus)` | `:focus-within` no wrapper |
| `error` | `1px solid var(--color-danger)` | `none` | `aria-invalid="true"` no input |
| `disabled` | `1px solid var(--color-border)` | `none` | `opacity: var(--opacity-disabled)` no wrapper; `disabled` no input |

### 8.7 Tokens Utilizados

- `--color-border`, `--color-primary`, `--color-danger`, `--color-text-primary`, `--color-text-secondary`
- `--color-card`
- `--radius-md`
- `--shadow-focus`
- `--font-size-text`, `--font-size-caption`
- `--font-weight-regular`
- `--line-height-base`
- `--space-1`, `--space-icon-text`
- `--duration-fast`, `--easing-standard`
- `--opacity-disabled`

---

## 9. SectionTitle — `SectionTitle`

### 9.1 Container

| Propriedade | Valor |
|---|---|
| Display | `block` |
| Margem inferior | `var(--space-section)` (24px) |

### 9.2 Estrutura

```
Título (24px, 600)
[Espaço de 8px]
Subtítulo opcional (16px, 400, text-secondary)
```

### 9.3 Título

| Propriedade | Valor |
|---|---|
| `font-size` | `var(--font-size-section)` (24px) |
| `font-weight` | `var(--font-weight-semibold)` (600) |
| `line-height` | `var(--line-height-base)` (1.4) |
| Cor | `var(--color-text-primary)` |

### 9.4 Subtítulo

| Propriedade | Valor |
|---|---|
| `font-size` | `var(--font-size-text)` (16px) |
| `font-weight` | `var(--font-weight-regular)` (400) |
| `line-height` | `var(--line-height-base)` (1.4) |
| Cor | `var(--color-text-secondary)` |
| Margem superior | `var(--space-title-subtitle)` (8px) |

### 9.5 Tokens Utilizados

- `--color-text-primary`, `--color-text-secondary`
- `--font-size-section`, `--font-size-text`
- `--font-weight-semibold`, `--font-weight-regular`
- `--line-height-base`
- `--space-section`, `--space-title-subtitle` (8px)

---

## 10. Skeleton — `Skeleton`

### 10.1 Container

| Propriedade | Valor |
|---|---|
| Background | `var(--color-border)` |
| Border radius | `var(--radius-md)` (14px) |
| Animação | `pulse var(--duration-skeleton) var(--easing-standard) infinite` |

### 10.2 Animação Pulse

| Keyframe | Valor |
|---|---|
| `0%` | `opacity: 1` |
| `50%` | `opacity: 0.6` |
| `100%` | `opacity: 1` |

### 10.3 Tamanhos

Aceita `width` e `height` numéricos em pixels. Default: `100%` x `16px` (múltiplo de 8).

### 10.4 Tokens Utilizados

- `--color-border`
- `--radius-md`
- `--duration-skeleton`, `--easing-standard`

---

## 11. Icon — `Icon`

### 11.1 Wrapper

| Propriedade | Valor |
|---|---|
| `width` | `24px` |
| `height` | `24px` |
| `display` | `inline-flex` |
| `align-items` | `center` |
| `justify-content` | `center` |
| `color` | `currentColor` (herda do pai) |
| `stroke-width` | `2` |
| `flex-shrink` | `0` |

### 11.2 API

```ts
interface IconProps {
  name: IconName; // restrito ao catálogo do DESIGN_SYSTEM
  className?: string;
  ariaLabel?: string;
}
```

### 11.3 Tokens Utilizados

Nenhum token de cor. Cor é herdada via `currentColor`.

---

## 12. Toast — `Toast`

### 12.1 Container

| Propriedade | Valor |
|---|---|
| Posição | `fixed` |
| `top` | `244px` (logo abaixo do header de 224px + 20px) |
| `left` | `var(--space-screen-x)` (20px) |
| `right` | `var(--space-screen-x)` (20px) |
| `z-index` | `var(--z-toast)` (400) |
| Padding | `16px` |
| Border radius | `var(--radius-lg)` (16px) |
| Sombra | `var(--shadow-raised)` |
| Display | `grid` |
| `grid-template-columns` | `24px 1fr` |
| `column-gap` | `var(--space-icon-text)` (12px) |
| `align-items` | `center` |
| `role` | `status` |
| `aria-live` | `polite` |
| `aria-atomic` | `true` |
| Animação entrada | `translateY(-8px) -> 0`, `opacity 0 -> 1`, `var(--duration-slow) var(--easing-enter)` |
| Animação saída | `opacity 1 -> 0`, `var(--duration-base) var(--easing-exit)` |
| Duração visível | `3000ms` (configurável por chamada) |
| `prefers-reduced-motion` | Animações desabilitadas (aparece/some instantaneamente) |

### 12.2 Tipografia

| Propriedade | Valor |
|---|---|
| `font-size` | `var(--font-size-text)` (16px) |
| `font-weight` | `var(--font-weight-regular)` (400) |
| Cor do texto | `var(--color-text-on-primary)` (`#1A1D22`, contraste AA sobre teal) |

### 12.3 Variantes

| Variante | Background | Cor do texto | Contraste AA |
|---|---|---|---|
| `success` | `var(--color-success)` (`#1E8E3E`) | `var(--color-text-on-primary)` (`#1A1D22`) | ✓ 9.2:1 |
| `error` | `var(--color-danger)` (`#C9302C`) | `#FFFFFF` | ✓ 6.3:1 |
| `warning` | `var(--color-warning)` (`#E0A800`) | `var(--color-text-on-primary)` (`#1A1D22`) | ✓ 9.0:1 |
| `info` | `var(--color-primary)` (`#00BAB9`) | `var(--color-text-on-primary)` (`#1A1D22`) | ✓ 9.4:1 |

> **Nota de contraste:** branco sobre `#E0A800` (warning) e sobre `#00BAB9` (info) **falha** WCAG AA. Por isso ambas as variantes usam texto escuro. As variantes `success` e `error` poderiam usar branco, mas o sistema padroniza em texto escuro para consistência.

### 12.4 Ícone

`Icon` 24px, cor `var(--color-text-on-primary)`.

| Variante | Ícone |
|---|---|
| `success` | `Check` |
| `error` | `X` |
| `warning` | `AlertTriangle` |
| `info` | `Info` |

### 12.5 Tokens Utilizados

- `--color-success`, `--color-danger`, `--color-warning`, `--color-primary`, `--color-text-on-primary`
- `--space-screen-x`, `--space-icon-text`
- `--radius-lg`
- `--shadow-raised`
- `--font-size-text`, `--font-weight-regular`
- `--duration-base`, `--duration-slow`
- `--easing-enter`, `--easing-exit`
- `--z-toast`

---

## 13. LoginForm (estrutura, sem implementação nesta fase)

Documentado apenas para manter a forma de especificação. Implementação em fase 1.0.

### 13.1 Container

| Propriedade | Valor |
|---|---|
| Largura | `100%` |
| Padding | `var(--space-screen-x)` (20px) lateral, `40px` superior, `var(--space-screen-bottom)` inferior |
| Display | `grid` |
| `row-gap` | `var(--space-section)` (24px) |

### 13.2 Logo

| Propriedade | Valor |
|---|---|
| Largura | `180px` |
| Altura | `auto` |
| `object-fit` | `contain` |
| `align-self` | `center` |
| `justify-self` | `center` |
| Margem inferior | `var(--space-section)` (24px) |

### 13.3 Campos

- 2 inputs: e-mail e senha, especificação em seção 8.
- `row-gap` entre campos: `var(--space-card)` (16px).

### 13.4 Botão de Submit

- Especificação em seção 6 (variante primária).

---

## 14. Lista de Cards (estrutura)

Aplicável a listagens em Associados, Mensalidades, etc.

| Propriedade | Valor |
|---|---|
| Display | `grid` |
| `grid-template-columns` | `1fr` |
| `row-gap` | `var(--space-card)` (16px) |

---

## 15. Responsividade

### 15.1 Regras Globais

- Mobile first, largura base 390px.
- Em larguras > 390px, container centraliza com `max-width: 480px` (em fase futura, ajustar).
- Header e bottom nav permanecem em todas as larguras nesta fase.

### 15.2 Breakpoints Comportamentais

| Breakpoint | Comportamento |
|---|---|
| `≥ 320px` | Layout base, scroll vertical permitido |
| `≥ 390px` | Layout de projeto |
| `≥ 480px` | Container interno com `max-width: 480px`, centralizado |
| `≥ 768px` | Container interno com `max-width: 600px`, centralizado |
| `≥ 1024px` | Container interno com `max-width: 720px`, centralizado |
| `≥ 1280px` | Container interno com `max-width: 720px`, centralizado |
| `≥ 1920px` | Container interno com `max-width: 720px`, centralizado |

### 15.3 Garantias

- `body` com `overflow-x: hidden`.
- Nenhum componente pode produzir scroll horizontal.
- Nenhum texto pode ser cortado.
- Nenhum layout pode quebrar.

---

## 16. Acessibilidade

- Foco visível em todos os elementos interativos via `--shadow-focus`.
- Contraste mínimo AA em todos os pares texto/fundo.
- `aria-label` em todos os botões que contenham apenas ícone.
- `aria-busy` em estados de loading.
- Navegação completa por teclado.
- Textos em `pt-BR` com acentuação correta.

---

## 17. Bloqueios desta Documentação

- Logo oficial (afeta proporções reais da logo no header).
- Cores reais (afeta valores exatos dos tons de hover/pressed).
- Ajustes finos de sombra só podem ser feitos após aprovação do cliente.
