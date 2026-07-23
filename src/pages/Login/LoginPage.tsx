import { Link } from 'react-router-dom';

import { LoginForm } from '@/components/auth/LoginForm';
import { ROUTES } from '@/constants';

export function LoginPage() {
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
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          display: 'grid',
          rowGap: 'var(--space-section)',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4) 0',
          }}
        >
          <span
            style={{
              fontSize: 'var(--font-size-title)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-primary)',
              letterSpacing: '2px',
            }}
          >
            ABSB
          </span>
        </header>

        <div
          style={{
            display: 'block',
            padding: 'var(--space-5)',
            background: 'var(--color-card)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <LoginForm />
        </div>

        <nav style={{ textAlign: 'center' }}>
          <Link
            to={ROUTES.HOME}
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Acessar como visitante
          </Link>
        </nav>
      </div>
    </div>
  );
}
