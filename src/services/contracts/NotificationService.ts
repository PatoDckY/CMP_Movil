
import {
  MarkNotificationReadResponseDto,
  NotificationsPageResponseDto,
} from '../dto/NotificationDto';

/**
 * Contrato del servicio de notificaciones.
 *
 * GET: bandeja paginada del cliente.
 * PATCH: marcar una notificación como leída.
 */
export interface NotificationService {
  getNotifications(
    page: number,
    pageSize: number,
  ): Promise<NotificationsPageResponseDto>;

  markAsRead(
    notificationId: number,
  ): Promise<MarkNotificationReadResponseDto>;
}
