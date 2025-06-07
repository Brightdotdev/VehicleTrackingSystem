"use client";
import React, { useEffect } from "react";
import { AdminKeyForm } from "@/components/ui/AdminKey";
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
      pageSender !== "local-log-in" &&
      pageSender !== "google-log-in" &&
      pageSender !== "google-sign-up"
    )) {
    toast.error("Uhm who sent you here boss");

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
       <AdminKeyForm  pageSender={pageSender ?? ""}/>
    }

   </div>    
  )
}