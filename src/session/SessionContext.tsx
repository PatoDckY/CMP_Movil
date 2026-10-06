import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {authRepository} from '../config/dependencies';
import {User} from '../models/User';

type SessionContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  setAuthenticatedUser: (
    user: User,
  ) => void;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext =
  createContext<SessionContextValue | null>(
    null,
  );

type Props = {
  children: React.ReactNode;
};

export function SessionProvider({
  children,
}: Props): React.JSX.Element {
  const [user, setUser] =
    useState<User | null>(null);

  const [isRestoring, setIsRestoring] =
    useState(true);

  const restoreSession =
    useCallback(async () => {
      try {
        setIsRestoring(true);

        const currentUser =
          await authRepository.getCurrentUser();

        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsRestoring(false);
      }
    }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const setAuthenticatedUser =
    useCallback(
      (
        authenticatedUser: User,
      ) => {
        setUser(authenticatedUser);
      },
      [],
    );

  const logout =
    useCallback(async () => {
      await authRepository.logout();
      setUser(null);
    }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated:
        user !== null,
      isRestoring,
      setAuthenticatedUser,
      restoreSession,
      logout,
    }),
    [
      user,
      isRestoring,
      setAuthenticatedUser,
      restoreSession,
      logout,
    ],
  );

  return (
    <SessionContext.Provider
      value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context =
    useContext(SessionContext);

  if (!context) {
    throw new Error(
      'useSession debe utilizarse dentro de SessionProvider',
    );
  }

  return context;
}