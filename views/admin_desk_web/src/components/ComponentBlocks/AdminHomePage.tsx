"use client"
import dynamic from 'next/dynamic';
import Usernav from '../ui/Usernav'
import { useAuth } from '@/contexts/AuthContext'
import { Suspense } from 'react';
import Loading from '../ui/Loading';


type LatLng = [number, number];
const randomLocations: LatLng[] = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.52, -0.12],
  [51.5, -0.08],
  [51.515, -0.11]
];

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

{/* 
   <Suspense fallback={<Loading/>}>
        <MapView locations={randomLocations}  />
   </Suspense> */}  

      </section>
    )
  )
}

export default AdminHomePage