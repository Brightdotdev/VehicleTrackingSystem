import { DispatchRequestDto, VehicleDTO } from '@/types/VehicleTypes';
import { ArrowLeft,  CarFront,  CircleHelp, Cog, HeartPulse, IdCard, Info,  Shield, TimerIcon, TriangleAlertIcon} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {getVehicleDataByVin, getVehicleDispatchHistory } from '@/lib/handleDsiaptchRequestPage';
import { HealthText } from '../../utils/UtilComponents';
import { VehicleInfoPagePropsPills, VehicleInfoPageStatusPills } from '@/components/utils/VehiclePageUtilComponent';
import { dotEnv } from '@/lib/dotEnv';
import { toast } from 'sonner';



 const markForMentainance =  async  (vehicleVin : string) => {
          
      console.log("Mentainingggg grahhh")
  
        // try {
        //       const response = await fetch(`${dotEnv.markForMentainanceUrl}/?vin=${vehicleVin}`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //       });
        //       if (response.ok) {
        //   toast.info('Vehicle marked for maintenance successfully!');
        //       } else {
        //   toast.error('Failed to mark vehicle for maintenance.');
        //       }
        //     } catch (error) {
        //       toast.error('Network error. Please try again.');
        //     }
          }




const VehicleNamePill = (
  { model} : { model? : string}
) => {

  return(
<div className="w-full h-4 z-10 flex items-center justify-center  absolute top-0">
  <div className={`
 bg-gray-800 p-4 flex gap-3 h-[2.4rem] rounded-full items-center justify-start shadow-xl pl-4`}>

<div className={`bg-white rounded-full w-2 h-2`}>
</div>

<p className="text-small text-primary-foreground  dark:text-foreground">
   The  {model}
 </p>

</div>
</div>


  )
}




