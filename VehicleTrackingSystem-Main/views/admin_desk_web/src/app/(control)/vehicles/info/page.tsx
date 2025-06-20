"use client";

import { useUserValidation } from '@/hooks/useUserValidation';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { lazy, Suspense, useEffect } from 'react';
import { toast } from 'sonner';


export default function page() {

  const router = useRouter();

  
  const searchParams = useSearchParams();
  
  const vehicle = searchParams.get('vehicle');

  const {loading, isValidated, checkValidation} = useUserValidation();
  const VehcileInfoPage = lazy(() => import('../../../../components/ComponentBlocks/Vehicles/VehicleInfoPage'));
  
  
  useEffect(() => {

    if(!vehicle){
      toast.error("No Valid params for page")
      router.replace("/vehicles")}

    checkValidation();
  
    
  }, []);



  if (loading) return <></>;

    if (isValidated && vehicle)
      return (
        <Suspense fallback={<div className='flex items-center justify-center size-screen'>
           <Loader2 className="animate-spin mr-l stroke-foreground" />
        Vehicle info page Loading....</div>}>
        <VehcileInfoPage vehicleVin={vehicle}  />
        </Suspense>
      );
    
      
  }
