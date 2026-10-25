import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Role = 'inspector' | 'admin';

export interface AuthUser {
  nombre: string;
  correo: string;
  rol: Role;
  comuna: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  logout: () => void;
}

const STORAGE_KEY = 'sifcom-user';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readUser = (): AuthUser | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    return {
      nombre: parsed.nombre || 'Usuario',
      correo: parsed.correo,
      rol: parsed.rol,
      comuna: parsed.comuna || 'Valparaíso',
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(readUser);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (next) => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setUser(next);
      },
      updateUser: (patch) => {
        setUser((current) => {
          if (!current) return current;
          const next = { ...current, ...patch };
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      },
      logout: () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
};
