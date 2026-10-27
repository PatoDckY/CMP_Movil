
export interface NotificationDto {
  id: number;

  courseId: number | null;
  enrollmentId: number | null;
  sessionId: number | null;
  evaluationId: number | null;

  type: string;

  title: string;
  message: string;

  channel: string;
  deliveryStatus: string;

  scheduledAt: string | null;
  sentAt: string | null;
  readAt: string | null;
}

// GET /cliente/notificaciones?page=&pageSize=
export interface NotificationsPageResponseDto {
  notifications: NotificationDto[];
  unreadCount: number;
  page: number;
  pageSize: number;
  total: number;
}

// PATCH /cliente/notificaciones/{id}/leida devuelve la notificación sin envolver.
export type MarkNotificationReadResponseDto = NotificationDto;
