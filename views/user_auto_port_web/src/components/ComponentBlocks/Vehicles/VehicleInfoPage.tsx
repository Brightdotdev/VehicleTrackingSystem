import { VehicleDTO } from '@/types/VehicleTypes';
import { ArrowLeft,  CarFront,  CircleHelp, Cog, HeartPulse, IdCard, Info,  Shield, TimerIcon} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { HealthText } from '../../utils/UtilComponents';
import { VehicleInfoPageStatusPills } from '@/components/utils/VehiclePageUtilComponent';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getVehicleByVin } from '@/lib/handleVehiclePage';








const VehicleNamePill = (
  { model, isDispatchable} : { model? : string,isDispatchable : boolean}
) => {

  return(
<div className="w-full h-4 z-10 flex items-center justify-center  absolute top-0">
  <div className={`
 bg-gray-800 p-4 flex gap-3 h-[2.4rem] rounded-full items-center justify-start shadow-xl pl-4`}>

<div className={`bg-white rounded-full w-2 h-2`}>
</div>

<p className="flex items-center justify-center gap-1  text-small text-primary-foreground  dark:text-foreground">
   The  {model} <span className='flex md:hidden' >is {isDispatchable ? " dispatchable" : " not dispatchable" }</span>
 </p>

</div>
</div>


  )
}




