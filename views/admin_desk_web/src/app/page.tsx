"use client"

import Loading from '@/components/ui/Loading';
import { useUserValidation } from '@/hooks/useUserValidation';
import dynamic from 'next/dynamic';
import {useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { toast } from 'sonner';


const AdminHomePage = dynamic(() => import('@/components/ComponentBlocks/AdminHomePage'), {
  loading: () => <Loading/>,
});

const AdminWelcomePage = dynamic(() => import('@/components/ComponentBlocks/AdminWelcomePage'), {
  loading: () => <Loading/>
});


export default function Page() {
  const {loading,checkValidation, isValidated} = useUserValidation();
  
    const searchParams = useSearchParams();
  const redirected = searchParams.get("redirected");

  useEffect(() => {
    checkValidation()
    if (redirected && (redirected === "already-logged-in")) {
      toast.error(`You're already logged`);
    }
  }, [redirected]);


  if(loading && !isValidated) return <></>

  if(!isValidated && !loading) return <AdminWelcomePage/>
  if(!isValidated && !loading) return <AdminWelcomePage/>

  if(isValidated && !loading) return <AdminHomePage/>

  
}
