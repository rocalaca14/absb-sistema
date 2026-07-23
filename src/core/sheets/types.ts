/**
 * Tipos de domínio da planilha de associados.
 */

export interface AssociadoRow {
  id?: string;
  nome: string;
  cpf?: string | null;
  rg?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  cep?: string | null;
  veiculo_marca?: string | null;
  veiculo_modelo?: string | null;
  veiculo_ano?: number | null;
  veiculo_placa?: string | null;
  veiculo_cor?: string | null;
  categoria?: string | null;
  data_nascimento?: string | null;
  data_filiacao?: string | null;
  observacoes?: string | null;
  ativo?: boolean;
  origem?: string;
}

export interface ImportError {
  linha: number;
  coluna?: string;
  valor?: unknown;
  codigo: string;
  mensagem: string;
}

export interface ImportPreview {
  total: number;
  validas: number;
  invalidas: number;
  duplicatas: number;
  primeirasLinhas: ReadonlyArray<{
    linha: number;
    preview: Partial<AssociadoRow>;
    status: 'valido' | 'invalido' | 'aviso';
    erros: ReadonlyArray<ImportError>;
  }>;
}

export interface ImportResult {
  total: number;
  inseridos: number;
  atualizados: number;
  erros: number;
  relatorioErros: ReadonlyArray<ImportError>;
  duracaoMs: number;
}
