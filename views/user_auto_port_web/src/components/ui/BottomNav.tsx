"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './button'
import { Car, Navigation, UserRound } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useUserValidation } from '@/hooks/useUserValidation'
import { getMyValidDIspatches } from '@/lib/handleUserDispatchPage'

type BottomNavType = "me" | "dispatch" | "vehicles"

const BottomNav = () => {
  const pathName = usePathname()
  const router = useRouter()
  const { isValidated, loading, checkValidation } = useUserValidation()

  // Set initial path based on current pathname
  const getInitialPath = (): BottomNavType => {
    if (pathName.includes("me")) return "me"
    if (pathName.includes("vehicles")) return "vehicles"
    return "dispatch"
  }
  const [path, setPath] = useState<BottomNavType>(getInitialPath())

  // Route handlers with clear names
  const goToVehicles = () => {
    setPath("vehicles")
    router.push("/vehicles")
  }
  const goToDispatch = () => {
    setPath("dispatch")
    router.push("/")
  }
  const goToProfile = () => {
    setPath("me")
    router.push("/me")
  }

  useEffect(() => {
    checkValidation()
    setPath(getInitialPath())
  }, [pathName])
  useEffect(() => {
    const checkOngoingDispatch = async () => {
        if(isValidated){
                const onGoingDispatch = await getMyValidDIspatches()
      if (onGoingDispatch && onGoingDispatch.length > 0) {
        setPath("dispatch")
        router.push("/")
      } else {
        setPath("vehicles")
        router.push("/vehicles")
      }

        }else {
          return
        }
    }

    checkOngoingDispatch()
  

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return null
  if (!isValidated) return null

 
  const hideNav =
    pathName.includes("/join-us") ||
    pathName.includes("/welcome-back") ||
    pathName.includes("/vehicles/get") ||
    pathName.includes("/vehicles/info")

  if (hideNav) return null

  return (
    <nav className="flex items-start justify-center backdrop-blur-xs z-10 bg-white/1 fixed bottom-0 w-full md:h-[var(--size-lg)] h-[var(--size-xxl)]">
      <section className="flex items-center justify-center w-[18rem]">
        <Button
          onClick={goToVehicles}
          className={`bottomNavButton navButtonLeft ${path === "vehicles" ? "bg-blue-950/90 dark:bg-blue-850/90 hover:bg-blue-800/90" : ""}`}>
          <Car className={`w-[var(--size-xl)] ${path === "vehicles" ? "dark:stroke-primary" : ""}`} />
        </Button>
        <Button
          onClick={goToDispatch}
          className={`bottomNavButton rounded-none ${path === "dispatch" ? "bg-blue-950/90 dark:bg-blue-850/90 hover:bg-blue-800/90" : ""}`}>
          <Navigation className={`w-[var(--size-xl)] ${path === "dispatch" ? "dark:stroke-primary" : ""}`} />
        </Button>
        <Button
          onClick={goToProfile}
          className={`bottomNavButton navButtonRight ${path === "me" ? "bg-blue-950/90 dark:bg-blue-850/90 hover:bg-blue-800/90" : ""}`}>
          <UserRound className={`w-[var(--size-xl)] ${path === "me" ? "dark:stroke-primary" : ""}`} />
        </Button>
      </section>
    </nav>
  )
}

export default BottomNav


