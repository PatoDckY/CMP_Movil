import { Notification } from '../../src/models/Notification';
import {
  NotificationPage,
  NotificationRepository,
} from '../../src/repositories/contracts/NotificationRepository';
import {
  useNotificationsViewModel,
  useUnreadNotificationsCount,
} from '../../src/viewmodels/notifications/useNotificationsViewModel';
import { act, deferred, renderHook } from '../helpers/renderHook';

const item = (id: number, readAt: string | null = null): Notification => ({
  id,
  courseId: null,
  enrollmentId: null,
  sessionId: null,
  evaluationId: null,
  type: 'aviso',
  title: `Aviso ${id}`,
  message: 'Mensaje',
  channel: 'app',
  deliveryStatus: 'Enviada',
  scheduledAt: null,
  sentAt: '2026-10-20T10:00:00.000Z',
  readAt,
});

const pageOf = (
  notifications: Notification[],
  overrides: Partial<NotificationPage> = {},
): NotificationPage => ({
  notifications,
  unreadCount: notifications.filter(n => n.readAt === null).length,
  page: 1,
  pageSize: 2,
  total: notifications.length,
  ...overrides,
});

describe('Centro de notificaciones - useNotificationsViewModel', () => {
  let repository: jest.Mocked<NotificationRepository>;

  beforeEach(() => {
    repository = {
      getNotifications: jest
        .fn()
        .mockResolvedValue(pageOf([item(1), item(2, '2026-10-19T00:00:00.000Z')])),
      markAsRead: jest.fn(),
    };
  });

  test('carga la primera página al montar y expone unreadCount', async () => {
    const hook = await renderHook(() => useNotificationsViewModel(repository, 2));
    expect(repository.getNotifications).toHaveBeenCalledWith(1, 2);
    expect(hook.current.state).toBe('success');
    expect(hook.current.notifications.map(n => n.id)).toEqual([1, 2]);
    expect(hook.current.unreadCount).toBe(1);
    await hook.unmount();
  });

  test('estado vacío cuando no hay notificaciones', async () => {
    repository.getNotifications.mockResolvedValue(pageOf([]));
    const hook = await renderHook(() => useNotificationsViewModel(repository));
    expect(hook.current.isEmpty).toBe(true);
    await hook.unmount();
  });

  test('error de carga muestra el mensaje y permite reintentar', async () => {
    repository.getNotifications.mockRejectedValueOnce(new Error('Sin conexión'));
    const hook = await renderHook(() => useNotificationsViewModel(repository));
    expect(hook.current.state).toBe('error');
    expect(hook.current.error).toBe('Sin conexión');
    await act(async () => hook.current.load());
    expect(hook.current.state).toBe('success');
    expect(hook.current.error).toBeNull();
    await hook.unmount();
  });

  test('loadMore agrega la siguiente página sin duplicados', async () => {
    repository.getNotifications
      .mockResolvedValueOnce(pageOf([item(1), item(2)], { total: 3 }))
      .mockResolvedValueOnce(
        pageOf([item(2), item(3)], { page: 2, total: 3, unreadCount: 3 }),
      );
    const hook = await renderHook(() => useNotificationsViewModel(repository, 2));
    expect(hook.current.hasMore).toBe(true);
    await act(async () => hook.current.loadMore());
    expect(repository.getNotifications).toHaveBeenLastCalledWith(2, 2);
    expect(hook.current.notifications.map(n => n.id)).toEqual([1, 2, 3]);
    expect(hook.current.hasMore).toBe(false);
    await act(async () => hook.current.loadMore());
    expect(repository.getNotifications).toHaveBeenCalledTimes(2);
    await hook.unmount();
  });

  test('error al cargar más conserva la lista y reporta el error', async () => {
    repository.getNotifications
      .mockResolvedValueOnce(pageOf([item(1), item(2)], { total: 4 }))
      .mockRejectedValueOnce(new Error('Fallo de red'));
    const hook = await renderHook(() => useNotificationsViewModel(repository, 2));
    await act(async () => hook.current.loadMore());
    expect(hook.current.notifications).toHaveLength(2);
    expect(hook.current.actionError).toBe('Fallo de red');
    expect(hook.current.state).toBe('success');
    await hook.unmount();
  });

  test('refresh reinicia desde la página 1', async () => {
    repository.getNotifications
      .mockResolvedValueOnce(pageOf([item(1)], { total: 5 }))
      .mockResolvedValueOnce(pageOf([item(9), item(1)], { unreadCount: 2 }));
    const hook = await renderHook(() => useNotificationsViewModel(repository, 2));
    await act(async () => hook.current.refresh());
    expect(repository.getNotifications).toHaveBeenLastCalledWith(1, 2);
    expect(hook.current.notifications.map(n => n.id)).toEqual([9, 1]);
    expect(hook.current.unreadCount).toBe(2);
    expect(hook.current.isRefreshing).toBe(false);
    await hook.unmount();
  });

  test('refresh fallido conserva la lista visible', async () => {
    const hook = await renderHook(() => useNotificationsViewModel(repository));
    repository.getNotifications.mockRejectedValueOnce(new Error('Sin red'));
    await act(async () => hook.current.refresh());
    expect(hook.current.state).toBe('success');
    expect(hook.current.notifications).toHaveLength(2);
    expect(hook.current.actionError).toBe('Sin red');
    await hook.unmount();
  });

  test('markAsRead es optimista: marca leída y baja el contador antes de responder', async () => {
    const pending = deferred<Notification>();
    repository.markAsRead.mockReturnValue(pending.promise);
    const hook = await renderHook(() => useNotificationsViewModel(repository));
    let result!: Promise<boolean>;
    await act(async () => {
      result = hook.current.markAsRead(1);
    });
    expect(hook.current.notifications[0].readAt).not.toBeNull();
    expect(hook.current.unreadCount).toBe(0);
    const confirmed = item(1, '2026-10-21T08:00:00.000Z');
    await act(async () => {
      pending.resolve(confirmed);
      await result;
    });
    expect(hook.current.notifications[0]).toEqual(confirmed);
    expect(hook.current.unreadCount).toBe(0);
    await hook.unmount();
  });

  test.each([
    ['404', 'Notificación no encontrada'],
    ['409', 'La notificación aún no ha sido enviada'],
  ])('si el PATCH falla (%s) revierte el estado local y muestra el error', async (_code, message) => {
    repository.markAsRead.mockRejectedValue(new Error(message));
    const hook = await renderHook(() => useNotificationsViewModel(repository));
    let ok = true;
    await act(async () => {
      ok = await hook.current.markAsRead(1);
    });
    expect(ok).toBe(false);
    expect(hook.current.notifications[0].readAt).toBeNull();
    expect(hook.current.unreadCount).toBe(1);
    expect(hook.current.actionError).toBe(message);
    await hook.unmount();
  });

  test('markAsRead sobre una notificación ya leída no llama al servidor (idempotencia local)', async () => {
    const hook = await renderHook(() => useNotificationsViewModel(repository));
    let ok = true;
    await act(async () => {
      ok = await hook.current.markAsRead(2);
    });
    expect(ok).toBe(false);
    expect(repository.markAsRead).not.toHaveBeenCalled();
    await hook.unmount();
  });

  test('ignora toques repetidos mientras el PATCH sigue en curso', async () => {
    const pending = deferred<Notification>();
    repository.markAsRead.mockReturnValue(pending.promise);
    const hook = await renderHook(() => useNotificationsViewModel(repository));
    await act(async () => {
      void hook.current.markAsRead(1);
      await hook.current.markAsRead(1);
    });
    expect(repository.markAsRead).toHaveBeenCalledTimes(1);
    await act(async () => {
      pending.resolve(item(1, '2026-10-21T08:00:00.000Z'));
    });
    await hook.unmount();
  });
});

describe('useUnreadNotificationsCount', () => {
  test('consulta una sola notificación y expone unreadCount', async () => {
    const repository: jest.Mocked<NotificationRepository> = {
      getNotifications: jest.fn().mockResolvedValue(
        pageOf([item(1)], { unreadCount: 6, pageSize: 1 }),
      ),
      markAsRead: jest.fn(),
    };
    const hook = await renderHook(() => useUnreadNotificationsCount(repository));
    await act(async () => hook.current.refresh());
    expect(repository.getNotifications).toHaveBeenCalledWith(1, 1);
    expect(hook.current.unreadCount).toBe(6);
    await hook.unmount();
  });

  test('si falla no muestra contador', async () => {
    const repository: jest.Mocked<NotificationRepository> = {
      getNotifications: jest.fn().mockRejectedValue(new Error('fallo')),
      markAsRead: jest.fn(),
    };
    const hook = await renderHook(() => useUnreadNotificationsCount(repository));
    await act(async () => hook.current.refresh());
    expect(hook.current.unreadCount).toBe(0);
    await hook.unmount();
  });
});
