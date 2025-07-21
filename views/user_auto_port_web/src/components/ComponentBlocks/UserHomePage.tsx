import React, { lazy, Suspense, useEffect, useState } from 'react'
import Usernav from '../ui/Usernav'
import Loading from '../ui/Loading'




const UserHomePage = () => {
const DispatchPageComponent = lazy(() => import("../ComponentBlocks/Dispatches/DispatchPageComponent"));

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