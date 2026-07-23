import { type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Skeleton } from '@/components/ui/Skeleton';
import { ROUTES } from '@/constants';

import { useAuth } from '@/hooks/useAuth';

import styles from './ProtectedRoute.module.css';

interface ProtectedRouteProps {
  children?: ReactNode;
}

function RouteLoading() {
  return (
    <div className={styles.loading} role="status" aria-busy="true" aria-live="polite">
      <Skeleton height={32} width="60%" rounded="md" />
      <Skeleton count={3} height={16} />
      <Skeleton height={120} rounded="xl" />
    </div>
  );
}

/**
 * ProtectedRoute — guarda de rota.
 *
 * - Sessão carregando: exibe Skeleton.
 * - Sem sessão: redireciona para /login preservando destino em `state.from`.
 * - Sessão válida: libera acesso via <Outlet /> ou `children`.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, initialized, loading } = useAuth();
  const location = useLocation();

  if (!initialized || loading) {
    return <RouteLoading />;
  }

  if (!user) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (children !== undefined) {
    return <>{children}</>;
  }

  return <Outlet />;
}
