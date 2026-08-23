import { NotificationItem } from '../types/notifications';
import { initialNotifications } from '../data/notifications';
import { StorageStore } from '../utils/storage';

const notificationStore = new StorageStore<NotificationItem[]>('notifications', initialNotifications);

export const notificationService = {
  getAllNotifications(): NotificationItem[] {
    return notificationStore.get();
  },

  getNotificationsForUser(userId: string): NotificationItem[] {
    return notificationStore.get().filter(
      (n) => n.recipientId === userId || n.recipientId === 'all'
    );
  },

  getUnreadCount(userId: string): number {
    return this.getNotificationsForUser(userId).filter((n) => !n.isRead).length;
  },

  markAsRead(notificationId: string): void {
    notificationStore.set((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  },

  markAllAsRead(userId: string): void {
    notificationStore.set((prev) =>
      prev.map((n) => {
        if (n.recipientId === userId || n.recipientId === 'all') {
          return { ...n, isRead: true };
        }
        return n;
      })
    );
  },

  sendNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>): NotificationItem {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    notificationStore.set((prev) => [newItem, ...prev]);
    return newItem;
  },

  deleteNotification(id: string): void {
    notificationStore.set((prev) => prev.filter((n) => n.id !== id));
  },

  subscribe(listener: (notifications: NotificationItem[]) => void): () => void {
    return notificationStore.subscribe(listener);
  }
};
