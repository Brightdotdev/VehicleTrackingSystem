'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { NotificationData } from '@/types/utilTypes';
import {
  getAdminNotifications,
  pollNotifications,
  setNotificationToRead, // ✅ Don't forget to import this
} from '@/lib/handleUserNotiications';

import { toast } from 'sonner';


// ====== Admin Notification Context Type ======
type AdminNotificationContextType = {
  notifications: NotificationData[];
  newNotifications: NotificationData[];
  updateLastChecked: (lastChecked: string) => void;
  getMyNotifications: () => void;
  getLattestNotifications: () => void;
  optimisticSetToRead: (notification: NotificationData) => Promise<void>;
};


// ====== Create Context ======
const AdminNotificationContext = createContext<AdminNotificationContextType | undefined>(undefined);


// ====== Provider ======
export const AdminNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [newNotifications, setNewNotifications] = useState<NotificationData[]>([]);

  const [lastChecked, setLastChecked] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_lastChecked') || new Date().toISOString();
    }
    return new Date().toISOString();
  });

  const lastCheckedRef = useRef(lastChecked);

  // ===== Update Last Checked Timestamp =====
  const updateLastChecked = (timestamp: string) => {
    setLastChecked(timestamp);
    lastCheckedRef.current = timestamp;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_lastChecked', timestamp);
    }
  };

  // ===== Fetch All Admin Notifications =====
  const getMyNotifications = async () => {
    try {
      const data = await getAdminNotifications();
      setNotifications(data);
      setNewNotifications(data); // Assume initial data includes new
    } catch (error) {
      toast.error('Failed to fetch admin notifications');
      console.error(error);
    }
  };

  // ===== Poll for Latest Notifications =====
  const getLattestNotifications = async () => {
    try {
      const latest = await pollNotifications(lastCheckedRef.current, updateLastChecked);

      // Deduplicate
      const dedupedNew = latest.filter(
        (notif : NotificationData) => !newNotifications.some((n) => n.id === notif.id)
      );
      const dedupedAll = latest.filter(
        (notif : NotificationData ) => !notifications.some((n) => n.id === notif.id)
      );

      // Merge in
      setNewNotifications((prev) => [...prev, ...dedupedNew]);
      setNotifications((prev) => [...prev, ...dedupedAll]);
    } catch (error) {
      toast.error('Failed to poll new admin notifications');
      console.error(error);
    }
  };

  // ===== Optimistically Mark a Notification as Read =====
  const optimisticSetToRead = async (notificationData: NotificationData) => {
    const updatedNotification = { ...notificationData, read: true };

    const prevNotifications = [...notifications];
    const prevNew = [...newNotifications];

    // Optimistically update notifications
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === updatedNotification.id ? updatedNotification : notif
      )
    );

    // Optimistically remove from newNotifications
    setNewNotifications((prev) =>
      prev.filter((notif) => notif.id !== updatedNotification.id)
    );

    try {
      await setNotificationToRead(updatedNotification.id);
    } catch (error) {
      toast.error('Failed to mark notification as read. Rolling back.');

      // Rollback
      setNotifications(prevNotifications);
      setNewNotifications(prevNew);
    }
  };

  // ===== Polling Setup =====
  useEffect(() => {
    if (typeof window === 'undefined') return;

    getMyNotifications();

    const interval = setInterval(() => {
      if (!document.hidden) {
        getLattestNotifications();
        localStorage.setItem('admin_lastChecked', lastCheckedRef.current);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ===== Provide State and Functions =====
  return (
    <AdminNotificationContext.Provider
      value={{
        notifications,
        newNotifications,
        updateLastChecked,
        getMyNotifications,
        getLattestNotifications,
        optimisticSetToRead, // ✅ Injected into context
      }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
};


// ===== Custom Hook =====
export const useAdminNotifications = () => {
  const ctx = useContext(AdminNotificationContext);
  if (!ctx) throw new Error('useAdminNotifications must be used within AdminNotificationProvider');
  return ctx;
};
