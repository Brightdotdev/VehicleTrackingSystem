"use client";

import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import UnvalidatedPage from '@/components/UnvalidatedPage';
import { useUserValidation } from '@/hooks/useUserValidation';
import { deleteCookie } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { lazy, Suspense, useEffect } from 'react';



const VehiclePageComponent = lazy(() => import("../../../components/ComponentBlocks/Vehicles/VehiclePageComponent"));

export default function Page() {
  const {loading, isValidated, checkValidation } = useUserValidation();

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

  
  return (
    <Suspense fallback={<Loading />}>
      <VehiclePageComponent />
    </Suspense>
  );

}
