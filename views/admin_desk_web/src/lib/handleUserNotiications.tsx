import { EventSourcePolyfill } from 'event-source-polyfill';

export const subscribeUserToSse = ({ user }: { user: string }): EventSource => {
 
    const sseUrl = `http://localhost:8102/v1/sse/subscribe?clientId=${user}`;
    const eventSource = new EventSourcePolyfill(sseUrl, {
      withCredentials: true,
    });
 



  eventSource.addEventListener('INIT', (event: MessageEvent) => {
    console.log('Connected:', event.data);
  });

  eventSource.addEventListener('USER_NOTIFICATION', (event: MessageEvent) => {
    const notification = JSON.parse(event.data);
    console.log('User notification received:', notification);
  });

  eventSource.addEventListener('DISPATCH_USER_NOTIFICATION', (event: MessageEvent) => {
    const dispatchNotification = JSON.parse(event.data);
    console.log('Dispatch notification received:', dispatchNotification);
  });

  eventSource.addEventListener('ADMIN_NOTIFICATION', (event: MessageEvent) => {
    const adminNotification = JSON.parse(event.data);
    console.log('Admin notification received:', adminNotification);
  });

  eventSource.onerror = (err: Event) => {
    console.error('SSE connection error:', err);
  };

  return eventSource;
};



const setNotiicationToRead = () => {
    
}


export const getMyNotifications = async ({ user }: { user: string }) => {
  const notificationUrl = `http://localhost:8102/v1/user/notifications/get-all-me?clientId=${user}`;
  try {

    const response = await fetch(notificationUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.status}`);
    }

    const data = await response.json();
    // data should be your notifications array or object
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
};