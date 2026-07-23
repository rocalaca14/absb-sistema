export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  MENSALIDADES: '/mensalidades',
  ASSOCIADOS: '/associados',
  CONFIGURACOES: '/configuracoes',
  RELATORIOS: '/relatorios',
  NOT_FOUND: '*',
  OFFLINE: '/offline',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
