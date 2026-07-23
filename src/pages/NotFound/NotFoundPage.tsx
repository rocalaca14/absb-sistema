import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

export function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-5)',
        background: 'var(--color-background)',
        textAlign: 'center',
        gap: 'var(--space-section)',
      }}
    >
      <div
        style={{
          display: 'grid',
          rowGap: 'var(--space-3)',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--font-size-value)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
            lineHeight: 'var(--line-height-tight)',
          }}
        >
          404
        </h1>
        <p
          style={{
            fontSize: 'var(--font-size-section)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
          }}
        >
          Página não encontrada
        </p>
        <p
          style={{
            fontSize: 'var(--font-size-text)',
            color: 'var(--color-text-secondary)',
          }}
        >
          A rota acessada não existe ou foi removida.
        </p>
      </div>

      <Link to={ROUTES.HOME} style={{ textDecoration: 'none' }}>
        <Button variant="primary">Voltar ao Início</Button>
      </Link>
    </div>
  );
}
