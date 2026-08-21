export type NotificationState = {
  notifications: any[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loadHistory: (params?: { limit?: number; skip?: number; onlyUnread?: boolean }) => Promise<void>;
  clearError: () => void;
  refreshUnreadCount: () => void;
  connect: () => void;
  disconnect: () => void;
};

export function useNotifications(): NotificationState {
  return {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    markAsRead: async () => {},
    markAllAsRead: async () => {},
    loadHistory: async () => {},
    clearError: () => {},
    refreshUnreadCount: () => {},
    connect: () => {},
    disconnect: () => {},
  };
}
