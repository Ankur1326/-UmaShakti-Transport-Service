'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications, NotificationState } from '@/hooks/useNotifications';

interface NotificationContextType extends NotificationState {
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loadHistory: (params?: { limit?: number; skip?: number; onlyUnread?: boolean }) => Promise<void>;
  clearError: () => void;
  refreshUnreadCount: () => void;
  connect: () => void;
  disconnect: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
};
