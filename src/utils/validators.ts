import { z } from 'zod';

const UF_ENUM = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

const FORMA_PAGAMENTO_ENUM = [
  'dinheiro', 'pix', 'transferencia', 'cartao', 'boleto', 'outro',
] as const;

const emptyToNull = (val: unknown) => (val === '' ? null : val);
const emptyToUndefined = (val: unknown) => (val === '' ? undefined : val);

const optionalCpf = z.preprocess(
  emptyToNull,
  z
    .string()
    .regex(/^\d{11}$/, 'CPF deve ter 11 dígitos')
    .nullable()
    .optional(),
);

const optionalCep = z.preprocess(
  emptyToNull,
  z
    .string()
    .regex(/^\d{8}$/, 'CEP deve ter 8 dígitos')
    .nullable()
    .optional(),
);

const optionalPlaca = z.preprocess(
  emptyToNull,
  z
    .string()
    .regex(/^[A-Z0-9]{7}$/, 'Placa inválida')
    .nullable()
    .optional(),
);

const optionalEmail = z.preprocess(
  emptyToNull,
  z.string().email('E-mail inválido').max(200).nullable().optional(),
);

const optionalUf = z.preprocess(
  emptyToNull,
  z.enum(UF_ENUM).nullable().optional(),
);

const optionalShortString = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

const optionalInteger = z.preprocess(
  emptyToUndefined,
  z
    .number({ invalid_type_error: 'Ano inválido' })
    .int()
    .min(1900, 'Ano mínimo 1900')
    .max(2100, 'Ano máximo 2100')
    .optional(),
);

const optionalIsoDate = z.preprocess(
  emptyToUndefined,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida').optional(),
);

/**
 * Schema Zod para criação de associado.
 *
 * Aceita strings vazias como null (UX-friendly em formulários HTML).
 * Validações de regras de negócio (ex: campos obrigatórios além de nome)
 * dependem de INFO-10 e devem ser adicionadas após validação.
 */
export const associadoCreateSchema = z.object({
  nome: z
    .string({ required_error: 'Informe o nome.' })
    .trim()
    .min(1, 'Nome obrigatório')
    .max(200, 'Nome muito longo (máx. 200)'),

  cpf: optionalCpf,
  rg: optionalShortString(20),
  telefone: optionalShortString(20),
  email: optionalEmail,
  endereco: optionalShortString(200),
  numero: optionalShortString(20),
  complemento: optionalShortString(100),
  bairro: optionalShortString(100),
  cidade: optionalShortString(100),
  uf: optionalUf,
  cep: optionalCep,

  veiculo_marca: optionalShortString(50),
  veiculo_modelo: optionalShortString(50),
  veiculo_ano: optionalInteger,
  veiculo_placa: optionalPlaca,
  veiculo_cor: optionalShortString(30),
  categoria: optionalShortString(50),

  data_nascimento: optionalIsoDate,
  data_filiacao: optionalIsoDate,
  observacoes: optionalShortString(1000),

  ativo: z.boolean().optional().default(true),
});

export type AssociadoCreateSchema = z.infer<typeof associadoCreateSchema>;

/**
 * Schema para criação de mensalidade.
 *
 * NOTA: regras de valor mínimo, vencimento e cobrança dependem de
 * INFO-01, INFO-04. Apenas validação de formato e obrigatoriedade do
 * associado_id, referencia, valor, vencimento_em.
 */
export const mensalidadeCreateSchema = z.object({
  associado_id: z.string().uuid('ID de associado inválido'),
  referencia: z
    .string()
    .regex(/^\d{4}-\d{2}$/, 'Referência deve ser YYYY-MM'),
  valor: z
    .number({ required_error: 'Informe o valor.', invalid_type_error: 'Valor inválido' })
    .min(0, 'Valor não pode ser negativo'),
  desconto: z.number().min(0).optional().default(0),
  acrescimo: z.number().min(0).optional().default(0),
  vencimento_em: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Vencimento inválido'),
  observacoes: z.string().trim().max(500).optional(),
});

export type MensalidadeCreateSchema = z.infer<typeof mensalidadeCreateSchema>;

/**
 * Schema para registro de pagamento.
 *
 * NOTA: regras de validação mínima do valor, forma de pagamento obrigatória,
 * bloqueios por inadimplência (INFO-01, INFO-05) NÃO são aplicadas aqui.
 */
export const pagamentoCreateSchema = z.object({
  mensalidade_id: z.string().uuid('ID de mensalidade inválido'),
  valor_pago: z
    .number({ required_error: 'Informe o valor pago.' })
    .positive('Valor deve ser positivo'),
  forma_pagamento: z.enum(FORMA_PAGAMENTO_ENUM, {
    errorMap: () => ({ message: 'Forma de pagamento inválida' }),
  }),
  pago_em: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, 'Data/hora inválida')
    .optional(),
  observacoes: z.string().trim().max(500).optional(),
  comprovante_url: z.string().url('URL inválida').optional(),
});

export type PagamentoCreateSchema = z.infer<typeof pagamentoCreateSchema>;
