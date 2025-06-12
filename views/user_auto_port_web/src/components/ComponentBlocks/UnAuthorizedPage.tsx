import React from 'react'
import HomeButton from '../utils/HomeButton'

const UnAuthorizedPage = () => {
  return (
    <main className='flex flex-col justfy-center md:items-start md:justify-start p-[var(--size-md)] w-screen h-screen bg-background2'>
        
      <div className="">
          <h3 className='text-large text-red-900 dark:text-red-500 text-900'>
            403<span className='mutedText'> Unathorized! </span>
        </h3>

        <h1 className='md:w-1/2 titleText'>
            Youre not allowed to see this page fine boy shoo
        </h1>
      </div>

            <HomeButton/>
    </main>
  )
}

export default UnAuthorizedPage