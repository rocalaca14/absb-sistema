import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppShell } from '@/components/layout/AppShell';
import { Skeleton } from '@/components/ui/Skeleton';
import { ROUTES } from '@/constants';

import { ProtectedRoute } from './ProtectedRoute';
import styles from './AppRoutes.module.css';

// Code splitting: cada página é carregada sob demanda.
const LoginPage = lazy(() =>
  import('@/pages/Login/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const InicioPage = lazy(() =>
  import('@/pages/Inicio/InicioPage').then((m) => ({ default: m.InicioPage })),
);
const MensalidadesPage = lazy(() =>
  import('@/pages/Mensalidades/MensalidadesPage').then((m) => ({
    default: m.MensalidadesPage,
  })),
);
const AssociadosPage = lazy(() =>
  import('@/pages/Associados/AssociadosPage').then((m) => ({
    default: m.AssociadosPage,
  })),
);
const ConfiguracoesPage = lazy(() =>
  import('@/pages/Configuracoes/ConfiguracoesPage').then((m) => ({
    default: m.ConfiguracoesPage,
  })),
);
const RelatoriosPage = lazy(() =>
  import('@/pages/Relatorios/RelatoriosPage').then((m) => ({
    default: m.RelatoriosPage,
  })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function RouteFallback() {
  return (
    <div className={styles.fallback} role="status" aria-busy="true" aria-live="polite">
      <Skeleton height={32} width="60%" rounded="md" />
      <Skeleton count={3} height={16} />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <AppShell>
                <InicioPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.MENSALIDADES}
          element={
            <ProtectedRoute>
              <AppShell>
                <MensalidadesPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ASSOCIADOS}
          element={
            <ProtectedRoute>
              <AppShell>
                <AssociadosPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.CONFIGURACOES}
          element={
            <ProtectedRoute>
              <AppShell>
                <ConfiguracoesPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.RELATORIOS}
          element={
            <ProtectedRoute>
              <AppShell>
                <RelatoriosPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
