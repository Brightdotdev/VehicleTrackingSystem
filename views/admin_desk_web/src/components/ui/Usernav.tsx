import { useAuth } from '@/contexts/AuthContext'
import { Bell } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from './button';


const NotifPopUp = ({setVisible , isvisible} : {setVisible : (isVisible : boolean) => void,isvisible : boolean }) => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      
    <article className='w-[var(--size-xl)]  h-[var(--size-lg)] bg-accent relattive flex flex-col items-start justify-center'>

    </article>
    </div>
    )
}



const Usernav = () => {
    const [notifIsVisible, setNotifIsVisible] = useState(false);
    const { isAuthenticated, userData} = useAuth();
  return (
    isAuthenticated ? (
      <nav className='flex items-center justify-between w-screen h-[var(--size-md)] px-[var(--size-sm-2)] py-[var(--size-xs)]'>
        <article className="flex items-center justify-start gap-2 p-[var(--space-xs)] bg-accent rounded-lg cursor-pointer">
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

        <NotifPopUp setVisible={setNotifIsVisible} isvisible={notifIsVisible} />


      </nav>
    ) : null
  );
}

export default Usernav