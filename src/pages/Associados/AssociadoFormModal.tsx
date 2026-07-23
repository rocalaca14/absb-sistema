import { useState, type FormEvent } from 'react';

import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { associadoCreateSchema, type AssociadoCreateSchema } from '@/utils/validators';
import type { Associado, AssociadoCreate } from '@/types/domain.types';

import styles from './AssociadoFormModal.module.css';

const UF_OPTIONS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

interface AssociadoFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AssociadoCreate) => Promise<void>;
  associado?: Associado | null;
}

type FormErrors = Partial<Record<keyof AssociadoCreateSchema, string>>;

function toFormValues(associado?: Associado | null): AssociadoCreateSchema {
  if (!associado) {
    return {
      nome: '',
      cpf: undefined,
      rg: undefined,
      telefone: undefined,
      email: undefined,
      endereco: undefined,
      numero: undefined,
      complemento: undefined,
      bairro: undefined,
      cidade: undefined,
      uf: undefined,
      cep: undefined,
      veiculo_marca: undefined,
      veiculo_modelo: undefined,
      veiculo_ano: undefined,
      veiculo_placa: undefined,
      veiculo_cor: undefined,
      categoria: undefined,
      data_nascimento: undefined,
      data_filiacao: undefined,
      observacoes: undefined,
      ativo: true,
    };
  }
  return {
    nome: associado.nome,
    cpf: associado.cpf ?? undefined,
    rg: associado.rg ?? undefined,
    telefone: associado.telefone ?? undefined,
    email: associado.email ?? undefined,
    endereco: associado.endereco ?? undefined,
    numero: associado.numero ?? undefined,
    complemento: associado.complemento ?? undefined,
    bairro: associado.bairro ?? undefined,
    cidade: associado.cidade ?? undefined,
    uf: (associado.uf as AssociadoCreateSchema['uf']) ?? undefined,
    cep: associado.cep ?? undefined,
    veiculo_marca: associado.veiculoMarca ?? undefined,
    veiculo_modelo: associado.veiculoModelo ?? undefined,
    veiculo_ano: associado.veiculoAno ?? undefined,
    veiculo_placa: associado.veiculoPlaca ?? undefined,
    veiculo_cor: associado.veiculoCor ?? undefined,
    categoria: associado.categoria ?? undefined,
    data_nascimento: associado.dataNascimento ?? undefined,
    data_filiacao: associado.dataFiliacao ?? undefined,
    observacoes: associado.observacoes ?? undefined,
    ativo: associado.ativo,
  };
}

function toCreateInput(values: AssociadoCreateSchema): AssociadoCreate {
  return {
    nome: values.nome,
    cpf: values.cpf ?? null,
    rg: values.rg ?? null,
    telefone: values.telefone ?? null,
    email: values.email ?? null,
    endereco: values.endereco ?? null,
    numero: values.numero ?? null,
    complemento: values.complemento ?? null,
    bairro: values.bairro ?? null,
    cidade: values.cidade ?? null,
    uf: values.uf ?? null,
    cep: values.cep ?? null,
    veiculoMarca: values.veiculo_marca ?? null,
    veiculoModelo: values.veiculo_modelo ?? null,
    veiculoAno: values.veiculo_ano ?? null,
    veiculoPlaca: values.veiculo_placa ?? null,
    veiculoCor: values.veiculo_cor ?? null,
    categoria: values.categoria ?? null,
    dataNascimento: values.data_nascimento ?? null,
    dataFiliacao: values.data_filiacao ?? null,
    observacoes: values.observacoes ?? null,
    ativo: values.ativo ?? true,
  };
}

