"use client";
import React, { useEffect } from "react";
import {  LastStep } from "@/components/ui/auth/LastStepForm";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { useUserValidation } from "@/hooks/useUserValidation";
import UserSignUpMultiStep from "@/components/ui/auth/UserSignUpMultiStep";

export default function Home() {
  const { loading, isValidated, checkValidation } = useUserValidation()
  const router = useRouter()
  const searchParams = useSearchParams();
  const pageSender : string  | null = searchParams.get("sender");

  useEffect(() => {

  if (!pageSender ||
     (pageSender !== "local-sign-up" &&
      pageSender !== "google-sign-up"
    )) {
      checkValidation()

    if(isValidated){
      router.replace("/")
      return;
    }
  }
  }, [searchParams, router]);

  


  return(
   <div className="flex items-center justify-center w-screen h-screen md:py-[var(--space-xs)]">
    {
      loading ? <Loading/> : <UserSignUpMultiStep/>
    }

   </div>    
  )
}