import { useAuth } from '@/contexts/AuthContext'
import { Bell, X } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from './button';
import { NotificationData } from '@/types/utilTypes';
import { useAdminNotifications } from '@/contexts/NotificationContext';
import { HandleReadNotifications, HandleUnreadNotifications } from '../utils/NotificationUtils';
import Link from 'next/link';




//// utilitiesssss grah


const NotifPopUp = ({ readNotifications, unreadNotifications, setVisible, isvisible, user }: 
{
  readNotifications : NotificationData[],
  unreadNotifications : NotificationData[],
  setVisible : (isVisible : boolean) => void,
  isvisible : boolean,
  user : string | undefined
}) => {

  const hasNotifications = Array.isArray(readNotifications) && readNotifications.length > 0;

  const hasUnread = Array.isArray(unreadNotifications) && unreadNotifications.length > 0;


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
  


    {hasNotifications && 
    <HandleReadNotifications notifications={readNotifications} />
    }
    {hasUnread && 
    <HandleUnreadNotifications newNotifications={unreadNotifications} /> 
    }
    
    
    
                
      </div>
    </article>
  </div>))}




const Usernav = ({classNames} : {classNames? : string}) => {
  const { isAuthenticated, userData} = useAuth();
    const [notifIsVisible, setNotifIsVisible] = useState(false);
    const {newNotifications, notifications} = useAdminNotifications();

  return (
    isAuthenticated ? (
      <nav className={'fixed top-2 flex items-start justify-between w-screen h-[var(--size-sm)] p-[var(--size-sm-3)] z-10 ' + classNames} >

        <Link href="/me" className="flex items-center justify-start gap-4  p-[var(--space-xs)] bg-accent rounded-lg cursor-pointer" >
                {
                    userData?.picture  && (<img src={userData.picture} className='size-8 rounded-full object-cover' />)
                }
                <div className='size-8 rounded-full object-cover bg-red-400' />
                 <h3 className=' hidden md:flex md:subtitleText'>
                {`${userData?.username || "Nobody" }'s Desk`}  
            </h3>
        </Link>
        


                  {/* <WalletProfile /> */}

        <Button onClick={() => setNotifIsVisible(true)} variant="outline" className="relative  flex items-center justify-center rounded-full p-[var(--space-sm-1)] h-[var(--space-sm-3)] bg-accent">
            
             
             
        
              {
                newNotifications.length > 0 && (
<div className="flex items-center justify-center size-6 text-xxs absolute rounded-full -right-3 -top-2 bg-chart-5 p-[var(--space-xxs)]">{newNotifications.length > 9 ? "9+" : newNotifications.length}</div>
                )
              }
              
                  
             
            <Bell className='stroke-foreground hover:stroke-background'  />
        </Button>

          <NotifPopUp unreadNotifications={notifications} readNotifications={newNotifications} setVisible={setNotifIsVisible} isvisible={notifIsVisible}  user={userData?.username} />


      </nav>
    ) : null
  );
}

export default Usernav


