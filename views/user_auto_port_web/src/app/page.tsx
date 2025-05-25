"use client"
import AdminHomePage from '@/components/ComponentBlocks/AdminHomePage';
import WelcomPage from '@/components/ComponentBlocks/WelcomPage';
import { useAuth } from '@/contexts/AuthContext';
import { LampDesk } from 'lucide-react'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { toast } from 'sonner';



export default function page() {
  const {isAuthenticated, userData, authLoaing} = useAuth();
  
    const searchParams = useSearchParams();
  const redirected = searchParams.get("redirected");

  useEffect(() => {
    if (redirected && (redirected === "already-logged-in")) {
      toast.error(`You're already logged in`);
    }
  }, [redirected]);


  return (
    <main className="w-screen h-screen flex items-center justify-center">
   
      {authLoaing ? <h2>Loading....</h2>   :   ( isAuthenticated ?  <AdminHomePage/>  : <WelcomPage/>)}
  
    </main>

  )
}
