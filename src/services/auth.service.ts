import type { AuthError, Session, Subscription, User } from '@supabase/supabase-js';

import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { logger } from '@/core/logger/logger';
import { isSupabaseConfigured, supabase } from '@/core/supabase/client';
import type { Role } from '@/constants';

export interface Profile {
  id: string;
  nome: string;
  role: Role;
  ativo: boolean;
  ultimoAcessoEm: string | null;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: Role | null;
}

function mapSupabaseError(error: AuthError | null | undefined): AppError {
  const message = error?.message?.toLowerCase() ?? '';
  if (message.includes('invalid login') || message.includes('invalid credentials')) {
    return new AppError({ code: ERROR_CODES.AUTH_INVALID_CREDENTIALS, originalError: error });
  }
  if (error?.status === 401) {
    return new AppError({ code: ERROR_CODES.AUTH_SESSION_EXPIRED, originalError: error });
  }
  if (error?.status === 403) {
    return new AppError({ code: ERROR_CODES.PERMISSION_DENIED, originalError: error });
  }
  return new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
}

function ensureClient(): NonNullable<typeof supabase> {
  if (!supabase) {
    throw new AppError({ code: ERROR_CODES.BACKEND_NOT_CONFIGURED });
  }
  return supabase;
}

function toProfile(row: {
  id: string;
  nome: string;
  role: Role;
  ativo: boolean;
  ultimo_acesso_em: string | null;
}): Profile {
  return {
    id: row.id,
    nome: row.nome,
    role: row.role,
    ativo: row.ativo,
    ultimoAcessoEm: row.ultimo_acesso_em,
  };
}

function buildState(user: User | null, session: Session | null, profile: Profile | null): AuthState {
  return {
    user,
    session,
    profile,
    role: profile?.role ?? null,
  };
}

const noopSubscription: Subscription = {
  id: 'noop',
  callback: () => undefined,
  unsubscribe: () => undefined,
};

const noopResult = { data: { subscription: noopSubscription } };

export const authService = {
  isSupabaseConfigured,

  async signIn(email: string, password: string): Promise<AuthState> {
    const client = ensureClient();
    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw mapSupabaseError(error);
      if (!data.user || !data.session) {
        throw new AppError({ code: ERROR_CODES.INTERNAL });
      }
      const profile = await this.getProfile(data.user.id);
      if (profile && !profile.ativo) {
        await client.auth.signOut().catch(() => undefined);
        throw new AppError({ code: ERROR_CODES.AUTH_ACCOUNT_DISABLED });
      }
      return buildState(data.user, data.session, profile);
    } catch (error) {
      if (AppError.isAppError(error)) throw error;
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }
  },

  async signOut(): Promise<void> {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.warn('Erro em signOut do Supabase', { error });
      }
    } catch (error) {
      logger.warn('Exceção em signOut', { error });
    }
  },

  async getCurrentSession(): Promise<Session | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        logger.warn('Erro em getSession', { error });
        return null;
      }
      return data.session ?? null;
    } catch (error) {
      logger.warn('Exceção em getSession', { error });
      return null;
    }
  },

  async getProfile(userId: string): Promise<Profile | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, role, ativo, ultimo_acesso_em')
        .eq('id', userId)
        .maybeSingle();
      if (error) {
        logger.warn('Erro em getProfile', { error });
        return null;
      }
      if (!data) return null;
      return toProfile(data);
    } catch (error) {
      logger.warn('Exceção em getProfile', { error });
      return null;
    }
  },

  onAuthStateChange(
    callback: (event: string, state: AuthState) => void,
  ): { data: { subscription: Subscription } } {
    if (!supabase) {
      return noopResult;
    }
    const client = supabase;
    return client.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          const profile = await this.getProfile(session.user.id);
          callback(event, buildState(session.user, session, profile));
        } else {
          callback(event, buildState(null, null, null));
        }
      } catch (error) {
        logger.warn('Exceção em onAuthStateChange', { error });
        callback(event, buildState(null, null, null));
      }
    });
  },
};

export type AuthService = typeof authService;
