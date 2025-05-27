
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';


interface NotificationData {
  type: string; // The event name (e.g., "USER_NOTIFICATION")
  data: any;    // The actual event payload
  timestamp: number;
}

interface NotificationType {
  latestEvent: NotificationData | null;
  queue: NotificationData[];
  dequeue: () => void;
}

const NotificationContext = createContext<NotificationType | undefined>(undefined);

export const SSEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [latestEvent, setLatestEvent] = useState<NotificationData | null>(null);
  const [queue, setQueue] = useState<NotificationData[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  const clientId = 'some-user-id-or-email'; // Get this dynamically e.g., from auth/user context

  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:8080/v1/sse/subscribe?clientId=${clientId}`
    );
    eventSourceRef.current = eventSource;

    // Generic handler for known events
    const handleSSE = (event: MessageEvent, eventType: string) => {
      const parsed: NotificationData = {
        type: eventType,
        data: event.data,
        timestamp: Date.now(),
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

    eventSource.onerror = (err) => {
      console.error('SSE Error', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [clientId]);

  const dequeue = () => {
    setLatestEvent(queue[0] || null);
    setQueue((prev) => prev.slice(1));
  };

  return (
    <NotificationContext.Provider value={{ latestEvent, queue, dequeue }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useSSE = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useSSE must be used inside SSEProvider');
  }
  return ctx;
};
