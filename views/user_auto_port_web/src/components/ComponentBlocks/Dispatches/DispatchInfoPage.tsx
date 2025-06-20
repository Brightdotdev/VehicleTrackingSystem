import { DispatchRequestDto, VehicleDTO } from '@/types/VehicleTypes';
import { ArrowLeft,  CarFront,  CircleHelp, Cog, HeartPulse, IdCard, Info,  Shield, TimerIcon} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { HealthText } from '../../utils/UtilComponents';
import {VehicleInfoPageStatusPills } from '@/components/utils/VehiclePageUtilComponent';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getVehicleByVin } from '@/lib/handleVehiclePage';
import { getThisDispatch } from '@/lib/handleUserDispatchPage';
import DispatchHandlerCard from './DispatchHandlerCard';








const VehicleNamePill = (
  { model} : { model? : string}
) => {

  return(
<div className="w-full h-4 z-10 flex items-center justify-center  absolute top-0">
  <div className={`
 bg-gray-800 p-4 flex gap-3 h-[2.4rem] rounded-full items-center justify-start shadow-xl pl-4`}>

<div className={`bg-white rounded-full w-2 h-2`}>
</div>

<p className="flex items-center justify-center gap-1  text-small text-primary-foreground  dark:text-foreground">
  Your request for the  {model}
 </p>

</div>
</div>


  )
}




const DispatchInfoPage = ({vehicleVin, vehicleReqId} : {vehicleVin : string, vehicleReqId : number}) => {
  const router = useRouter();
 const [dispatchData, setDispatchData] = useState<DispatchRequestDto | undefined>(undefined);
  

 
  

  
  useEffect(() =>{
    
    const handleVehiclePage = async () =>{
       const vData = await getThisDispatch(vehicleVin,vehicleReqId);
      console.log("Vehicle Dataaa info")
      setDispatchData(vData)
       console.log(vData)
  } 

handleVehiclePage();

  }, [])
  
  
  
  return (

    <main className="flex flex-col items-center justify-center w-screen h-screen relative overflow-scroll overflow-y-auto overflow-hidden overflow-x-hidden lg:overflow-x-hidden">
      
      <div
        className="flex items-center justify-center xl:p-3 p-2 shadow-lg absolute lg:rounded-full
        rounded-lg
        lg:size-14 w-fit
        lg:top-6 lg:left-4 bottom-8 shadow-lg right-2 z-10 cursor-pointer dark:bg-gray-800 bg-teal-900 text-primary-foreground dark:text-foreground"
        onClick={() => window.history.back()}
      >
        <ArrowLeft />  
      <p className="text-sm lg:hidden">Go Back</p>
      </div>
    
      <section className='relative flex flex-col items-center justify-start w-[96vw] h-[94vh] h-24 disatchRequestContainer'>

        <VehicleNamePill  model={dispatchData?.vehicleName ?? "Unknown vehicle"} />
        
  
  
  <DispatchHandlerCard dispatchData={dispatchData || undefined} />
  
      </section>
    </main>
  )
}

export default  DispatchInfoPage