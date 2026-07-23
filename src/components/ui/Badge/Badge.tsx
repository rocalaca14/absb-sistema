import { type ReactNode } from 'react';

import styles from './Badge.module.css';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface BadgeProps {
  variant?: BadgeVariant;
  showDot?: boolean;
  children: ReactNode;
  className?: string | undefined;
}

/**
 * Badge — rótulo semântico para status, categorias e contagens.
 *
 * Usa exclusivamente tokens de cor. Cinco variantes semânticas.
 */
export function Badge({
  variant = 'neutral',
  showDot = false,
  children,
  className,
}: BadgeProps) {
  const composedClassName = [styles.badge, styles[variant], className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <span className={composedClassName}>
      {showDot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
