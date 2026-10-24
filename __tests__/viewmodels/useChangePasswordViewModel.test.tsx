import { PasswordChangeRepository } from '../../src/repositories/contracts/PasswordChangeRepository';
import { ApiError } from '../../src/services/http/httpClient';
import {
  useChangePasswordViewModel,
  validateNewPassword,
} from '../../src/viewmodels/account/useChangePasswordViewModel';
import { act, deferred, renderHook } from '../helpers/renderHook';

const CURRENT = 'Actual#9x';
const NEXT = 'Nueva#7kz';
const MESSAGE = 'Contraseña actualizada correctamente. Vuelve a iniciar sesión.';

describe('validateNewPassword (espejo de la política de CMP_Site)', () => {
  test.each([
    [CURRENT, NEXT, NEXT, null],
    ['', NEXT, NEXT, 'Ingresa tu contraseña actual.'],
    [CURRENT, 'Ab#1', 'Ab#1', 'La contraseña debe tener al menos 8 caracteres y no superar 72 bytes.'],
    [CURRENT, 'a'.repeat(73) + '1#', 'x', 'La contraseña debe tener al menos 8 caracteres y no superar 72 bytes.'],
    [CURRENT, 'Nuevaaaa1', 'Nuevaaaa1', 'La contraseña debe contener letras, números y un símbolo.'],
    [CURRENT, 'Nuevaaaa#', 'Nuevaaaa#', 'La contraseña debe contener letras, números y un símbolo.'],
    [CURRENT, '12345678#a', '12345678#a', 'La contraseña contiene una secuencia insegura.'],
    [CURRENT, 'Nueva#7kz', 'Otra#7kzz', 'Las contraseñas no coinciden.'],
    [NEXT, NEXT, NEXT, 'La nueva contraseña debe ser diferente de la actual.'],
  ])('(%s, %s, %s) -> %s', (current, next, confirm, expected) => {
    expect(validateNewPassword(current, next, confirm)).toBe(expected);
  });
});

describe('Cambio de contraseña - useChangePasswordViewModel', () => {
  let repository: jest.Mocked<PasswordChangeRepository>;
  let logout: jest.Mock;
  let onSuccess: jest.Mock;
  const setup = async () => {
    const hook = await renderHook(() =>
      useChangePasswordViewModel(repository, logout, onSuccess),
    );
    await act(async () => {
      hook.current.setCurrentPassword(CURRENT);
      hook.current.setNewPassword(NEXT);
      hook.current.setConfirmPassword(NEXT);
    });
    return hook;
  };

  beforeEach(() => {
    repository = { changePassword: jest.fn().mockResolvedValue(MESSAGE) };
    logout = jest.fn().mockResolvedValue(undefined);
    onSuccess = jest.fn();
  });

  test('no permite enviar con campos vacíos', async () => {
    const hook = await renderHook(() =>
      useChangePasswordViewModel(repository, logout),
    );
    expect(hook.current.canSubmit).toBe(false);
    await act(async () => {
      await hook.current.submit();
    });
    expect(repository.changePassword).not.toHaveBeenCalled();
    await hook.unmount();
  });

  test('éxito: envía, avisa con el mensaje del servidor, limpia campos y cierra sesión', async () => {
    const hook = await setup();
    let ok = false;
    await act(async () => {
      ok = await hook.current.submit();
    });
    expect(ok).toBe(true);
    expect(repository.changePassword).toHaveBeenCalledWith(CURRENT, NEXT, NEXT);
    expect(onSuccess).toHaveBeenCalledWith(MESSAGE);
    expect(logout).toHaveBeenCalledTimes(1);
    expect(onSuccess.mock.invocationCallOrder[0]).toBeLessThan(
      logout.mock.invocationCallOrder[0],
    );
    expect(hook.current.isChanged).toBe(true);
    expect(hook.current.currentPassword).toBe('');
    expect(hook.current.newPassword).toBe('');
    expect(hook.current.canSubmit).toBe(false);
    await hook.unmount();
  });

  test('si el cierre de sesión falla el cambio sigue siendo exitoso', async () => {
    logout.mockRejectedValue(new Error('Revocación remota no confirmada'));
    const hook = await setup();
    let ok = false;
    await act(async () => {
      ok = await hook.current.submit();
    });
    expect(ok).toBe(true);
    expect(hook.current.error).toBeNull();
    await hook.unmount();
  });

  test.each([
    [401, 'La contraseña actual no es correcta.'],
    [400, 'La contraseña debe contener letras, números y un símbolo.'],
    [400, 'Las contraseñas no coinciden.'],
    [400, 'La nueva contraseña debe ser diferente de la actual.'],
    [409, 'La contraseña cambió mientras se procesaba la solicitud. Inténtalo de nuevo.'],
  ])('HTTP %i muestra el mensaje del backend, no cierra sesión y conserva los campos', async (status, message) => {
    repository.changePassword.mockRejectedValue(new ApiError(message, status, { message }));
    const hook = await setup();
    let ok = true;
    await act(async () => {
      ok = await hook.current.submit();
    });
    expect(ok).toBe(false);
    expect(hook.current.error).toBe(message);
    expect(logout).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(hook.current.newPassword).toBe(NEXT);
    expect(hook.current.canSubmit).toBe(true);
    await hook.unmount();
  });

  test('tras un 409 se puede reintentar con éxito', async () => {
    repository.changePassword.mockRejectedValueOnce(
      new ApiError('Inténtalo de nuevo.', 409, null),
    );
    const hook = await setup();
    await act(async () => {
      await hook.current.submit();
    });
    await act(async () => {
      await hook.current.submit();
    });
    expect(repository.changePassword).toHaveBeenCalledTimes(2);
    expect(logout).toHaveBeenCalledTimes(1);
    expect(hook.current.error).toBeNull();
    await hook.unmount();
  });

  test('la validación local impide la petición y muestra el error', async () => {
    const hook = await renderHook(() =>
      useChangePasswordViewModel(repository, logout, onSuccess),
    );
    await act(async () => {
      hook.current.setCurrentPassword(CURRENT);
      hook.current.setNewPassword(NEXT);
      hook.current.setConfirmPassword('Otra#7kzz');
    });
    await act(async () => {
      await hook.current.submit();
    });
    expect(hook.current.error).toBe('Las contraseñas no coinciden.');
    expect(repository.changePassword).not.toHaveBeenCalled();
    await hook.unmount();
  });

  test('ignora envíos repetidos mientras hay uno en curso', async () => {
    const pending = deferred<string>();
    repository.changePassword.mockReturnValue(pending.promise);
    const hook = await setup();
    let first!: Promise<boolean>;
    let second = true;
    await act(async () => {
      first = hook.current.submit();
      second = await hook.current.submit();
    });
    expect(second).toBe(false);
    expect(hook.current.isSubmitting).toBe(true);
    expect(hook.current.canSubmit).toBe(false);
    await act(async () => {
      pending.resolve(MESSAGE);
      await first;
    });
    expect(repository.changePassword).toHaveBeenCalledTimes(1);
    await hook.unmount();
  });
});
