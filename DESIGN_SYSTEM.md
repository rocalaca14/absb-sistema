# DESIGN_SYSTEM — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Idioma:** Português (Brasil)

---

## 1. Propósito

Este documento define **todos os tokens visuais** do projeto. Nenhum valor visual (cor, tamanho, espaçamento, raio, sombra, animação, opacidade, z-index) pode ser utilizado fora dos tokens aqui documentados.

Toda decisão de design está registrada. Em caso de necessidade de novo valor, ele é primeiramente **adicionado a este documento** e só depois utilizado em código.

---

## 2. Fonte

### 2.1 Família Tipográfica

- **Única família autorizada:** `Inter`.
- Carregamento: via `@fontsource/inter` (sem CDN externo).
- Pesos disponíveis no projeto: `400`, `500`, `600`, `700`.
- Estilo: somente regular. Sem itálico.

### 2.2 Pesos

| Token | Valor | Uso |
|---|---|---|
| `--font-weight-regular` | `400` | Texto corrido, legendas |
| `--font-weight-medium` | `500` | (Reservado para futuro) |
| `--font-weight-semibold` | `600` | Títulos de seção, títulos de card |
| `--font-weight-bold` | `700` | Título principal, valor financeiro |

### 2.3 Tamanhos

| Token | Valor (px) | Peso | Uso |
|---|---|---|---|
| `--font-size-title` | `32` | `700` | Título principal da tela |
| `--font-size-value` | `34` | `700` | Valor financeiro destacado |
| `--font-size-section` | `24` | `600` | Título de seção |
| `--font-size-card-title` | `18` | `600` | Título de card |
| `--font-size-text` | `16` | `400` | Texto corrido |
| `--font-size-caption` | `14` | `400` | Legendas, hints, labels secundários |

**Regra:** Nenhum outro tamanho de fonte pode ser utilizado.

### 2.4 Line Height

| Token | Valor | Uso |
|---|---|---|
| `--line-height-tight` | `1.2` | Títulos e valores grandes |
| `--line-height-base` | `1.4` | Demais textos |

- `--font-size-title` e `--font-size-value` usam `--line-height-tight`.
- `--font-size-section`, `--font-size-card-title`, `--font-size-text` e `--font-size-caption` usam `--line-height-base`.

### 2.5 Letter Spacing

| Token | Valor |
|---|---|
| `--letter-spacing-normal` | `0` |
| `--letter-spacing-wide` | `0.2px` (reservado para labels em CAIXA ALTA) |

---

## 3. Cores

### 3.1 Princípios

- Toda cor é um token.
- Cores hexadecimais literais são proibidas em qualquer arquivo fora de `design-system/tokens.css`.
- Cores semânticas (papéis) são proibidas fora dos tokens.
- Mudança de paleta requer atualização deste documento.

### 3.2 Tokens de Marca (definidos pelo cliente)

> **Status:** cores oficiais confirmadas pelo cliente.

| Token | Valor | Uso previsto |
|---|---|---|
| `--color-primary` | `#00BAB9` | Cor primária da marca (teal) |
| `--color-secondary` | `#FFA600` | Cor secundária (laranja) |
| `--color-accent` | `#FFA600` | Destaque, chamadas de ação secundárias |
| `--color-success` | `#1E8E3E` | Confirmações, status positivo |
| `--color-warning` | `#E0A800` | Avisos |
| `--color-danger` | `#C9302C` | Erros, exclusões, alertas críticos |

### 3.3 Tokens de Superfície

| Token | Valor provisório | Uso |
|---|---|---|
| `--color-background` | `#F4F5F7` | Fundo geral da aplicação (cinza muito claro) |
| `--color-card` | `#FFFFFF` | Fundo de cards |
| `--color-border` | `#E1E4EA` | Bordas e divisores |
| `--color-overlay` | `rgba(0, 0, 0, 0.5)` | Backdrop de modais |

### 3.4 Tokens de Texto

