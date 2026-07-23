import { type ReactNode } from 'react';

import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';

import styles from './AppShell.module.css';

export interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell — estrutura global da aplicação.
 *
 * Responsabilidades:
 * - Definir altura total (100dvh com fallback 100vh).
 * - Renderizar header sticky (224px) e bottom nav fixo (80px + safe area).
 * - Garantir scroll vertical único (apenas no <main>).
 * - Bloquear scroll horizontal.
 * - Respeitar safe area iOS via tokens.
 *
 * Páginas de login e 404 NÃO devem usar AppShell.
 *
 * @see UI_SPECIFICATION.md seção 3.1
 * @see PLANO_IMPLEMENTACAO_FASE_1.md (decisão de roteamento e scroll)
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.appShell}>
      <div className={styles.headerSlot}>
        <AppHeader />
      </div>
      <main className={styles.main} id="main-content" tabIndex={-1}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
