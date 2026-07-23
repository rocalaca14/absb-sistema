import { HashRouter } from 'react-router-dom';

import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

import { AppRoutes } from './routes/AppRoutes';

import './design-system/tokens.css';
import './design-system/reset.css';
import './design-system/typography.css';

export function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
}
