import { NotificationRepositoryImpl } from '../../src/repositories/implementations/NotificationRepositoryImpl';
import { notificationService } from '../../src/services/implementations/notificationService';
import { NotificationDto } from '../../src/services/dto/NotificationDto';
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

const dto = (overrides: Partial<NotificationDto> = {}): NotificationDto => ({
  id: 1,
  courseId: 4,
  enrollmentId: 9,
  sessionId: null,
  evaluationId: null,
  type: 'recordatorio',
  title: 'Sesión mañana',
  message: 'Tu sesión inicia a las 9:00',
  channel: 'app',
  deliveryStatus: 'Enviada',
  scheduledAt: '2026-10-20T10:00:00.000Z',
  sentAt: '2026-10-20T10:00:05.000Z',
  readAt: null,
  ...overrides,
});

describe('Centro de notificaciones - servicio y repositorio', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn();
  const response = (status: number, data: unknown) => ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(data),
  });
  const page = (overrides = {}) => ({
    notifications: [dto()],
    unreadCount: 1,
    page: 1,
    pageSize: 20,
    total: 1,
    ...overrides,
  });
  const repository = new NotificationRepositoryImpl(notificationService);

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

  describe('servicio', () => {
    test('GET autenticado con page y pageSize en el querystring', async () => {
      fetchMock.mockResolvedValueOnce(response(200, page()));
      const result = await notificationService.getNotifications(2, 10);
      expect(result.unreadCount).toBe(1);
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toMatch(/\/api\/cliente\/notificaciones\?page=2&pageSize=10$/);
      expect(options.method).toBe('GET');
      expect(new Headers(options.headers).get('Authorization')).toBe(
        'Bearer fixture-access',
      );
    });

    test('PATCH sin cuerpo a /{id}/leida y respuesta sin envolver', async () => {
      fetchMock.mockResolvedValueOnce(
        response(200, dto({ readAt: '2026-10-21T08:00:00.000Z' })),
      );
      const result = await notificationService.markAsRead(7);
      expect(result.readAt).toBe('2026-10-21T08:00:00.000Z');
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toMatch(/\/api\/cliente\/notificaciones\/7\/leida$/);
      expect(options.method).toBe('PATCH');
      expect(options.body).toBeUndefined();
    });

    test.each([
      [404, 'Notificación no encontrada'],
      [409, 'La notificación aún no ha sido enviada'],
    ])('PATCH propaga el mensaje del backend ante HTTP %i', async (status, message) => {
      fetchMock.mockResolvedValueOnce(response(status, { error: message }));
      await expect(notificationService.markAsRead(7)).rejects.toMatchObject({
        status,
        message,
      });
    });
  });

  describe('repositorio', () => {
    test('mapea DTO a dominio y conserva paginación y contador', async () => {
      fetchMock.mockResolvedValueOnce(
        response(200, page({ page: 2, pageSize: 5, total: 12, unreadCount: 4 })),
      );
      const result = await repository.getNotifications(2, 5);
      expect(result).toEqual({
        notifications: [dto()],
        unreadCount: 4,
        page: 2,
        pageSize: 5,
        total: 12,
      });
    });

    test('usa página 1 y 20 por defecto y limita pageSize a 50', async () => {
      fetchMock.mockResolvedValue(response(200, page()));
      await repository.getNotifications();
      await repository.getNotifications(0, 500);
      await repository.getNotifications(3, 50);
      expect(fetchMock.mock.calls[0][0]).toMatch(/page=1&pageSize=20$/);
      expect(fetchMock.mock.calls[1][0]).toMatch(/page=1&pageSize=50$/);
      expect(fetchMock.mock.calls[2][0]).toMatch(/page=3&pageSize=50$/);
    });

    test('rechaza respuestas con estructura inválida', async () => {
      fetchMock.mockResolvedValueOnce(response(200, { notifications: 'x' }));
      await expect(repository.getNotifications()).rejects.toThrow('válidas');
      fetchMock.mockResolvedValueOnce(
        response(200, page({ notifications: [dto({ id: 0 })] })),
      );
      await expect(repository.getNotifications()).rejects.toThrow('válida');
    });

    test('markAsRead devuelve la notificación leída (idempotente)', async () => {
      const already = dto({ readAt: '2026-10-19T08:00:00.000Z' });
      fetchMock.mockResolvedValueOnce(response(200, already));
      expect(await repository.markAsRead(1)).toEqual(already);
    });

    test('markAsRead valida el identificador sin llamar al servidor', async () => {
      await expect(repository.markAsRead(0)).rejects.toThrow('válida');
      expect(fetchMock).not.toHaveBeenCalled();
    });

    test.each([404, 409])('markAsRead propaga HTTP %i', async status => {
      fetchMock.mockResolvedValueOnce(response(status, { error: 'fallo' }));
      await expect(repository.markAsRead(1)).rejects.toMatchObject({ status });
    });
  });
});
