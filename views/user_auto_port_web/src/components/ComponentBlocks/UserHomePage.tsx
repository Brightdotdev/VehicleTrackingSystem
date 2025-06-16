import React, { useEffect } from 'react'
import Usernav from '../ui/Usernav'
import { useUserValidation } from '@/hooks/useUserValidation'
import { getMyValidDIspatches } from '@/lib/handleUserDispatchPage'
import { useRouter } from 'next/navigation'




const UserHomePage = () => {
  const router = useRouter();
  const {isValidated, checkValidation} = useUserValidation()


useEffect(() => {
    const checkOngoingDispatch = async () => {
        
      await  checkValidation();

      if(isValidated){
                const onGoingDispatch = await getMyValidDIspatches()
        if (!onGoingDispatch && onGoingDispatch.length > 0) {
        router.push("/vehicles")}
        }else {  return}
    }

    checkOngoingDispatch()
  

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (

    
    <section className='relative  w-screen h-screen flex items-center justify-center'>
        <Usernav/>

 

    </section>
    
    
  )
}

export default UserHomePage