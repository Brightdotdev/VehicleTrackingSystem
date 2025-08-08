import React, { useEffect, useState } from 'react'
import { DispatchRequestPageStatusPills, DispatchRequestPageStatusPillsProps } from './RequestPageUtilComponents';
import { DispatchRequestDto } from '@/types/VehicleTypes';
import { ArrowUpRight, Info } from 'lucide-react';
import { getAllMyDIspatches } from '@/lib/handleUserDispatchPage';
import Link from 'next/link';

const UserDispatchHistory = () => {

    const [dispatchHistory, setDispatchHistory] = useState<DispatchRequestDto[]>([])

    const getUserHistory =  async () => {
        const userDispatchHistory = await getAllMyDIspatches();
        console.log(userDispatchHistory)
        setDispatchHistory(userDispatchHistory)
    }


    useEffect(() =>{
            getUserHistory()
    }, [])




    if(dispatchHistory.length === 0) return(
<div className="flex flex-col items-center justify-start gap-6 bg-background rounded-sm w-full
   h-full overflow-hidden overflow-y-auto no-scrollbar md:p-4 p-2 bg-background2">

<div className="flex items-center flex-col gap-2">
     <Info className='size-8'/>
<h4 className="text-body-2">
      You Have no dispatch record with us yet..
</h4>
</div>

<div className="flex items-center justify-center gap-2 bg-muted/80 p-3 rounded-full hover:bg-accent/70 group transition-colors border border-border shadow-sm dark:bg-muted/60 dark:hover:bg-accent/40">
  <Link href="/vehicles" className="text-primary font-medium  hover:text-accent-foreground transition-colors">
    checkout the vehicles to make one
  </Link>
  <ArrowUpRight className="transition-transform duration-200 group-hover:rotate-45 text-primary" />
</div>
    </div>
    )  
  
    return (
    
<div className="flex flex-col items-start justify-start gap-6 bg-background rounded-sm w-full
   h-full overflow-hidden overflow-y-auto no-scrollbar md:p-4 p-2 bg-background2">
    <h4 className="subtitleText2">
              My Dispatch History
            </h4>
    {
      dispatchHistory.map((dispatch, index) => {
        // Map dispatchStatus to valid DispatchRequestPageStatusPillsProps["statusName"]
        const statusMap: Record<string, DispatchRequestPageStatusPillsProps["statusName"]> = {
          "EXPIRED": "EXPIRED",
          "COMPLETED": "COMPLETED",
          "REJECTED": "REJECTED",
          "ACTIVE": "ACTIVE",
          "IN_TRANSIT": "IN_TRANSIT",
          "PENDING": "PENDING",
          "IN_PROGRESS": "IN_PROGRESS",
          "DISPATCH_DATA": "DISPATCH_DATA",
          "AVAILABLE": "AVAILABLE",
          "CLASSIFIED": "CLASSIFIED",
          "CARGO": "CARGO",
          "CANCELLED": "CANCELLED",
          "REGULAR": "REGULAR",
          "ONGOING": "ONGOING",
          "TRANSPORT": "TRANSPORT",
          "DELIVERY": "DELIVERY",
          "NOT_DISPATCHABLE": "NOT_DISPATCHABLE",
          "DISPATCHABLE": "DISPATCHABLE"
        };
        const mappedStatus = statusMap[dispatch.dispatchStatus as string] || "FAILED TO FETCH";
        return (
<Link href={`/dispatch/info?vehicleReqId=${dispatch.dispatchId}&vehicleId=${dispatch.dispatchVehicleId}`} className="flex  md:items-center items-start justify-between gap-2 w-full rounded-md  p-1 cursor-pointer" key={index}>
<div className="flex items-center justify-center gap-2">
    
      <span className='text-small'> My Request for the  {dispatch.vehicleName}</span>
</div>

  <DispatchRequestPageStatusPills statusName={mappedStatus} userName={dispatch.dispatchRequester} userImage={dispatch.userImage} className='realtive' />
</Link>
        );
      })
     
    }



   </div>


  )
}

export default UserDispatchHistory