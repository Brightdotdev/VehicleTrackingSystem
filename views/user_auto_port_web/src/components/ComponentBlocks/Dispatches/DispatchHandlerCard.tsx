// Import necessary components and types
import { Button } from '@/components/ui/button'
import { DispatchInfoPagePills } from '@/components/utils/RequestPageUtilComponents'
import { DispatchRequestDto } from '@/types/VehicleTypes'
import React from 'react'

// Define props interface for the component
interface DispatchHandlerCardProps {
  dispatchData?: DispatchRequestDto; // Mark optional in case undefined is passed
}

// Component now correctly accepts props as an object
const DispatchHandlerCard: React.FC<DispatchHandlerCardProps> = ({ dispatchData }) => {
  // Return early if no dispatchData is provided to avoid runtime errors
  if (!dispatchData) return null;

  return (
    <article className='flex flex-col items-center justify-start gap-2 p-4 absolute bottom-2 right-2 
      h-[26rem] w-[24rem] bg-card rounded-lg'>
      <h5 className='text-small-2'>My Request Metadata</h5>

      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <div className="flex w-full items-center justify-between">
          <h5 className='text-small-2'>Dispatch Status</h5>
          <DispatchInfoPagePills statusName={dispatchData.dispatchStatus} />
        </div>

        <div className="flex w-full items-center justify-between">
          <h5 className='text-small-2'>Dispatch Reason</h5>
          <DispatchInfoPagePills statusName={dispatchData.dispatchReason} />
        </div>

        <div className="flex w-full items-center justify-between">
          <h5 className='text-small-2'>Dispatch Request Time</h5>
          <h6 className='text-small-2'>{dispatchData.dispatchRequestTime}</h6>
        </div>
      </div>

      <Button variant="destructive" className='px-12 text-normal py-6 rounded-lg'>
        Terminate Dispatch
      </Button>
    </article>
  )
}

export default DispatchHandlerCard;
