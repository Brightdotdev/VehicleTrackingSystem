import { DispatchRequestDto, VehicleDTO } from '@/types/VehicleTypes';
import { ArrowLeft,  CarFront,  CircleHelp, Cog, GitCommitVertical, Info,  Shield, TriangleAlertIcon} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { getVehicleByIdAndVinForDispatch, getVehicleDataByVin, getVehicleDispatchHistory } from '@/lib/handleDsiaptchRequestPage';
import { HealthText } from '../../utils/UtilComponents';
import { DispatchRequestPageStatusPills, DispatchRequestPageStatusPillsProps } from '../../utils/RequestPageUtilComponents';
import RejectDispatchModal from '../../ui/Requests/RejectDispatchModal';
import AcceptDispatchModal from '../../ui/Requests/AcceptDispatchModal';









const DispatchRequesterPill = (
  {userName, userImage, model, className} : {userImage? : string, userName : string, model? : string, className? : string}
) => {

  return(
<div className="w-full h-4 z-10 flex items-center justify-center  absolute top-0">
  <div className={`
 bg-gray-800 p-4
flex gap-3 h-[2.4rem] rounded-full
items-center justify-start shadow-xl
 ${userImage ? "pl-1" :  "pl-4"} 
 ${className || ""}
 `}>

{
  userImage ? <img
  
  src={userImage} alt="user"
  className='w-[2rem] h-[2rem] rounded-full object-center object-cover border-white border-2'/> :
<div className={`bg-white rounded-full w-2 h-2`}>
</div>
}

<p className="text-small text-primary-foreground dark:text-foreground">
   {userName}'s Dispatch Request For the {model}
 </p>

</div>
</div>


  )
}




