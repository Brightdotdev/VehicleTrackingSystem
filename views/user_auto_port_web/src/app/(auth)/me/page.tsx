"use client";

import WalletProfile from '@/components/ui/UserProfile';
import { useUserValidation } from '@/hooks/useUserValidation';
import { UserPageData } from '@/types/authTypes';
import Link from 'next/link';
import { lazy, useEffect, useState } from 'react';





export default function Page() {
  const { checkValidation, returnMyData} = useUserValidation();
  const [userData, setUserData] = useState<UserPageData | undefined>(null);
  
  useEffect(() => {
    const handleUserData  = async () => {
         const user = await returnMyData()
      setUserData(user);
    }
    handleUserData();

  }, []);
  
    return (
  
      <div className="flex flex-col gap-4 items-center justify-start w-screen h-screen">

      <div className="w-[98vw] flex flex-col items-center justify-start">

        {
          userData?.email
        }

     {/*    <div className="w-full h-[20rem] rounded-sm bg-red-300">
          <img src="/placeholder.png" alt=""  className='max-w-full max-h-full object-cover'/>
        

        </div> */}

        <WalletProfile/>
      </div>
     </div>
    )
}
