'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { NotificationData } from '@/types/utilTypes';
import { getAllMyNotifications, markNofiticationAsReadApi, pollNotifications } from '@/lib/handleUserNotiications';
import { useUserValidation } from '@/hooks/useUserValidation';
import { toast } from 'sonner';



// ====== Notification type ======



type NotificationContextType = {
  readNotifications: NotificationData[];
  unreadNotifications: NotificationData[];
  getMyNotifications : () => void;
  getLattestNotifications : () => void;
  updateLastChecked: (lastChecked: string) => void;
  optimisticSetToRead: (notificationData: NotificationData) => Promise<void>;
};


const NotificationContext = createContext<NotificationContextType | undefined>(undefined);




export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [newNotifications, setLatestNotifications] = useState<NotificationData[]>([]);
  const [readNotifications, setReadNotifications] = useState<NotificationData[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<NotificationData[]>([]);
  

  const [lastChecked, setLastChecked] = useState(() => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("lastChecked") || new Date().toISOString().replace("Z", "");
      } else {
        return new Date().toISOString().replace("Z", "")}});





  const { isValidated } = useUserValidation();
  const lastCheckedRef = useRef(lastChecked);
  
// ==== extra coontext methods ====


    const updateLastChecked = (timestamp: string) => {
  setLastChecked(timestamp);
  lastCheckedRef.current = timestamp;
  localStorage.setItem("lastChecked", timestamp);
};

  // === Polling logic ===
  useEffect(() => {
      if (!isValidated || typeof window === 'undefined') return;

    console.log("Yeah the context was rendered");

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



  useEffect(() => {

      if (!isValidated || typeof window === 'undefined') return;


      const readNotificationsFilter = () => notifications.filter((n) => n.read)

const unreadNotificationsFilter = () => notifications.filter((n) => !n.read)

let mergedUnread = unreadNotificationsFilter();
if (newNotifications.length > 0) {
  // Merge and deduplicate by id (assuming NotificationData has an 'id' field)
  const newNotifsToAdd = newNotifications.filter(
    (newNotif) => !mergedUnread.some((notif) => notif.id === newNotif.id)
  );
  mergedUnread = [...mergedUnread, ...newNotifsToAdd];
}





  setUnreadNotifications(unreadNotificationsFilter)
  setReadNotifications(readNotificationsFilter)
  
  console.log(unreadNotificationsFilter)
console.log(readNotificationsFilter)
console.log("read notifications ",  readNotifications)
console.log("new notifications ", newNotifications)


  } ,[notifications, newNotifications])


const optimisticSetToRead = async (notificationData : NotificationData)  => {

  // set it to read localy
  
  const updatedNotification = { ...notificationData, read: true };

  // set to read and add to the read array
  setReadNotifications((previousNotifications) => {
    
    if (!previousNotifications) return [updatedNotification];

    const exists = previousNotifications.find((notif) => notif.id === updatedNotification.id);


    if (exists) {
      return previousNotifications.map((notifs) =>
        notifs.id === updatedNotification.id ? { ...notifs, ...updatedNotification } : notifs
      );
    } else {
      return [...previousNotifications, updatedNotification];
    }
  })

  
  
  // remove it from the unread array too 
  
  setUnreadNotifications((previousNotifications) => 
     previousNotifications ? previousNotifications.filter((notif) => notif.id !== updatedNotification.id) : [])

try {
 await markNofiticationAsReadApi(updatedNotification.id)
}catch (error) {
    
  toast.error("We couldnt set the notification to read")
 
  
  

  

// 2. Add to unread notifications
setUnreadNotifications((previous) => {
  if (!previous) return [updatedNotification];

  const exists = previous.find((notif) => notif.id === updatedNotification.id);
  if (exists) {
    return previous.map((notif) =>
      notif.id === updatedNotification.id ? { ...notif, ...updatedNotification } : notif
    );
  } else {
    return [...previous, updatedNotification];
  }
});

// 3. Remove from read notifications
setReadNotifications((previous) =>
  previous ? previous.filter((notif) => notif.id !== updatedNotification.id) : []
);}}



  const getLattestNotifications = async () => {
        const latestNotification = await pollNotifications(lastCheckedRef.current, updateLastChecked);
        setLatestNotifications(latestNotification);
  }

  
   const getMyNotifications = async () => {
      const notifcationData = await getAllMyNotifications();
      setNotifications(notifcationData);
    };
  


  return (
    <NotificationContext.Provider value={{ updateLastChecked,readNotifications, unreadNotifications, getMyNotifications, getLattestNotifications,optimisticSetToRead }}>
      {children}
    </NotificationContext.Provider>
  );
};


export const useNotifications = () => {

  const ctx = useContext(NotificationContext);
  
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};
