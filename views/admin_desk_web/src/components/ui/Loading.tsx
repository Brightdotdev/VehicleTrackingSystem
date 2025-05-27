import { PhilippinePesoIcon } from 'lucide-react'
import React from 'react'
import { Progress } from './progress'

const Loading = () => {
  return (

    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-md flex flex-col items-center gap-md">
        <Progress  value={20} />
    <h3 className='text-foreground-muted text-normal'>Desk Loading....</h3>

      </div>
    </div>

  )
}

export default Loading