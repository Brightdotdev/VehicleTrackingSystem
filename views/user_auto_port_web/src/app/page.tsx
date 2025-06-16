"use client"

import Loading from '@/components/ui/Loading';
import { useUserValidation } from '@/hooks/useUserValidation';
import dynamic from 'next/dynamic';
import {useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { toast } from 'sonner';


const UserHomePage = dynamic(() => import('@/components/ComponentBlocks/UserHomePage'), {
  loading: () => <Loading/>,
});

const UserWelcomePage = dynamic(() => import('@/components/ComponentBlocks/UserAutoPortWelcomePage'), {
  loading: () => <Loading/>
});


export default function Page() {
  const {checkValidation, isValidated, loading} = useUserValidation();
  
    const searchParams = useSearchParams();
  const redirected = searchParams.get("redirected");

  useEffect(() => {
    checkValidation();
    if (redirected && (redirected === "already-logged-in")) {
      toast.error(`You're already logged in`);
    }
  }, [redirected]);


  if(loading && !isValidated) return <></>

  if(!isValidated && !loading) return <UserWelcomePage/>

  if(isValidated && !loading) return <UserHomePage/>

  
}
