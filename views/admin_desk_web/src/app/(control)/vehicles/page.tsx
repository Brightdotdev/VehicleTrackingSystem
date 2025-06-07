"use client";

import UnAuthorizedPage from '@/components/ComponentBlocks/UnAuthorizedPage';
import VehiclePageComponent from '@/components/ComponentBlocks/VehiclePageComponent';
import { useAuth } from '@/contexts/AuthContext';

export default function page() {
  const {isAuthenticated, authLoading} = useAuth();


  if (authLoading) return <></>;

  if(!isAuthenticated && !authLoading) return <UnAuthorizedPage/>

  if(isAuthenticated && !authLoading) return <VehiclePageComponent/>  
}
