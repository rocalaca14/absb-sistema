import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';

import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { logger } from '@/core/logger/logger';
import { isSupabaseConfigured } from '@/core/supabase/client';
import { authService, type AuthState, type Profile } from '@/services/auth.service';

import { useToast } from '@/hooks/useToast';

import { AuthContext, type AuthContextValue } from './authContext.types';

const INITIAL_STATE: AuthState = {
  user: null,
  session: null,
  profile: null,
  role: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const isBackendConfigured = isSupabaseConfigured;

  // Refs para acessar estado atual dentro do listener sem recriar subscription.
  const stateRef = useRef<AuthState>(state);
  stateRef.current = state;

  const toast = useToast();
  const sessionExpiredShownRef = useRef<boolean>(false);

  const refreshProfile = useCallback(async () => {
    const current = stateRef.current;
    if (!current.user) return;
    const profile = await authService.getProfile(current.user.id);
    setState((prev) => ({ ...prev, profile, role: profile?.role ?? null }));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.signIn(email, password);
      setState(result);
      sessionExpiredShownRef.current = false;
      return { error: null };
    } catch (error) {
      const appError = AppError.isAppError(error)
        ? error
        : new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
      logger.warn('Falha em signIn', { code: appError.code });
      return { error: appError };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setState(INITIAL_STATE);
    } finally {
      setLoading(false);
    }
  }, []);

  // Restauração inicial de sessão + subscription de mudanças.
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const session: Session | null = await authService.getCurrentSession();
        if (!mounted) return;
        if (session?.user) {
          const profile: Profile | null = await authService.getProfile(session.user.id);
          if (!mounted) return;
          setState({
            user: session.user,
            session,
            profile,
            role: profile?.role ?? null,
          });
        }
      } catch (error) {
        logger.warn('Erro na restauração de sessão', { error });
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    })();

    const { data } = authService.onAuthStateChange((event, newState) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' && stateRef.current.user && !newState.user) {
        if (!sessionExpiredShownRef.current) {
          toast.warning('Sua sessão expirou. Faça login novamente.');
          sessionExpiredShownRef.current = true;
        }
      }

      if (newState.user) {
        sessionExpiredShownRef.current = false;
      }

      setState(newState);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [toast]);

  const value: AuthContextValue = {
    ...state,
    loading,
    initialized,
    isBackendConfigured,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
