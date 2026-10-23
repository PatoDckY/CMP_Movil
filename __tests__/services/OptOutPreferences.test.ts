import { DEFAULT_OPT_OUT_PREFERENCES } from '../../src/models/OptOutPreferences';
import { OptOutPreferencesRepositoryImpl } from '../../src/repositories/implementations/OptOutPreferencesRepositoryImpl';
import { optOutPreferencesService } from '../../src/services/implementations/optOutPreferencesService';
import { tokenStorage } from '../../src/services/security/tokenStorage';

jest.mock('../../src/services/security/tokenStorage', () => ({
  tokenStorage: {
    getSessionVersion: jest.fn(() => 0),
    getAccessToken: jest.fn(async () => 'fixture-access'),
    getRefreshToken: jest.fn(),
    clearTokens: jest.fn(),
    updateAccessToken: jest.fn(),
  },
}));

describe('A66 - preferencias de Opt-Out sincronizadas con CMP_Site', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn();
  const response = (status: number, data: unknown) => ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(data),
  });
  const body = (overrides = {}) => ({
    preferences: { ...DEFAULT_OPT_OUT_PREFERENCES, ...overrides },
    updatedAt: '2026-10-22T10:00:00.000Z',
  });
  const repository = new OptOutPreferencesRepositoryImpl(
    optOutPreferencesService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = fetchMock;
    (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue(
      'fixture-access',
    );
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('service: GET autenticado a /profile/privacy-preferences', async () => {
    fetchMock.mockResolvedValueOnce(response(200, body({ analytics: true })));
    const result = await optOutPreferencesService.getPreferences();
    expect(result.preferences.analytics).toBe(true);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/profile\/privacy-preferences$/);
    expect(options.method).toBe('GET');
    expect(new Headers(options.headers).get('Authorization')).toBe(
      'Bearer fixture-access',
    );
  });

  test('service: PUT envía exactamente las tres banderas', async () => {
    fetchMock.mockResolvedValueOnce(response(200, body({ shareProgress: true })));
    await optOutPreferencesService.updatePreferences({
      ...DEFAULT_OPT_OUT_PREFERENCES,
      shareProgress: true,
    });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/profile\/privacy-preferences$/);
    expect(options.method).toBe('PUT');
    expect(JSON.parse(options.body)).toEqual({
      nonEssentialCommunications: false,
      analytics: false,
      shareProgress: true,
    });
  });

  test('service: propaga el mensaje del backend ante HTTP 400', async () => {
    fetchMock.mockResolvedValueOnce(response(400, { message: 'Datos inválidos' }));
    await expect(
      optOutPreferencesService.updatePreferences(DEFAULT_OPT_OUT_PREFERENCES),
    ).rejects.toThrow('Datos inválidos');
  });

  test('repository: load devuelve las preferencias del servidor', async () => {
    fetchMock.mockResolvedValueOnce(
      response(200, body({ nonEssentialCommunications: true })),
    );
    expect(await repository.load(1)).toEqual({
      ...DEFAULT_OPT_OUT_PREFERENCES,
      nonEssentialCommunications: true,
    });
  });

  test('repository: usuario sin registro (updatedAt null) queda sin oposición', async () => {
    fetchMock.mockResolvedValueOnce(
      response(200, { preferences: DEFAULT_OPT_OUT_PREFERENCES, updatedAt: null }),
    );
    expect(await repository.load(1)).toEqual(DEFAULT_OPT_OUT_PREFERENCES);
  });

  test('repository: ignora campos desconocidos o no booleanos', async () => {
    fetchMock.mockResolvedValueOnce(
      response(200, {
        preferences: { analytics: 'yes', shareProgress: true, extra: true },
        updatedAt: null,
      }),
    );
    expect(await repository.load(1)).toEqual({
      ...DEFAULT_OPT_OUT_PREFERENCES,
      shareProgress: true,
    });
  });

  test('repository: save envía el cuerpo normalizado', async () => {
    fetchMock.mockResolvedValueOnce(response(200, body({ analytics: true })));
    await repository.save(1, { ...DEFAULT_OPT_OUT_PREFERENCES, analytics: true });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      nonEssentialCommunications: false,
      analytics: true,
      shareProgress: false,
    });
  });

  test('repository: load y save propagan fallos de red/HTTP', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network'));
    await expect(repository.load(1)).rejects.toBeDefined();
    fetchMock.mockResolvedValueOnce(response(500, { message: 'Error' }));
    await expect(
      repository.save(1, DEFAULT_OPT_OUT_PREFERENCES),
    ).rejects.toThrow();
  });
});
