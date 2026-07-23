type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogArg = string | number | boolean | object | Error | null | undefined;

const REDACT_PATTERNS = [/password/i, /token/i, /secret/i, /authorization/i];

const isProduction = !import.meta.env.DEV;

function sanitizeArg(arg: LogArg): LogArg {
  if (arg instanceof Error) {
    return { name: arg.name, message: arg.message };
  }
  if (typeof arg === 'object' && arg !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(arg as Record<string, unknown>)) {
      if (REDACT_PATTERNS.some((pattern) => pattern.test(key)) && typeof value === 'string') {
        sanitized[key] = '[REDACTED]';
      } else if (value instanceof Error) {
        sanitized[key] = { name: value.name, message: value.message };
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
  return arg;
}

function emit(level: LogLevel, args: LogArg[]): void {
  if (isProduction && (level === 'debug' || level === 'info')) return;
  const sanitized = args.map(sanitizeArg);
  const prefix = '[ABSB]';
  // eslint-disable-next-line no-console
  switch (level) {
    case 'debug':
      // eslint-disable-next-line no-console
      console.debug(prefix, ...sanitized);
      return;
    case 'info':
      // eslint-disable-next-line no-console
      console.info(prefix, ...sanitized);
      return;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(prefix, ...sanitized);
      return;
    case 'error':
      // eslint-disable-next-line no-console
      console.error(prefix, ...sanitized);
      return;
  }
}

export const logger = {
  debug: (...args: LogArg[]) => emit('debug', args),
  info: (...args: LogArg[]) => emit('info', args),
  warn: (...args: LogArg[]) => emit('warn', args),
  error: (...args: LogArg[]) => emit('error', args),
};
