import React, { lazy, Suspense, useEffect, useState } from 'react'
import Usernav from '../ui/Usernav'
import { useUserValidation } from '@/hooks/useUserValidation'
import { getMyValidDispatches } from '@/lib/handleUserDispatchPage'
import { useRouter } from 'next/navigation'
import Loading from '../ui/Loading'




const UserHomePage = () => {
  const router = useRouter();
  const {isValidated, checkValidation} = useUserValidation()
const DispatchPageComponent = lazy(() => import("../ComponentBlocks/Dispatches/DispatchPageComponent"));
const [hasCheckedDispatch, setHasCheckedDispatch] = useState(false); // prevent rechecking

  useEffect(() => {

    const checkDispatch = async () => {
      // Only run if validated and haven't already checked
      if (!isValidated || hasCheckedDispatch) return;

      console.log("yesss this is ittt");
      
      try {
        const onGoingDispatch = await getMyValidDispatches();
        console.log("Ongoinggg");
        console.log(onGoingDispatch);

        const hasActiveDispatches = Array.isArray(onGoingDispatch) && onGoingDispatch.length > 0;
        console.log("do they?");
        console.log(hasActiveDispatches);

        if (!hasActiveDispatches) {
          router.push("/vehicles"); // Redirect only if they don't have active dispatch
        }
      } catch (err) {
        console.error("Error checking dispatch:", err);
      } finally {
        setHasCheckedDispatch(true); // Prevent infinite re-checking
      }
    };
    checkValidation()
    checkDispatch(); // Call the async function
  }, [isValidated, hasCheckedDispatch, router]); // Proper dependencies




  return (

    
    <section className='relative  w-screen h-screen flex items-center justify-center'>
        <Usernav />

   <Suspense fallback={<Loading/>}>
   <DispatchPageComponent/>
   </Suspense>  

    </section>
    
    
  )
}

export default UserHomePage