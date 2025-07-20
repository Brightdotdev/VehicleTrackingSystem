import { useAuth } from '@/contexts/AuthContext'
import { Bell, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Button } from './button';
import { cn } from '@/lib/utils';
import { NotificationData } from '@/types/utilTypes';
import { useNotifications } from '@/contexts/NotificationContext';


//// utilitiesssss grah



const handleNotifClose =  ()=>  {



  return ;
}


// notification card

const NotificationCard = ({notificationItem} : {notificationItem : NotificationData}) => (
  


  <article className={cn(
    "w-full rounded-sm flex flex-col items-start justify-center gap-xs p-[var(--space-sm)]",
    notificationItem.isActionNotif ? "bg-blue-950/10" : "",
    notificationItem.read ? "bg-blue-950/5" : "bg-blue-950/10"
  )}>
    <h4 className="text-normal">{notificationItem.title}</h4>
    <p className="text-muted-foreground text-body">{notificationItem.message}</p>
    {notificationItem.isActionNotif && (
      <div className="flex gap-2 items-center justify-center">
        <Button>{notificationItem.goodNotificationCta}</Button>
        <Button>{notificationItem.badNotificationCta}</Button>
      </div>
    )}
  </article>
);






const NotifPopUp = ({ setVisible, isvisible, user, notifications }: 
{
  setVisible : (isVisible : boolean) => void,
  isvisible : boolean, 
  user : string | undefined
  notifications : NotificationData[]
}) => {
  console.log("the notificationss")
console.log(JSON.stringify(notifications))
  return (
   
    isvisible && (
      <div className="bg-background2/95 fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center  backdrop-blur-sm shadow-2xl">
    <article className='self-end lg:mr-10 lg:w-1/3 md:mr-6 md:w-2/3 h-screen w-full h-[var(--size-lg)] bg-accent relative flex flex-col items-start justify-start p-[var(--space-sm)] shadow-xl'>
      <div className="flex justify-between items-center w-full flex-1 top-1 z-8">
        <h2 className='text-normal-2 text-muted-foreground'> {`${user || "Nobody"}'s Nofitcation`} </h2>    
        <X 
          onClick={() =>  setVisible(false)}
          className=' cursor-pointer stroke-muted-foreground hover:stroke-sidebar-accent-foreground' />
      </div>
      <div className="w-full flex flex-col gap-2 items-center justify-start pt-2  overflow-y-scroll no-scrollbar">
        {
          notifications.map((notification,index)  => (
            <NotificationCard  notificationItem={notification} key={index} />
          ))
        }
      </div>
    </article>
  </div>))}




const Usernav = ({classNames} : {classNames? : string}) => {
  const { isAuthenticated, userData} = useAuth();
    const [notifIsVisible, setNotifIsVisible] = useState(false);
  const {newNotifications , notifications} = useNotifications()


  return (
    isAuthenticated ? (
      <nav className={'fixed top-4 flex items-center justify-between w-screen h-[var(--size-sm)] p-[var(--size-sm-3)] z-10 ' + classNames} >

        <article className="flex items-center justify-start gap-4  p-[var(--space-xs)] bg-accent rounded-lg cursor-pointer">
                {
                    userData?.picture  && (<img src={userData.picture} className='size-8 rounded-full object-cover' />)
                }
                <div className='size-8 rounded-full object-cover bg-red-400' />
                 <h3 className='  md:subtitleText'>
                {`${userData?.username || "Nobody" }'s Desk`}  
            </h3>
        </article>
        
        <Button onClick={() => setNotifIsVisible(true)} variant="outline" className="relative  flex items-center justify-center rounded-full p-[var(--space-sm-1)] h-[var(--space-sm-3)] bg-accent">
            
             {/* 
             this is supposed to like get the data from the loggin service and show the notifications
                  <div className="flex items-center justify-center size-6 text-xxs absolute rounded-full -right-3 -top-2 bg-chart-5 p-[var(--space-xxs)]">9+</div>
             */}
             
            <Bell className='stroke-foreground hover:stroke-background'  />
        </Button>

          <NotifPopUp notifications={notifications} setVisible={setNotifIsVisible} isvisible={notifIsVisible}  user={userData?.username} />


      </nav>
    ) : null
  );
}

export default Usernav


