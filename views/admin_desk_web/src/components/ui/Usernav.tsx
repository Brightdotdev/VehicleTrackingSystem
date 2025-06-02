import { useAuth } from '@/contexts/AuthContext'
import { Bell, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Button } from './button';
import { cn } from '@/lib/utils';
import { getMyNotifications, subscribeUserToSse } from '@/lib/handleUserNotiications';




//// utilitiesssss grah


interface notification {
  dispatchId? : string | null ;
  notiicationId : string;
  isActionNotif: boolean;
  title: string;
  body: string;
  read: boolean;
  goodCta?: string;
  badCta?: string;

}


const handleNotifClose =  ({notifications, user } : {notifications : notification[], user : string})=>  {



  return ;
}


// notification card

const NotificationCard = ({notificationItem} : {notificationItem : notification}) => (
  
  <article className={cn(
    "w-full rounded-sm flex flex-col items-start justify-center gap-xs p-[var(--space-sm)]",
    notificationItem.isActionNotif ? "bg-blue-500/10" : "",
    notificationItem.read ? "bg-blue-500/5" : "bg-blue-500/10"
  )}>
    <h4 className="text-normal">{notificationItem.title}</h4>
    <p className="text-muted-foreground text-body">{notificationItem.body}</p>
    {notificationItem.isActionNotif && (
      <div className="flex gap-2 items-center justify-center">
        <Button>{notificationItem.goodCta}</Button>
        <Button>{notificationItem.badCta}</Button>
      </div>
    )}
  </article>
);



const testNotifications: notification[] = [
  {
    notiicationId : "bjbjbj",
    isActionNotif: true,
    title: "Account Alert",
    body: "Your password will expire in 3 days.",
    read: false,
    goodCta: "Change Now",
    badCta: "Remind Me Later"
  },
  {
    notiicationId : "bjbjsdsd",
    isActionNotif: false,
    title: "Welcome!",
    body: "Thanks for joining our platform.",
    read: true
  },
  {
    notiicationId : "bjbjsdsddsccsd",
    isActionNotif: true,
    title: "Vehicle Maintenance",
    body: "Your vehicle is due for service.",
    read: false,
    goodCta: "Book Service",
    badCta: "Ignore"
  },
  {
    notiicationId : "bjbjsdsddscscscscsd",
    isActionNotif: false,
    title: "System Update",
    body: "A new update is available.",
    read: false
  },
  {
    notiicationId : "bjbjsdsddsccsscsd",
    isActionNotif: true,
    title: "Unusual Activity",
    body: "We detected a login from a new device.",
    read: true,
    goodCta: "Review",
    badCta: "Ignore"
  }
];



const NotifPopUp = ({ setVisible, isvisible, user, notifications }: 
{
  setVisible : (isVisible : boolean) => void,
  isvisible : boolean, 
  user : string | undefined
  notifications : notification[]
}) => {

  return (
   
    isvisible && (
       <div className="bg-background2/95 fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center ">
      
    <article className='self-end lg:mr-10 lg:w-1/3 md:mr-6 md:w-2/3 h-screen  w-full  h-[var(--size-lg)] bg-accent relative flex flex-col items-start justify-start p-[var(--space-sm)]'>
   

   <div className="flex justify-between items-center w-full flex-1 top-1">
      
 
  <h2 className='text-normal text-muted-foreground'> {`${user || "Nobody"}'s Nofitcation`} </h2>    
  
    <X 
    onClick={() =>  setVisible(false)}
    className=' cursor-pointer stroke-muted-foreground hover:stroke-sidebar-accent-foreground' />
 
   </div>
  
   <div className="w-full flex flex-col gap-2 items-center justify-start pt-2  overflow-y-scroll no-scrollbar">
       {
          notifications.map((notification,index)  => (
              <NotificationCard  notificationItem={notification} />
          ))
        }
   </div>

    </article>
    </div>
    )
    )
}



const Usernav = () => {
  const { isAuthenticated, userData} = useAuth();

  useEffect(() => {
    
    if (!userData) return;

    const eventSource = subscribeUserToSse({ user: userData.email });
    const myNofitications  = getMyNotifications({ user: userData.email });
    console.log(myNofitications)
    return () => {
      eventSource.close();
      console.log('SSE connection closed');
    };
    
  }, [userData])

    const [notifIsVisible, setNotifIsVisible] = useState(false);
    const [notifications, setNotifications] = useState([
  { id: 1, title: "Notification 1", body: "Lorem ipsum...", isAction: false, read: false },
  { id: 2, title: "Action Notification", body: "Do something!", isAction: true, read: false , goodCta : "Good Cta", badCta : "Bad Cta" },
]);

  return (
    isAuthenticated ? (
      <nav className='fixed top-4 flex items-center justify-between w-screen h-[var(--size-sm)] p-[var(--size-sm-3)]'>

        <article className="flex items-center justify-start gap-4  p-[var(--space-xs)] bg-accent rounded-lg cursor-pointer">
                {
                    userData?.picture  && (<img src={userData.picture} className='size-8 rounded-full object-cover' />)
                }
                 <h3 className='subtitleText'>
                {`${userData?.username || "Nobody" }'s Desk`}  
            </h3>
        </article>
        
        <Button onClick={() => setNotifIsVisible(true)} variant="outline" className="relative  flex items-center justify-center rounded-full p-[var(--space-sm)] bg-accent">
            
             {/* 
             this is supposed to like get the data from the loggin service and show the notifications
                  <div className="flex items-center justify-center size-6 text-xxs absolute rounded-full -right-3 -top-2 bg-chart-5 p-[var(--space-xxs)]">9+</div>
             */}
             
            <Bell className='stroke-foreground hover:stroke-background'  />
        </Button>

          <NotifPopUp notifications={testNotifications} setVisible={setNotifIsVisible} isvisible={notifIsVisible}  user={userData?.username} />


      </nav>
    ) : null
  );
}

export default Usernav


