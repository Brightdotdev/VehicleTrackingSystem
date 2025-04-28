"use client"
import { Button } from '@/components/ui/button'
import SignUpPopUp from '@/components/utils/SignUpPopUp';
import ThemeToggle from '@/components/utils/ThemeToggle';
import { LampDesk } from 'lucide-react'
import React, { useState } from 'react'



export default function page() {
    const [isOpen, setIsOpen] = useState(false); // track open/close state

    const handleClose = () => {
      setIsOpen(open => !open); // when close button clicked, hide the modal
    }
  return (
    <main className="
    flex flex-col items-center 
    min-h-screen 
    justify-center
    max-w-md
    p-[var(--space-sm)]
    h-[calc(100vh-20rem)]
    gap-[var(--space-md-2)]">
      <article className="flexItemsCenter gap-[var(--space-sm)]  justify-self-center">
      <LampDesk className='size-12 stroke-muted-foreground hover:stroke-sidebar-accent-foreground cursor-pointer' />
      <div className="flexItemsCenter">
      <h1 className="subTitleText">Welcome to DESK</h1>
      <p className="mutedText">Full control of your fleet with a dashboard</p>
      </div>
      </article>
    <article className="flexItemsCenter flex-row gap-[var(--space-sm)]
    mt-[var(--space-lg)] md:mt-0 flex-wrap">
        <Button className='cursor-pointer 
         px-[var(--space-lg)]
         font-bold
        h-[var(--size-md)] rounded-[var(--radius-lg)]' onClick={handleClose} > Set Up My Desk</Button>
      </article>


      <SignUpPopUp isOpen={isOpen} onClose={handleClose} />

    </main>

  )
}
