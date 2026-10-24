import { PasswordChangeRepositoryImpl } from '../../src/repositories/implementations/PasswordChangeRepositoryImpl';
import { passwordChangeService } from '../../src/services/implementations/passwordChangeService';
import { tokenStorage } from '../../src/services/security/tokenStorage';

jest.mock('../../src/services/security/tokenStorage', () => ({
  tokenStorage: {
    getSessionVersion: jest.fn(() => 0),
    getAccessToken: jest.fn(async () => 'fixture-access'),
    getRefreshToken: jest.fn(async () => 'fixture-refresh'),
    clearTokens: jest.fn(),
    updateAccessToken: jest.fn(async () => true),
  },
}));

describe('Cambio de contraseña autenticado - servicio y repositorio', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn();
  const response = (status: number, data: unknown) => ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(data),
  });
  const repository = new PasswordChangeRepositoryImpl(passwordChangeService);
  const success = {
    message: 'Contraseña actualizada correctamente. Vuelve a iniciar sesión.',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = fetchMock;
    (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue('fixture-access');
    (tokenStorage.getRefreshToken as jest.Mock).mockResolvedValue('fixture-refresh');
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('PUT autenticado a /profile/password con las tres contraseñas', async () => {
    fetchMock.mockResolvedValueOnce(response(200, success));
    const message = await repository.changePassword('Actual#9x', 'Nueva#7kz', 'Nueva#7kz');
    expect(message).toBe(success.message);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/profile\/password$/);
    expect(options.method).toBe('PUT');
    expect(new Headers(options.headers).get('Authorization')).toBe(
      'Bearer fixture-access',
    );
    expect(JSON.parse(options.body)).toEqual({
      contrasenaActual: 'Actual#9x',
      contrasenaNueva: 'Nueva#7kz',
      confirmarContrasenaNueva: 'Nueva#7kz',
    });
  });

  test.each([
    [401, 'La contraseña actual no es correcta.'],
    [400, 'La contraseña debe contener letras, números y un símbolo.'],
    [400, 'Las contraseñas no coinciden.'],
    [400, 'La nueva contraseña debe ser diferente de la actual.'],
    [409, 'La contraseña cambió mientras se procesaba la solicitud. Inténtalo de nuevo.'],
  ])('HTTP %i propaga el mensaje del backend: %s', async (status, message) => {
    // Para 401 el cliente intenta renovar el token una vez y reenvía.
    fetchMock.mockResolvedValue(response(status, { message }));
    fetchMock.mockResolvedValueOnce(response(status, { message }));
    if (status === 401) {
      fetchMock.mockResolvedValueOnce(response(200, { accessToken: 'renovado' }));
      fetchMock.mockResolvedValueOnce(response(401, { message }));
    }
    await expect(
      repository.changePassword('Actual#9x', 'Nueva#7kz', 'Nueva#7kz'),
    ).rejects.toMatchObject({ status, message });
  });

  test('401 por contraseña actual incorrecta no borra la sesión local', async () => {
    const message = 'La contraseña actual no es correcta.';
    fetchMock
      .mockResolvedValueOnce(response(401, { message }))
      .mockResolvedValueOnce(response(200, { accessToken: 'renovado' }))
      .mockResolvedValueOnce(response(401, { message }));
    await expect(
      repository.changePassword('mala', 'Nueva#7kz', 'Nueva#7kz'),
    ).rejects.toMatchObject({ status: 401, message });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(tokenStorage.clearTokens).not.toHaveBeenCalled();
  });

  test('usa un mensaje por defecto si el servidor no devuelve message', async () => {
    fetchMock.mockResolvedValueOnce(response(200, {}));
    expect(
      await repository.changePassword('Actual#9x', 'Nueva#7kz', 'Nueva#7kz'),
    ).toMatch(/Vuelve a iniciar sesión/);
  });
});