export function AssociadoFormModal({
  open,
  onClose,
  onSubmit,
  associado,
}: AssociadoFormModalProps) {
  const isEditing = Boolean(associado);
  const [values, setValues] = useState<AssociadoCreateSchema>(() => toFormValues(associado));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = <K extends keyof AssociadoCreateSchema>(
    key: K,
    value: AssociadoCreateSchema[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const parsed = associadoCreateSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormErrors;
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(toCreateInput(parsed.data));
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar associado.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar associado' : 'Novo associado'}
      size="lg"
      primaryAction={{
        label: isEditing ? 'Salvar alterações' : 'Cadastrar',
        onClick: () => {
          void handleSubmit(new Event('submit') as unknown as FormEvent);
        },
        loading: submitting,
      }}
      secondaryAction={{
        label: 'Cancelar',
        onClick: onClose,
      }}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {submitError && (
          <p className={styles.errorText} role="alert">{submitError}</p>
        )}

        {/* Dados Pessoais */}
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>Dados Pessoais</legend>

          <Input
            label="Nome"
            required
            value={values.nome}
            onChange={(e) => setField('nome', e.target.value)}
            errorMessage={errors.nome}
            placeholder="Nome completo"
          />

          <div className={styles.fieldRow}>
            <Input
              label="CPF"
              value={values.cpf ?? ''}
              onChange={(e) => setField('cpf', e.target.value || undefined)}
              errorMessage={errors.cpf}
              placeholder="000.000.000-00"
              maxLength={11}
            />
            <Input
              label="RG"
              value={values.rg ?? ''}
              onChange={(e) => setField('rg', e.target.value || undefined)}
              errorMessage={errors.rg}
              placeholder="Número do RG"
            />
          </div>

          <div className={styles.fieldRow}>
            <Input
              label="Telefone"
              value={values.telefone ?? ''}
              onChange={(e) => setField('telefone', e.target.value || undefined)}
              errorMessage={errors.telefone}
              placeholder="(00) 00000-0000"
              type="tel"
            />
            <Input
              label="E-mail"
              value={values.email ?? ''}
              onChange={(e) => setField('email', e.target.value || undefined)}
              errorMessage={errors.email}
              placeholder="email@exemplo.com"
              type="email"
            />
          </div>

          <div className={styles.fieldRow}>
            <Input
              label="Data de nascimento"
              value={values.data_nascimento ?? ''}
              onChange={(e) => setField('data_nascimento', e.target.value || undefined)}
              errorMessage={errors.data_nascimento}
              type="date"
            />
            <Input
              label="Data de filiação"
              value={values.data_filiacao ?? ''}
              onChange={(e) => setField('data_filiacao', e.target.value || undefined)}
              errorMessage={errors.data_filiacao}
              type="date"
            />
          </div>
        </fieldset>

        {/* Endereço */}
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>Endereço</legend>

          <div className={styles.fieldRow}>
            <Input
              label="Endereço"
              value={values.endereco ?? ''}
              onChange={(e) => setField('endereco', e.target.value || undefined)}
              errorMessage={errors.endereco}
              placeholder="Rua, avenida..."
            />
            <Input
              label="Número"
              value={values.numero ?? ''}
              onChange={(e) => setField('numero', e.target.value || undefined)}
              errorMessage={errors.numero}
              placeholder="Número"
            />
          </div>

          <Input
            label="Complemento"
            value={values.complemento ?? ''}
            onChange={(e) => setField('complemento', e.target.value || undefined)}
            errorMessage={errors.complemento}
            placeholder="Apto, bloco, sala..."
          />

          <div className={styles.fieldRow}>
            <Input
              label="Bairro"
              value={values.bairro ?? ''}
              onChange={(e) => setField('bairro', e.target.value || undefined)}
              errorMessage={errors.bairro}
              placeholder="Bairro"
            />
            <Input
              label="Cidade"
              value={values.cidade ?? ''}
              onChange={(e) => setField('cidade', e.target.value || undefined)}
              errorMessage={errors.cidade}
              placeholder="Cidade"
            />
          </div>

          <div className={styles.fieldRow}>
            <div>
              <label htmlFor="uf-select" className={styles.sectionTitle}>UF</label>
              <select
                id="uf-select"
                className={styles.select}
                value={values.uf ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setField('uf', (val || undefined) as AssociadoCreateSchema['uf']);
                }}
              >
                <option value="">Selecione</option>
                {UF_OPTIONS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <Input
              label="CEP"
              value={values.cep ?? ''}
              onChange={(e) => setField('cep', e.target.value || undefined)}
              errorMessage={errors.cep}
              placeholder="00000-000"
              maxLength={8}
            />
          </div>
        </fieldset>

        {/* Veículo */}
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>Veículo</legend>

          <div className={styles.fieldRow}>
            <Input
              label="Marca"
              value={values.veiculo_marca ?? ''}
              onChange={(e) => setField('veiculo_marca', e.target.value || undefined)}
              errorMessage={errors.veiculo_marca}
              placeholder="Ex: Volkswagen"
            />
            <Input
              label="Modelo"
              value={values.veiculo_modelo ?? ''}
              onChange={(e) => setField('veiculo_modelo', e.target.value || undefined)}
              errorMessage={errors.veiculo_modelo}
              placeholder="Ex: Gol"
            />
          </div>

          <div className={styles.fieldRow}>
            <Input
              label="Ano"
              value={values.veiculo_ano ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                setField('veiculo_ano', val ? Number(val) : undefined);
              }}
              errorMessage={errors.veiculo_ano}
              placeholder="Ex: 2020"
              type="number"
            />
            <Input
              label="Placa"
              value={values.veiculo_placa ?? ''}
              onChange={(e) => setField('veiculo_placa', e.target.value.toUpperCase() || undefined)}
              errorMessage={errors.veiculo_placa}
              placeholder="ABC1234"
              maxLength={7}
            />
          </div>

          <div className={styles.fieldRow}>
            <Input
              label="Cor"
              value={values.veiculo_cor ?? ''}
              onChange={(e) => setField('veiculo_cor', e.target.value || undefined)}
              errorMessage={errors.veiculo_cor}
              placeholder="Ex: Prata"
            />
            <Input
              label="Categoria"
              value={values.categoria ?? ''}
              onChange={(e) => setField('categoria', e.target.value || undefined)}
              errorMessage={errors.categoria}
              placeholder="Ex: Buggy"
            />
          </div>
        </fieldset>

        {/* Observações */}
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>Observações</legend>

          <Input
            label="Observações"
            value={values.observacoes ?? ''}
            onChange={(e) => setField('observacoes', e.target.value || undefined)}
            errorMessage={errors.observacoes}
            placeholder="Informações adicionais..."
          />
        </fieldset>
      </form>
    </Modal>
  );
}
