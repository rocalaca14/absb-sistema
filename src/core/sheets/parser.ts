import Papa from 'papaparse';

import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { logger } from '@/core/logger/logger';

export interface ParsedRow {
  rowIndex: number; // 1-indexed, considerando apenas linhas com dados
  raw: Record<string, string>;
}

export interface ParseResult {
  headers: ReadonlyArray<string>;
  rows: ReadonlyArray<ParsedRow>;
}

/**
 * Converte uma string CSV em linhas estruturadas.
 *
 * - Detecta cabeçalho automaticamente.
 * - Ignora linhas completamente vazias.
 * - Mantém todas as colunas como string (normalização acontece depois).
 * - 1-indexed: a primeira linha de dados é rowIndex = 1.
 */
export function parseCsv(csv: string): ParseResult {
  const result = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
    transform: (value) => (typeof value === 'string' ? value.trim() : value),
  });

  if (result.errors.length > 0) {
    const fatal = result.errors.find((e) => e.type === 'Delimiter' || e.type === 'Quotes');
    if (fatal) {
      logger.warn('Erros de parse CSV', { errors: result.errors });
      throw new AppError({
        code: ERROR_CODES.VALIDATION_FAILED,
        userMessage: 'A planilha contém dados em formato inválido.',
        technicalMessage: `Erro CSV: ${fatal.message}`,
      });
    }
  }

  const headers = (result.meta.fields ?? []).map((h) => h.trim());
  const rows: ParsedRow[] = [];

  result.data.forEach((row, index) => {
    // Ignora linhas onde todos os campos são vazios
    const hasAnyValue = Object.values(row).some(
      (value) => typeof value === 'string' && value.trim().length > 0,
    );
    if (!hasAnyValue) return;

    rows.push({
      rowIndex: index + 1,
      raw: row,
    });
  });

  logger.info('CSV parseado', { headers: headers.length, rows: rows.length });
  return { headers, rows };
}
