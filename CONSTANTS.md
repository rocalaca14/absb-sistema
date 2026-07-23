# CONSTANTS — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Idioma:** Português (Brasil)

---

## 1. Propósito

Este documento cataloga **todas as constantes** utilizadas no código do projeto. Nenhum valor numérico, string ou enumeração deve existir espalhado pelo código. Toda constante reside em `src/constants/` e é exportada por `src/constants/index.ts`.

As constantes TypeScript aqui documentadas são a **fonte única** dos valores que também aparecem como variáveis CSS em `design-system/tokens.css`. Quando um valor aparece nos dois lugares, o token CSS é a implementação e esta constante é a referência.

---

## 2. Layout

Arquivo: `src/constants/layout.ts`

| Constante | Valor (px) | Descrição |
|---|---|---|
| `LAYOUT_HEADER_HEIGHT` | `224` | Altura do cabeçalho fixo (múltiplo de 8) |
| `LAYOUT_BOTTOM_NAV_HEIGHT` | `80` | Altura do menu inferior fixo |
| `LAYOUT_BASE_WIDTH` | `390` | Largura base do projeto |
| `LAYOUT_LOGO_MAX_HEIGHT` | `120` | Altura máxima da logo no header (dimensão de imagem, exceção) |
| `LAYOUT_LOGO_MAX_WIDTH_PERCENT` | `80` | Largura máxima da logo em % |
| `LAYOUT_CONTENT_MAX_WIDTH_XS` | `100%` | Max-width até 480px |
| `LAYOUT_CONTENT_MAX_WIDTH_SM` | `480` | Max-width em >= 480px |
| `LAYOUT_CONTENT_MAX_WIDTH_MD` | `600` | Max-width em >= 768px |
| `LAYOUT_CONTENT_MAX_WIDTH_LG` | `720` | Max-width em >= 1024px |
| `LAYOUT_CONTENT_MAX_WIDTH_XL` | `720` | Max-width em >= 1280px |
| `LAYOUT_LOGIN_LOGO_WIDTH` | `180` | Largura da logo na tela de login (dimensão de imagem) |
| `LAYOUT_LOGIN_PADDING_TOP` | `40` | Padding superior do LoginForm |
| `LAYOUT_BUTTON_HEIGHT` | `48` | Altura do botão (mínimo 48px) |
| `LAYOUT_INPUT_HEIGHT` | `48` | Altura do input (mínimo 48px) |
| `LAYOUT_CARD_MIN_HEIGHT` | `112` | Altura mínima do card |
| `LAYOUT_TOUCH_TARGET_MIN` | `48` | Área de toque mínima (px) — WCAG 2.5.5 / Apple HIG |

---

## 3. Espaçamento

Arquivo: `src/constants/spacing.ts`

**Regra oficial (D1):** valores devem pertencer ao conjunto permitido do Grid 8pt: `{4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80}`.

### 3.1 Escala Numérica

| Constante | Valor (px) | Token CSS correspondente |
|---|---|---|
| `SPACE_1` | `4` | `--space-1` |
| `SPACE_2` | `8` | `--space-2` |
| `SPACE_3` | `12` | `--space-3` |
| `SPACE_4` | `16` | `--space-4` |
| `SPACE_5` | `20` | `--space-5` |
| `SPACE_6` | `24` | `--space-6` |
| `SPACE_7` | `32` | `--space-7` |
| `SPACE_8` | `40` | `--space-8` |
| `SPACE_9` | `48` | `--space-9` |
| `SPACE_10` | `56` | `--space-10` |
| `SPACE_11` | `64` | `--space-11` |
| `SPACE_12` | `72` | `--space-12` |
| `SPACE_13` | `80` | `--space-13` |

### 3.2 Constantes Semânticas

| Constante | Valor (px) | Token CSS | Mapeamento |
|---|---|---|---|
| `SPACE_SCREEN_X` | `20` | `--space-screen-x` | `SPACE_5` |
| `SPACE_SCREEN_TOP` | `20` | `--space-screen-top` | `SPACE_5` |
| `SPACE_SCREEN_BOTTOM` | `20` | `--space-screen-bottom` | `SPACE_5` |
| `SPACE_SECTION` | `24` | `--space-section` | `SPACE_6` |
| `SPACE_CARD` | `16` | `--space-card` | `SPACE_4` |
| `SPACE_ICON_TEXT` | `12` | `--space-icon-text` | `SPACE_3` |
| `SPACE_TITLE_SUBTITLE` | `8` | `--space-title-subtitle` | `SPACE_2` |

