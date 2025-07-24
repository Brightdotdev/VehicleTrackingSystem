"use client";

import UnvalidatedPage from '@/components/utils/UnvalidatedPage';
import { useUserValidation } from '@/hooks/useUserValidation';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { lazy, Suspense, useEffect } from 'react';
import { toast } from 'sonner';


export default function page() {

  const router = useRouter();

  
  const searchParams = useSearchParams();
  
  const vehicleReqId = searchParams.get('vehicleReqId');
  const vehicleId = searchParams.get('vehicleId');

  const {loading, isValidated, checkValidation} = useUserValidation();
  const DispatchInfoPage = lazy(() => import('../../../../components/ComponentBlocks/Dispatches/DispatchInfoPage'));
  
  
  useEffect(() => {

    if(!vehicleReqId || !vehicleId) {
      toast.error("No Valid params for page")
      router.replace("/vehicles")}
    checkValidation();
  }, []);

  
  if (loading || isValidated === null)
     return (
    <div className="flex items-center justify-center size-screen">
      <Loader2 className="animate-spin mr-l stroke-foreground" />
      Loading Dispatch information...
    </div>
  );


if (!isValidated) {
    return (
     <UnvalidatedPage/>
    );
  }


  
  // ...
    if (isValidated && vehicleReqId && vehicleId) {
      return (
        <Suspense fallback={<div className='flex items-center justify-center size-screen'>
           <Loader2 className="animate-spin mr-l stroke-foreground" />
        Vehicle info page Loading....</div>}>
        <DispatchInfoPage vehicleVin={vehicleId}  vehicleReqId={Number(vehicleReqId)} />
        </Suspense>
      );
    
      
  }
}
