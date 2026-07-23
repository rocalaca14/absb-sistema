import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

import './design-system/tokens.css';
import './design-system/reset.css';
import './design-system/typography.css';

// Aplicar tema salvo antes do render para evitar flash
const STORAGE_KEY = 'absb-theme';
const storedTheme = localStorage.getItem(STORAGE_KEY);
const resolvedTheme =
  storedTheme === 'dark' || storedTheme === 'light'
    ? storedTheme
    : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
document.documentElement.setAttribute('data-theme', resolvedTheme);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento #root não encontrado no DOM.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Registro de Service Worker (apenas em produção)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  void import('virtual:pwa-register')
    .then(({ registerSW }) => {
      registerSW({
        immediate: true,
        onRegisteredSW: (swUrl) => {
          // eslint-disable-next-line no-console
          console.info('[ABSB] Service Worker registrado:', swUrl);
        },
        onRegisterError: (error) => {
          // eslint-disable-next-line no-console
          console.error('[ABSB] Falha ao registrar Service Worker:', error);
        },
      });
    })
    .catch(() => {
      // Falha silenciosa: app continua funcionando sem PWA
    });
}
