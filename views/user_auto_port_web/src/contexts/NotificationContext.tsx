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

interface NotificationType {
  latestEvent: NotificationData | null;
  queue: NotificationData[];
  dequeue: () => void;
}

const NotificationContext = createContext<NotificationType | undefined>(undefined);

export const NotificationProvider : React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const  {userData } = useAuth()
  const [latestEvent, setLatestEvent] = useState<NotificationData | null>(null);
  const [queue, setQueue] = useState<NotificationData[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  
  
  useEffect(() => {

    
    const eventSource = new EventSource(
       dotEnv.sseSubscribeUrl,{
         withCredentials: true
      }
    );
    eventSourceRef.current = eventSource;

    // Generic handler for known events
    const handleSSE = (event: MessageEvent, eventType: string) => {
      
      const parsedData = JSON.parse(event.data); // This should match your NotificationData interface
      console.log("Parsed Data:", parsedData);
      const parsed: NotificationData = {
        ...parsedData,
        type: eventType,
        
      };

      // Push to UI or queue depending on focus
      if (document.hasFocus()) {
        setLatestEvent(parsed);
      } else {
        setQueue((prev) => [...prev, parsed]);
      }
    };

    eventSource.addEventListener('INIT', (e) => handleSSE(e as MessageEvent, 'INIT'));
    eventSource.addEventListener('USER_NOTIFICATION', (e) =>
      handleSSE(e as MessageEvent, 'USER_NOTIFICATION')
    );
    eventSource.addEventListener('DISPATCH_USER_NOTIFICATION', (e) =>
      handleSSE(e as MessageEvent, 'DISPATCH_USER_NOTIFICATION')
    );
    eventSource.addEventListener('ADMIN_NOTIFICATION', (e) =>
      handleSSE(e as MessageEvent, 'ADMIN_NOTIFICATION')
    );

    eventSource.onmessage = (event) => {
      console.log("Generic SSE message:", event.data);
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error', err);
      eventSource.close();
    };

    // Handler for when the window regains focus
    const handleFocus = () => {
      if (queue.length > 0) {
        setLatestEvent(queue[0]);
        setQueue((prev) => prev.slice(1));
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      eventSource.close();
      window.removeEventListener("focus", handleFocus);
    };
  }, [queue]);

  const dequeue = () => {
    setLatestEvent(queue[0] || null);
    setQueue((prev) => prev.slice(1));
  };

  return (
    userData &&(
    <NotificationContext.Provider value={{ latestEvent, queue, dequeue }}>
      {children}
    </NotificationContext.Provider>
    )
  );
};

export const useSSE = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useSSE must be used inside SSEProvider');
  }
  return ctx;
};
