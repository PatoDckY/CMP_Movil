import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {Notification} from '../../models/Notification';

import {
  DEFAULT_NOTIFICATIONS_PAGE_SIZE,
  NotificationRepository,
} from '../../repositories/contracts/NotificationRepository';

export type NotificationsState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

export function useNotificationsViewModel(
  repository: NotificationRepository,
  pageSize: number = DEFAULT_NOTIFICATIONS_PAGE_SIZE,
) {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [state, setState] =
    useState<NotificationsState>('idle');
  const [error, setError] =
    useState<string | null>(null);
  const [actionError, setActionError] =
    useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const pageRef = useRef(0);
  const requestId = useRef(0);
  const busy = useRef(false);
  const pending = useRef(new Set<number>());
  const mounted = useRef(true);
  const itemsRef = useRef<Notification[]>([]);

  const setItems = useCallback((items: Notification[]) => {
    itemsRef.current = items;
    setNotifications(items);
  }, []);

  const loadFirstPage = useCallback(
    async (refreshing: boolean) => {
      if (busy.current) {return;}
      busy.current = true;
      const current = ++requestId.current;
      if (refreshing) {setIsRefreshing(true);} else {setState('loading');}
      setError(null);
      setActionError(null);
      try {
        const result = await repository.getNotifications(1, pageSize);
        if (current !== requestId.current || !mounted.current) {return;}
        pageRef.current = result.page;
        setItems(result.notifications);
        setUnreadCount(result.unreadCount);
        setTotal(result.total);
        setState(result.notifications.length === 0 ? 'empty' : 'success');
      } catch (err) {
        if (current !== requestId.current || !mounted.current) {return;}
        // Un refresco fallido conserva la lista que ya se mostraba.
        if (refreshing && itemsRef.current.length > 0) {
          setActionError(errorMessage(err, 'No fue posible actualizar tus notificaciones.'));
        } else {
          setItems([]);
          setUnreadCount(0);
          setTotal(0);
          setError(errorMessage(err, 'No fue posible cargar tus notificaciones.'));
          setState('error');
        }
      } finally {
        if (current === requestId.current) {
          busy.current = false;
          if (mounted.current) {setIsRefreshing(false);}
        }
      }
    },
    [repository, pageSize, setItems],
  );

  const load = useCallback(() => loadFirstPage(false), [loadFirstPage]);
  const refresh = useCallback(() => loadFirstPage(true), [loadFirstPage]);

  const hasMore = state === 'success' && notifications.length < total;

  const loadMore = useCallback(async () => {
    if (busy.current || state !== 'success' ||
        itemsRef.current.length >= total) {
      return;
    }
    busy.current = true;
    const current = ++requestId.current;
    setIsLoadingMore(true);
    setActionError(null);
    try {
      const result = await repository.getNotifications(
        pageRef.current + 1,
        pageSize,
      );
      if (current !== requestId.current || !mounted.current) {return;}
      pageRef.current = result.page;
      const known = new Set(itemsRef.current.map(item => item.id));
      setItems([
        ...itemsRef.current,
        ...result.notifications.filter(item => !known.has(item.id)),
      ]);
      setUnreadCount(result.unreadCount);
      setTotal(result.total);
    } catch (err) {
      if (current !== requestId.current || !mounted.current) {return;}
      setActionError(errorMessage(err, 'No fue posible cargar más notificaciones.'));
    } finally {
      if (current === requestId.current) {
        busy.current = false;
        if (mounted.current) {setIsLoadingMore(false);}
      }
    }
  }, [repository, pageSize, state, total, setItems]);

  const markAsRead = useCallback(
    async (notificationId: number): Promise<boolean> => {
      const previous = itemsRef.current.find(
        item => item.id === notificationId,
      );
      if (!previous || previous.readAt !== null ||
          pending.current.has(notificationId)) {
        return false;
      }
      pending.current.add(notificationId);
      setActionError(null);
      // Actualización optimista: se marca leída y se baja el contador.
      const optimistic = {...previous, readAt: new Date().toISOString()};
      setItems(itemsRef.current.map(item =>
        item.id === notificationId ? optimistic : item));
      setUnreadCount(count => Math.max(0, count - 1));
      try {
        const updated = await repository.markAsRead(notificationId);
        if (mounted.current) {
          setItems(itemsRef.current.map(item =>
            item.id === notificationId ? updated : item));
        }
        return true;
      } catch (err) {
        if (mounted.current) {
          // Solo se revierte esta notificación; el resto de la lista no cambia.
          setItems(itemsRef.current.map(item =>
            item.id === notificationId ? previous : item));
          setUnreadCount(count => count + 1);
          setActionError(errorMessage(err, 'No fue posible marcar la notificación como leída.'));
        }
        return false;
      } finally {
        pending.current.delete(notificationId);
      }
    },
    [repository, setItems],
  );

  useEffect(() => {
    mounted.current = true;
    void load();
    return () => {
      mounted.current = false;
      requestId.current += 1;
      busy.current = false;
    };
  }, [load]);

  return {
    notifications,
    unreadCount,
    total,
    state,
    error,
    actionError,
    isLoading: state === 'loading',
    isEmpty: state === 'empty',
    isRefreshing,
    isLoadingMore,
    hasMore,
    load,
    refresh,
    loadMore,
    markAsRead,
  };
}

/**
 * Contador de no leídas para la pantalla de cuenta.
 * Pide una sola notificación: solo interesa unreadCount.
 */
export function useUnreadNotificationsCount(
  repository: NotificationRepository,
) {
  const [unreadCount, setUnreadCount] = useState(0);
  const requestId = useRef(0);

  useEffect(() => () => {
    requestId.current += 1;
  }, []);

  const refresh = useCallback(async () => {
    const current = ++requestId.current;
    try {
      const result = await repository.getNotifications(1, 1);
      if (current === requestId.current) {setUnreadCount(result.unreadCount);}
    } catch {
      // El contador es informativo: si falla, no se muestra badge.
      if (current === requestId.current) {setUnreadCount(0);}
    }
  }, [repository]);

  return {unreadCount, refresh};
}
