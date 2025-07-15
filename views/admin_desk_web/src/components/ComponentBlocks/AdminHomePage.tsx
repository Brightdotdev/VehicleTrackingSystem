"use client"
import dynamic from 'next/dynamic';
import Usernav from '../ui/Usernav'
import { useAuth } from '@/contexts/AuthContext'


const MapView = dynamic(
  () => import("../mapComponents/Map/Map"),
  { ssr: false }
);

const AdminHomePage = () => {
  const {userData} = useAuth()

  
  return (
    userData && (

      <>
    
        <Usernav />
        <MapView  />
      </>
    )
  )
}

export default AdminHomePage