### 3.3 Conjunto Permitido (D1)

```ts
export const GRID_ALLOWED_VALUES = [4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80] as const;
```

Qualquer valor fora deste conjunto é considerado violação do Design System. Exceções documentadas (não invalidam a regra, mas justificam o desvio): textos, linhas de borda, ícones, elementos internos de tipografia.

---

## 4. Tipografia

Arquivo: `src/constants/typography.ts`

| Constante | Valor | Token CSS |
|---|---|---|
| `FONT_FAMILY` | `'Inter', system-ui, -apple-system, sans-serif` | `--font-family` |
| `FONT_WEIGHT_REGULAR` | `400` | `--font-weight-regular` |
| `FONT_WEIGHT_MEDIUM` | `500` | `--font-weight-medium` |
| `FONT_WEIGHT_SEMIBOLD` | `600` | `--font-weight-semibold` |
| `FONT_WEIGHT_BOLD` | `700` | `--font-weight-bold` |
| `FONT_SIZE_TITLE` | `32` | `--font-size-title` |
| `FONT_SIZE_VALUE` | `34` | `--font-size-value` |
| `FONT_SIZE_SECTION` | `24` | `--font-size-section` |
| `FONT_SIZE_CARD_TITLE` | `18` | `--font-size-card-title` |
| `FONT_SIZE_TEXT` | `16` | `--font-size-text` |
| `FONT_SIZE_CAPTION` | `14` | `--font-size-caption` |
| `LINE_HEIGHT_TIGHT` | `1.2` | `--line-height-tight` |
| `LINE_HEIGHT_BASE` | `1.4` | `--line-height-base` |
| `LETTER_SPACING_NORMAL` | `0` | `--letter-spacing-normal` |
| `LETTER_SPACING_WIDE` | `'0.2px'` | `--letter-spacing-wide` |

---

## 5. Radius

Arquivo: `src/constants/radius.ts`

| Constante | Valor (px) | Token CSS | Uso |
|---|---|---|---|
| `RADIUS_XS` | `4` | `--radius-xs` | (Reservado) |
| `RADIUS_SM` | `8` | `--radius-sm` | (Reservado) |
| `RADIUS_MD` | `12` | `--radius-md` | Campos de texto (input) |
| `RADIUS_LG` | `16` | `--radius-lg` | Botões |
| `RADIUS_XL` | `20` | `--radius-xl` | Cards |
| `RADIUS_PILL` | `9999` | `--radius-pill` | Badges, tags (exceção: pill) |

---

## 6. Sombras

Arquivo: `src/constants/shadow.ts`

| Constante | Valor | Token CSS |
|---|---|---|
| `SHADOW_NONE` | `'none'` | `--shadow-none` |
| `SHADOW_CARD` | `'0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.02)'` | `--shadow-card` |
| `SHADOW_RAISED` | `'0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)'` | `--shadow-raised` |
| `SHADOW_MODAL` | `'0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)'` | `--shadow-modal` |
| `SHADOW_FOCUS` | `'0 0 0 3px rgba(0, 186, 185, 0.25)'` | `--shadow-focus` (teal `#00BAB9` a 25%) |

---

## 7. Animação

Arquivo: `src/constants/animation.ts`

| Constante | Valor (ms) | Token CSS |
|---|---|---|
| `DURATION_INSTANT` | `0` | `--duration-instant` |
| `DURATION_FAST` | `150` | `--duration-fast` |
| `DURATION_BASE` | `200` | `--duration-base` |
| `DURATION_SLOW` | `300` | `--duration-slow` |
| `DURATION_SKELETON` | `1200` | `--duration-skeleton` |
| `DURATION_SPINNER` | `800` | (sem token, valor próprio do spinner) |
| `DURATION_TOAST_VISIBLE` | `3000` | Duração visível do toast (ms) |