const DispatchRequestPage = ({vehicleReqid ,  vehicleVin} : {vehicleReqid : number, vehicleVin : string}) => {

  
  const [dispatchData, setDispatchData] = useState<DispatchRequestDto | undefined>(undefined);
  const [vehicleData, setVehicleData] = useState<VehicleDTO | undefined>(undefined);
  const [dispatchHistory, setDispatchHistory] = useState<DispatchRequestDto[] | undefined>(undefined);

  
  const [rejectOpen, setRejectOpen] = useState(false) 
  const [acceptOpen, setAcceptOpen] = useState(false) 



  useEffect(() =>{
    setDispatchData(getVehicleByIdAndVinForDispatch(vehicleReqid, vehicleVin));
    const vData = getVehicleDataByVin(vehicleVin);
    setVehicleData(vData);
    if (vData) {
      setDispatchHistory(getVehicleDispatchHistory(vData.vehicleIdentificationNumber));
    } else {
      setDispatchHistory(undefined);
    }
    console.log(dispatchData)
    console.log(vehicleData)

  }, [])
  
  

  
  return (

    <main className="flex flex-col items-center justify-center w-screen h-screen relative overflow-scroll overflow-y-auto overflow-hidden overflow-x-hidden lg:overflow-x-hidden">
      <div
        className="flex items-center justify-center xl:p-3 p-2 shadow-lg absolute lg:rounded-full
        rounded-lg
        lg:size-14 w-fit
        lg:top-3 lg:left-2 bottom-14 shadow-lg right-2 z-10 cursor-pointer dark:bg-gray-800 bg-teal-900 text-primary-foreground dark:text-foreground"
        onClick={() => window.history.back()}
      >
        <ArrowLeft />  
      <p className="text-sm lg:hidden">Go Back</p>
      </div>
    
      <section className='relative flex flex-col items-center justify-start w-[96vw] h-[94vh] h-24 disatchRequestContainer'>

        <DispatchRequesterPill userName={dispatchData?.dispatchRequester || "Nobdoy"} userImage={dispatchData?.userImage}  model={dispatchData?.vehicleName ?? ""} />
        
        <article className="relative sm:w-full  disatchRequestImage hidden md:flex lg:h-[var(--size-xl2)] md:h-[var(--size-xl)]">
          {
            dispatchData?.vehicleImage ?
            <img src={dispatchData?.vehicleImage} alt="vehicle" className="w-full h-full object-cover disatchRequestImage object-center" /> :
          <div className="w-full h-full object-cover disatchRequestImage object-center bg-background"></div>
          }
        
          {
            dispatchData?.canDispatch ? 
            <DispatchRequestPageStatusPills statusName="DISPATCHABLE" className='absolute bottom-2 right-2 sahdow-lg'  /> :
            <DispatchRequestPageStatusPills statusName="NOT_DISPATCHABLE" className='absolute bottom-2 right-2 sahdow-lg'  /> 
          }
        </article>
        
<div className="w-full h-full flex items-center justify-between flex-col md:p-[var(--space-sm)]">

  <div className="pt-8 md:pt-0 w-full flex items-center justify-between  md:h-[var(--size-md)]">
    <h3 className="text-medium">
      {dispatchData?.vehicleName} 
    </h3>

            {vehicleData?.vehicleStatus && (
              <DispatchRequestPageStatusPills statusName={vehicleData.vehicleStatus} className='flex' />
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
<CircleHelp /><span className='text-sm pl-2 font-[500]' > DISPATCH REASON :</span>
</div>
<p className='text-body text-muted-foreground' >{dispatchData?.dispatchReason} </p>
</div>


<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row">
  <div className="flex items-center justify-center">
<GitCommitVertical /> 
<span className='text-sm pl-2 font-[500]' > DISPATCH STATUS :</span>
</div>
<p className='text-body text-muted-foreground' >{dispatchData?.dispatchStatus} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2">
  <div className="flex items-center justify-center">

<Shield /> <span className='text-sm pl-2 font-[500]' >Safety Score :</span>
</div>
<HealthText  value={dispatchData?.safetyScore || 0}/>
</div>




{dispatchData?.wildCards && dispatchData?.wildCards.length > 0 && (
  <div className="flex items-center gap-2">
  <TriangleAlertIcon /> 
    <span className="text-sm pl-2 font-[500]'">Wildcards:</span>
    <span className="text-body text-muted-foreground">
      {dispatchData?.wildCards
        .map(obj => Object.keys(obj).join(", "))
        .join(", ")}
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

  <DispatchRequestPageStatusPills statusName={mappedStatus} userName={dispatch.dispatchRequester} userImage={dispatch.userImage} className='realtive' />
</div>
        );
      })
      : 
      <div className="flex items-center justify-center h-[5rem]">
        <p className="text-body text-muted-foreground">
          No dispatch Record...for now
        </p>
      </div>

    }



   </div>

</div>

 </article>

  </div>



<div className="w-full flex items-center  justify-between xl:justify-start lg:gap-16 absolute bottom-4 xl:pl-16 p-0 ">
<button
  className="text-normal bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 cursor-pointer  px-2 py-1  xl:px-4 xl:py-2 xl:rounded-lg rounded-sm transition-all duration-200 shadow-md hover:from-blue-800 hover:via-blue-700 hover:to-blue-900 hover:scale-105 hover:shadow-xl focus:outline-none text-primary-foreground dark:text-foreground  lg:text-body text-small "
  onClick={() => setAcceptOpen(true)}
>
  VALIDATE DISPATCH
</button>
  
  <button
  className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 cursor-pointer 
   px-2 py-1  xl:px-4 xl:py-2  
  xl:rounded-lg rounded-sm transition-all duration-200 shadow-md hover:from-blue-800 hover:via-blue-700 hover:to-blue-900 hover:scale-105 hover:shadow-xl focus:outline-none text-primary-foreground dark:text-foreground lg:text-body text-small"
  onClick={() => setRejectOpen(true)}
>
  REJECT DISPATCH
</button>
  
</div>


  {vehicleData && dispatchData && (
    <RejectDispatchModal  
      open={rejectOpen} 
      setOpen={setRejectOpen}
      vehicleData={vehicleData}
      dispatchData={dispatchData}
    />
  )}

  {vehicleData && dispatchData && (
    <AcceptDispatchModal  
      open={acceptOpen} 
      setOpen={setAcceptOpen}
      vehicleData={vehicleData}
      dispatchData={dispatchData}
    />
  )}



</div>




  
      </section>
    </main>
  )
}

export default  DispatchRequestPage