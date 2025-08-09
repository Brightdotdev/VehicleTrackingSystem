import { cn } from '@/lib/utils';
import { NotificationData, notificationType } from '@/types/utilTypes';
import React, { useState } from 'react'
import { Button } from '../ui/button';

import { handleDispatchValidatedTracking } from '@/lib/handleUserTracking';

import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';
import { handleTerminateDispatch } from '@/lib/handleUserDispatchPage';




// notification card
export const NotificationCard = ({ notificationItem }: { notificationItem: NotificationData }) => {
  // Local read state to reflect UI changes after API call
  const [loading, setLoading] = useState(false);
  const [worked, setWorked] = useState(false);
const {optimisticSetToRead } = useNotifications()
  const goodCtaMethod = async () => {
    setLoading(true);
    toast.info("Yeah i was clicked")
    try {
      
      if (notificationItem.type === notificationType.DISPATCH_VALIDATED_USER) {
        toast.info("we are here")
        await handleDispatchValidatedTracking(notificationItem, loading, setLoading, setWorked);
    
          if(worked){
        await optimisticSetToRead(notificationItem)  
          }
    } else {
        setWorked(true)
       await optimisticSetToRead(notificationItem);
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
     
        await handleTerminateDispatch(notificationItem.dispatchId, notificationItem.vehicleId);
      } else {
       await optimisticSetToRead(notificationItem);
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

          {notificationItem.badNotificationCta && (
            <Button onClick={badCtaMethod} disabled={loading}>
              {loading ? "Loading..." : notificationItem.badNotificationCta}
            </Button>
          )}
        </div>
      )}
    </article>
  );
};
export const HandleReadNotifications = ({readNotifications} : {readNotifications : NotificationData[]}) => {

  const hasNotifications = Array.isArray(readNotifications) && readNotifications.length > 0;

  return (
    <div className="flex flex-col gap-1 items-start justify-start">
      <h3 className="text-normal text-muted-foreground">Read Notifications</h3>

      <div className="flex flex-col gap-2 items-center justify-start">
        {hasNotifications ? (
          [...readNotifications].reverse().map((notification: NotificationData) => (
            <NotificationCard notificationItem={notification} key={notification.id} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">No notifications for you, sir 🫡</p>
        )}
      </div>
    </div>
  );
};

export const HandleUnreadNotifications = ({unreadNotifications} : {unreadNotifications : NotificationData[]}) => {

  
  const hasUnread = Array.isArray(unreadNotifications) && unreadNotifications.length > 0;

  return (
    <div className="flex flex-col gap-1 items-start justify-start">
      <h3 className="text-normal text-muted-foreground">Unread Notifications</h3>

      <div className="flex flex-col gap-2 items-center justify-start">
        {hasUnread ? (
          unreadNotifications.map((notification: NotificationData) => (
            <NotificationCard notificationItem={notification} key={notification.id} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No unread notifications left. You’re all caught up 🎉
          </p>
        )}
      </div>
    </div>
  );
};
