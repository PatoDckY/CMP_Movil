import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {authRepository} from '../config/dependencies';
import {AppState} from 'react-native';
import {User} from '../models/User';
import {Profile} from '../models/Profile';
import {sessionEvents} from '../services/security/sessionEvents';

type SessionContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  setAuthenticatedUser: (
    user: User,
    purchaseCourseId?: number,
  ) => void;
  initialPurchaseCourseId: number | null;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Profile) => void;
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
  const [initialPurchaseCourseId, setInitialPurchaseCourseId] =
    useState<number | null>(null);

  const sessionVersion = useRef(0);
  const locallyClosed = useRef(false);
  const logoutPromise = useRef<Promise<void> | null>(null);
  const hasRestored = useRef(false);
  const currentUserRef = useRef(user);
  currentUserRef.current = user;

  const restoreSession =
    useCallback(async () => {
      if (locallyClosed.current) {
        return;
      }
      const version = ++sessionVersion.current;
      try {
        if (!hasRestored.current) { setIsRestoring(true); }

        const currentUser =
          await authRepository.getCurrentUser();

        if (version === sessionVersion.current && !locallyClosed.current) {
          setUser(currentUser);
        }
      } catch {
        // Un fallo transitorio no convierte una sesión existente en inválida.
        // La invalidación definitiva se recibe mediante sessionEvents.
      } finally {
        if (version === sessionVersion.current) {
          hasRestored.current = true;
          setIsRestoring(false);
        }
      }
    }, []);

  useEffect(() => {
    const unsubscribe = sessionEvents.subscribe(() => {
      sessionVersion.current += 1;
      locallyClosed.current = true;
      hasRestored.current = true;
      setUser(null);
      setInitialPurchaseCourseId(null);
      setIsRestoring(false);
    });
    restoreSession();
    const foreground = AppState.addEventListener('change', state => {
      if (state === 'active' && !locallyClosed.current) {
        restoreSession();
      }
    });
    return () => { unsubscribe(); foreground.remove(); };
  }, [restoreSession]);

  const setAuthenticatedUser =
    useCallback(
      (
        authenticatedUser: User,
        purchaseCourseId?: number,
      ) => {
        if (logoutPromise.current) {
          return;
        }
        sessionVersion.current += 1;
        locallyClosed.current = false;
        hasRestored.current = true;
        setUser(authenticatedUser);
        setInitialPurchaseCourseId(
          typeof purchaseCourseId === 'number' &&
            Number.isSafeInteger(purchaseCourseId) &&
            purchaseCourseId > 0
            ? purchaseCourseId
            : null,
        );
        setIsRestoring(false);
      },
      [],
    );

  const updateProfile = useCallback((profile: Profile) => {
    const authenticated = currentUserRef.current;
    if (!authenticated || authenticated.id !== profile.id || locallyClosed.current) { return; }
    sessionVersion.current += 1;
    setUser({...authenticated, firstName: profile.firstName,
      paternalLastName: profile.paternalLastName, maternalLastName: profile.maternalLastName,
      fullName: [profile.firstName, profile.paternalLastName, profile.maternalLastName].filter(Boolean).join(' '),
    });
  }, []);

  const logout =
    useCallback(() => {
      if (logoutPromise.current) {
        return logoutPromise.current;
      }
      sessionVersion.current += 1;
      locallyClosed.current = true;
      setUser(null);
      setInitialPurchaseCourseId(null);
      setIsRestoring(false);
      const operation = authRepository.logout().finally(() => {
        logoutPromise.current = null;
      });
      logoutPromise.current = operation;
      return operation;
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
      updateProfile,
      initialPurchaseCourseId,
    }),
    [
      user,
      isRestoring,
      setAuthenticatedUser,
      restoreSession,
      logout,
      updateProfile,
      initialPurchaseCourseId,
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
