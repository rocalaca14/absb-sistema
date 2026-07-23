import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import type { AppError } from '@/core/errors/AppError';
import type { Role } from '@/constants';
import type { Profile } from '@/services/auth.service';

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: Role | null;
  loading: boolean;
  initialized: boolean;
  isBackendConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AppError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
