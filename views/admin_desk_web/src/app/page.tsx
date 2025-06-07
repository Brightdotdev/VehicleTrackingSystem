"use client"

import AdminHomePage from '@/components/ComponentBlocks/AdminHomePage';
import { AdminWelcomePage } from '@/components/ComponentBlocks/AdminWelcomePage';
import { useAuth } from '@/contexts/AuthContext';

import {useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

export default function page() {
  const {isAuthenticated, authLoading} = useAuth();
  
    const searchParams = useSearchParams();
  const redirected = searchParams.get("redirected");

  useEffect(() => {
    if (redirected && (redirected === "already-logged-in")) {
      toast.error(`You're already logged in ode`);
    }
  }, [redirected]);


  if(authLoading && !isAuthenticated) return <></>

  if(!isAuthenticated && !authLoading) return <AdminWelcomePage/>
  if(!isAuthenticated && !authLoading) return <AdminWelcomePage/>

  if(isAuthenticated && !authLoading) return <AdminHomePage/>

  
}
