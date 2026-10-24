
import {
  Notification,
} from '../models/Notification';

import {
  NotificationDto,
} from '../services/dto/NotificationDto';

function isNullableId(value: unknown): value is number | null {
  return value === null || (Number.isSafeInteger(value) && (value as number) > 0);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

/**
 * Convierte una notificación de CMP_Site
 * al modelo utilizado en CMP_Movil.
 */
export function mapNotificationDtoToModel(
  dto: NotificationDto,
): Notification {
  if (!dto || !Number.isSafeInteger(dto.id) || dto.id <= 0 ||
      !isNullableId(dto.courseId) || !isNullableId(dto.enrollmentId) ||
      !isNullableId(dto.sessionId) || !isNullableId(dto.evaluationId) ||
      typeof dto.type !== 'string' || typeof dto.title !== 'string' ||
      typeof dto.message !== 'string' || typeof dto.channel !== 'string' ||
      typeof dto.deliveryStatus !== 'string' ||
      !isNullableString(dto.scheduledAt) || !isNullableString(dto.sentAt) ||
      !isNullableString(dto.readAt)) {
    throw new Error('El servidor no devolvió una notificación válida.');
  }
  return {
    id: dto.id,
    courseId: dto.courseId,
    enrollmentId: dto.enrollmentId,
    sessionId: dto.sessionId,
    evaluationId: dto.evaluationId,
    type: dto.type,
    title: dto.title,
    message: dto.message,
    channel: dto.channel,
    deliveryStatus: dto.deliveryStatus,
    scheduledAt: dto.scheduledAt,
    sentAt: dto.sentAt,
    readAt: dto.readAt,
  };
}
