"use client"

import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import ToggleTier from "@/components/utils/Toggler"

export default function LoginPage() {
  return (
  <div className="flex items-center justify-center w-screen h-screen md:py-[var(--space-xs)]">
        <LoginForm />

  </div>    

  )
}
