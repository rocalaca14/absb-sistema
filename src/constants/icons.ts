/**
 * Catálogo de ícones oficiais.
 * Adicionar novos ícones APENAS aqui e em DESIGN_SYSTEM.md seção 9.4.
 */

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
