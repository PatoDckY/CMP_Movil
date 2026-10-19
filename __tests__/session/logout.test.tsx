import React from 'react';
import {AppState, AppStateStatus} from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import * as Keychain from 'react-native-keychain';
import { authRepository } from '../../src/config/dependencies';
import { SessionProvider, useSession } from '../../src/session/SessionContext';
import {
  tokenStorage,
  StoredTokens,
} from '../../src/services/security/tokenStorage';
import { httpClient } from '../../src/services/http/httpClient';

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(),
  setGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

jest.mock('../../src/config/dependencies', () => {
  const {
    AuthRepositoryImpl,
  } = require('../../src/repositories/implementations/AuthRepositoryImpl');
  const {
    authService,
  } = require('../../src/services/implementations/authService');
  return { authRepository: new AuthRepositoryImpl(authService) };
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

function response(status: number, data: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: jest.fn().mockResolvedValue(JSON.stringify(data)),
  } as unknown as Response;
}

const tokens: StoredTokens = {
  accessToken: 'fixture-access',
  refreshToken: 'fixture-refresh',
};
const userDto = {
  id: 1,
  nombre: 'Cliente',
  apellidoPaterno: 'Prueba',
  apellidoMaterno: null,
  nombreCompleto: 'Cliente Prueba',
  correo: 'cliente@example.com',
  email: 'cliente@example.com',
  rol: 'cliente',
};
const sessionResponse = () => response(200, { ok: true, usuario: userDto });

describe('Logout local y revocación remota (integración con mocks)', () => {
  let credentials: false | { username: string; password: string };
  let session: ReturnType<typeof useSession>;
  let foregroundHandler: (state: AppStateStatus) => void;
  let renderer: ReturnType<typeof ReactTestRenderer.create> | undefined;
  const fetchMock = jest.fn();
  const originalFetch = globalThis.fetch;
  const get = Keychain.getGenericPassword as jest.Mock;
  const set = Keychain.setGenericPassword as jest.Mock;
  const reset = Keychain.resetGenericPassword as jest.Mock;

  function Probe() {
    session = useSession();
    return null;
  }

  async function mount() {
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <SessionProvider>
          <Probe />
        </SessionProvider>,
      );
    });
  }

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, listener) => {
      foregroundHandler = listener;
      return {remove: jest.fn()};
    });
    credentials = false;
    get.mockImplementation(async () => credentials);
    set.mockImplementation(async (username: string, password: string) => {
      credentials = { username, password };
      return { service: 'cmp_mobile_auth', storage: 'mock' };
    });
    reset.mockImplementation(async () => {
      credentials = false;
      return true;
    });
    await tokenStorage.clearTokens();
    await tokenStorage.saveTokens(tokens);
    fetchMock.mockImplementation(async (url: string) => {
      if (url.endsWith('/auth/check-session')) {
        return sessionResponse();
      }
      if (url.endsWith('/auth/mobile/logout')) {
        return response(200, { message: 'Sesión móvil cerrada correctamente' });
      }
      throw new Error('Petición inesperada en una prueba offline');
    });
    globalThis.fetch = fetchMock;
  });

  afterEach(async () => {
    await act(async () => renderer?.unmount());
    renderer = undefined;
    jest.useRealTimers();
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test('logout exitoso borra Keychain antes de revocar con Bearer y no restaura al reiniciar', async () => {
    await mount();
    expect(session.isAuthenticated).toBe(true);
    fetchMock.mockImplementationOnce(
      async (url: string, options: RequestInit) => {
        expect(url.endsWith('/auth/mobile/logout')).toBe(true);
        expect(options.method).toBe('POST');
        expect(new Headers(options.headers).get('Authorization')).toBe(
          `Bearer ${tokens.accessToken}`,
        );
        expect(options.body).toBeUndefined();
        expect(credentials).toBe(false);
        return response(200, { message: 'OK' });
      },
    );
    await act(async () => {
      await session.logout();
    });
    expect(session.user).toBeNull();
    expect(await tokenStorage.getTokens()).toBeNull();

    let restarted!: typeof tokenStorage;
    jest.isolateModules(() => {
      restarted =
        require('../../src/services/security/tokenStorage').tokenStorage;
    });
    expect(await restarted.getTokens()).toBeNull();
    expect(await restarted.getAccessToken()).toBeNull();
    expect(await restarted.getRefreshToken()).toBeNull();
    const {
      AuthRepositoryImpl,
    } = require('../../src/repositories/implementations/AuthRepositoryImpl');
    const {
      authService,
    } = require('../../src/services/implementations/authService');
    const restartedRepository = new AuthRepositoryImpl(authService, restarted);
    fetchMock.mockClear();
    expect(await restartedRepository.getCurrentUser()).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();

    await act(async () => renderer?.unmount());
    fetchMock.mockClear();
    await mount();
    expect(session.isAuthenticated).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  test('la continuación de una compra solo vive en memoria y se limpia al cerrar sesión', async () => {
    await mount();
    await act(async () => {session.setAuthenticatedUser(session.user!, 42);});
    expect(session.initialPurchaseCourseId).toBe(42);
    await act(async () => {await session.logout();});
    expect(session.initialPurchaseCourseId).toBeNull();
    expect(session.user).toBeNull();
    await act(async () => {session.setAuthenticatedUser({id: 2, firstName: 'Nueva', fullName: 'Nueva cuenta', email: 'nueva@example.com', role: 'cliente', paternalLastName: null, maternalLastName: null});});
    expect(session.initialPurchaseCourseId).toBeNull();
  });
  test.each([0, -1, NaN, 1.5])('no restaura intenciones con identificador inválido %s', async courseId => {
    await mount();
    await act(async () => {session.setAuthenticatedUser(session.user!, courseId);});
    expect(session.initialPurchaseCourseId).toBeNull();
  });

  test('error de conexión informa fallo remoto y conserva cerrada la sesión local', async () => {
    await mount();
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    await act(async () => {
      await expect(session.logout()).rejects.toMatchObject({ phase: 'remote' });
    });
    expect(session.isAuthenticated).toBe(false);
    expect(credentials).toBe(false);
    expect(await tokenStorage.getRefreshToken()).toBeNull();
  });

  test('revocación con 401 no renueva tokens ni vuelve a abrir la sesión', async () => {
    await mount();
    fetchMock.mockResolvedValueOnce(response(401, { message: 'Expiró' }));
    await act(async () => {
      await expect(session.logout()).rejects.toMatchObject({ phase: 'remote' });
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(credentials).toBe(false);
    expect(session.isAuthenticated).toBe(false);
  });

  test('servidor sin respuesta: limpia inmediatamente y termina a los diez segundos', async () => {
    await mount();
    jest.useFakeTimers();
    const pending = deferred<Response>();
    fetchMock.mockReturnValueOnce(pending.promise);
    let logout!: Promise<unknown>;
    await act(async () => {
      logout = session.logout().catch(error => error);
    });
    expect(session.isAuthenticated).toBe(false);
    expect(credentials).toBe(false);
    const options = fetchMock.mock.calls[1][1] as RequestInit;
    await act(async () => {
      await jest.advanceTimersByTimeAsync(10_000);
    });
    expect(await logout).toMatchObject({ phase: 'remote' });
    expect(options.signal?.aborted).toBe(true);
    // Incluso si fetch ignora abort y responde tarde, no restaura credenciales.
    pending.resolve(response(200, { message: 'OK' }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(session.user).toBeNull();
    expect(credentials).toBe(false);
  });

  test.each(['rechazo', 'false', 'persistencia'])(
    'fallo de Keychain (%s): informa error local y mantiene bloqueado el acceso',
    async mode => {
      await mount();
      if (mode === 'rechazo') {
        reset.mockRejectedValueOnce(new Error('Native failure'));
      } else if (mode === 'false') {
        reset.mockResolvedValueOnce(false);
      } else {
        reset.mockResolvedValueOnce(true);
      }
      await act(async () => {
        await expect(session.logout()).rejects.toMatchObject({
          phase: 'local',
        });
      });
      expect(session.isAuthenticated).toBe(false);
      expect(await tokenStorage.getTokens()).toBeNull();
      expect(credentials).not.toBe(false);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      await act(async () => {
        await session.restoreSession();
      });
      expect(session.user).toBeNull();
      // Reintentar la limpieza sí permite eliminar las credenciales persistidas.
      await act(async () => {
        await session.logout();
      });
      expect(credentials).toBe(false);
    },
  );

  test('una restauración pendiente no vuelve a autenticar después del logout', async () => {
    const pending = deferred<Response>();
    fetchMock.mockReturnValueOnce(pending.promise);
    await mount();
    expect(session.isRestoring).toBe(true);
    await act(async () => {
      await session.logout();
    });
    pending.resolve(sessionResponse());
    await act(async () => {
      await Promise.resolve();
    });
    expect(session.user).toBeNull();
    expect(session.isRestoring).toBe(false);
    expect(credentials).toBe(false);
  });

  test('el contexto ignora resultados tardíos aunque el repositorio entregue un usuario', async () => {
    const pending =
      deferred<Awaited<ReturnType<typeof authRepository.getCurrentUser>>>();
    jest
      .spyOn(authRepository, 'getCurrentUser')
      .mockReturnValueOnce(pending.promise);
    await mount();
    await act(async () => {
      await session.logout();
    });
    pending.resolve({
      id: 1,
      firstName: 'Cliente',
      paternalLastName: 'Prueba',
      maternalLastName: null,
      fullName: 'Cliente Prueba',
      email: 'cliente@example.com',
      role: 'cliente',
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(session.isAuthenticated).toBe(false);
    expect(session.isRestoring).toBe(false);
  });

  test('un nuevo login explícito después del cierre sí permite una nueva sesión', async () => {
    await mount();
    await act(async () => {
      await session.logout();
    });
    fetchMock.mockResolvedValueOnce(
      response(200, {
        usuario: userDto,
        accessToken: 'new-login-access',
        refreshToken: 'new-login-refresh',
      }),
    );
    await act(async () => {
      const result = await authRepository.login(
        'cliente@example.com',
        'fixture',
      );
      if (result.status === 'authenticated') {
        session.setAuthenticatedUser(result.user);
      }
    });
    expect(session.isAuthenticated).toBe(true);
    expect(await tokenStorage.getAccessToken()).toBe('new-login-access');
  });

  test('el límite remoto también cubre un cuerpo de respuesta que nunca termina', async () => {
    await mount();
    jest.useFakeTimers();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => new Promise(() => {}),
    });
    let logout!: Promise<unknown>;
    await act(async () => {
      logout = session.logout().catch(error => error);
    });
    expect(credentials).toBe(false);
    await act(async () => {
      await jest.advanceTimersByTimeAsync(10_000);
    });
    expect(await logout).toMatchObject({ phase: 'remote' });
    expect(session.isAuthenticated).toBe(false);
  });

  test.each([200, 401])(
    'refresh pendiente (%s) no reescribe tokens ni repite la petición tras logout y nuevo login',
    async status => {
      await mount();
      const pending = deferred<Response>();
      const refreshing = deferred<void>();
      fetchMock.mockResolvedValueOnce(response(401, { message: 'Expiró' }));
      fetchMock.mockImplementationOnce(() => {
        refreshing.resolve();
        return pending.promise;
      });
      const request = httpClient
        .request('/cliente/mis-cursos')
        .catch(error => error);
      await refreshing.promise;
      await act(async () => {
        await session.logout();
      });
      const nextTokens = {
        accessToken: 'next-access',
        refreshToken: 'next-refresh',
      };
      await tokenStorage.saveTokens(nextTokens);
      const writes = set.mock.calls.length;
      pending.resolve(response(status, { accessToken: 'late-access' }));
      expect(await request).toMatchObject({ status: 401 });
      expect(set).toHaveBeenCalledTimes(writes);
      expect(await tokenStorage.getTokens()).toEqual(nextTokens);
      expect(fetchMock).toHaveBeenCalledTimes(4);
      expect(session.isAuthenticated).toBe(false);
    },
  );

  test('un guardado nativo de refresh ya iniciado termina antes del borrado definitivo', async () => {
    await mount();
    const writing = deferred<void>();
    const release = deferred<void>();
    set.mockImplementationOnce(async (username: string, password: string) => {
      writing.resolve();
      await release.promise;
      credentials = { username, password };
      return { service: 'cmp_mobile_auth', storage: 'mock' };
    });
    const update = tokenStorage.updateAccessToken('late-access');
    await writing.promise;
    let logout!: Promise<void>;
    await act(async () => {
      logout = session.logout();
    });
    expect(session.isAuthenticated).toBe(false);
    release.resolve();
    await act(async () => {
      await logout;
    });
    expect(await update).toBe(false);
    expect(credentials).toBe(false);
    expect(await tokenStorage.getTokens()).toBeNull();
  });

  test('lectura pendiente de Keychain no entrega tokens después del logout', async () => {
    const oldCredentials = credentials;
    const pending = deferred<typeof credentials>();
    get.mockReturnValueOnce(pending.promise);
    const read = tokenStorage.getTokens();
    await authRepository.logout();
    pending.resolve(oldCredentials);
    expect(await read).toBeNull();
  });

  test('pulsaciones repetidas comparten el cierre y bloquean login mientras se revoca', async () => {
    await mount();
    const pending = deferred<Response>();
    fetchMock.mockReturnValueOnce(pending.promise);
    let first!: Promise<void>;
    let second!: Promise<void>;
    await act(async () => {
      first = session.logout();
      second = session.logout();
    });
    expect(first).toBe(second);
    await expect(
      authRepository.login('cliente@example.com', 'fixture'),
    ).rejects.toThrow('Espera');
    pending.resolve(response(200, { message: 'OK' }));
    await act(async () => {
      await first;
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('un login pendiente no guarda credenciales después del logout', async () => {
    const pending = deferred<Response>();
    const started = deferred<void>();
    fetchMock.mockImplementationOnce(() => {
      started.resolve();
      return pending.promise;
    });
    const login = authRepository
      .login('cliente@example.com', 'fixture')
      .catch(error => error);
    await started.promise;
    await authRepository.logout();
    pending.resolve(response(200, { usuario: userDto, ...tokens }));
    expect(await login).toBeInstanceOf(Error);
    expect(credentials).toBe(false);
  });

  test('un error al capturar el token no impide borrarlo y se informa revocación no confirmada', async () => {
    await mount();
    get.mockRejectedValueOnce(new Error('Read failed'));
    await act(async () => {
      await expect(session.logout()).rejects.toMatchObject({ phase: 'remote' });
    });
    expect(credentials).toBe(false);
    expect(session.isAuthenticated).toBe(false);
  });

  test('refresh rechazado definitivamente retira usuario y credenciales', async () => {
    await mount();
    fetchMock.mockResolvedValueOnce(response(401, {message: 'Expiró'}))
      .mockResolvedValueOnce(response(401, {message: 'Cuenta desactivada o token revocado'}));
    await act(async () => {
      await expect(httpClient.request('/cliente/mis-cursos')).rejects.toMatchObject({status: 401});
    });
    expect(session.isAuthenticated).toBe(false);
    expect(credentials).toBe(false);
  });

  test('un 403 de contraseña incorrecta no invalida la sesión', async () => {
    await mount();
    fetchMock.mockResolvedValueOnce(response(403, {message: 'Contraseña incorrecta'}));
    await act(async () => {
      await expect(httpClient.request('/account', {method: 'DELETE'})).rejects.toMatchObject({status: 403});
    });
    expect(session.isAuthenticated).toBe(true);
    expect(await tokenStorage.getTokens()).toEqual(tokens);
  });

  test('fallo de red durante refresh conserva la sesión y permite recuperación posterior', async () => {
    await mount();
    fetchMock.mockResolvedValueOnce(response(401, {message: 'Expiró'}))
      .mockRejectedValueOnce(new TypeError('Network request failed'));
    await act(async () => {
      await expect(httpClient.request('/cliente/mis-cursos')).rejects.toMatchObject({status: 401});
    });
    expect(session.isAuthenticated).toBe(true);
    expect(await tokenStorage.getTokens()).toEqual(tokens);
  });

  test('refresh sin respuesta vence y no bloquea una renovación posterior', async () => {
    await mount();
    jest.useFakeTimers();
    const pending = deferred<Response>();
    fetchMock.mockResolvedValueOnce(response(401, {message: 'Expiró'}))
      .mockReturnValueOnce(pending.promise);
    const request = httpClient.request('/cliente/mis-cursos').catch(error => error);
    await act(async () => { await jest.advanceTimersByTimeAsync(15_000); });
    expect(await request).toMatchObject({status: 401});
    expect(session.isAuthenticated).toBe(true);
    fetchMock.mockResolvedValueOnce(response(401, {message: 'Expiró'}))
      .mockResolvedValueOnce(response(200, {accessToken: 'renewed-fixture'}))
      .mockResolvedValueOnce(response(200, {ok: true}));
    await expect(httpClient.request('/cliente/mis-cursos')).resolves.toEqual({ok: true});
    pending.resolve(response(401, {message: 'Respuesta antigua'}));
    await act(async () => { await Promise.resolve(); });
    expect(await tokenStorage.getAccessToken()).toBe('renewed-fixture');
    expect(session.isAuthenticated).toBe(true);
  });

  test('fallo transitorio al actualizar perfil de sesión no cierra una sesión existente', async () => {
    await mount();
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    await act(async () => { await session.restoreSession(); });
    expect(session.isAuthenticated).toBe(true);
  });

  test('al volver a primer plano revalida una cuenta desactivada', async () => {
    await mount();
    fetchMock.mockResolvedValueOnce(response(401, {message: 'Sesión inválida'}))
      .mockResolvedValueOnce(response(401, {message: 'Cuenta desactivada'}));
    await act(async () => { foregroundHandler('active'); });
    expect(session.isAuthenticated).toBe(false);
    expect(credentials).toBe(false);
  });

  test('revalidar una sesión activa no activa el bloqueo inicial que desmonta la navegación', async () => {
    await mount();
    const pending = deferred<Response>();
    fetchMock.mockReturnValueOnce(pending.promise);
    let restoring!: Promise<void>;
    await act(async () => { restoring = session.restoreSession(); });
    expect(session.isRestoring).toBe(false);
    pending.resolve(sessionResponse());
    await act(async () => { await restoring; });
  });

  test('una petición de la sesión anterior no entrega datos tras guardar otra sesión', async () => {
    const pending = deferred<Response>();
    const started = deferred<void>();
    fetchMock.mockImplementationOnce(() => { started.resolve(); return pending.promise; });
    const request = httpClient.request('/cliente/mis-cursos').catch(error => error);
    await started.promise;
    const next = {accessToken: 'next-access', refreshToken: 'next-refresh'};
    await tokenStorage.saveTokens(next);
    pending.resolve(response(200, {privateFixture: 'previous-account'}));
    expect(await request).toMatchObject({status: 401});
    expect(await tokenStorage.getTokens()).toEqual(next);
  });

  test('refresh pendiente no sobrescribe una sesión nueva aunque no haya logout previo', async () => {
    const pending = deferred<Response>();
    const started = deferred<void>();
    fetchMock.mockResolvedValueOnce(response(401, {})).mockImplementationOnce(() => {
      started.resolve(); return pending.promise;
    });
    const request = httpClient.request('/cliente/mis-cursos').catch(error => error);
    await started.promise;
    const next = {accessToken: 'next-access', refreshToken: 'next-refresh'};
    await tokenStorage.saveTokens(next);
    pending.resolve(response(200, {accessToken: 'previous-session-renewal'}));
    expect(await request).toMatchObject({status: 401});
    expect(await tokenStorage.getTokens()).toEqual(next);
  });

  test('dos logins concurrentes no permiten que la respuesta antigua sustituya al usuario nuevo', async () => {
    const pending = deferred<Response>();
    const started = deferred<void>();
    fetchMock.mockImplementationOnce(() => { started.resolve(); return pending.promise; });
    const first = authRepository.login('first@example.com', 'fixture').catch(error => error);
    await started.promise;
    fetchMock.mockResolvedValueOnce(response(200, {usuario: {...userDto, id: 2}, accessToken: 'second-access', refreshToken: 'second-refresh'}));
    expect((await authRepository.login('second@example.com', 'fixture')).status).toBe('authenticated');
    pending.resolve(response(200, {usuario: userDto, accessToken: 'first-access', refreshToken: 'first-refresh'}));
    expect(await first).toBeInstanceOf(Error);
    expect(await tokenStorage.getAccessToken()).toBe('second-access');
  });

  test('no guarda un par de tokens vacío o inválido', async () => {
    await expect(tokenStorage.saveTokens({accessToken: '', refreshToken: 'fixture'})).rejects.toThrow();
    expect(await tokenStorage.getTokens()).toEqual(tokens);
  });

  test('Keychain no puede confirmar un guardado sin persistir el par de tokens', async () => {
    await mount();
    set.mockResolvedValueOnce({service: 'mock', storage: 'mock'});
    await act(async () => {
      await expect(tokenStorage.saveTokens({accessToken: 'next-access', refreshToken: 'next-refresh'})).rejects.toThrow();
    });
    expect(session.isAuthenticated).toBe(false);
    expect(credentials).toBe(false);
  });

  test('un fallo al limpiar datos corruptos no dispara un segundo borrado', async () => {
    credentials = {username: 'fixture', password: '{}'};
    reset.mockClear().mockRejectedValue(new Error('Native failure'));
    await expect(tokenStorage.getTokens()).rejects.toThrow();
    expect(reset).toHaveBeenCalledTimes(1);
  });

  test('la desaparición de credenciales bloquea el contexto al consultar una ruta privada', async () => {
    await mount();
    credentials = false;
    await act(async () => {
      await expect(httpClient.request('/profile', {}, {requireAuthentication: true})).rejects.toMatchObject({status: 401});
    });
    expect(session.isAuthenticated).toBe(false);
  });

  test('una sesión nueva puede renovar mientras el refresh de la anterior sigue pendiente', async () => {
    const pending = deferred<Response>();
    const started = deferred<void>();
    fetchMock.mockResolvedValueOnce(response(401, {})).mockImplementationOnce(() => {
      started.resolve(); return pending.promise;
    });
    const oldRequest = httpClient.request('/cliente/mis-cursos').catch(error => error);
    await started.promise;
    await tokenStorage.saveTokens({accessToken: 'next-access', refreshToken: 'next-refresh'});
    fetchMock.mockResolvedValueOnce(response(401, {}))
      .mockResolvedValueOnce(response(200, {accessToken: 'next-renewed'}))
      .mockResolvedValueOnce(response(200, {newSession: true}));
    await expect(httpClient.request('/cliente/mis-cursos')).resolves.toEqual({newSession: true});
    pending.resolve(response(200, {accessToken: 'old-renewed'}));
    expect(await oldRequest).toMatchObject({status: 401});
    expect(await tokenStorage.getAccessToken()).toBe('next-renewed');
  });

  test('actualizar perfil refresca el nombre del contexto y rechaza otro ID', async () => {
    await mount();
    const profile = {id: userDto.id, firstName: 'Nuevo', paternalLastName: 'Nombre', maternalLastName: null, age: 25, sex: 'otro', phone: '5555555555', email: userDto.correo};
    await act(async () => { session.updateProfile(profile); });
    expect(session.user?.fullName).toBe('Nuevo Nombre');
    await act(async () => { session.updateProfile({...profile, id: 999, firstName: 'Ajeno'}); });
    expect(session.user?.fullName).toBe('Nuevo Nombre');
  });
});
