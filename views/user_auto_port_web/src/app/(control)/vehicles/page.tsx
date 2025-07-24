"use client";

import Loading from '@/components/ui/Loading';
import UnvalidatedPage from '@/components/utils/UnvalidatedPage';
import { useUserValidation } from '@/hooks/useUserValidation';
import { lazy, Suspense, useEffect } from 'react';



const VehiclePageComponent = lazy(() => import("../../../components/ComponentBlocks/Vehicles/VehiclePageComponent"));

export default function Page() {
  const {loading, isValidated, checkValidation} = useUserValidation();

  useEffect(() => {
    checkValidation();
  }, []);
     

  if (loading || isValidated === null) {
    return <Loading />; 
  }


if (!isValidated) {
    return (
     <UnvalidatedPage/>
    );
  }
  
  
  if(isValidated && !loading) 
    return  <Suspense fallback={<Loading/>}><VehiclePageComponent/></Suspense>  

  

}
