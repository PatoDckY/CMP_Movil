import {Notification} from '../../models/Notification';

export interface NotificationRepository {
  getNotifications(): Promise<Notification[]>;

  markAsRead(
    notificationId: number,
  ): Promise<void>;
}