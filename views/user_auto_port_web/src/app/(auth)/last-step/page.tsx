"use client";
import React, { useEffect } from "react";
import {  LastStep } from "@/components/ui/auth/LastStepForm";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/ui/Loading";

export default function Home() {
  const { isAuthenticated, authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams();
  const pageSender : string  | null = searchParams.get("sender");

  useEffect(() => {

  if (!pageSender ||
     (pageSender !== "local-sign-up" &&
      pageSender !== "google-sign-up"
    )) {
    if(isAuthenticated){
      router.replace("/")
      return;
    }
  }
  }, [searchParams, router]);

  


  return(
   <div className="flex items-center justify-center w-screen h-screen md:py-[var(--space-xs)]">
    {
      authLoading ? <Loading/> : 
       <LastStep  pageSender={pageSender ?? ""}/>
    }

   </div>    
  )
}