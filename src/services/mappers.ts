/**
 * Helpers de mapeamento entre linhas do banco (snake_case) e tipos de domínio
 * (camelCase). Centralizado para evitar duplicação entre services.
 */

import type { Database } from '@/core/supabase/types';
import type {
  Associado,
  Configuracao,
  FormaPagamento,
  Mensalidade,
  MensalidadeWithAssociado,
  Pagamento,
} from '@/types/domain.types';

type DbAssociado = Database['public']['Tables']['associados']['Row'];
type DbMensalidade = Database['public']['Tables']['mensalidades']['Row'];
type DbPagamento = Database['public']['Tables']['pagamentos']['Row'];
type DbConfiguracao = Database['public']['Tables']['configuracoes']['Row'];

interface DbMensalidadeWithAssociado extends DbMensalidade {
  associado: Pick<DbAssociado, 'id' | 'nome' | 'cpf' | 'categoria'> | null;
}

export function toAssociado(row: DbAssociado): Associado {
  return {
    id: row.id,
    nome: row.nome,
    cpf: row.cpf,
    rg: row.rg,
    telefone: row.telefone,
    email: row.email,
    endereco: row.endereco,
    numero: row.numero,
    complemento: row.complemento,
    bairro: row.bairro,
    cidade: row.cidade,
    uf: row.uf,
    cep: row.cep,
    veiculoMarca: row.veiculo_marca,
    veiculoModelo: row.veiculo_modelo,
    veiculoAno: row.veiculo_ano,
    veiculoPlaca: row.veiculo_placa,
    veiculoCor: row.veiculo_cor,
    categoria: row.categoria,
    dataNascimento: row.data_nascimento,
    dataFiliacao: row.data_filiacao,
    observacoes: row.observacoes,
    ativo: row.ativo,
    origem: row.origem,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toMensalidade(row: DbMensalidade): Mensalidade {
  return {
    id: row.id,
    associadoId: row.associado_id,
    referencia: row.referencia,
    valor: row.valor,
    desconto: row.desconto,
    acrescimo: row.acrescimo,
    valorFinal: row.valor_final,
    vencimentoEm: row.vencimento_em,
    pago: row.pago,
    pagoEm: row.pago_em,
    observacoes: row.observacoes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toMensalidadeWithAssociado(
  row: DbMensalidadeWithAssociado,
): MensalidadeWithAssociado {
  return {
    ...toMensalidade(row),
    associado: row.associado
      ? {
          id: row.associado.id,
          nome: row.associado.nome,
          cpf: row.associado.cpf,
          categoria: row.associado.categoria,
        }
      : null,
  };
}

export function toPagamento(row: DbPagamento): Pagamento {
  return {
    id: row.id,
    mensalidadeId: row.mensalidade_id,
    valorPago: row.valor_pago,
    pagoEm: row.pago_em,
    formaPagamento: row.forma_pagamento as FormaPagamento,
    comprovanteUrl: row.comprovante_url,
    observacoes: row.observacoes,
    createdAt: row.created_at,
  };
}

export function toConfiguracao(row: DbConfiguracao): Configuracao {
  return {
    id: row.id,
    chave: row.chave,
    valor: row.valor,
    descricao: row.descricao,
    updatedAt: row.updated_at,
  };
}
