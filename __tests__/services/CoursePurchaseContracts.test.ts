import { CourseRepositoryImpl } from '../../src/repositories/implementations/CourseRepositoryImpl';
import { courseService } from '../../src/services/implementations/courseService';
import { PurchaseRepositoryImpl } from '../../src/repositories/implementations/PurchaseRepositoryImpl';
import { purchaseService } from '../../src/services/implementations/purchaseService';
import { tokenStorage } from '../../src/services/security/tokenStorage';
import { CourseDto } from '../../src/services/dto/CourseDto';
import { purchaseInput, paymentInput } from '../helpers/fixtures';
jest.mock('../../src/services/security/tokenStorage', () => ({
  tokenStorage: {
    getSessionVersion: jest.fn(() => 0),
    getAccessToken: jest.fn(async () => 'fixture-access'),
    getRefreshToken: jest.fn(),
    clearTokens: jest.fn(),
    updateAccessToken: jest.fn(),
  },
}));
const dto: CourseDto = {
  idCurso: 1,
  tituloCurso: 'Curso',
  descripcion: null,
  idInstructor: 1,
  idCategoria: 1,
  idUbicacion: null,
  idModalidad: 1,
  fechaInicio: '2026-10-01',
  fechaFin: '2026-12-01',
  horario: null,
  dirigidoA: null,
  cupoMaximo: 20,
  cuposOcupados: 0,
  costo: '100.00',
  urlImagenPortada: null,
  activo: true,
};
const compra = {
  idCompra: 1,
  folioCompra: 'TEST-1',
  usuarioId: 1,
  cursoId: 1,
  tituloCurso: 'Curso',
  cantidadCupos: 1,
  precioUnitario: '100.00',
  subtotal: '100.00',
  descuento: '0.00',
  total: '100.00',
  estado: 'Pendiente de pago',
  fechaCompra: '2026-10-01',
  fechaLimitePago: '2026-12-01',
};
describe('PI - contratos de catálogo y adquisición', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn();
  const response = (status: number, data: unknown) => ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(data),
  });
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
  test('catálogo público mapea DTO sin exigir sesión', async () => {
    (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue(null);
    fetchMock.mockResolvedValueOnce(response(200, [dto]));
    const courses = await new CourseRepositoryImpl(courseService).getCourses();
    expect(courses[0].title).toBe('Curso');
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/cursos$/);
  });
  test('detalle público utiliza el identificador del curso', async () => {
    fetchMock.mockResolvedValueOnce(response(200, dto));
    expect(
      (await new CourseRepositoryImpl(courseService).getCourseById(1)).id,
    ).toBe(1);
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/cursos\/1$/);
  });
  test('detalle rechaza ID inválido o respuesta que corresponde a otro curso', async () => {
    const repository = new CourseRepositoryImpl(courseService);
    await expect(repository.getCourseById(0)).rejects.toThrow('identificador');
    expect(fetchMock).not.toHaveBeenCalled();
    fetchMock.mockResolvedValueOnce(response(200, {...dto, idCurso: 2}));
    await expect(repository.getCourseById(1)).rejects.toThrow('seleccionado');
  });
  test.each(['El curso ya inició y no acepta nuevas compras', 'No hay cupos suficientes'])('A37: HTTP 409 impide conceder una reserva: %s', async message => {
    fetchMock.mockResolvedValueOnce(response(409, {error: message}));
    await expect(new PurchaseRepositoryImpl(purchaseService).createPurchase(purchaseInput)).rejects.toThrow(message);
  });
  test('reserva envía participantes y conserva estado pendiente devuelto por backend', async () => {
    fetchMock.mockResolvedValueOnce(
      response(201, { compra, participantes: [] }),
    );
    const created = await new PurchaseRepositoryImpl(
      purchaseService,
    ).createPurchase(purchaseInput);
    expect(created.status).toBe('Pendiente de pago');
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/compras-cursos$/);
    expect(options.method).toBe('POST');
    expect(new Headers(options.headers).get('Authorization')).toBe(
      'Bearer fixture-access',
    );
    expect(JSON.parse(options.body)).toEqual({
      cursoId: 1,
      cantidadCupos: 1,
      participantes: [{ participanteId: 5 }],
      observacionesUsuario: null,
    });
  });
  test('historial y métodos de pago se mapean sin simular cobros', async () => {
    fetchMock.mockResolvedValueOnce(
      response(200, { compras: [compra], total: 1 }),
    );
    fetchMock.mockResolvedValueOnce(
      response(200, {
        metodos: [
          {
            idMetodoPago: 1,
            nombre: 'Transferencia',
            descripcion: null,
            requiereComprobante: true,
            instrucciones: null,
          },
        ],
      }),
    );
    const repo = new PurchaseRepositoryImpl(purchaseService);
    expect((await repo.getPurchases())[0].folio).toBe('TEST-1');
    expect((await repo.getPaymentMethods())[0].requiresReceipt).toBe(true);
  });
  test('sin token no registra compras ni consulta datos privados', async () => {
    (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue(null);
    await expect(
      purchaseService.createPurchase({
        cursoId: 1,
        cantidadCupos: 1,
        participantes: [],
        observacionesUsuario: null,
      }),
    ).rejects.toMatchObject({ status: 401 });
    await expect(purchaseService.getPurchases()).rejects.toMatchObject({
      status: 401,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  test('error HTTP 500 no muestra detalles internos del servidor', async () => {
    fetchMock.mockResolvedValueOnce(
      response(500, { message: 'private server diagnostic' }),
    );
    await expect(courseService.getCourses()).rejects.not.toThrow(
      'private server diagnostic',
    );
  });
  test('no acepta un detalle ni reporte asociado a otra compra aunque llegue HTTP 200', async () => {
    fetchMock.mockResolvedValueOnce(response(200, {compra: {...compra, idCompra: 999}}));
    const repo = new PurchaseRepositoryImpl(purchaseService);
    await expect(repo.getPurchaseDetail(1)).rejects.toThrow('esta compra');
    fetchMock.mockResolvedValueOnce(response(201, {pago: {idCompra: 999}}));
    await expect(repo.reportPayment(1, paymentInput)).rejects.toThrow('esta compra');
  });
});
