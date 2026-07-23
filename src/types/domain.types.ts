/**
 * Tipos de domínio da aplicação.
 *
 * Representam as entidades de negócio com nomenclatura camelCase,
 * enquanto o banco (Postgres) usa snake_case. O mapping é feito nos
 * services via funções `toX()`.
 */

import type { FormaPagamento, UserRole } from '@/core/supabase/types';

export type { UserRole, FormaPagamento };

/**
 * Associado — cadastro de membro da associação.
 */
export interface Associado {
  id: string;
  nome: string;
  cpf: string | null;
  rg: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  cep: string | null;
  veiculoMarca: string | null;
  veiculoModelo: string | null;
  veiculoAno: number | null;
  veiculoPlaca: string | null;
  veiculoCor: string | null;
  categoria: string | null;
  dataNascimento: string | null;
  dataFiliacao: string | null;
  observacoes: string | null;
  ativo: boolean;
  origem: string;
  createdAt: string;
  updatedAt: string;
}

export type AssociadoCreate = Omit<Associado, 'id' | 'createdAt' | 'updatedAt' | 'origem'> & {
  origem?: string;
};

export type AssociadoUpdate = Partial<Omit<AssociadoCreate, 'id'>>;

/**
 * Mensalidade — cobrança mensal de um associado.
 *
 * `valorFinal` é gerado por trigger no banco (valor - desconto + acrescimo).
 */
export interface Mensalidade {
  id: string;
  associadoId: string;
  referencia: string;
  valor: number;
  desconto: number;
  acrescimo: number;
  valorFinal: number | null;
  vencimentoEm: string;
  pago: boolean;
  pagoEm: string | null;
  observacoes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MensalidadeWithAssociado extends Mensalidade {
  associado: Pick<Associado, 'id' | 'nome' | 'cpf' | 'categoria'> | null;
}

export type MensalidadeCreate = Omit<
  Mensalidade,
  'id' | 'createdAt' | 'updatedAt' | 'valorFinal' | 'pago' | 'pagoEm'
> & {
  pago?: boolean;
  pagoEm?: string | null;
};

export type MensalidadeUpdate = Partial<
  Omit<MensalidadeCreate, 'associadoId' | 'referencia'>
>;

/**
 * Pagamento — registro de pagamento de uma mensalidade.
 */
export interface Pagamento {
  id: string;
  mensalidadeId: string;
  valorPago: number;
  pagoEm: string;
  formaPagamento: FormaPagamento;
  comprovanteUrl: string | null;
  observacoes: string | null;
  createdAt: string;
}

export type PagamentoCreate = Omit<Pagamento, 'id' | 'createdAt' | 'pagoEm'> & {
  pagoEm?: string;
};

/**
 * Configuração — chave/valor JSON.
 */
export interface Configuracao {
  id: string;
  chave: string;
  valor: unknown;
  descricao: string | null;
  updatedAt: string;
}

export type ConfiguracaoUpdate = {
  valor: unknown;
  descricao?: string | null;
};

/**
 * Resumo do dashboard.
 *
 * Nota: regras de inadimplência e agregações específicas dependem de
 * definições do cliente (pendência INFO-05). Os valores atuais são
 * placeholders neutros.
 */
export interface DashboardResumo {
  totalAssociadosAtivos: number;
  totalMensalidadesEmAberto: number;
  valorEmAberto: number;
  totalPagasNoMes: number;
  valorPagoNoMes: number;
  totalVencidas: number;
}

/**
 * Resultado paginado genérico.
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Parâmetros de listagem comuns.
 */
export interface ListParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

export interface ListAssociadosParams extends ListParams {
  search?: string;
  ativo?: boolean;
  categoria?: string;
}

export interface ListMensalidadesParams extends ListParams {
  referencia?: string;
  pago?: boolean;
  associadoId?: string;
  vencidasAte?: string;
}
