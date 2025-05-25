import { LampDesk } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export  const WelcomPage = () => {
  return (
  <section className="
    flex flex-col items-center 
    min-h-2xl 
    justify-center
    max-w-md
    p-[var(--space-sm)]
    gap-md-2
    overflow-y-hidden
    ">
      <article className="flexItemsCenter gap-sm  justify-self-center">
      <LampDesk className='size-12 stroke-muted-foreground hover:stroke-sidebar-accent-foreground cursor-pointer' />
      <div className="flexItemsCenter">
      <h1 className="subTitleText">Welcome to DESK</h1>
      <p className="mutedText">Control your fleet</p>
      </div>
      </article>
    <article className="flexItemsCenter flex-row gap-sm  mt-[var(--space-lg)] md:mt-0 flex-wrap">
       
        <Link className='
        flex items-center justify-center
        cursor-pointer  
         px-[var(--space-lg)]
         bg-card-foreground
         font-bold
         text-background2         
        h-[var(--size-md)] 
        rounded-[var(--radius-xl)]' href="/welcome-back" >Log In To Continue</Link>

        <p className='bodyText'>or   {"  "}
          <Link href="/join-us">
          <span className='cursor-pointer underline underline-offset-1'>
          Create an account </span>
          </Link>
          </p>
      </article>
    </section>)

}

export default WelcomPage