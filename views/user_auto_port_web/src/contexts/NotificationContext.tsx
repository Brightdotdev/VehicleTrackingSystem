'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { dotEnv } from '@/lib/dotEnv';



// ====== Notification type ======

interface NotificationData {
  dispatchId? : string | null ;
  notiicationId : string;
  isActionNotif: boolean;
  title: string;
  type: string;
  body: string;
  read: boolean;
  goodCta?: string;
  badCta?: string;

}



type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
};

const NotificationContext = createContext<NotificationData | undefined>(undefined);

// ====== Provider component ======

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [lastChecked, setLastChecked] = useState(() => {
  return localStorage.getItem("lastChecked") || new Date().toISOString();
});


  // === Polling logic ===
  useEffect(() => {
    const poll = () => {
      const userId = 1; // Replace with your auth logic

      fetch(`/api/notifications?userId=${userId}&since=${lastChecked}`)
        .then(res => res.json())
        .then((newNotifs: Notification[]) => {
          if (newNotifs.length > 0) {
            // Show toast, play sound, etc.
            console.log("🔔 New notifications!");
            setNotifications(prev => [...newNotifs, ...prev]);
          }
          setLastChecked(new Date().toISOString());
        });
    };

    const interval = setInterval(() => {
      if (!document.hidden) poll();
    }, 10000); // 10s

    return () => clearInterval(interval);
  }, [lastChecked]);

  // === Mark all as read ===
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );

    // Optionally call backend to mark as read
    // POST /api/notifications/mark-all-read
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

// ====== Hook for easy usage ======
export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};
