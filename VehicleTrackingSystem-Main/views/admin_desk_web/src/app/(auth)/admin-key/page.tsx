"use client";

import React from "react";
import { AdminKeyForm } from "@/components/ui/auth/AdminKey";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/ui/Loading";

export default function Home() {
  const { authLoading } = useAuth()
  const searchParams = useSearchParams();
  const pageSender : string  | null = searchParams.get("sender");

  
  


  return(
   <div className="flex items-center justify-center w-screen h-screen md:py-[var(--space-xs)]">
    {
      authLoading ? <Loading/> : 
       <AdminKeyForm  pageSender={pageSender ?? ""}/>
    }

   </div>    
  )
}