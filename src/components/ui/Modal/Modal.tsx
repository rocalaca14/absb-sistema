import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { ButtonVariant } from '@/constants';

import styles from './Modal.module.css';

export type ModalSize = 'sm' | 'md' | 'lg' | 'full';

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: ModalSize;
  children: ReactNode;
  footer?: ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
    (el) => !el.hasAttribute('aria-hidden') && el.offsetParent !== null,
  );
}

/**
 * Modal — diálogo sobreposto para confirmações, formulários e detalhes.
 *
 * Acessibilidade WCAG AA:
 * - role="dialog" + aria-modal="true"
 * - aria-labelledby aponta para o título
 * - aria-describedby aponta para descrição (se houver)
 * - Foco inicial no primeiro elemento focável (ou no modal)
 * - Trap de foco: Tab e Shift+Tab percorrem apenas elementos internos
 * - ESC fecha o modal
 * - Foco é restaurado para o elemento que abriu o modal
 * - body scroll bloqueado enquanto aberto
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  primaryAction,
  secondaryAction,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Salvar foco anterior e bloquear scroll do body
  useEffect(() => {
    if (!open) return;
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      const previous = previousActiveElementRef.current;
      if (previous && typeof previous.focus === 'function') {
        previous.focus();
      }
    };
  }, [open]);

  // Focus trap + ESC
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const modal = modalRef.current;
      if (!modal) return;
      const focusable = getFocusable(modal);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        modal.focus();
        return;
      }
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (active === first || !active || !modal.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, closeOnEscape]);

  // Foco inicial no primeiro elemento focável
  useEffect(() => {
    if (!open) return;
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = getFocusable(modal);
    const target = focusable[0] ?? modal;
    // Pequeno delay para garantir que o DOM está pintado
    const timer = window.setTimeout(() => target.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  const sizeClass = size === 'full' ? styles.full : styles[size];

  const footerContent =
    footer ??
    (primaryAction || secondaryAction ? (
      <>
        {secondaryAction && (
          <Button
            variant={secondaryAction.variant ?? 'secondary'}
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disabled || secondaryAction.loading}
            {...(secondaryAction.loading !== undefined ? { loading: secondaryAction.loading } : {})}
          >
            {secondaryAction.label}
          </Button>
        )}
        {primaryAction && (
          <Button
            variant={primaryAction.variant ?? 'primary'}
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled || primaryAction.loading}
            {...(primaryAction.loading !== undefined ? { loading: primaryAction.loading } : {})}
          >
            {primaryAction.label}
          </Button>
        )}
      </>
    ) : null);

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={closeOnBackdropClick ? onClose : undefined}
      aria-hidden="false"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`${styles.modal} ${sizeClass}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className={styles.closeButton}
          >
            <Icon name="X" />
          </button>
        </header>

        {description && (
          <p id={descriptionId} className={styles.description}>
            {description}
          </p>
        )}

        <div className={styles.body}>{children}</div>

        {footerContent && <footer className={styles.footer}>{footerContent}</footer>}
      </div>
    </div>,
    document.body,
  );
}