Easings:

| Constante | Valor | Token CSS |
|---|---|---|
| `EASING_STANDARD` | `'cubic-bezier(0.4, 0, 0.2, 1)'` | `--easing-standard` |
| `EASING_ENTER` | `'cubic-bezier(0, 0, 0.2, 1)'` | `--easing-enter` |
| `EASING_EXIT` | `'cubic-bezier(0.4, 0, 1, 1)'` | `--easing-exit` |

---

## 8. Opacidade

Arquivo: `src/constants/opacity.ts` (ou dentro de `animation.ts`)

| Constante | Valor | Token CSS |
|---|---|---|
| `OPACITY_DISABLED` | `0.5` | `--opacity-disabled` |
| `OPACITY_OVERLAY` | `0.5` | `--opacity-overlay` |
| `OPACITY_HOVER` | `1.0` | `--opacity-hover` |
| `OPACITY_PRESSED` | `0.85` | `--opacity-pressed` |

---

## 9. Z-Index

Arquivo: `src/constants/zindex.ts`

| Constante | Valor | Token CSS |
|---|---|---|
| `Z_BASE` | `0` | `--z-base` |
| `Z_STICKY` | `100` | `--z-sticky` |
| `Z_HEADER` | `200` | `--z-header` |
| `Z_BOTTOM_NAV` | `200` | `--z-bottom-nav` |
| `Z_DROPDOWN` | `300` | `--z-dropdown` |
| `Z_TOAST` | `400` | `--z-toast` |
| `Z_MODAL_BACKDROP` | `500` | `--z-modal-backdrop` |
| `Z_MODAL` | `600` | `--z-modal` |
| `Z_TOOLTIP` | `700` | `--z-tooltip` |

---

## 10. Breakpoints

Arquivo: `src/constants/breakpoints.ts`

| Constante | Valor (px) | Token CSS |
|---|---|---|
| `BREAKPOINT_XS` | `320` | `--breakpoint-xs` |
| `BREAKPOINT_SM` | `390` | `--breakpoint-sm` |
| `BREAKPOINT_MD` | `480` | `--breakpoint-md` |
| `BREAKPOINT_LG` | `768` | `--breakpoint-lg` |
| `BREAKPOINT_XL` | `1024` | `--breakpoint-xl` |
| `BREAKPOINT_2XL` | `1280` | `--breakpoint-2xl` |
| `BREAKPOINT_3XL` | `1440` | `--breakpoint-3xl` |
| `BREAKPOINT_4XL` | `1920` | `--breakpoint-4xl` |

---

## 11. Cache

Arquivo: `src/constants/cache.ts`

| Constante | Valor | Descrição |
|---|---|---|
| `CACHE_TTL_LIST` | `60` | TTL (s) de listagens |
| `CACHE_TTL_DETAIL` | `300` | TTL (s) de detalhes |
| `CACHE_TTL_MAX` | `600` | TTL (s) máximo permitido |
| `CACHE_MAX_KEYS` | `100` | Quantidade máxima de chaves no cache LRU |

---

## 12. Rotas

Arquivo: `src/constants/routes.ts`

```ts
export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  MENSALIDADES: '/mensalidades',
  ASSOCIADOS: '/associados',
  CONFIGURACOES: '/configuracoes',
  NOT_FOUND: '*',
  OFFLINE: '/offline',
} as const;
```

Tipos derivados:

```ts
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
```

Nomes de abas (usados em `BottomNav`):

```ts
export const NAV_ITEMS = [
  { key: 'home', label: 'Início', path: ROUTES.HOME, icon: 'Home' },
  { key: 'mensalidades', label: 'Mensalidades', path: ROUTES.MENSALIDADES, icon: 'Wallet' },
  { key: 'associados', label: 'Associados', path: ROUTES.ASSOCIADOS, icon: 'Users' },
  { key: 'configuracoes', label: 'Configurações', path: ROUTES.CONFIGURACOES, icon: 'Settings' },
] as const;
```

---

## 13. Permissões e Roles

Arquivo: `src/constants/permissions.ts`

### 13.1 Roles

