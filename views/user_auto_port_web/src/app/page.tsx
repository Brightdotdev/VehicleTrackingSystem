"use client"

import Loading from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
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
  const {isAuthenticated, authLoading} = useAuth();
  
    const searchParams = useSearchParams();
  const redirected = searchParams.get("redirected");

  useEffect(() => {
    if (redirected && (redirected === "already-logged-in")) {
      toast.error(`You're already logged in ode`);
    }
  }, [redirected]);


  if(authLoading && !isAuthenticated) return <></>

  if(!isAuthenticated && !authLoading) return <UserWelcomePage/>
  if(!isAuthenticated && !authLoading) return <UserWelcomePage/>

  if(isAuthenticated && !authLoading) return <UserHomePage/>

  
}
