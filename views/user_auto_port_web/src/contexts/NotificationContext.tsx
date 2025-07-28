'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { NotificationData } from '@/types/utilTypes';
import { getAllMyNotifications, pollNotifications } from '@/lib/handleUserNotiications';
import { useUserValidation } from '@/hooks/useUserValidation';



// ====== Notification type ======



type NotificationContextType = {
  notifications: NotificationData[];
  newNotifications: NotificationData[];
  getMyNotifications : () => void;
  getLattestNotifications : () => void;
  updateLastChecked: (lastChecked: string) => void;
};


const NotificationContext = createContext<NotificationContextType | undefined>(undefined);




export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [newNotifications, setLatestNotifications] = useState<NotificationData[]>([]);
  const [lastChecked, setLastChecked] = useState(() => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("lastChecked") || new Date().toISOString().replace("Z", "");
      } else {
        return new Date().toISOString().replace("Z", "")}});

        


  
// ==== extra coontext methods ====


  const lastCheckedRef = useRef(lastChecked);
    const updateLastChecked = (timestamp: string) => {
  setLastChecked(timestamp);
  lastCheckedRef.current = timestamp;
  localStorage.setItem("lastChecked", timestamp);
};

  // === Polling logic ===
  useEffect(() => {

    console.log("Yesh the context was rendered");


  if (typeof window === "undefined") {
    console.log("we returned here :: the window was undefined");
    return;}


    getMyNotifications()
    
    const interval = setInterval(() => {
      if (!document.hidden) {
        console.log("Yesh the context was rendered");
        getLattestNotifications()
        localStorage.setItem("lastChecked", lastChecked); 
      }
    }, 10000);

    return () => clearInterval(interval);

    
  }, [lastChecked]);



  const getLattestNotifications = async () => {
        const latestNotification = await pollNotifications(lastCheckedRef.current, updateLastChecked);
        setLatestNotifications(latestNotification);
  }

  

   const getMyNotifications = async () => {
      const notifcationData = await getAllMyNotifications();
      setNotifications(notifcationData);
      setLatestNotifications(notifcationData);
    };
  
  return (
    <NotificationContext.Provider value={{ updateLastChecked,newNotifications, notifications, getMyNotifications, getLattestNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};


export const useNotifications = () => {

  const ctx = useContext(NotificationContext);
  
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};
