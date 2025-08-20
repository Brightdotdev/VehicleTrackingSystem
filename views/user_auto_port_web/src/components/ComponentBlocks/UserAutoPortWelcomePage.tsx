import { CableCar, LampDesk, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { BackgroundBeams } from "../ui/BackgroundBeam";
import { toast } from 'sonner';
import { Button } from '../ui/button';

export  const WelcomPage = () => {
  const [loading, setLoading] = useState(false);

  return (
  <section className="
    flex flex-col items-center 
    gap-md-2  
    overflow-y-hidden
    h-[40rem] w-screen rounded-md  relative flex flex-col items-center justify-center antialiased
    ">
<section className="
flex flex-col items-center  gap-lg
max-w-2xl mx-auto p-12 z-10 bg-background rounded-xl">      
         
            <article className="flexItemsCenter gap-sm
            justify-self-center">
      <CableCar className='size-12 stroke-muted-foreground hover:stroke-sidebar-accent-foreground cursor-pointer' />
      <div className="flex flex-col items-start ml-4">
        <h1 className="subTitleText mb-1">Welcome to Auto Port</h1>
        <p className="mutedText mb-2">Easily request a vehicle and get it dispatched to your location in minutes.</p>
        
      </div>
      </article>

    <article className="flexItemsCenter flex-row gap-sm  mt-[var(--space-lg)] md:mt-0 flex-wrap">
       
{ loading ? 

    <Button disabled className="flex items-center justify-center
  cursor-pointer  
    px-[var(--space-lg)]
    bg-muted-foreground
    font-bold
    text-primary-foreground         
  h-[var(--size-md)] 
  rounded-[var(--radius-xl)]">
    <Loader2 className="animate-spin mr-2" />
    Loading
  </Button>

:

<Link 
onClick={() => {
  toast.info("Redirecting now");
  setLoading(true)
}}

className='
        flex items-center justify-center
        cursor-pointer  
         px-[var(--space-lg)]
         bg-card-foreground
         font-bold
         text-background2         
        h-[var(--size-md)] 
        rounded-[var(--radius-xl)]' href="/join-us" >Sign Up To Continue</Link>
        }

        <p className='bodyText'>or   {"  "}
          <Link href="/welcome-back"
          onClick={() => {
  toast.info("Loging you in now");
  setLoading(true)
}}
          
          >
          <span className='cursor-pointer underline underline-offset-1'>
          Log in To Continue </span>
          </Link>
          </p>
      </article>
      </section>
      <BackgroundBeams />

    </section>)

}

export default WelcomPage