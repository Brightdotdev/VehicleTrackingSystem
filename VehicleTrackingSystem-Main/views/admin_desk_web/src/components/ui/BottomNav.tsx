"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './button'
import { Car, History, Map } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useUserValidation } from '@/hooks/useUserValidation'


type pathTypes = {
    bottmNavTypes : "history" | "map" | "vehicles"  
}


const BottomNav = () => {
      const [path, setPath] = useState<pathTypes["bottmNavTypes"]>("map")
      const  {isValidated, loading, checkValidation} = useUserValidation();

      const pathName = usePathname()
    const router = useRouter()

      const handleVehicleRoute = () => {
        setPath("vehicles")
        console.log("hello")
        router.push("/vehicles")
      }

      const handleHistoryRoute = () => {
        setPath("history")
        router.push("/history")
      }
      const handleMapRoute = () => {
        setPath("map")
        router.push("/")
      }



useEffect( () =>{

    console.log(pathName)
    checkValidation();


    if(pathName.includes("history")){
        setPath("history")
    }else if(pathName.includes("vehicles")){
        setPath("vehicles")
    }else{
        setPath("map")
    }
  


}, [pathName])



if(!isValidated && loading) return <></>

if(!isValidated && !loading)return <></>


if(isValidated && !loading) return (
          <nav className={`
            ${
            !pathName.includes("/join-us") && !pathName.includes("/welcome-back") &&
            !pathName.includes("/vehicles/request") && !pathName.includes("/vehicles/info") 
            ? `flex items-start justify-center backdrop-blur-xs z-10 bg-white/1 
            fixed bottom-0 w-full h-[var(--size-lg)]
            ` : "hidden"}`}>

              <section className={`
                flex items-center justify-center w-[16rem]`}>
            <Button
                onClick={() => handleHistoryRoute()}
                className={`bottomNavButton navButtonLeft
                ${path === "history" ? "bg-blue-950/90 dark:bg-blue-850/90 hover:bg-blue-800/90" : ""}`}>
                <History className={`w-[var(--size-xl)]  ${path === "history" ? "dark:stroke-primary" : ""} `} />
            </Button>

            <Button
                onClick={() => handleMapRoute()}
                className={`bottomNavButton rounded-none 
                ${path === "map" ? "bg-blue-950/90 dark:bg-blue-850/90 hover:bg-blue-800/90" : ""}`}>
                <Map className={`w-[var(--size-xl)]  ${path === "map" ? "dark:stroke-primary" : ""} `} />
            </Button>

            <Button
                onClick={() => handleVehicleRoute()}
                className={`bottomNavButton navButtonRight  
                ${path === "vehicles" ? "bg-blue-950/90 dark:bg-blue-850/90 hover:bg-blue-800/90" : ""}`}>
                <Car className={`w-[var(--size-xl)]  ${path === "vehicles" ? "dark:stroke-primary" : ""} `} />
            </Button>

              </section>

          </nav>)}


export default BottomNav


