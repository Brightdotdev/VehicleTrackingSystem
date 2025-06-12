"use client";

import { useUserValidation } from '@/hooks/useUserValidation';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { lazy, Suspense, useEffect } from 'react';
import { toast } from 'sonner';


export default function page() {

  const router = useRouter();

  
  const searchParams = useSearchParams();
  const vehicleReqid = searchParams.get('vehicleReq');
  const vehicle = searchParams.get('vehicle');

  const {loading, isValidated, checkValidation} = useUserValidation();
  const DispatchRequestPage = lazy(() => import('../../../../components/ComponentBlocks/Vehicles/DispatchRequestPage'));
  
  
  useEffect(() => {

    if(!vehicle || !vehicleReqid){
      toast.error("No Valid params for page")
      router.replace("/vehicles")}

    checkValidation();
  
    
  }, []);



  if (loading) return <></>;

    if (isValidated && vehicle && vehicleReqid)
      return (
        <Suspense fallback={<div className='w-screen h-screen flex items-center justify-center gap-2 '>
                   <Loader2 className="animate-spin ml-2 stroke-foreground" />
        Dispatch Request Loading...
        </div>}>
          <DispatchRequestPage vehicleVin={vehicle} vehicleReqid={Number(vehicleReqid)} />
        </Suspense>
      );
    
      
  }
