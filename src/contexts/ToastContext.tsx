import { useCallback, useState, type ReactNode } from 'react';

import { Toast } from '@/components/ui/Toast';
import type { ToastVariant } from '@/constants';

import { ToastContext, type ToastContextValue, type ToastInput } from './toastContextValue';
import styles from './ToastContainer.module.css';

interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
  leaving: boolean;
}

const DEFAULT_DURATION = 3000;
const EXIT_ANIMATION_MS = 200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const startLeaving = useCallback(
    (id: string) => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      window.setTimeout(() => removeToast(id), EXIT_ANIMATION_MS);
    },
    [removeToast],
  );

  const show = useCallback(
    (toast: ToastInput) => {
      const id =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const duration = toast.duration ?? DEFAULT_DURATION;
      setToasts((prev) => [...prev, { id, leaving: false, ...toast }]);
      window.setTimeout(() => startLeaving(id), duration);
    },
    [startLeaving],
  );

  const value: ToastContextValue = {
    show,
    success: (message) => show({ variant: 'success', message }),
    error: (message) => show({ variant: 'error', message }),
    warning: (message) => show({ variant: 'warning', message }),
    info: (message) => show({ variant: 'info', message }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={styles.container}
        role="region"
        aria-label="Notificações"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            message={toast.message}
            leaving={toast.leaving}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
