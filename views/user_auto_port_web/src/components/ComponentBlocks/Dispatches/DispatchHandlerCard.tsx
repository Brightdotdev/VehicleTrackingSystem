import { format, parseISO } from "date-fns";
import { Button } from '@/components/ui/button';
import { DispatchInfoPagePills } from '@/components/utils/RequestPageUtilComponents';
import { HealthText } from '@/components/utils/UtilComponents';
import { DispatchRequestDto } from '@/types/VehicleTypes';
import React, { useEffect, useState } from 'react';
import { handleTerminateDispatch } from "@/lib/handleUserDispatchPage";
import { Fuel } from "lucide-react";

interface DispatchHandlerCardProps {
  dispatchData?: DispatchRequestDto;
}

const DispatchHandlerCard: React.FC<DispatchHandlerCardProps> = ({ dispatchData }) => {
  const [formatedReqTime, setFormatedReqTime] = useState<string>('');

    const [formartedEndTime, setFormartedEndTime] = useState<string>('');


  useEffect(() => {
    if (!dispatchData) return;



    console.log("We are in the card")
    if (dispatchData?.dispatchRequestTime) {
      const date = parseISO(dispatchData.dispatchRequestTime);
      const formatted = format(date, "MMMM do, yyyy 'at' h:mm a");
      setFormatedReqTime(formatted);
    }

      if (dispatchData?.dispatchEndTime) {
      const date = parseISO(dispatchData.dispatchEndTime);
      const formatted = format(date, "MMMM do, yyyy 'at' h:mm a");
      setFormartedEndTime(formatted);
    console.log(JSON.stringify(dispatchData))

    }

  }, [dispatchData]);

  if (!dispatchData) return null;

  return (
    <article className='flex flex-col items-center justify-start gap-2 p-4 absolute bottom-2 xl:right-2 
      xl:h-[26rem] xl:w-[24rem] w-[96vw] h-[50vh] bg-card rounded-lg z-10'>
      
      <h5 className='text-small-2'>My Request Metadata</h5>


    <div className="flex flex-col items-center justify-center gap-4 w-full">
        <div className="flex w-full items-center justify-between">
   
   <div className="flex items-center justify-center gap-2">
       <Fuel className="size-4 text-blue-400" />
          <h5 className='text-small-2'>Dispatch Cost</h5>
   </div>
          
          <span className="text-small-2 text-green-300">
         {dispatchData.dispatchCost}

          </span>

        </div>
      </div>



      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <div className="flex w-full items-center justify-between">
          <h5 className='text-small-2'>Vehicle Safety Score</h5>
          <HealthText value={dispatchData.safetyScore} />
        </div>
      </div>

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
          <h6 className='text-small'>{formatedReqTime}</h6>
        </div>


        <div className="flex w-full items-center justify-between">
          <h5 className='text-small-2'>Dispatch End Time</h5>
          <h6 className='text-small'>{formartedEndTime}</h6>
        </div>


      </div>





<div className="flex justify-between lg:justify-center items-center w-full pt-4">
        <Button variant="destructive" 
      onClick={ () => handleTerminateDispatch(dispatchData.dispatchId,dispatchData.dispatchVehicleId)}
      className='xl:mt-5 xl:px-12 px-6 text-normal py-6 rounded-lg'>
        Terminate Dispatch
      </Button>

<Button className="text-sm lg:hidden"
        onClick={() => window.history.back()}
>
  Go Back

</Button>

</div>


    </article>
  );
};

export default DispatchHandlerCard;