```ts
export const ROLES = {
  ADMIN: 'admin',
  TESOUREIRO: 'tesoureiro',
  DIRETOR: 'diretor',
  VISUALIZADOR: 'visualizador',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
```

### 13.2 Permissões

```ts
export const PERMISSIONS = {
  ASSOCIADOS_READ: 'associados.read',
  ASSOCIADOS_WRITE: 'associados.write',
  ASSOCIADOS_DELETE: 'associados.delete',
  MENSALIDADES_READ: 'mensalidades.read',
  MENSALIDADES_WRITE: 'mensalidades.write',
  MENSALIDADES_DELETE: 'mensalidades.delete',
  IMPORTACAO_EXECUTAR: 'importacao.executar',
  USUARIOS_MANAGE: 'usuarios.manage',
  RELATORIOS_VIEW: 'relatorios.view',
  CONFIGURACOES_MANAGE: 'configuracoes.manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
```

Detalhamento da matriz em `PERMISSIONS.md`.

---

## 14. Cores (nomes lógicos)

Arquivo: `src/constants/colors.ts`

Define os **nomes lógicos** das cores. Os valores em si vivem em `tokens.css`.

```ts
export const COLOR_TOKENS = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  background: 'var(--color-background)',
  card: 'var(--color-card)',
  border: 'var(--color-border)',
  overlay: 'var(--color-overlay)',
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textOnPrimary: 'var(--color-text-on-primary)',
  textOnSecondary: 'var(--color-text-on-secondary)',
  textOnAccent: 'var(--color-text-on-accent)',
  textDisabled: 'var(--color-text-disabled)',
  headerGradientStart: 'var(--color-header-gradient-start)',
  headerGradientEnd: 'var(--color-header-gradient-end)',
  categoryBlue: 'var(--color-category-blue)',
  categoryGreen: 'var(--color-category-green)',
  categoryRed: 'var(--color-category-red)',
  categoryYellow: 'var(--color-category-yellow)',
} as const;
```

**Cores oficiais (referência):**

| Token | Valor | Notas |
|---|---|---|
| `--color-primary` | `#00BAB9` | Teal oficial |
| `--color-accent` | `#FFA600` | Accent oficial |
| `--color-text-on-primary` | `#1A1D22` | Contraste AA sobre `#00BAB9` |
| `--color-text-on-accent` | `#1A1D22` | Contraste AA sobre `#FFA600` |
| `--color-category-blue` | `#00BAB9` | Categoria semântica (teal) |
| `--color-category-yellow` | `#FFA600` | Categoria semântica (accent) |
| `--color-category-green` | `#1E8E3E` | Mantido |
| `--color-category-red` | `#C9302C` | Mantido |

Categorias permitidas em `Card`:

```ts
export const CARD_CATEGORIES = ['blue', 'green', 'red', 'yellow'] as const;
export type CardCategory = (typeof CARD_CATEGORIES)[number];
```

---

## 15. Ícones

Arquivo: `src/constants/icons.ts`

```ts
export const ICON_NAMES = [
  'Home',
  'Wallet',
  'Users',
  'Settings',
  'LogOut',
  'Eye',
  'EyeOff',
  'Check',
  'X',
  'AlertTriangle',
  'Info',
  'Plus',
  'Search',
  'Filter',
  'Download',
  'RefreshCw',
  'ChevronRight',
  'ChevronDown',
] as const;

export type IconName = (typeof ICON_NAMES)[number];
```

Adicionar novos ícones **somente aqui**, em `DESIGN_SYSTEM.md` (seção 9.4) e em `UI_SPECIFICATION.md` quando aplicável.

---

## 16. Tipos de Componente (variantes)

Arquivo: `src/constants/componentVariants.ts`

```ts
export const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const TOAST_VARIANTS = ['success', 'error', 'warning', 'info'] as const;
export type ToastVariant = (typeof TOAST_VARIANTS)[number];
```

---

## 17. Storage Keys

Arquivo: `src/constants/storage.ts`

| Constante | Valor | Uso |
|---|---|---|
| `STORAGE_KEY_SUPABASE_AUTH` | (gerenciado pelo Supabase) | Reservado ao Supabase Auth |
| `STORAGE_KEY_THEME` | (reservado) | Reservado para tema futuro |

