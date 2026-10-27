import {
  mapNotificationDtoToModel,
} from '../../mappers/notificationMapper';

import {
  Notification,
} from '../../models/Notification';

import {
  NotificationService,
} from '../../services/contracts/NotificationService';

import {
  DEFAULT_NOTIFICATIONS_PAGE_SIZE,
  MAX_NOTIFICATIONS_PAGE_SIZE,
  NotificationPage,
  NotificationRepository,
} from '../contracts/NotificationRepository';

function isCount(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

/**
 * Repositorio de notificaciones.
 *
 * Separa los servicios HTTP de
 * la lógica utilizada por MVVM.
 * Los errores HTTP (404, 409...) se propagan al ViewModel.
 */
export class NotificationRepositoryImpl
  implements NotificationRepository {

  constructor(
    private readonly service: NotificationService,
  ) {}

  async getNotifications(
    page: number = 1,
    pageSize: number = DEFAULT_NOTIFICATIONS_PAGE_SIZE,
  ): Promise<NotificationPage> {
    const safePage =
      Number.isSafeInteger(page) && page > 0 ? page : 1;
    const safePageSize =
      Number.isSafeInteger(pageSize) && pageSize > 0
        ? Math.min(pageSize, MAX_NOTIFICATIONS_PAGE_SIZE)
        : DEFAULT_NOTIFICATIONS_PAGE_SIZE;

    const response =
      await this.service.getNotifications(
        safePage,
        safePageSize,
      );

    if (!response || !Array.isArray(response.notifications) ||
        !isCount(response.unreadCount) || !isCount(response.total) ||
        !isCount(response.page) || !isCount(response.pageSize)) {
      throw new Error('El servidor no devolvió notificaciones válidas.');
    }

    return {
      notifications:
        response.notifications.map(mapNotificationDtoToModel),
      unreadCount: response.unreadCount,
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
    };
  }

  async markAsRead(
    notificationId: number,
  ): Promise<Notification> {
    if (!Number.isSafeInteger(notificationId) || notificationId <= 0) {
      throw new Error('La notificación seleccionada no es válida.');
    }

    return mapNotificationDtoToModel(
      await this.service.markAsRead(notificationId),
    );
  }
}
