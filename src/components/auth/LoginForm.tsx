import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AppError } from '@/core/errors/AppError';
import { logger } from '@/core/logger/logger';
import { ROUTES } from '@/constants';

import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

import styles from './LoginForm.module.css';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Informe o e-mail.' })
    .min(1, 'Informe o e-mail.')
    .email('Informe um e-mail válido.'),
  password: z
    .string({ required_error: 'Informe a senha.' })
    .min(1, 'Informe a senha.'),
});

type FormValues = z.infer<typeof loginSchema>;
type FormErrors = Partial<Record<keyof FormValues, string>>;

interface LocationState {
  from?: string;
}

export function LoginForm() {
  const { signIn, isBackendConfigured } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const from = (location.state as LocationState | null)?.from ?? ROUTES.HOME;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (key === 'email' || key === 'password') {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const { error } = await signIn(result.data.email, result.data.password);
      if (error) {
        if (AppError.isAppError(error) && error.code === 'VALIDATION_FAILED') {
          toast.error(error.userMessage);
        } else {
          toast.error(error.userMessage);
        }
        return;
      }
      toast.success('Login realizado com sucesso.');
      navigate(from, { replace: true });
    } catch (error) {
      logger.error('Exceção no submit do login', { error });
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Formulário de login">
      <div className={styles.header}>
        <h1 className={styles.title}>Entrar</h1>
        <p className={styles.subtitle}>
          Use seu e-mail e senha para acessar o painel da associação.
        </p>
      </div>

      {!isBackendConfigured && (
        <div className={styles.notice} role="alert">
          Backend não configurado. Defina as variáveis de ambiente{' '}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no arquivo{' '}
          <code>.env</code> para habilitar a autenticação.
        </div>
      )}

      <Input
        label="E-mail"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        placeholder="seu@email.com"
        required
        disabled={submitting}
        errorMessage={errors.email}
      />

      <Input
        label="Senha"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        placeholder="••••••"
        required
        disabled={submitting}
        errorMessage={errors.password}
      />

      <Button
        type="submit"
        variant="primary"
        loading={submitting}
        disabled={!isBackendConfigured}
        fullWidth
      >
        Entrar
      </Button>
    </form>
  );
}
