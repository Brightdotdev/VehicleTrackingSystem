import React, { useState } from 'react'
import Usernav from '../ui/Usernav'
import { useAuth } from '@/contexts/AuthContext'




const AdminHomePage = () => {
  const {userData} = useAuth()

  return (

    userData && (
    <section className='relative  w-screen h-screen flex items-center justify-center'>
        <Usernav/>



    </section>
    )


  )
}

export default AdminHomePage