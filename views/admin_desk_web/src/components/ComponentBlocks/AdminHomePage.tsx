"use client"
import dynamic from 'next/dynamic';
import Usernav from '../ui/Usernav'
import { useAuth } from '@/contexts/AuthContext'
import { Suspense } from 'react';
import Loading from '../ui/Loading';




const MapView = dynamic(
  () => import("../mapComponents/Map/Map"),
  { ssr: false }
);

const AdminHomePage = () => {
  const {userData} = useAuth()

  
  return (
    userData && (
   <section className='relative  w-screen h-screen flex items-center justify-center'>
       
        <Usernav />


   <Suspense fallback={<Loading/>}>
        <MapView  />
   </Suspense>  

      </section>
    )
  )
}

export default AdminHomePage