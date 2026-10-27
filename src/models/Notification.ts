export interface Notification {
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