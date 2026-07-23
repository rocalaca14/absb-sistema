import { supabase } from '@/core/supabase/client';
import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { logger } from '@/core/logger/logger';

import { toAssociado } from './mappers';
import type {
  Associado,
  AssociadoCreate,
  AssociadoUpdate,
  ListAssociadosParams,
  PaginatedResult,
} from '@/types/domain.types';

function ensureClient(): NonNullable<typeof supabase> {
  if (!supabase) {
    throw new AppError({ code: ERROR_CODES.BACKEND_NOT_CONFIGURED });
  }
  return supabase;
}

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_ORDER_BY = 'nome';
const DEFAULT_ORDER_DIR = 'asc' as const;

/**
 * Service de Associados.
 *
 * Operações neutras, sem regras de negócio:
 * - list, get, create, update, deactivate (soft delete via ativo=false)
 * - delete (hard delete) requer aprovação de regras (INFO-09)
 *
 * @see FASE_2_PLAN.md
 */
export const associadosService = {
  async list(
    params: ListAssociadosParams = {},
  ): Promise<PaginatedResult<Associado>> {
    const client = ensureClient();
    const {
      search,
      ativo,
      categoria,
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      orderBy = DEFAULT_ORDER_BY,
      orderDir = DEFAULT_ORDER_DIR,
    } = params;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = client
      .from('associados')
      .select('*', { count: 'exact' })
      .order(orderBy, { ascending: orderDir === 'asc' })
      .range(from, to);

    if (typeof ativo === 'boolean') {
      query = query.eq('ativo', ativo);
    }
    if (categoria) {
      query = query.eq('categoria', categoria);
    }
    if (search) {
      const term = `%${search}%`;
      query = query.or(
        `nome.ilike.${term},cpf.ilike.${term},veiculo_placa.ilike.${term}`,
      );
    }

    const { data, error, count } = await query;

    if (error) {
      logger.warn('Erro em associados.list', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    return {
      items: (data ?? []).map(toAssociado),
      total: count ?? 0,
      page,
      pageSize,
    };
  },

  async get(id: string): Promise<Associado | null> {
    const client = ensureClient();
    const { data, error } = await client
      .from('associados')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      logger.warn('Erro em associados.get', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    return data ? toAssociado(data) : null;
  },

  async create(input: AssociadoCreate): Promise<Associado> {
    const client = ensureClient();
    const {
      data: { user },
    } = await client.auth.getUser();
    const createdBy = user?.id ?? null;

    const insertPayload = {
      nome: input.nome,
      cpf: input.cpf ?? null,
      rg: input.rg ?? null,
      telefone: input.telefone ?? null,
      email: input.email ?? null,
      endereco: input.endereco ?? null,
      numero: input.numero ?? null,
      complemento: input.complemento ?? null,
      bairro: input.bairro ?? null,
      cidade: input.cidade ?? null,
      uf: input.uf ?? null,
      cep: input.cep ?? null,
      veiculo_marca: input.veiculoMarca ?? null,
      veiculo_modelo: input.veiculoModelo ?? null,
      veiculo_ano: input.veiculoAno ?? null,
      veiculo_placa: input.veiculoPlaca ?? null,
      veiculo_cor: input.veiculoCor ?? null,
      categoria: input.categoria ?? null,
      data_nascimento: input.dataNascimento ?? null,
      data_filiacao: input.dataFiliacao ?? null,
      observacoes: input.observacoes ?? null,
      ativo: input.ativo ?? true,
      origem: input.origem ?? 'manual',
      created_by: createdBy,
      updated_by: createdBy,
    };

    const { data, error } = await client
      .from('associados')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      logger.warn('Erro em associados.create', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    return toAssociado(data);
  },

  async update(id: string, input: AssociadoUpdate): Promise<Associado> {
    const client = ensureClient();
    const {
      data: { user },
    } = await client.auth.getUser();
    const updatedBy = user?.id ?? null;

    const updatePayload: Record<string, unknown> = {};
    if (input.nome !== undefined) updatePayload.nome = input.nome;
    if (input.cpf !== undefined) updatePayload.cpf = input.cpf;
    if (input.rg !== undefined) updatePayload.rg = input.rg;
    if (input.telefone !== undefined) updatePayload.telefone = input.telefone;
    if (input.email !== undefined) updatePayload.email = input.email;
    if (input.endereco !== undefined) updatePayload.endereco = input.endereco;
    if (input.numero !== undefined) updatePayload.numero = input.numero;
    if (input.complemento !== undefined) updatePayload.complemento = input.complemento;
    if (input.bairro !== undefined) updatePayload.bairro = input.bairro;
    if (input.cidade !== undefined) updatePayload.cidade = input.cidade;
    if (input.uf !== undefined) updatePayload.uf = input.uf;
    if (input.cep !== undefined) updatePayload.cep = input.cep;
    if (input.veiculoMarca !== undefined) updatePayload.veiculo_marca = input.veiculoMarca;
    if (input.veiculoModelo !== undefined) updatePayload.veiculo_modelo = input.veiculoModelo;
    if (input.veiculoAno !== undefined) updatePayload.veiculo_ano = input.veiculoAno;
    if (input.veiculoPlaca !== undefined) updatePayload.veiculo_placa = input.veiculoPlaca;
    if (input.veiculoCor !== undefined) updatePayload.veiculo_cor = input.veiculoCor;
    if (input.categoria !== undefined) updatePayload.categoria = input.categoria;
    if (input.dataNascimento !== undefined) updatePayload.data_nascimento = input.dataNascimento;
    if (input.dataFiliacao !== undefined) updatePayload.data_filiacao = input.dataFiliacao;
    if (input.observacoes !== undefined) updatePayload.observacoes = input.observacoes;
    if (input.ativo !== undefined) updatePayload.ativo = input.ativo;

    updatePayload.updated_by = updatedBy;

    const { data, error } = await client
      .from('associados')
      .update(updatePayload as never)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      logger.warn('Erro em associados.update', { error });
      if (error.code === 'PGRST116') {
        throw new AppError({ code: ERROR_CODES.NOT_FOUND, originalError: error });
      }
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    return toAssociado(data);
  },

  /**
   * Desativa um associado (soft delete).
   *
   * Operação neutra: altera `ativo = false`. Não remove dados.
   */
  async deactivate(id: string): Promise<Associado> {
    return this.update(id, { ativo: false });
  },

  /**
   * Reativa um associado.
   */
  async activate(id: string): Promise<Associado> {
    return this.update(id, { ativo: true });
  },

  /**
   * Exclusão permanente.
   *
   * BLOQUEADO: depende de decisão sobre soft vs hard delete (pendência INFO-09).
   * Implementar apenas após aprovação do cliente.
   */
  async delete(_id: string): Promise<void> {
    throw new AppError({
      code: ERROR_CODES.INTERNAL,
      userMessage: 'Exclusão permanente ainda não habilitada.',
      technicalMessage:
        'Exclusão permanente bloqueada até decisão sobre soft vs hard delete (pendência INFO-09 do FASE_2_PLAN.md).',
    });
  },
};
