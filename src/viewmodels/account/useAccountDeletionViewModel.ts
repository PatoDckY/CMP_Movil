import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccountDeletionReceipt,
  AccountDeletionError,
} from '../../models/AccountDeletion';
import { AccountRepository } from '../../repositories/contracts/AccountRepository';

export function useAccountDeletionViewModel(
  repository: AccountRepository,
  role: string | undefined,
) {
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [receipt, setReceipt] = useState<AccountDeletionReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const accepted = useRef(false);
  const mounted = useRef(true);
  const isClient = role?.toLowerCase() === 'cliente';
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const submit = useCallback(async (): Promise<boolean> => {
    if (submitting.current || accepted.current || !mounted.current) {
      return false;
    }
    if (!isClient) {
      setError('Esta solicitud está disponible para clientes autenticados.');
      return false;
    }
    if (!password || password.length > 200 || !confirmed) {
      setError(
        'Ingresa tu contraseña actual (máximo 200 caracteres) y confirma expresamente la solicitud.',
      );
      return false;
    }
    submitting.current = true;
    setIsSubmitting(true);
    setError(null);
    // La contraseña solo vive durante esta operación; nunca se persiste.
    const currentPassword = password;
    setPassword('');
    try {
      const result = await repository.requestDeletion({
        password: currentPassword,
        confirmed: true,
      });
      accepted.current = true;
      if (mounted.current) {
        setReceipt(result);
        setConfirmed(false);
      }
      return true;
    } catch (requestError) {
      if (mounted.current) {
        setError(
          requestError instanceof AccountDeletionError
            ? requestError.message
            : 'No fue posible confirmar tu solicitud. Consulta su estado antes de reintentar.',
        );
      }
      return false;
    } finally {
      submitting.current = false;
      if (mounted.current) {
        setIsSubmitting(false);
      }
    }
  }, [repository, isClient, password, confirmed]);
  return {
    password,
    setPassword,
    confirmed,
    setConfirmed,
    receipt,
    error,
    isSubmitting,
    isClient,
    canSubmit:
      isClient &&
      password.length > 0 &&
      password.length <= 200 &&
      confirmed &&
      !isSubmitting &&
      !receipt,
    submit,
  };
}
