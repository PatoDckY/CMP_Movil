
import {
  NotificationService,
} from '../contracts/NotificationService';

import {
  MarkNotificationReadResponseDto,
  NotificationsPageResponseDto,
} from '../dto/NotificationDto';

import {
  apiRequest,
} from '../http/httpClient';

/**
 * Servicio de notificaciones.
 *
 * Consume los endpoints protegidos
 * de CMP_Site:
 *
 * GET   /api/cliente/notificaciones?page=&pageSize=
 * PATCH /api/cliente/notificaciones/{id}/leida
 */
export const notificationService: NotificationService = {
  getNotifications(
    page: number,
    pageSize: number,
  ): Promise<NotificationsPageResponseDto> {
    return apiRequest<NotificationsPageResponseDto>(
      `/cliente/notificaciones?page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
      },
      {requireAuthentication: true, timeoutMs: 15_000},
    );
  },

  markAsRead(
    notificationId: number,
  ): Promise<MarkNotificationReadResponseDto> {
    return apiRequest<MarkNotificationReadResponseDto>(
      `/cliente/notificaciones/${notificationId}/leida`,
      {
        method: 'PATCH',
      },
      {requireAuthentication: true, timeoutMs: 15_000},
    );
  },
};
