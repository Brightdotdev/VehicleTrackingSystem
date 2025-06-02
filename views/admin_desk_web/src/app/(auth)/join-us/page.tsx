"use client";

import { SignUpForm } from "@/components/ComponentBlocks/sign-up-form";
import dynamic from "next/dynamic";
import Link from "next/link";




export default function Home() {



  return(
   <div className="flex items-center justify-center w-screen  overflow-hidden py-[var(--space-sm)] ">
         <SignUpForm />
         
                 <Link href="/welcome-back" className="absolute underline-offset-2 hover:underline md:right-4 right-2 md:bottom-4 bottom-2 px-[var(--space-sm)] py-[var(--space-xs)] rounded-md md:text-muted-foreground md:hover:text-foreground">
                   Already have and account? 
                 </Link>
   </div>    
  )
}