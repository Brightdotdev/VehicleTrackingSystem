import { cn } from '@/lib/utils';
import { NotificationData, notificationType } from '@/types/utilTypes';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { setNotificationToRead } from '@/lib/handleUserNotiications';
import { handleDispatchValidatedTracking } from '@/lib/handleUserTracking';
import { handleTerminateDispatch } from '@/lib/handleUserDispatchPage';
import { toast } from 'sonner';




// notification card
export const NotificationCard = ({ notificationItem }: { notificationItem: NotificationData }) => {
  // Local read state to reflect UI changes after API call
  const [loading, setLoading] = useState(false);

  const goodCtaMethod = async () => {
    setLoading(true);
    try {
      toast.info(notificationItem.type);

      if (notificationItem.type === notificationType.DISPATCH_VALIDATED_USER) {
        toast.info("THis is like working the valdiated one");
        await handleDispatchValidatedTracking(notificationItem, loading, setLoading);
      } else {
        toast.info("THis is like working the other ones");
        // await setNotificationToRead(notificationItem.id);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handles the bad CTA click
  const badCtaMethod = async () => {
    setLoading(true);
    try {
      if (notificationItem.type === notificationType.DISPATCH_VALIDATED_USER) {
        toast.info("THis is like working the valdiated one");
        // await handleTerminateDispatch(notificationItem.dispatchId, notificationItem.vehicleId);
      } else {
        toast.info("THis is like working the other ones");
        // await setNotificationToRead(notificationItem.id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      className={cn(
        'w-full rounded-sm flex flex-col items-start justify-center gap-xs p-[var(--space-sm)]',
        notificationItem.isActionNotif ? 'bg-blue-950/10' : '',
        notificationItem.read ? 'bg-blue-950/5' : 'bg-blue-950/10'
      )}
    >
      <div className="flex items-center justify-between w-full">
        <h4 className="text-body">{notificationItem.title}</h4>
      </div>

      <p className="text-muted-foreground text-small">{notificationItem.message}</p>

      {!notificationItem.read && (
        <div className="flex gap-2 items-center justify-center">
          {notificationItem.goodNotificationCta && (
            <Button onClick={goodCtaMethod} disabled={loading}>
              {loading ? "Loading..." : notificationItem.goodNotificationCta}
            </Button>
          )}

          {notificationItem.isActionNotif && notificationItem.badNotificationCta && (
            <Button onClick={badCtaMethod} disabled={loading}>
              {loading ? "Loading..." : notificationItem.badNotificationCta}
            </Button>
          )}
        </div>
      )}
    </article>
  );
};





export const HandleNewNotifications = ({ newNotificationProps }: { newNotificationProps: NotificationData[] }) => (
  
  
   <div className="flex flex-col gap-1 items-start justify-start">
          
    <h3 className='text-normal text-muted-foreground'>New Notifications</h3>  
    <div className='flex flex-col gap-2 items-center justify-start'>
      {newNotificationProps.map((notification: NotificationData) => (
        <NotificationCard notificationItem={notification} key={notification.id} />
      ))}         
    </div>
  </div>
)


export const HandleReadNotifications = ({ readNotificationProps }: { readNotificationProps: NotificationData[] }) => (
 
 <div className="flex flex-col gap-1 items-start justify-start">
          
    <h3 className='text-normal text-muted-foreground'>Read Notifications</h3>  
    <div className='flex flex-col gap-2 items-center justify-start'>
      {readNotificationProps.map((notification: NotificationData) => (
        <NotificationCard notificationItem={notification} key={notification.id} />
      ))}         
    </div>
  </div>
)


export const HandleUnreadNotifications = ({ readNotificationProps }: { readNotificationProps: NotificationData[] }) => (
 
 <div className="flex flex-col gap-1 items-start justify-start">
          
    <h3 className='text-normal text-muted-foreground'>UnRead Notifications</h3>  
    <div className='flex flex-col gap-2 items-center justify-start'>
      {readNotificationProps.map((notification: NotificationData) => (
        <NotificationCard notificationItem={notification} key={notification.id} />
      ))}         
    </div>
  </div>
)
