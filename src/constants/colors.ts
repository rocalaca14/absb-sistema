export const CARD_CATEGORIES = ['blue', 'green', 'red', 'yellow'] as const;
export type CardCategory = (typeof CARD_CATEGORIES)[number];

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
