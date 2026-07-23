import { createContext } from 'react';

export interface ToastInput {
  variant: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ToastContextValue {
  show: (toast: ToastInput) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
