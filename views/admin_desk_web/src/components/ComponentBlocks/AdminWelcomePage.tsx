import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "../ui/Spotlight";
import { LampDesk,  } from "lucide-react";
import Link from "next/link";

export function AdminWelcomePage() {
  return (
    <main className="relative flex h-screen  w-screen overflow-hidden rounded-md  antialiased items-center justify-center">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
            "[background-image:linear-gradient(to_right,var(--gradientLine)_1px,transparent_1px),linear-gradient(to_bottom,var(--gradientLine)_1px,transparent_1px)]",
          )}
        />


      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="grey"
      />
      
      <section className="flex flex-col relative gap-lg z-10 w-full max-w-md">


  <article className="flexItemsCenter gap-sm  justify-self-center">
    
    <LampDesk className='size-12 stroke-muted-foreground hover:stroke-sidebar-accent-foreground cursor-pointer' />

  <div className="flexItemsCenter gap-sm">
        <h1 className="subTitleTextGradient bg-opacity-50 bg-gradient-to-b from-muted-foreground to-foreground bg-clip-text text-center  text-transparent">
          Welcome to DESK.
        </h1>
         <p className="mutedText">Control your fleet</p></div>
         </article>


    <article className="flexItemsCenter flex-row gap-sm  flex-wrap">
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
      </section>
    </main>
  );
}
