import {Notification} from '../../models/Notification';

export const DEFAULT_NOTIFICATIONS_PAGE_SIZE = 20;
export const MAX_NOTIFICATIONS_PAGE_SIZE = 50;

export interface NotificationPage {
  notifications: Notification[];
  unreadCount: number;
  page: number;
  pageSize: number;
  total: number;
}

export interface NotificationRepository {
  // Más recientes primero. pageSize se limita a 50 (máximo del backend).
  getNotifications(
    page?: number,
    pageSize?: number,
  ): Promise<NotificationPage>;

  // Idempotente en el servidor: devuelve la notificación ya leída.
  markAsRead(
    notificationId: number,
  ): Promise<Notification>;
}
