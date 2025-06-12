"use client";

import UnAuthorizedPage from '@/components/ComponentBlocks/UnAuthorizedPage';
import Loading from '@/components/ui/Loading';
import { useUserValidation } from '@/hooks/useUserValidation';
import { useRouter, useSearchParams } from 'next/navigation';
import { lazy, Suspense, useEffect } from 'react';
import { toast } from 'sonner';


export default function page() {

  const router = useRouter();

  
  const searchParams = useSearchParams();
  const vehicleReqid = searchParams.get('vehicleReq');
  const vehicle = searchParams.get('vehicle');

  const {loading, isValidated, checkValidation} = useUserValidation();

  
  
  useEffect(() => {

    if(!vehicle || !vehicleReqid){
      toast.error("No Valid params for page")
      router.replace("/vehicles")}

    checkValidation();
  
    
  }, []);



  if (loading) return <Loading />;

    if (isValidated && vehicle && vehicleReqid)
      return (
        <Suspense fallback={<>Disppatch Request Loading</>}>
          <>Thisss is my profileeeeeee </>
      
        </Suspense>
      );
    
  if(!loading && !isValidated) return  <UnAuthorizedPage/>;
      
  }