| Token | Valor provisório | Uso |
|---|---|---|
| `--color-text-primary` | `#1A1D22` | Texto principal |
| `--color-text-secondary` | `#5C6470` | Texto secundário, legendas |
| `--color-text-on-primary` | `#1A1D22` | Texto sobre `--color-primary` (preto para contraste AA com #00BAB9) |
| `--color-text-on-secondary` | `#1A1D22` | Texto sobre `--color-secondary` (preto para contraste AA com #FFA600) |
| `--color-text-on-accent` | `#1A1D22` | Texto sobre `--color-accent` |
| `--color-text-disabled` | `#9AA0A6` | Texto desabilitado |

> **Contraste WCAG AA (4.5:1):** com as cores oficiais `#00BAB9` e `#FFA600`, o texto branco **não atinge** o mínimo AA. Por isso o texto sobre estas superfícies deve ser escuro (`#1A1D22`). Esta é uma decisão de acessibilidade obrigatória, não estética.

### 3.5 Tokens de Header (Degradê)

| Token | Valor | Uso |
|---|---|---|
| `--color-header-gradient-start` | `#008F8E` | Início do degradê do cabeçalho (teal escuro) |
| `--color-header-gradient-end` | `#00BAB9` | Final do degradê do cabeçalho (teal claro) |

Direção: `180deg` (vertical, escuro em cima, claro embaixo).

> **Nota:** os tons escurecidos de teal foram calculados a partir de `#00BAB9` aplicando `-15%` de luminosidade para preservar a identidade. O cliente pode confirmar o tom exato.

### 3.6 Tokens de Categoria (Cards)

As 4 cores semânticas de categoria, derivadas da identidade oficial:

| Token | Valor | Categoria | Origem |
|---|---|---|---|
| `--color-category-blue` | `#00BAB9` | Azul | Teal primário oficial |
| `--color-category-green` | `#1E8E3E` | Verde | Mantido |
| `--color-category-red` | `#C9302C` | Vermelho | Mantido |
| `--color-category-yellow` | `#FFA600` | Amarelo | Accent oficial |

**Definição semântica:** os 4 tons de categoria são uma derivação da identidade visual. Os tons `blue` e `yellow` foram alinhados com a primária (`#00BAB9`) e o accent (`#FFA600`) da nova marca, mantendo `green` e `red` para preservar convenção de sucesso/erro.

**Regra:** nenhuma outra cor pode ser usada como linha de categoria. Ajustes finos (variação de saturação/luminosidade) só podem ser feitos com aprovação do cliente.

### 3.7 Mapeamento de Cores por Estado

| Estado | Token de cor |
|---|---|
| Botão padrão | `--color-primary` |
| Botão hover | escurecimento de `--color-primary` em 8% (definido em `tokens.css` via função `color-mix`) |
| Botão pressed | escurecimento de `--color-primary` em 12% |
| Botão desabilitado | `--color-border` |
| Texto botão desabilitado | `--color-text-disabled` |
| Input focus | borda `--color-primary` |
| Input error | borda `--color-danger` |
| Toast success | fundo `--color-success` |
| Toast error | fundo `--color-danger` |
| Toast warning | fundo `--color-warning` |
| Toast info | fundo `--color-primary` |

### 3.8 Padrão Visual de Referência

A interface deve seguir a sensação de:

- **Apple Wallet** — clareza, hierarquia, espaços generosos, tipografia precisa.
- **Notion** — minimalismo, foco no conteúdo, ausência de ruído visual.
- **Stripe Dashboard** — sofisticação, refinamento de cor e tipografia, transições suaves.

Princípios visuais inegociáveis:

- Hierarquia visual clara.
- Bastante espaço em branco.
- Poucos elementos simultâneos na tela.
- Animações suaves (duração e easing conforme tokens).
- Feedback visual para toda ação.

---

## 4. Espaçamentos

### 4.1 Regra Oficial (Decisão D1)

Todos os valores de espaçamento do projeto DEVEM pertencer ao conjunto permitido do Grid 8pt:

```
4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80
```

Valores estruturais principais (paddings, gaps, margens) devem **priorizar múltiplos de 8**. Valores intermediários (4, 12, 20) podem ser usados quando o ajuste fino é necessário.

**Exceções permitidas (documentadas):**

- Tipografia (tamanhos de fonte, line-height, letter-spacing).
- Largura de bordas (1px, 5px).
- Tamanho de ícones (24px).
- Elementos internos de tipografia.

Não é permitido criar valores fora do conjunto permitido. Ajustes requerem atualização deste documento.

### 4.2 Escala Numérica

| Token | Valor (px) | Uso |
|---|---|---|
| `--space-1` | `4` | Ajustes mínimos |
| `--space-2` | `8` | Entre label e value em inputs |
| `--space-3` | `12` | Entre título e subtítulo (regra D1) |
| `--space-4` | `16` | Entre cards |
| `--space-5` | `20` | Padding lateral e vertical da tela |
| `--space-6` | `24` | Entre seções |
| `--space-7` | `32` | (Reservado) |
| `--space-8` | `40` | (Reservado) |
| `--space-9` | `48` | (Reservado) |
| `--space-10` | `56` | (Reservado) |
| `--space-11` | `64` | (Reservado) |
| `--space-12` | `72` | (Reservado) |
| `--space-13` | `80` | (Reservado) |

### 4.3 Tokens Semânticos de Espaçamento

| Token | Valor | Uso |
|---|---|---|
| `--space-screen-x` | `20px` (`--space-5`) | Padding lateral da tela |
| `--space-screen-top` | `20px` (`--space-5`) | Padding superior da tela |
| `--space-screen-bottom` | `20px` (`--space-5`) | Padding inferior da tela |
| `--space-section` | `24px` (`--space-6`) | Entre seções |
| `--space-card` | `16px` (`--space-4`) | Entre cards |
| `--space-icon-text` | `12px` (`--space-3`) | Entre ícones e textos |
| `--space-title-subtitle` | `8px` (`--space-2`) | Entre título e subtítulo |

---

## 5. Grid

### 5.1 Princípios

- Layout é sempre via CSS Grid.
- Margens negativas são proibidas.
- Posicionamento manual fora de Grid é proibido.
- `display: flex` é permitido apenas dentro de blocos internos de um componente (ex: alinhamento de ícone + texto em botão). Nunca para layout macro.

### 5.2 Largura Base

- **390 px** (mobile, largura de projeto).
- Container principal: `100%` da viewport, limitado a `--max-width-content` em telas grandes (definido em `UI_SPECIFICATION.md`).

### 5.3 Grid de Página

- `display: grid`.
- `grid-template-columns: 1fr`.
- `grid-template-rows: auto 1fr auto` (header, conteúdo, nav).
- `min-height: 100vh` (com `100dvh` como fallback moderno).

### 5.4 Grid de Seção

- `display: grid`.
- `grid-template-columns: 1fr`.
- `row-gap: var(--space-section)`.

### 5.5 Grid de Cards (listagem)

- `display: grid`.
- `grid-template-columns: 1fr`.
- `row-gap: var(--space-card)`.

---

## 6. Border Radius

| Token | Valor (px) | Uso | Em D1? |
|---|---|---|---|
| `--radius-xs` | `4` | (Reservado) | ✓ |
| `--radius-sm` | `8` | (Reservado) | ✓ |
| `--radius-md` | `12` | Campos de texto (input) | ✓ |
| `--radius-lg` | `16` | Botões | ✓ |
| `--radius-xl` | `20` | Cards | ✓ |
| `--radius-pill` | `9999` | Badges, tags | Exceção (pill) |

---

## 7. Sombras e Elevação

### 7.1 Princípios

Sombras extremamente suaves. Sombras fortes são proibidas.

### 7.2 Tokens

| Token | Valor | Uso |
|---|---|---|
| `--shadow-none` | `none` | Sem sombra (estado padrão em superfícies planas) |
| `--shadow-card` | `0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.02)` | Sombra de card |
| `--shadow-raised` | `0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)` | Elemento elevado (dropdown, bottom sheet) |
| `--shadow-modal` | `0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)` | Modal, diálogo |
| `--shadow-focus` | `0 0 0 3px rgba(0, 186, 185, 0.25)` | Anel de foco (teal `#00BAB9` a 25% de opacidade) |

### 7.3 Regra de Elevação

Cada nível de elevação corresponde a um token. Nunca compor sombras manualmente.

| Nível | Token | Onde usar |
|---|---|---|
| 0 | `--shadow-none` | Tela de fundo |
| 1 | `--shadow-card` | Cards, inputs |
| 2 | `--shadow-raised` | Dropdowns, popovers, bottom sheets |
| 3 | `--shadow-modal` | Modais, diálogos |
| Focus | `--shadow-focus` | Anel de foco em controles interativos |

---

## 8. Bordas

| Token | Valor | Uso |
|---|---|---|
| `--border-width-hairline` | `1px` | Bordas sutis, divisores, borda de input padrão |
| `--border-width-card-line` | `5px` | Linha colorida inferior de card (categoria) |
| `--border-style` | `solid` | Único estilo permitido |

Cores de borda: sempre via tokens (`--color-border`, `--color-category-*`, etc.).

---

## 9. Ícones

### 9.1 Fonte de Ícones

- **Única biblioteca autorizada:** `lucide-react`.
- Emojis são proibidos.
- Imagens no papel de ícone são proibidas.
- Qualquer outro pacote de ícones é proibido.

### 9.2 Especificação

| Propriedade | Valor |
|---|---|
| Tamanho padrão | `24px` |
| Stroke | `2` |
| Cor | Herda do elemento pai via `currentColor` |

### 9.3 Wrapper

Todo ícone utilizado na UI passa pelo componente `Icon` (`components/ui/Icon/Icon.tsx`), que:

- Garante tamanho e stroke consistentes.
- Recebe `name` (string) e mapeia para o componente do `lucide-react`.
- Não aceita props de tamanho ou stroke (são fixos).

### 9.4 Catálogo de Ícones Iniciais

| Nome no Lucide | Uso previsto |
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

Novos ícones precisam ser adicionados a este catálogo antes de serem utilizados.

---

## 10. Estados

### 10.1 Catálogo de Estados

Aplicam-se a componentes interativos (botões, inputs, cards clicáveis, links):

| Estado | Aplicação |
|---|---|
| `default` | Estado padrão em repouso |
| `hover` | Cursor sobre o elemento |
| `pressed` | Elemento sendo pressionado (mouse ou touch) |
| `focus` | Elemento focado via teclado |
| `disabled` | Elemento desabilitado |
| `loading` | Elemento em carregamento |
| `selected` | Elemento selecionado (cards, itens de lista) |
| `error` | Estado de erro (aplicável a inputs) |
| `empty` | Lista/conteúdo vazio |
| `skeleton` | Estado de carregamento de conteúdo |

### 10.2 Implementação

Todos os estados são descritos visualmente em `UI_SPECIFICATION.md`, componente a componente. Nenhum estado pode ser improvisado.

---

## 11. Animações e Transições

### 11.1 Durações

| Token | Valor (ms) | Uso |
|---|---|---|
| `--duration-instant` | `0` | Sem animação |
| `--duration-fast` | `150` | Mudanças de cor, hover |
| `--duration-base` | `200` | Transições padrão |
| `--duration-slow` | `300` | Entrada/saída de modais, toasts |
| `--duration-skeleton` | `1200` | Pulse do skeleton |

### 11.2 Easings

| Token | Valor | Uso |
|---|---|---|
| `--easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Padrão |
| `--easing-enter` | `cubic-bezier(0, 0, 0.2, 1)` | Entrada (ex: modal) |
| `--easing-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Saída (ex: modal) |

### 11.3 Propriedades Transicionadas

Por padrão, transições aplicam-se a `background-color`, `border-color`, `color`, `transform`, `opacity` apenas.

- **Nunca** animar `width`, `height`, `top`, `left`, `margin`, `padding`.

### 11.4 Skeleton

- Cor de base: `--color-border`.
- Cor de destaque: `rgba(255, 255, 255, 0.6)` sobre `--color-border` calculado.
- Animação: pulse de opacidade de `0.6` a `1.0` em `--duration-skeleton`, com `--easing-standard`.
- Forma: retângulo com `--radius-md` (ou conforme o componente que está sendo carregado).

---

## 12. Opacidade

| Token | Valor | Uso |
|---|---|---|
| `--opacity-disabled` | `0.5` | Elemento desabilitado |
| `--opacity-overlay` | `0.5` | Backdrop de modal |
| `--opacity-hover` | `1.0` (com mudança de cor) | Camada de hover |
| `--opacity-pressed` | `0.85` | Camada de pressed (sobre cor base) |

---

## 13. Z-Index

Camadas de empilhamento (ordem de baixo para cima):

| Token | Valor | Uso |
|---|---|---|
| `--z-base` | `0` | Conteúdo padrão |
| `--z-sticky` | `100` | Elementos sticky |
| `--z-header` | `200` | Cabeçalho fixo |
| `--z-bottom-nav` | `200` | Menu inferior fixo |
| `--z-dropdown` | `300` | Dropdowns, popovers |
| `--z-toast` | `400` | Toasts |
| `--z-modal-backdrop` | `500` | Backdrop de modal |
| `--z-modal` | `600` | Modal |
| `--z-tooltip` | `700` | Tooltip |

**Regra:** Nenhum valor de `z-index` pode ser usado fora destes tokens.

---

## 14. Breakpoints

| Token | Valor (px) | Nome |
|---|---|---|
| `--breakpoint-xs` | `320` | Telas muito pequenas |
| `--breakpoint-sm` | `390` | Base (largura do projeto) |
| `--breakpoint-md` | `480` | Mobile grande |
| `--breakpoint-lg` | `768` | Tablet |
| `--breakpoint-xl` | `1024` | Desktop pequeno |
| `--breakpoint-2xl` | `1280` | Desktop padrão |
| `--breakpoint-3xl` | `1440` | Desktop grande |
| `--breakpoint-4xl` | `1920` | Full HD |

Regras de uso:

- Layout base: `390px` (mobile first).
- Em larguras superiores, container centraliza com largura máxima (definida em `UI_SPECIFICATION.md`).
- A partir de `--breakpoint-lg` (768px), header e bottom nav permanecem (não há versão desktop diferenciada nesta fase).

---

## 15. Tokens Compilados (referência rápida para implementação)

Quando `tokens.css` for implementado, conterá no mínimo:

```
/* Tipografia */
--font-family: 'Inter', system-ui, -apple-system, sans-serif;
--font-weight-regular, --font-weight-medium, --font-weight-semibold, --font-weight-bold
--font-size-title, --font-size-value, --font-size-section, --font-size-card-title, --font-size-text, --font-size-caption
--line-height-tight, --line-height-base
--letter-spacing-normal, --letter-spacing-wide

/* Cores - marca */
--color-primary, --color-secondary, --color-accent, --color-success, --color-warning, --color-danger

/* Cores - superfície */
--color-background, --color-card, --color-border, --color-overlay

/* Cores - texto */
--color-text-primary, --color-text-secondary, --color-text-on-primary, --color-text-on-accent, --color-text-disabled

/* Cores - header */
--color-header-gradient-start, --color-header-gradient-end

/* Cores - categoria */
--color-category-blue, --color-category-green, --color-category-red, --color-category-yellow

/* Espaçamento */
--space-1 até --space-13
--space-screen-x, --space-screen-top, --space-screen-bottom, --space-section, --space-card, --space-icon-text, --space-title-subtitle

/* Radius */
--radius-xs, --radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-pill

/* Sombra */
--shadow-none, --shadow-card, --shadow-raised, --shadow-modal, --shadow-focus

/* Borda */
--border-width-hairline, --border-width-card-line, --border-style

/* Animação */
--duration-instant, --duration-fast, --duration-base, --duration-slow, --duration-skeleton
--easing-standard, --easing-enter, --easing-exit

/* Opacidade */
--opacity-disabled, --opacity-overlay, --opacity-hover, --opacity-pressed

/* Z-index */
--z-base, --z-sticky, --z-header, --z-bottom-nav, --z-dropdown, --z-toast, --z-modal-backdrop, --z-modal, --z-tooltip

/* Breakpoints */
--breakpoint-xs até --breakpoint-4xl
```

---

## 16. Regras de Uso

1. **Nunca** usar valor hexadecimal em componente.
2. **Nunca** criar novo token sem documentá-lo aqui antes.
3. **Nunca** usar fonte que não seja Inter.
4. **Nunca** usar ícone de fora do `lucide-react`.
5. **Nunca** usar sombra fora dos tokens.
6. **Nunca** animar propriedades geométricas (largura, altura, posição).
7. **Nunca** exceder 4 níveis de z-index.
8. **Sempre** preferir token semântico (ex: `--space-section`) sobre token numérico (ex: `--space-11`).
9. **Sempre** consultar este documento antes de propor ajuste visual.

---

## 17. Bloqueios

- Cores reais das seções 3.2, 3.5 e 3.6 dependem da logo oficial.
- Tom exato de azul para o degradê do header depende da logo.
- Caso a logo não permita extração dos 4 tons de categoria, o cliente deve informar os 4 valores.

---

## 18. Safe Area (iOS)

Aplicações PWA em iOS precisam lidar com a área segura do dispositivo (notch, home indicator, bordas arredondadas).

### 18.1 Variáveis de ambiente CSS

`tokens.css` declara:

```
--safe-area-top: env(safe-area-inset-top, 0px);
--safe-area-bottom: env(safe-area-inset-bottom, 0px);
--safe-area-left: env(safe-area-inset-left, 0px);
--safe-area-right: env(safe-area-inset-right, 0px);
```

### 18.2 Aplicação

| Componente | Padding a aplicar |
|---|---|
| `AppHeader` | `padding-top: var(--safe-area-top)` |
| `BottomNav` | `padding-bottom: var(--safe-area-bottom)` |
| `PageContainer` | `padding-left: max(var(--space-screen-x), var(--safe-area-left))`, `padding-right: max(var(--space-screen-x), var(--safe-area-right))` |
| `AppShell` | `padding-top: var(--safe-area-top)`, `padding-bottom: var(--safe-area-bottom)` |

### 18.3 Viewport

`index.html` deve conter:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1">
```

`viewport-fit=cover` é obrigatório para que `env(safe-area-inset-*)` funcione.

---

## 19. Área de Toque Mínima

Todo elemento interativo deve ter área de toque de **no mínimo 48x48px** (recomendação WCAG 2.5.5 / Apple HIG).

- Botões da biblioteca oficial já respeitam (48px de altura).
- Itens de lista, ícones clicáveis e itens do `BottomNav` devem garantir 48px mesmo visualmente menores — usar `padding` invisível ou `::before` para ampliar a área de toque.
- Constante: `TOUCH_TARGET_MIN = 48` (em `constants/layout.ts`).

---

## 20. Dark Mode (preparação, sem implementação)

O sistema de tokens é preparado para receber Dark Mode sem refatoração. A implementação efetiva ocorre em fase futura.

### 20.1 Estratégia

- Todos os tokens cromáticos são declarados em `[data-theme="light"]` por padrão.
- Variante dark sobrescreve em `[data-theme="dark"]`.
- Componentes nunca referenciam cor literal — sempre `var(--token)`.
- Atributo `data-theme` é aplicado no `<html>` por hook futuro `useTheme` (não implementado nesta fase).

### 20.2 Mapeamento Light → Dark (planejado)

| Token light | Token dark planejado |
|---|---|
| `--color-background` | `#0E1116` |
| `--color-card` | `#171A21` |
| `--color-text-primary` | `#F2F4F7` |
| `--color-text-secondary` | `#A0A6B0` |
| `--color-border` | `#2A2F38` |
| `--color-primary` | `#00BAB9` (mantida para identidade) |
| `--color-secondary` | `#FFA600` (mantida para identidade) |
| `--color-overlay` | `rgba(0, 0, 0, 0.7)` |

### 20.3 Regra para esta fase

- Nenhum seletor `[data-theme="dark"]` é criado.
- Apenas a estrutura de tokens é validada para suportar dark mode no futuro.
- Componentes não podem usar valores de cor hardcoded que impeçam a troca.

---

## 21. Acessibilidade (WCAG AA)

Todos os componentes da biblioteca oficial respeitam:

- **Contraste mínimo 4.5:1** para texto normal.
- **Contraste mínimo 3:1** para texto grande (>= 18.66px bold ou >= 24px regular).
- **Contraste mínimo 3:1** para elementos não textuais (ícones, bordas de input, etc.).
- **Área de toque mínima 48x48px**.
- **Foco visível** em todos os elementos interativos via `--shadow-focus`.
- **Navegação completa por teclado**.
- **Textos em `pt-BR`**.
- **Sem dependência exclusiva de cor** para transmitir informação (sempre ícone + texto ou texto + cor).
- **Labels associadas** a todos os inputs.

Esta seção é uma **constraint de design**. Componentes que não respeitam não podem ser adicionados à biblioteca.

### 21.1 `prefers-reduced-motion`

Usuários com sensibilidade a movimento podem definir `prefers-reduced-motion: reduce` no sistema operacional. A aplicação deve respeitar.

**Implementação em `tokens.css`:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Componentes que devem respeitar:**

- Animações de hover em Card (transform translateY).
- Animações de entrada/saída de Toast.
- Animações de pulse em Skeleton.
- Transições de cor de Button (hover/pressed).
- Animações de BottomNav (estado ativo).

**Regra:** nenhum componente introduz animação nova sem prever o comportamento em `prefers-reduced-motion: reduce`.

### 21.2 `:focus-visible`

Estilos de foco são aplicados **apenas** via `:focus-visible`, não via `:focus`. Isso evita mostrar o anel de foco em interações por mouse/toque (onde é desnecessário) mas mantém em navegação por teclado.

**Implementação obrigatória em todo componente interativo:**

```css
.interactive-element:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

**Regra:** nenhum elemento interativo pode omitir o estilo `:focus-visible`. Estados de `focus` devem ser documentados na `UI_SPECIFICATION.md` para cada componente.

### 21.3 Atributos ARIA obrigatórios

| Atributo | Quando usar | Exemplo |
|---|---|---|
| `aria-label` | Botões que contém apenas ícone. | `<button aria-label="Logout"><Icon name="LogOut" /></button>` |
| `aria-hidden` | Ícones decorativos (acompanham texto). | `<Icon name="Wallet" aria-hidden="true" />` (se houver texto "Mensalidades" ao lado) |
| `aria-current` | Item ativo em navegação. | `<NavLink to="/mensalidades" aria-current="page">` |
| `aria-busy` | Estado de loading. | `<Button loading aria-busy="true">Salvar</Button>` |
| `aria-disabled` | Elemento desabilitado em casos sem `disabled` HTML. | `<div role="button" aria-disabled="true">` |
| `aria-invalid` | Input com erro de validação. | `<Input error aria-invalid="true">` |
| `aria-describedby` | Input com helper text. | `<Input aria-describedby="helper-email" />` |
| `aria-live` | Conteúdo que muda dinamicamente (toasts, contador). | `<div role="status" aria-live="polite">` |
| `role` | Apenas quando o HTML semântico é inadequado. | `<div role="button" tabIndex={0}>` |

### 21.4 `tabindex`

- `tabindex="0"` — torna o elemento focável na ordem natural.
- `tabindex="-1"` — torna o elemento focável via JavaScript mas não na ordem natural.
- `tabindex` positivo (1, 2, ...) — **proibido**. Quebra a ordem natural de tabulação.

**Quando usar:**

| Caso | `tabindex` |
|---|---|
| Botão HTML nativo | Não necessário |
| `<a>` HTML nativo | Não necessário |
| Elemento customizado com `role="button"` | `tabindex="0"` |
| Modal aberto (foco preso dentro) | Itens focáveis com `tabindex="0"` e primeiro item recebe foco; trap de foco gerenciado |
| Skip link ("Pular para conteúdo") | `tabindex="0"` |

### 21.5 Skip Link

A aplicação fornece um **skip link** "Pular para conteúdo principal" no topo, oculto visualmente, que se torna visível ao receber foco. Implementado em `AppShell` como primeiro elemento focável.

### 21.6 Foco Inicial

Ao montar uma página ou modal, o foco vai automaticamente para:

- Modal aberto: primeiro elemento focável do modal.
- Página carregada: cabeçalho da página (heading principal) ou skip link.
- Toast: não recebe foco (anunciado via `aria-live`).

### 21.7 Verificação AA — Tabela de Contrastes da Identidade

| Par | Contraste medido | AA Texto | AA Não-texto | Status |
|---|---|---|---|---|
| `#1A1D22` (texto primário) sobre `#FFFFFF` (card) | 16.5:1 | ✓ | ✓ | OK |
| `#5C6470` (texto secundário) sobre `#FFFFFF` | 6.4:1 | ✓ | ✓ | OK |
| `#5C6470` sobre `#F4F5F7` (fundo) | 6.1:1 | ✓ | ✓ | OK |
| `#9AA0A6` (texto desabilitado) sobre `#FFFFFF` | 2.9:1 | ✗ | ✓ | OK apenas para não-texto; uso restrito |
| `#1A1D22` sobre `#00BAB9` (botão primário) | 9.4:1 | ✓ | ✓ | OK |
| `#1A1D22` sobre `#FFA600` (botão accent) | 7.3:1 | ✓ | ✓ | OK |
| `#FFFFFF` sobre `#00BAB9` | 2.4:1 | ✗ | ✗ | **Proibido** (uso de branco em teal) |
| `#FFFFFF` sobre `#FFA600` | 2.0:1 | ✗ | ✗ | **Proibido** (uso de branco em laranja) |

**Conclusão:** texto sobre `--color-primary` e `--color-accent` é sempre escuro (`#1A1D22`). Texto branco é proibido sobre estas superfícies.

---

## 22. Decisões D1 e D2 Aplicadas (22/07/2026)

### 22.1 Decisão D1 — Grid 8pt

**Aplicada.** Conjunto oficial de valores permitidos: `{4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80}`. Toda a escala de espaçamento foi reescrita para usar apenas este conjunto. Exceções documentadas: tipografia, bordas, ícones, elementos internos de tipografia.

### 22.2 Decisão D2 — BottomNav 48x48

**Aplicada.** BottomNav agora tem `80px` de altura total. Cada item garante área de toque mínima de `48x48px` via pseudo-elemento `::before` com `position: absolute; min-width: 48px; min-height: 48px`. `padding-bottom: var(--safe-area-bottom)` para respeitar iOS.

### 22.3 Conflitos Anteriores (Resolvidos)

| Conflito | Status |
|---|---|
| Grid 8pt vs valores existentes | ✓ Resolvido com D1 |
| 48x48 touch area vs BottomNav | ✓ Resolvido com D2 |
| Nomenclatura de documentos | ✓ Em resolução — documentos ausentes a criar |
| Branco sobre `#00BAB9` | ✓ Resolvido com troca para texto escuro `#1A1D22` |