> Nenhuma outra chave de storage é permitida sem registro aqui.

---

## 18. Supabase

Arquivo: `src/constants/supabase.ts`

| Constante | Valor | Descrição |
|---|---|---|
| `SUPABASE_TABLE_ASSOCIADOS` | `'associados'` | Nome da tabela |
| `SUPABASE_TABLE_MENSALIDADES` | `'mensalidades'` | Nome da tabela |
| `SUPABASE_TABLE_IMPORTACOES` | `'importacoes'` | Nome da tabela |
| `SUPABASE_TABLE_PROFILES` | `'profiles'` | Nome da tabela |

Nomes de colunas e constraints vivem em `DATABASE_SPECIFICATION.md`.

---

## 19. Erros (códigos)

Arquivo: `src/constants/errors.ts`

| Constante | Valor | Descrição |
|---|---|---|
| `ERROR_CODE_AUTH_INVALID_CREDENTIALS` | `'AUTH_INVALID_CREDENTIALS'` | E-mail ou senha inválidos |
| `ERROR_CODE_AUTH_SESSION_EXPIRED` | `'AUTH_SESSION_EXPIRED'` | Sessão expirada |
| `ERROR_CODE_NETWORK_OFFLINE` | `'NETWORK_OFFLINE'` | Sem conexão |
| `ERROR_CODE_PERMISSION_DENIED` | `'PERMISSION_DENIED'` | RLS bloqueou |
| `ERROR_CODE_VALIDATION_FAILED` | `'VALIDATION_FAILED'` | Dados inválidos |
| `ERROR_CODE_NOT_FOUND` | `'NOT_FOUND'` | Registro inexistente |
| `ERROR_CODE_CONFLICT` | `'CONFLICT'` | Conflito de chave única |
| `ERROR_CODE_INTERNAL` | `'INTERNAL'` | Erro inesperado |

---

## 20. Tempo (delays, debounce, throttle)

Arquivo: `src/constants/time.ts`

| Constante | Valor (ms) | Uso |
|---|---|---|
| `DEBOUNCE_SEARCH` | `300` | Debounce padrão de busca |
| `DEBOUNCE_INPUT` | `200` | Debounce de input genérico |
| `THROTTLE_SCROLL` | `100` | Throttle de eventos de scroll |
| `RETRY_BACKOFF_BASE` | `1000` | Backoff base de retentativa (não usado nesta fase) |

---

## 21. Importação de Planilha

Arquivo: `src/constants/importacao.ts`

| Constante | Valor | Descrição |
|---|---|---|
| `IMPORT_MAX_ERRORS_REPORTED` | `50` | Máximo de erros reportados por linha |
| `IMPORT_CHUNK_SIZE` | `500` | Tamanho do lote de upsert |

---

## 22. PWA

Arquivo: `src/constants/pwa.ts`

| Constante | Valor | Descrição |
|---|---|---|
| `PWA_NAME` | `'ABSB — Associação dos Bugueiros de São Bento'` | Nome completo |
| `PWA_SHORT_NAME` | `'ABSB'` | Nome curto |
| `PWA_THEME_COLOR` | `'var(--color-primary)'` | Cor do tema |
| `PWA_BACKGROUND_COLOR` | `'var(--color-background)'` | Cor de fundo da splash |
| `PWA_ORIENTATION` | `'portrait'` | Orientação |
| `PWA_DISPLAY` | `'standalone'` | Modo de exibição |

---

## 23. Convenções de Exportação

- `src/constants/index.ts` reexporta **tudo** de cada arquivo de constante.
- Importações em código sempre via:

```ts
import { SPACE_SECTION, CARD_CATEGORIES, ROUTES } from '@/constants';
```

- Nunca importar de um arquivo de constante individual fora de `constants/`.

---

## 24. Regras de Manutenção

1. Toda nova constante precisa ser adicionada ao arquivo apropriado **e** a este documento no mesmo PR.
2. Nenhuma constante pode ser removida sem justificativa registrada.
3. Nenhuma constante pode ter valor alterado sem aprovação (mudança de valor é tratada como mudança de design).
4. Constantes TypeScript e tokens CSS devem estar em sincronia. Divergência é defeito.
