import { Icon } from '@/components/ui/Icon';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import type { IconName } from '@/constants';

import styles from './EmptyState.module.css';

export type EmptyStateVariant = 'empty' | 'first-use' | 'error';

const DEFAULT_ICONS: Record<EmptyStateVariant, IconName> = {
  empty: 'Search',
  'first-use': 'Plus',
  error: 'AlertTriangle',
};

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
}

export interface EmptyStateProps {
  /** Define ícone, cor e mensagem padrão. */
  variant?: EmptyStateVariant;
  /** Sobrescreve o ícone padrão. */
  icon?: IconName;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string | undefined;
}

/**
 * EmptyState — estado vazio reutilizável para listas, telas e seções.
 *
 * Três variantes:
 * - `empty`: padrão para "nenhum resultado encontrado".
 * - `first-use`: "adicione seu primeiro item" com tom convidativo.
 * - `error`: erro recuperável com ícone e cor de alerta.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   variant="empty"
 *   title="Nenhum associado encontrado"
 *   description="Adicione o primeiro associado para começar."
 *   action={{ label: 'Adicionar associado', onClick: () => navigate('/associados/novo') }}
 * />
 * ```
 */
export function EmptyState({
  variant = 'empty',
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const iconName = icon ?? DEFAULT_ICONS[variant];
  const composedClassName = [
    styles.container,
    variant === 'error' ? styles.error : '',
    variant === 'first-use' ? styles.firstUse : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={composedClassName} role="status">
      <div className={styles.iconWrapper} aria-hidden="true">
        <Icon name={iconName} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && (
        <div className={styles.action}>
          <Button
            variant={action.variant ?? 'primary'}
            onClick={action.onClick}
            leftIcon={variant === 'first-use' ? <Icon name="Plus" /> : undefined}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
