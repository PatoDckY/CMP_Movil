
import {
  useCallback,
  useRef,
  useState,
} from 'react';

import {
  PasswordRecoveryRepository,
} from '../../repositories/contracts/PasswordRecoveryRepository';

export type PasswordRecoveryState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

export function usePasswordRecoveryViewModel(
  repository: PasswordRecoveryRepository,
) {
  const [email, setEmail] =
    useState('');

  const [state, setState] =
    useState<PasswordRecoveryState>('idle');

  const [error, setError] =
    useState<string | null>(null);

  const submittingRef = useRef(false);

  const updateEmail = useCallback(
    (value: string) => {
      setEmail(value);
      setError(null);
      setState('idle');
    },
    [],
  );

  const requestPasswordReset =
    useCallback(async (): Promise<boolean> => {
      if (submittingRef.current) {
        return false;
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          normalizedEmail,
        ) ||
        normalizedEmail.length > 150
      ) {
        setError(
          'Ingresa un correo electrónico válido.',
        );
        setState('error');
        return false;
      }

      submittingRef.current = true;

      try {
        setState('loading');
        setError(null);

        await repository.requestPasswordReset(
          normalizedEmail,
        );

        setState('success');
        return true;
      } catch {
        setError(
          'No fue posible procesar la solicitud. Verifica tu conexión e intenta nuevamente.',
        );
        setState('error');
        return false;
      } finally {
        submittingRef.current = false;
      }
    }, [
      email,
      repository,
    ]);

  return {
    email,
    state,
    error,
    updateEmail,
    requestPasswordReset,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
  };
}
