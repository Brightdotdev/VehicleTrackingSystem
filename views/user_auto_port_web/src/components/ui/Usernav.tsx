import { useAuth } from '@/contexts/AuthContext'
import { Bell } from 'lucide-react';
import React from 'react'

const Usernav = () => {
    const { isAuthenticated, userData} = useAuth();
  return (
    isAuthenticated ? (
      <nav className='flex items-center jsutify-between w-screen h-[var(--size-md)]'>
        <article className="px-[var(--size-md)] py-[var(--size-sm)] ">
                {
                    userData?.picture  && (<img src={userData.picture} className='size-6 rounded-full' />)
                }
            <h3 className='subtitleText'>
                {`${userData?.username || "Nobody " }'s Desk`}  
            </h3>
        </article>
        
        <div className="size-8 rounded-full p-[var(--space-sm)]">
            <Bell />
        </div>
      </nav>
    ) : null
  );
}

export default Usernav