const VehicleInfoPage = ({vehicleVin} : {vehicleVin : string}) => {
  
  const [vehicleData, setVehicleData] = useState<VehicleDTO | undefined>(undefined);
  const [dispatchHistory, setDispatchHistory] = useState<DispatchRequestDto[] | undefined>(undefined);

  

  
  useEffect(() =>{
    
    const vData = getVehicleDataByVin(vehicleVin);
    setVehicleData(vData);
    if (vData) {
      setDispatchHistory(getVehicleDispatchHistory(vData.vehicleIdentificationNumber));
    } else {
      setDispatchHistory(undefined);
    }
    console.log(vehicleData)

  }, [])
  
  

  
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

        <VehicleNamePill  model={vehicleData?.model ?? "Unknown vehicle"} />
        
        <article className="relative sm:w-full  disatchRequestImage hidden md:flex lg:h-[var(--size-xl2)] md:h-[var(--size-xl)]">
          {
            vehicleData?.vehicleImages[0] ?
            <img src={vehicleData?.vehicleImages[0] } alt="vehicle" className="w-full h-full object-cover disatchRequestImage object-center" /> :
          <div className="w-full h-full object-cover disatchRequestImage object-center bg-background"></div>
          }
        
          {
            vehicleData && vehicleData.safetyScore > 63 ? 
            <VehicleInfoPageStatusPills statusName="DISPATCHABLE" className='absolute bottom-2 right-2 sahdow-lg'  /> :
            <VehicleInfoPageStatusPills statusName="NOT_DISPATCHABLE" className='absolute bottom-2 right-2 sahdow-lg'  /> 
          }
        </article>
        
<div className="w-full h-full flex items-center justify-between flex-col md:p-[var(--space-sm)]">

  <div className="pt-8 md:pt-0 w-full flex items-center justify-between  md:h-[var(--size-md)]">
    <h3 className="text-medium">
      {vehicleData?.model} 
    </h3>

            {vehicleData?.vehicleStatus && (
              <VehicleInfoPageStatusPills statusName={vehicleData.vehicleStatus} className='flex' />
            )}
  </div>

  <div className="relative w-full  flex-1 flex items-start  justify-start gap-12
  md:gap-0
  md:justify-betwen lg:flex-row flex-col   md:pt-4 scorllebleElement customScrollBar"> 
 
<article
  className="flex flex-col items-start justify-start gap-6 bg-background2 rounded-sm lg:w-1/2 w-full lg:p-[var(--size-xxs)] pt-6
   min-h-full lg:max-h-[20rem] scorllebleElement customScrollBar"
>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">
<div className="flex items-center justify-center">
<Info /><span className='text-sm pl-2 font-[500]' > VEHICLE METADATA :</span>
</div>
<p className='text-body text-muted-foreground' >{vehicleData?.vehicleMetadata} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row">
  <div className="flex items-center justify-center">
<IdCard /> 
<span className='text-sm pl-2 font-[500]'>LISENSE PLATE:</span>
</div>
<p className='text-body text-muted-foreground' >{vehicleData?.licensePlate} </p>
</div>



<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row">
  <div className="flex items-center justify-center">
<TimerIcon /> 
<span className='text-sm pl-2 font-[500]' > VEHICLE ACQURED TIME :</span>
</div>
<p className='text-body text-muted-foreground' >{vehicleData?.vehicleAcquiredYear} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">
  <div className="flex items-center justify-center">
<Cog /><span className='text-sm pl-2 font-[500]' > ENGINE TYPE:</span>
  </div>
<p className='text-body text-muted-foreground' >{vehicleData?.engineType} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">

  <div className="flex items-center justify-center">
<CarFront /><span className='text-sm pl-2 font-[500]' > VEHICLE TYPE:</span>
</div>

<p className='text-body text-muted-foreground' >{vehicleData?.vehicleType} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">
  <div className="flex items-center justify-center">
<CircleHelp /><span className='text-sm pl-2 font-[500]' > DISPATCH STATUS :</span>
</div>
<p className='text-body text-muted-foreground' >{vehicleData?.dispatchStatus} </p>
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



{vehicleData?.wildcardAttributes && vehicleData?.wildcardAttributes.length > 0 && (
  <div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">
    <div className="flex items-center justify-center gap-2 xl:gap-0">
    <TriangleAlertIcon /> 
    <span className="text-sm pl-2 font-[500]">Wildcards:</span>
    </div>
    <span className="text-body text-muted-foreground">
      {vehicleData.wildcardAttributes
        .map(obj =>
          Object.entries(obj)
            .filter(([key, value]) => key !== "id" && key === "wildcardKey" && obj["wildcardValue"] === true)
            .map(([key, value]) => value)
            .join(", ")
        )
        .filter(Boolean)
        .join(", ")
      }
    </span>
  </div>
)}
 </article>

<article className="flex flex-col items-center justify-center gap-4  w-full  lg:w-1/2 h-[--size-sm] ">

<div className="lg:w-2/3 flex flex-col lg:bg-card lg:p-2 rounded-sm items-center h-fit  justify-center gap-sm w-full">
<h4 className='flex items-center justify-center bg-background rounded-sm w-full h-[var(--size-md)]'>Dispatch History</h4>

<div className="flex flex-col items-start justify-start gap-6 bg-background rounded-sm w-full
   min-h-full md:max-h-[20rem] overflow-hidden overflow-y-auto no-scrollbar md:p-4 p-2">


    {
      dispatchHistory && dispatchHistory.length > 0 && dispatchHistory !== null ? dispatchHistory.map((dispatch, index) => {
        // Map dispatchStatus to valid VehicleInfoPageStatusPillsProps["statusName"]
        const statusMap: Record<string, VehicleInfoPagePropsPills["statusName"]> = {
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
          "TRANSPORT": "TRANSPORT",
          "DELIVERY": "DELIVERY",
          "NOT_DISPATCHABLE": "NOT_DISPATCHABLE",
          "DISPATCHABLE": "DISPATCHABLE"
        };
        const mappedStatus = statusMap[dispatch.dispatchStatus as string] || "FAILED TO FETCH";
        return (
<div className="flex  md:items-center items-start justify-between gap-2 w-full " key={index}>

<div className="flex items-center justify-center gap-2">
        {
          dispatch.userImage ? <img src={dispatch.userImage} className="w-6 h-6 bg-white/30 dark:bg-black/30 rounded-full object-center object-cover" /> : 
          <div className="w-2 h-2 bg-white/30 dark:bg-black/30 rounded-full">
          </div>
        }
      <span className='text-small'> {dispatch.dispatchRequester}'s Request</span>
</div>

  <VehicleInfoPageStatusPills statusName={mappedStatus} userName={dispatch.dispatchRequester} userImage={dispatch.userImage} className='realtive' />
</div>
        );
      })
      : 
      <div className="flex items-center justify-center h-[5rem]">
        <p className="text-body text-muted-foreground">
          No dispatch Record...for now
        </p>
      </div>} </div>
       
</div>

 </article>

  </div>

  
  
 <div className="
absolute flex items-end justify-end w-full bottom-0 xl:bottom-4 left-0">
                {vehicleData?.wildcardAttributes?.some(attr => attr.wildcardKey === "IN_MAINTENANCE" && attr.wildcardValue === true) ? (
        <button className="bg-red-500 text-white px-4 py-2 rounded shadow-sm  cursor-not-allowed" disabled>
          Already in  Maintenance
        </button>
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-sm cursor-pointer"
          onClick={() => markForMentainance(vehicleVin)}>
          Mark for Maintenance
        </button>
      )}
        </div>



</div>



  
      </section>
    </main>
  )
}

export default  VehicleInfoPage