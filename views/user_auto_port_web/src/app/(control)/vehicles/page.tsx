"use client";

import Loading from '@/components/ui/Loading';
import { useUserValidation } from '@/hooks/useUserValidation';
import { lazy, Suspense, useEffect } from 'react';



const VehiclePageComponent = lazy(() => import("../../../components/ComponentBlocks/Vehicles/VehiclePageComponent"));

export default function Page() {
  const {loading, isValidated, checkValidation} = useUserValidation();

  useEffect(() => {
    checkValidation();
  }, []);
  
  if(isValidated && !loading) 
    return  <Suspense fallback={<Loading/>}><VehiclePageComponent/></Suspense>  

  if(loading) return <> </>;

}
