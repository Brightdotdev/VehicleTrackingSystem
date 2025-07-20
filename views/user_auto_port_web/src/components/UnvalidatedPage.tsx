import React from 'react'
import { Button } from './ui/button'
import { useUserValidation } from '@/hooks/useUserValidation';
import { AlertCircle } from 'lucide-react';

const UnvalidatedPage = () => {

      const {handleLogOut } = useUserValidation();
    
  return (
     
     
 <main className="flex items-center w-screen h-screen justify-center">
        <article className="flex flex-col justify-center gap-6 md:w-1/3 h-2/3 w-full p-2">
          <AlertCircle className='stroke-red-400 dark:stroke-red-500' />
          <div className="flex flex-col items-start gap-2">
            <h5 className="subTitleText2">We had a lil issue verifying you</h5>
            <p className="mutedText">Try logging in or signing up again</p>
          </div>
          <Button onClick={handleLogOut} className='px-8'>Go to Auth Page</Button>
        </article>
      </main>  
)
}

export default UnvalidatedPage