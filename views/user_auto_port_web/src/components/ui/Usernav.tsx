import { useAuth } from '@/contexts/AuthContext'
import { Bell, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Button } from './button';
import { NotificationData } from '@/types/utilTypes';
import { useNotifications } from '@/contexts/NotificationContext';
import { HandleNewNotifications, HandleReadNotifications } from '../utils/NotificationUtils';
import WalletProfile from './UserProfile';



//// utilitiesssss grah








const NotifPopUp = ({ setVisible,notifications ,newNotifications,  isvisible, user }: 
{
  setVisible : (isVisible : boolean) => void,
  isvisible : boolean,
  notifications : NotificationData[],
  newNotifications : NotificationData[], 
  user : string | undefined
}) => {

const [unreadNotifications, setUnreadNotifications] = useState<NotificationData[] | null>(null);
const [readNotifications, setReadNotifications] = useState<NotificationData[] | null>(null);



useEffect(() => {

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

setUnreadNotifications(mergedUnread);
setReadNotifications(readNotificationsFilter());



  setUnreadNotifications(unreadNotificationsFilter)
  setReadNotifications(readNotificationsFilter)
  
  console.log(unreadNotificationsFilter)
console.log(readNotificationsFilter)
console.log("read notifications ",  readNotifications)
console.log("new notifications ", newNotifications)

} ,[notifications, newNotifications])


  return (
   
    isvisible && (
      <div className="bg-background2/95 fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center  backdrop-blur-sm shadow-2xl">
    <article className='self-end lg:mr-10 lg:w-1/3 md:mr-6 md:w-2/3 h-screen w-full h-[var(--size-lg)] bg-accent relative flex flex-col items-start justify-start p-[var(--space-sm)] shadow-xl'>
      <div className="flex justify-between items-center w-full">
        <h2 className='text-normal-2 text-muted-foreground'> {`${user || "Nobody"}'s Nofitcations`} </h2>    
        <X 
          onClick={() =>  setVisible(false)}
          className=' cursor-pointer stroke-muted-foreground hover:stroke-sidebar-accent-foreground' />
      </div>
      <div className="w-full flex flex-col gap-2 items-center justify-start pt-2  
      overflow-y-scroll no-scrollbar">
  


    {
      Array.isArray(unreadNotifications) && unreadNotifications.length > 0 && (
        <HandleNewNotifications newNotificationProps={unreadNotifications ?? []} />
      )
    }

    {
      Array.isArray(readNotifications) && readNotifications.length > 0 && (
        <HandleReadNotifications readNotificationProps={readNotifications ?? []} />
      )
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
      <nav className={'fixed top-2 flex items-start justify-between w-screen h-[var(--size-sm)] p-[var(--size-sm-3)] z-10 ' + classNames} >

        <article className="flex items-center justify-start gap-4  p-[var(--space-xs)] bg-accent rounded-lg cursor-pointer">
                {
                    userData?.picture  && (<img src={userData.picture} className='size-8 rounded-full object-cover' />)
                }
                <div className='size-8 rounded-full object-cover bg-red-400' />
                 <h3 className=' hidden md:flex md:subtitleText'>
                {`${userData?.username || "Nobody" }'s Desk`}  
            </h3>
        </article>
        


                  {/* <WalletProfile /> */}

        <Button onClick={() => setNotifIsVisible(true)} variant="outline" className="relative  flex items-center justify-center rounded-full p-[var(--space-sm-1)] h-[var(--space-sm-3)] bg-accent">
            
             
             
        
              {
                newNotifications.length > 0 && (
<div className="flex items-center justify-center size-6 text-xxs absolute rounded-full -right-3 -top-2 bg-chart-5 p-[var(--space-xxs)]">{newNotifications.length > 9 ? "9+" : newNotifications.length}</div>
                )
              }
              
                  
             
            <Bell className='stroke-foreground hover:stroke-background'  />
        </Button>

          <NotifPopUp newNotifications={newNotifications} notifications={notifications} setVisible={setNotifIsVisible} isvisible={notifIsVisible}  user={userData?.username} />


      </nav>
    ) : null
  );
}

export default Usernav


