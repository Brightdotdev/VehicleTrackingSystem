"use client"

import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/ComponentBlocks/login-form"
import ToggleTier from "@/components/utils/Toggler"
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
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
