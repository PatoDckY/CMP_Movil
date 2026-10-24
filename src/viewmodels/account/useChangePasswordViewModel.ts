import { useCallback, useEffect, useRef, useState } from 'react';
import { PasswordChangeRepository } from '../../repositories/contracts/PasswordChangeRepository';

export const MAX_CURRENT_PASSWORD_LENGTH = 200;
const MAX_NEW_PASSWORD_BYTES = 72;
const INSECURE_SEQUENCES = ['123', '234', '345', '456', '789', 'abc', 'qwe'];

function utf8Bytes(value: string): number {
  let bytes = 0;
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    bytes += code < 0x80 ? 1 : code < 0x800 ? 2 : code < 0x10000 ? 3 : 4;
  }
  return bytes;
}

/**
 * Espejo de la política de CMP_Site (validarContrasena) para dar feedback
 * inmediato. El servidor sigue siendo la fuente de verdad.
 */
export function validateNewPassword(
  current: string,
  next: string,
  confirm: string,
): string | null {
  if (!current) {
    return 'Ingresa tu contraseña actual.';
  }
  if (next.length < 8 || utf8Bytes(next) > MAX_NEW_PASSWORD_BYTES) {
    return 'La contraseña debe tener al menos 8 caracteres y no superar 72 bytes.';
  }
  if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(next)) {
    return 'La contraseña debe contener letras, números y un símbolo.';
  }
  const lower = next.toLowerCase();
  if (INSECURE_SEQUENCES.some(sequence => lower.includes(sequence))) {
    return 'La contraseña contiene una secuencia insegura.';
  }
  if (next !== confirm) {
    return 'Las contraseñas no coinciden.';
  }
  if (next === current) {
    return 'La nueva contraseña debe ser diferente de la actual.';
  }
  return null;
}

export function useChangePasswordViewModel(
  repository: PasswordChangeRepository,
  logout: () => Promise<void>,
  onSuccess?: (message: string) => void,
) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const submitting = useRef(false);
  const changed = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const submit = useCallback(async (): Promise<boolean> => {
    if (submitting.current || changed.current) {
      return false;
    }
    const validationError = validateNewPassword(
      currentPassword,
      newPassword,
      confirmPassword,
    );
    if (validationError) {
      setError(validationError);
      return false;
    }
    submitting.current = true;
    setIsSubmitting(true);
    setError(null);
    try {
      const message = await repository.changePassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );
      changed.current = true;
      // Las contraseñas no deben permanecer en memoria tras el cambio.
      if (mounted.current) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsChanged(true);
      }
      // El servidor ya invalidó la sesión: el aviso se emite antes de cerrarla
      // porque cerrar sesión desmonta esta pantalla.
      onSuccess?.(message);
      try {
        await logout();
      } catch {
        // La sesión ya quedó revocada en el servidor y bloqueada localmente.
      }
      return true;
    } catch (requestError) {
      // Los mensajes de 400/401/409 vienen redactados por el backend.
      if (mounted.current) {
        setError(
          requestError instanceof Error && requestError.message
            ? requestError.message
            : 'No fue posible cambiar la contraseña.',
        );
      }
      return false;
    } finally {
      submitting.current = false;
      if (mounted.current) {
        setIsSubmitting(false);
      }
    }
  }, [repository, logout, onSuccess, currentPassword, newPassword, confirmPassword]);

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isSubmitting,
    isChanged,
    canSubmit:
      currentPassword.length > 0 &&
      newPassword.length > 0 &&
      confirmPassword.length > 0 &&
      !isSubmitting &&
      !isChanged,
    submit,
  };
}
