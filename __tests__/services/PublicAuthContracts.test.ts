import { authService } from '../../src/services/implementations/authService';
import { passwordRecoveryService } from '../../src/services/implementations/passwordRecoveryService';
import { PasswordRecoveryRepositoryImpl } from '../../src/repositories/implementations/PasswordRecoveryRepositoryImpl';
import { tokenStorage } from '../../src/services/security/tokenStorage';

jest.mock('../../src/services/security/tokenStorage', () => ({
  tokenStorage: {
    getSessionVersion: jest.fn(() => 0),
    getAccessToken: jest.fn(async () => null),
  },
}));

describe('A21/A25 - registro y recuperación con servicios inyectados y plazo de red', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn();
  const registration = {
    nombre: 'Persona',
    apellidoPaterno: 'Prueba',
    apellidoMaterno: null,
    edad: 25,
    sexo: 'otro' as const,
    telefono: '5555555555',
    correo: 'fixture@example.com',
    contrasena: 'fixture-only',
    codigoVerificacion: '654321',
  };
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = fetchMock;
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.useRealTimers();
  });
  test('repositorio de recuperación normaliza correo y acepta un servicio sustituible', async () => {
    const service = {
      requestPasswordReset: jest.fn(async () => ({
        message: 'Respuesta genérica',
      })),
    };
    await new PasswordRecoveryRepositoryImpl(service).requestPasswordReset(
      ' Fixture@Example.com ',
    );
    expect(service.requestPasswordReset).toHaveBeenCalledWith(
      'fixture@example.com',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
  test.each(['otp', 'register', 'recovery'])(
    '%s: servidor sin respuesta no mantiene el proceso pendiente indefinidamente',
    async operation => {
      jest.useFakeTimers();
      fetchMock.mockReturnValue(new Promise(() => {}));
      const promise =
        operation === 'otp'
          ? authService.sendRegistrationOtp({
              email: 'fixture@example.com',
              nombre: 'Persona',
            })
          : operation === 'register'
          ? authService.register(registration)
          : passwordRecoveryService.requestPasswordReset('fixture@example.com');
      const result = promise.catch(error => error);
      await jest.advanceTimersByTimeAsync(15_000);
      expect(await result).toBeInstanceOf(Error);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
      expect(tokenStorage.getAccessToken).toHaveBeenCalled();
    },
  );
});
