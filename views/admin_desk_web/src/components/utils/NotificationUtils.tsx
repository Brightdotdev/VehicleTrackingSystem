import { cn } from '@/lib/utils';
import { NotificationData, notificationType } from '@/types/utilTypes';
import React from 'react'
import { Button } from '../ui/button';
import { setNotificationToRead } from '@/lib/handleUserNotiications';




// notification card

export const NotificationCard = ({notificationItem} : {notificationItem : NotificationData}) =>{

    const goodCtaMethod = () => {
          return setNotificationToRead(notificationItem.id)
    }

    
    const badCtaMethod = () => {
            return setNotificationToRead(notificationItem.id)
  
    }


    return (
  <article className={cn(
    "w-full rounded-sm flex flex-col items-start justify-center gap-xs p-[var(--space-sm)]",
    notificationItem.isActionNotif ? "bg-blue-950/10" : "",
    notificationItem.read ? "bg-blue-950/5" : "bg-blue-950/10"
  )}>


<div className="flex items-center justify-between w-full">
    <h4 className="text-body">{notificationItem.title}</h4>
</div>

    <p className="text-muted-foreground text-small">{notificationItem.message}</p>
{notificationItem.isActionNotif && (
  <div className="flex gap-2 items-center justify-center">
    <Button onClick={() => goodCtaMethod()}>{notificationItem.goodNotificationCta}</Button>
    <Button>{notificationItem.badNotificationCta}</Button>
  </div>
)}

{!notificationItem.read && (
    notificationItem.isActionNotif ? (
        <div className="flex gap-2 items-center justify-center">
      {notificationItem.goodNotificationCta && (
        <Button onClick={() => goodCtaMethod()}>
          {notificationItem.goodNotificationCta}
        </Button>
      )}
      {notificationItem.badNotificationCta && (
        <Button onClick={() => badCtaMethod()} >{notificationItem.badNotificationCta}</Button>
      )}
    </div>
  ) : (
    notificationItem.goodNotificationCta && (
      <Button onClick={() => goodCtaMethod()}>
        {notificationItem.goodNotificationCta}
      </Button>
    )
  )
)}

  </article>
);
}





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
