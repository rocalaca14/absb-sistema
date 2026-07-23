export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'tesoureiro' | 'diretor' | 'visualizador';

export type FormaPagamento = 'dinheiro' | 'pix' | 'transferencia' | 'cartao' | 'boleto' | 'outro';

export type AuditOperacao = 'insert' | 'update' | 'delete';

/**
 * Tipo `Database` do Supabase.
 *
 * Reflete o schema definido em `supabase/migrations/`.
 * Será regenerado via `supabase gen types typescript --local` quando as
 * migrations forem aplicadas no projeto real.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome: string;
          role: UserRole;
          ativo: boolean;
          ultimo_acesso_em: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nome: string;
          role?: UserRole;
          ativo?: boolean;
          ultimo_acesso_em?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          role?: UserRole;
          ativo?: boolean;
          ultimo_acesso_em?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      associados: {
        Row: {
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
          veiculo_marca: string | null;
          veiculo_modelo: string | null;
          veiculo_ano: number | null;
          veiculo_placa: string | null;
          veiculo_cor: string | null;
          categoria: string | null;
          data_nascimento: string | null;
          data_filiacao: string | null;
          observacoes: string | null;
          ativo: boolean;
          origem: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
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
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: Partial<{
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
          veiculo_marca: string | null;
          veiculo_modelo: string | null;
          veiculo_ano: number | null;
          veiculo_placa: string | null;
          veiculo_cor: string | null;
          categoria: string | null;
          data_nascimento: string | null;
          data_filiacao: string | null;
          observacoes: string | null;
          ativo: boolean;
          origem: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        }>;
        Relationships: [];
      };
      mensalidades: {
        Row: {
          id: string;
          associado_id: string;
          referencia: string;
          valor: number;
          desconto: number;
          acrescimo: number;
          valor_final: number | null;
          vencimento_em: string;
          pago: boolean;
          pago_em: string | null;
          observacoes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          associado_id: string;
          referencia: string;
          valor: number;
          desconto?: number;
          acrescimo?: number;
          valor_final?: number | null;
          vencimento_em: string;
          pago?: boolean;
          pago_em?: string | null;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: Partial<{
          id: string;
          associado_id: string;
          referencia: string;
          valor: number;
          desconto: number;
          acrescimo: number;
          valor_final: number | null;
          vencimento_em: string;
          pago: boolean;
          pago_em: string | null;
          observacoes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        }>;
        Relationships: [];
      };
      pagamentos: {
        Row: {
          id: string;
          mensalidade_id: string;
          valor_pago: number;
          pago_em: string;
          forma_pagamento: FormaPagamento;
          comprovante_url: string | null;
          observacoes: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          mensalidade_id: string;
          valor_pago: number;
          pago_em?: string;
          forma_pagamento: FormaPagamento;
          comprovante_url?: string | null;
          observacoes?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: Partial<{
          id: string;
          mensalidade_id: string;
          valor_pago: number;
          pago_em: string;
          forma_pagamento: FormaPagamento;
          comprovante_url: string | null;
          observacoes: string | null;
          created_at: string;
          created_by: string | null;
        }>;
        Relationships: [];
      };
      importacoes: {
        Row: {
          id: string;
          tipo: string;
          arquivo_origem: string;
          total_linhas: number;
          total_inseridos: number;
          total_atualizados: number;
          total_erros: number;
          relatorio_erros: Json | null;
          executada_por: string;
          executada_em: string;
        };
        Insert: {
          id?: string;
          tipo: string;
          arquivo_origem: string;
          total_linhas: number;
          total_inseridos: number;
          total_atualizados: number;
          total_erros: number;
          relatorio_erros?: Json | null;
          executada_por: string;
          executada_em?: string;
        };
        Update: Partial<{
          id: string;
          tipo: string;
          arquivo_origem: string;
          total_linhas: number;
          total_inseridos: number;
          total_atualizados: number;
          total_erros: number;
          relatorio_erros: Json | null;
          executada_por: string;
          executada_em: string;
        }>;
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: string;
          tabela: string;
          registro_id: string;
          operacao: AuditOperacao;
          antes: Json | null;
          depois: Json | null;
          usuario_id: string | null;
          executada_em: string;
        };
        Insert: {
          id?: string;
          tabela: string;
          registro_id: string;
          operacao: AuditOperacao;
          antes?: Json | null;
          depois?: Json | null;
          usuario_id?: string | null;
          executada_em?: string;
        };
        Update: Partial<{
          id: string;
          tabela: string;
          registro_id: string;
          operacao: AuditOperacao;
          antes: Json | null;
          depois: Json | null;
          usuario_id: string | null;
          executada_em: string;
        }>;
        Relationships: [];
      };
      configuracoes: {
        Row: {
          id: string;
          chave: string;
          valor: Json;
          descricao: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          chave: string;
          valor: Json;
          descricao?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<{
          id: string;
          chave: string;
          valor: Json;
          descricao: string | null;
          updated_at: string;
          updated_by: string | null;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      forma_pagamento_tipo: FormaPagamento;
      audit_operacao: AuditOperacao;
    };
    CompositeTypes: Record<string, never>;
  };
}
