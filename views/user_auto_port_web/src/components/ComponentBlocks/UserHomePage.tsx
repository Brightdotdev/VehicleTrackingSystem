import React, { lazy, Suspense, useEffect } from 'react'
import Usernav from '../ui/Usernav'
import { useUserValidation } from '@/hooks/useUserValidation'
import { getMyValidDispatches } from '@/lib/handleUserDispatchPage'
import { useRouter } from 'next/navigation'
import Loading from '../ui/Loading'




const UserHomePage = () => {
  const router = useRouter();
  const {isValidated, checkValidation} = useUserValidation()
const DispatchPageComponent = lazy(() => import("../ComponentBlocks/Dispatches/DispatchPageComponent"));

useEffect(() => {
    const checkOngoingDispatch = async () => {
        
      await checkValidation();

      if(isValidated){
        console.log("yesss this is ittt")   
        const onGoingDispatch = await getMyValidDispatches()
        console.log("Ongoinggg")
        console.log(onGoingDispatch)
        const hasActiveDispatches : boolean = onGoingDispatch && onGoingDispatch.length > 0
        console.log("do they?")
        console.log(hasActiveDispatches)
        if (!hasActiveDispatches) {
        router.push("/vehicles")}
        }else {  return}
    }

    checkOngoingDispatch()

  }, [isValidated])

  return (

    
    <section className='relative  w-screen h-screen flex items-center justify-center'>
        <Usernav/>

   <Suspense fallback={<Loading/>}>
   <DispatchPageComponent/>
   </Suspense>  

    </section>
    
    
  )
}

export default UserHomePage