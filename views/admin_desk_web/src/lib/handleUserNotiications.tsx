

const subscribeUserToSse = ({ user }: { user: string }): EventSource => {
  const sseUrl = `http://localhost:8102/v1/sse/subscribe?clientId=${user}`;
  const eventSource = new EventSource(sseUrl);

  eventSource.addEventListener('INIT', (event) => {
    console.log('Connected:', event.data);
  });

  eventSource.addEventListener('USER_NOTIFICATION', (event) => {
    const notification = JSON.parse(event.data);
    console.log('User notification received:', notification);
  });

  eventSource.addEventListener('DISPATCH_USER_NOTIFICATION', (event) => {
    const dispatchNotification = JSON.parse(event.data);
    console.log('Dispatch notification received:', dispatchNotification);
  });

  eventSource.addEventListener('ADMIN_NOTIFICATION', (event) => {
    const adminNotification = JSON.parse(event.data);
    console.log('Admin notification received:', adminNotification);
  });

  eventSource.onerror = (err) => {
    console.error('SSE connection error:', err);
  };

  return eventSource;
};



const setNotiicationToRead = () => {
    
}