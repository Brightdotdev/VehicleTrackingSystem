"use client"

import { LoginForm } from "@/components/ComponentBlocks/login-form"
import Link from "next/link";

export default function LoginPage() {
  
  return (
  <div className="flex items-center justify-center w-screen h-screen md:py-[var(--space-xs)]">
        <LoginForm />

        <Link href="/join-us" className="absolute underline-offset-2 hover:underline md:right-4 right-2 md:bottom-4 bottom-2 px-[var(--space-sm)] py-[var(--space-xs)] rounded-md md:text-muted-foreground md:hover:text-foreground">
          Don't Have an Account ? 
        </Link>
  </div>    

  )
}
