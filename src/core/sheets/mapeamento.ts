/**
 * Mapeamento de colunas entre planilha Google Sheets e tabela `associados`.
 *
 * Este arquivo é o **contrato técnico** entre a planilha fornecida pelo cliente
 * e o banco Supabase. A planilha real será recebida em fase futura e este
 * mapeamento será preenchido.
 *
 * @see SHEETS_FORMAT.md para o formato esperado
 */

import type { AssociadoRow } from './types';

export type PlanilhaColumn = keyof AssociadoRow | string;

export interface ColumnMapping {
  planilha: string;
  banco: keyof AssociadoRow;
  transform?: 'trim' | 'cpf' | 'telefone' | 'cep' | 'placa' | 'email' | 'dataBR' | 'uppercase' | 'numero';
}

/**
 * Mapeamento das colunas da planilha para o banco.
 *
 * Será preenchido quando a planilha real for fornecida.
 *
 * @example
 * ```ts
 * export const MAPEAMENTO_ASSOCIADOS: ReadonlyArray<ColumnMapping> = [
 *   { planilha: 'nome', banco: 'nome' },
 *   { planilha: 'cpf', banco: 'cpf', transform: 'cpf' },
 *   // ...
 * ];
 * ```
 */
export const MAPEAMENTO_ASSOCIADOS: ReadonlyArray<ColumnMapping> = [];
