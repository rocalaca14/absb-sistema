import { type CSSProperties } from 'react';

import { Icon } from '@/components/ui/Icon';
import { TOAST_VARIANTS, type ToastVariant } from '@/constants';
import type { IconName } from '@/constants/icons';

import styles from './Toast.module.css';

const VARIANT_BG: Record<ToastVariant, string> = {
  success: 'var(--color-success)',
  error: 'var(--color-danger)',
  warning: 'var(--color-warning)',
  info: 'var(--color-primary)',
};

const VARIANT_TEXT_COLOR: Record<ToastVariant, string> = {
  success: 'var(--color-text-on-primary)',
  error: 'var(--color-text-on-danger)',
  warning: 'var(--color-text-on-primary)',
  info: 'var(--color-text-on-primary)',
};

const VARIANT_ICON: Record<ToastVariant, IconName> = {
  success: 'Check',
  error: 'X',
  warning: 'AlertTriangle',
  info: 'Info',
};

const VARIANT_LABEL: Record<ToastVariant, string> = {
  success: 'Sucesso',
  error: 'Erro',
  warning: 'Atenção',
  info: 'Informação',
};

export interface ToastProps {
  variant: ToastVariant;
  message: string;
  leaving?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Toast({ variant, message, leaving = false, className, style }: ToastProps) {
  const composedClassName = [
    styles.toast,
    leaving ? styles.leaving : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const composedStyle: CSSProperties = {
    background: VARIANT_BG[variant],
    color: VARIANT_TEXT_COLOR[variant],
    ...style,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={composedClassName}
      style={composedStyle}
    >
      <Icon name={VARIANT_ICON[variant]} ariaLabel={VARIANT_LABEL[variant]} />
      <span>{message}</span>
    </div>
  );
}

export { TOAST_VARIANTS };
export type { ToastVariant };
