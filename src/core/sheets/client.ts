import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { logger } from '@/core/logger/logger';

const TIMEOUT_MS = 30_000;
const MAX_BYTES = 10_000_000; // 10MB

export class SheetsClient {
  /**
   * Converte uma URL pública de Google Sheets em URL de exportação CSV.
   *
   * Aceita formatos:
   * - https://docs.google.com/spreadsheets/d/<id>/edit?usp=sharing
   * - https://docs.google.com/spreadsheets/d/<id>/edit#gid=<gid>
   * - https://docs.google.com/spreadsheets/d/<id>/export?format=csv&gid=<gid>
   * - https://docs.google.com/spreadsheets/d/<id>/pub?output=csv
   *
   * Retorna a URL no formato `/export?format=csv&gid=<gid>`.
   */
  toCsvUrl(url: string): string {
    const spreadsheetMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!spreadsheetMatch) {
      throw new AppError({
        code: ERROR_CODES.VALIDATION_FAILED,
        userMessage: 'URL do Google Sheets inválida.',
        technicalMessage: `URL não contém ID de planilha: ${url}`,
      });
    }

    const spreadsheetId = spreadsheetMatch[1];

    const gidMatch = url.match(/[#&?]gid=(\d+)/);
    const gid = gidMatch?.[1] ?? '0';

    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
  }

  /**
   * Faz fetch do conteúdo CSV de uma planilha Google Sheets.
   */
  async fetchCsv(url: string): Promise<string> {
    const csvUrl = this.toCsvUrl(url);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(csvUrl, {
        method: 'GET',
        signal: controller.signal,
        credentials: 'omit',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new AppError({
          code: ERROR_CODES.NOT_FOUND,
          userMessage: 'Não foi possível acessar a planilha. Verifique se ela é pública.',
          technicalMessage: `HTTP ${response.status} ao buscar ${csvUrl}`,
        });
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength && Number(contentLength) > MAX_BYTES) {
        throw new AppError({
          code: ERROR_CODES.VALIDATION_FAILED,
          userMessage: 'A planilha é muito grande (máximo 10MB).',
          technicalMessage: `Content-Length ${contentLength} excede ${MAX_BYTES}`,
        });
      }

      const text = await response.text();
      logger.info('CSV obtido da planilha', { length: text.length });
      return text;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new AppError({
          code: ERROR_CODES.NETWORK_OFFLINE,
          userMessage: 'Tempo esgotado ao buscar a planilha.',
          technicalMessage: `Timeout após ${TIMEOUT_MS}ms`,
        });
      }
      throw new AppError({
        code: ERROR_CODES.NETWORK_OFFLINE,
        originalError: error,
      });
    } finally {
      window.clearTimeout(timeoutId);
    }
  }
}

export const sheetsClient = new SheetsClient();
