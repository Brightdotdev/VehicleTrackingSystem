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
  getAllMyNotifications,
  markNofiticationAsReadApi,
  pollNotifications,
} from '@/lib/handleUserNotiications';
import { toast } from 'sonner';


// ========== Context Type ==========
type NotificationContextType = {
  readNotifications: NotificationData[];
  unreadNotifications: NotificationData[];
  getMyNotifications: () => void;
  getLattestNotifications: () => void;
  updateLastChecked: (lastChecked: string) => void;
  optimisticSetToRead: (notificationData: NotificationData) => Promise<void>;
};


// ========== Create Context ==========
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);


// ========== Provider ==========
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [newNotifications, setLatestNotifications] = useState<NotificationData[]>([]);
  const [readNotifications, setReadNotifications] = useState<NotificationData[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<NotificationData[]>([]);

  const [lastChecked, setLastChecked] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastChecked') || new Date().toISOString();
    }
    return new Date().toISOString();
  });

  const lastCheckedRef = useRef(lastChecked);

  // ========== Update LocalStorage + Ref ==========
  const updateLastChecked = (timestamp: string) => {
    setLastChecked(timestamp);
    lastCheckedRef.current = timestamp;
    localStorage.setItem('lastChecked', timestamp);
  };

  // ========== Polling for New Notifications ==========
  useEffect(() => {
    getMyNotifications();

    const interval = setInterval(() => {
      if (!document.hidden) {
        console.log('Polling for new notifications');
        getLattestNotifications();
        localStorage.setItem('lastChecked', lastCheckedRef.current);
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  // ========== Process All Notifications ==========
  useEffect(() => {
    const allNotifications = [...notifications];

    // Deduplicate new notifications and merge
    newNotifications.forEach((newNotif) => {
      const exists = allNotifications.some((n) => n.id === newNotif.id);
      if (!exists) {
        allNotifications.push(newNotif);
      }
    });

    // Separate read and unread
    const read = allNotifications.filter((n) => n.read);
    const unread = allNotifications.filter((n) => !n.read);

    // Set updated state
    setReadNotifications(read);
    setUnreadNotifications(unread);
  }, [notifications, newNotifications]);

  // ========== Optimistic Read Update ==========
  const optimisticSetToRead = async (notificationData: NotificationData) => {
    const updatedNotification = { ...notificationData, read: true };

    // Backup current state in case we need to revert
    const previousUnread = [...unreadNotifications];
    const previousRead = [...readNotifications];

    // Optimistically update local state
    setUnreadNotifications((prev) =>
      prev.filter((notif) => notif.id !== updatedNotification.id)
    );
    setReadNotifications((prev) => {
      const exists = prev.find((notif) => notif.id === updatedNotification.id);
      if (exists) {
        return prev.map((notif) =>
          notif.id === updatedNotification.id ? updatedNotification : notif
        );
      } else {
        return [...prev, updatedNotification];
      }
    });

    try {
      await markNofiticationAsReadApi(updatedNotification.id);
    } catch (error) {
      toast.error('Failed to mark notification as read. Rolling back.');

      // Revert state
      setUnreadNotifications(previousUnread);
      setReadNotifications(previousRead);
    }
  };

  // ========== Fetch All Notifications ==========
  const getMyNotifications = async () => {
    try {
      const data = await getAllMyNotifications();
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    }
  };

  // ========== Fetch Only New Notifications ==========
  const getLattestNotifications = async () => {
    try {
      const latest = await pollNotifications(lastCheckedRef.current, updateLastChecked);
      setLatestNotifications(latest);
    } catch (error) {
      toast.error('Failed to poll notifications');
    }
  };

  // ========== Return Provider ==========
  return (
    <NotificationContext.Provider
      value={{
        readNotifications,
        unreadNotifications,
        getMyNotifications,
        getLattestNotifications,
        updateLastChecked,
        optimisticSetToRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};


// ========== Context Consumer Hook ==========
export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
