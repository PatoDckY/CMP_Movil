import { LegalRepositoryImpl } from '../../src/repositories/implementations/LegalRepositoryImpl';
import { legalService } from '../../src/services/implementations/legalService';
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

const body = (overrides = {}) => ({
  tipo: 'aviso_privacidad',
  version: '1.0',
  resumen: 'Resumen',
  contenido: '# Aviso',
  vigenteDesde: '2026-10-24T21:01:12.147Z',
  ...overrides,
});

describe('Documentos legales - servicio y repositorio', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn();
  const response = (status: number, data: unknown) => ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(data),
  });
  const repository = new LegalRepositoryImpl(legalService);

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = fetchMock;
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('GET público a /legal/{tipo} sin Authorization', async () => {
    (tokenStorage.getAccessToken as jest.Mock).mockResolvedValueOnce(null);
    fetchMock.mockResolvedValueOnce(response(200, body()));
    const result = await legalService.obtener('aviso_privacidad');
    expect(result.version).toBe('1.0');
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/legal\/aviso_privacidad$/);
    expect(options.method).toBe('GET');
    expect(new Headers(options.headers).get('Authorization')).toBeNull();
  });

  test('el repositorio devuelve el documento válido', async () => {
    fetchMock.mockResolvedValueOnce(
      response(200, body({ tipo: 'terminos_condiciones' })),
    );
    const doc = await repository.obtener('terminos_condiciones');
    expect(doc.tipo).toBe('terminos_condiciones');
    expect(doc.contenido).toBe('# Aviso');
  });

  test.each([
    ['tipo distinto', { tipo: 'terminos_condiciones' }],
    ['contenido vacío', { contenido: '  ' }],
    ['sin versión', { version: undefined }],
  ])('rechaza respuestas inválidas: %s', async (_name, overrides) => {
    fetchMock.mockResolvedValueOnce(response(200, body(overrides)));
    await expect(repository.obtener('aviso_privacidad')).rejects.toThrow(
      'documento legal válido',
    );
  });

  test('propaga el error HTTP', async () => {
    fetchMock.mockResolvedValueOnce(response(404, { error: 'Documento no encontrado' }));
    await expect(repository.obtener('aviso_privacidad')).rejects.toThrow(
      'Documento no encontrado',
    );
  });
});
