export const ERROR_CODES = {
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  AUTH_ACCOUNT_DISABLED: 'AUTH_ACCOUNT_DISABLED',
  NETWORK_OFFLINE: 'NETWORK_OFFLINE',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL: 'INTERNAL',
  BACKEND_NOT_CONFIGURED: 'BACKEND_NOT_CONFIGURED',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

const USER_MESSAGES: Record<ErrorCode, string> = {
  AUTH_INVALID_CREDENTIALS: 'E-mail ou senha inválidos.',
  AUTH_SESSION_EXPIRED: 'Sua sessão expirou. Faça login novamente.',
  AUTH_ACCOUNT_DISABLED: 'Conta desabilitada. Contate o administrador.',
  NETWORK_OFFLINE: 'Sem conexão. Verifique sua internet.',
  PERMISSION_DENIED: 'Você não tem permissão para esta ação.',
  VALIDATION_FAILED: 'Dados inválidos.',
  NOT_FOUND: 'Registro não encontrado.',
  CONFLICT: 'Conflito de dados.',
  INTERNAL: 'Erro interno. Tente novamente.',
  BACKEND_NOT_CONFIGURED:
    'Backend não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.',
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly userMessage: string;
  readonly technicalMessage: string;
  readonly originalError?: unknown;

  constructor(opts: {
    code: ErrorCode;
    originalError?: unknown;
    userMessage?: string;
    technicalMessage?: string;
  }) {
    const technical = opts.technicalMessage ?? USER_MESSAGES[opts.code];
    super(technical);
    this.name = 'AppError';
    this.code = opts.code;
    this.userMessage = opts.userMessage ?? USER_MESSAGES[opts.code];
    this.technicalMessage = technical;
    if (opts.originalError !== undefined) {
      this.originalError = opts.originalError;
    }
  }

  static isAppError(value: unknown): value is AppError {
    return value instanceof AppError;
  }
}