const VehicleInfoPage = ({vehicleVin} : {vehicleVin : string}) => {
  const router = useRouter();
 const [vehicleData, setVehicleData] = useState<VehicleDTO | undefined>(undefined);

 
  

  
  useEffect(() =>{
    
    const handleVehiclePage = async () =>{
       const vData = await getVehicleByVin(vehicleVin);
      console.log("Vehicle Dataaa")
       console.log(vData)
    setVehicleData(vData)} 

handleVehiclePage();

  }, [])
  
  

  


  const hasWildcardDispatch = vehicleData?.wildcardAttributes?.some(attr => attr.wildcardValue === true) ?? false;
const hasLowSafetyScore = (vehicleData?.safetyScore ?? 0) < 63;
const isDispatchable = hasWildcardDispatch || hasLowSafetyScore;

  
  return (

    <main className="flex flex-col items-center justify-center w-screen h-screen relative overflow-scroll overflow-y-auto overflow-hidden overflow-x-hidden lg:overflow-x-hidden">
      <div
        className="flex items-center justify-center xl:p-3 p-2 shadow-lg absolute lg:rounded-full
        rounded-lg
        lg:size-14 w-fit
        lg:top-3 lg:left-2 bottom-18 shadow-lg right-2 z-10 cursor-pointer dark:bg-gray-800 bg-teal-900 text-primary-foreground dark:text-foreground"
        onClick={() => window.history.back()}
      >
        <ArrowLeft />  
      <p className="text-sm lg:hidden">Go Back</p>
      </div>
    
      <section className='relative flex flex-col items-center justify-start w-[96vw] h-[94vh] h-24 disatchRequestContainer'>

        <VehicleNamePill  model={vehicleData?.model ?? "Unknown vehicle"} isDispatchable={isDispatchable} />
        
        <article className="relative sm:w-full  disatchRequestImage hidden md:flex lg:h-[var(--size-xl2)] md:h-[var(--size-xl)]">
          {
            vehicleData?.vehicleImages[0] ?
            <img src={vehicleData?.vehicleImages[0] || "/placeholder.png" } alt="vehicle" className="w-full h-full object-cover disatchRequestImage object-center" /> :
          <div className="w-full h-full object-cover disatchRequestImage object-center bg-background"></div>
          }
        
          {
          
             isDispatchable  ?
                <VehicleInfoPageStatusPills statusName="DISPATCHABLE" className='absolute bottom-2 right-2 sahdow-lg' />
                : <VehicleInfoPageStatusPills statusName="NOT_DISPATCHABLE" className='absolute bottom-2 right-2 sahdow-lg' />
                       
                  
                       }
        </article>
        
<div className="w-full h-full flex items-center justify-between flex-col md:p-[var(--space-sm)]">

  <div className="pt-8 py-4 md:pt-0 w-full flex items-center justify-between  md:h-[var(--size-md)]">
    <h3 className="md:text-medium text-normal-2">
      {vehicleData?.model} 
    </h3>

            {vehicleData?.vehicleStatus && (
              <VehicleInfoPageStatusPills statusName={vehicleData.vehicleStatus} className='flex' />
            )}
  </div>

  <div className="relative w-full  flex-1 flex items-start  justify-start gap-12
  md:gap-0
  md:justify-between lg:flex-row flex-col  md:pt-4 scorllebleElement customScrollBar"> 
 
<article
  className="flex flex-col items-start justify-start gap-6 bg-background2 rounded-sm lg:w-1/2 w-full lg:p-[var(--size-xxs)] pt-4 p-2
   min-h-full lg:max-h-[20rem] scorllebleElement customScrollBar"
>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">
<div className="flex items-center justify-center">
<Info /><span className='text-sm pl-2 font-[500]' > VEHICLE METADATA :</span>
</div>
<p className='text-body text-muted-foreground' >{vehicleData?.vehicleMetadata || "No metadata Provided"} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row">
  <div className="flex items-center justify-center">
<IdCard /> 
<span className='text-sm pl-2 font-[500]'>LISENSE PLATE:</span>
</div>
<p className='text-body text-muted-foreground' >{vehicleData?.licensePlate || "License plate not porovided"} </p>
</div>



<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row">
  <div className="flex items-center justify-center">
<TimerIcon /> 
<span className='text-sm pl-2 font-[500]' > VEHICLE ACQURED TIME :</span>
</div>
<p className='text-body text-muted-foreground' >{vehicleData?.vehicleAcquiredYear || "Now"} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">
  <div className="flex items-center justify-center">
<Cog /><span className='text-sm pl-2 font-[500]' > ENGINE TYPE:</span>
  </div>
<p className='text-body text-muted-foreground' >{vehicleData?.engineType || "No vehicle Data"} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">

  <div className="flex items-center justify-center">
<CarFront /><span className='text-sm pl-2 font-[500]' > VEHICLE TYPE:</span>
</div>

<p className='text-body text-muted-foreground' >{vehicleData?.vehicleType || "Not my type"} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">
  <div className="flex items-center justify-center">
<CircleHelp /><span className='text-sm pl-2 font-[500]' > DISPATCH STATUS :</span>
</div>
<p className='text-body text-muted-foreground' >{vehicleData?.dispatchStatus.split("_").join(" ") || "Def not dispatchable" } </p>
</div>





<div className="flex md:items-center items-start justify-center gap-2">
  <div className="flex items-center justify-center">

<Shield /> <span className='text-sm pl-2 font-[500]' >Safety Score :</span>
</div>
<HealthText  value={vehicleData?.safetyScore || 0}/>
</div>


{vehicleData?.healthAttributes && vehicleData?.healthAttributes.length > 0 && (
  <div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">
    <div className="flex items-center justify-center">
      <HeartPulse/>
    <span className="text-sm pl-2 font-[500]">Health Attributes:</span>
</div>
    <span className="text-body text-muted-foreground">
      {vehicleData.healthAttributes
        .map(obj =>
          Object.entries(obj)
            .filter(([key]) => key !== "id") // Exclude the "id" key
            .map(([key, value]) => key === "attributeName" ? `${value}: ${obj.score}` : null)
            .filter(Boolean)
            .join(", ")
        )
        .join(", ")
      }
    </span>
  </div>
)}





 </article>

<article className="flex flex-col items-center justify-center gap-4  w-full  lg:w-1/2 h-[--size-sm] ">

<div className="lg:w-2/3 
min-h-[20rem]
flex flex-col lg:bg-card lg:p-2 rounded-sm items-center h-fit  justify-start gap-sm w-full">
<h4 className='flex items-center justify-center bg-background rounded-sm w-full h-[var(--size-md)]'>Vehicle Location</h4>

<div className="flex flex-col items-start justify-start gap-6 bg-background rounded-sm w-full
   min-h-full md:max-h-[20rem] overflow-hidden overflow-y-auto no-scrollbar md:p-4 p-2">


 im supposed to like dispaty a map here or sum

</div></div>

 </article>

  </div>

  
  
 <div className="
absolute flex items-end justify-end w-full bottom-0 xl:bottom-4 left-0">
                {!isDispatchable ? (
        <button className="bg-red-500 text-white px-4 py-2 rounded shadow-sm  cursor-not-allowed" disabled>
            Yeah this Vehicle Is Not Dispatchable
        </button>
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-sm cursor-pointer"
          onClick={() => 
          {
            toast("Finally...routing now")
            router.push(
              `vehicles/request?vehicle=${vehicleData?.vehicleIdentificationNumber}`
            )
          }
            
          }>
          Get This Vehicle !
        </button>
      )}
        </div>



</div>



  
      </section>
    </main>
  )
}

export default  VehicleInfoPage