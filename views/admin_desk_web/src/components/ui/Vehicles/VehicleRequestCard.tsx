import React from 'react'
import { DispatchRequestDto } from '@/types/VehicleTypes';
import {  Check, 
   CircleHelp, 
   GitCommitVertical, 
 Loader2, 
 Minus, Shield, Timer, TriangleAlertIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

 

const HealthText = ({value} : {value : number}) =>{

  if(value === 100 ) 
  return <p className='text-body-2 text-green-900'>{value}</p> 
  else if(value >= 95)
  return <p className='text-body-2 text-green-800'>{value}</p> 
  else if(value >= 90)
  return <p className='text-body-2 text-blue-800'>{value}</p>
  else if(value >= 85 ) 
  return <p className='text-body-2 text-blue-500'>{value}</p>
  else if (value >= 80)
  return <p className='text-body-2 text-orange-400'>{value}</p> 
   else if (value >= 75)
  return <p className='text-body-2 text-orange-600'>{value}</p> 
  else if ( value >= 63 ) 
  return <p className='text-body-2 text-yellow-900'>{value}</p> 
 else
  return <p className='text-body-2 text-red-900'>{value}</p>  
}


const DispatchRequesterPill = (
  {userName, userImage} : {userImage? : string, userName : string }
) => {
  return(
<div className={`
absolute top-3 left-2 
bg-gradient-to-r from-gray-800 via-gray-800 to-gray-700 p-2
flex gap-3 h-[2.4rem] rounded-full dark:text-foreground text-primary-foreground
items-center justify-start shadow-xl
${userImage ? "pl-1" : "pl-4"}
`}>
  {
    userImage ? (
      <img
        src={userImage}
        alt="user"
        className='w-[2rem] h-[2rem] rounded-full object-center object-cover border-white border-2'
      />
    ) : (
      <div className="bg-red-800 rounded-full w-2 h-2"></div>
    )
  }
  <p className="text-small">
    Requsted by {userName}
  </p>
</div>
  )
}


type StatusPillsProps = {
  statusName:
    | "NOT_DISPATCHABLE"
    | "DISPATCHABLE"
    className?: string; };

  

const StatusPills = (props: StatusPillsProps) => {
  if (props.statusName === "DISPATCHABLE") {
    return (
      <div
        className={`
          h-[2rem] lg:w-[11.5rem] w-[10rem] 
          bg-gradient-to-r from-green-800  to-green-900
          rounded-full flex items-center justify-start gap-4 pl-5
          shadow-lg ${props.className || ""}
          pointer-events-none select-none
        `}
        tabIndex={-1}
        aria-disabled="true"
      >
        <p className="text-small lg:text-body dark:text-foreground text-primary-foreground">DISPATCHABLE</p>
        <div className="p-1 rounded-full bg-green-100/20">
          <Check className="w-5 h-5 dark:text-foreground text-primary-foreground" />
        </div>
      </div>
    );
  } else if (props.statusName === "NOT_DISPATCHABLE") {
    return (
      <div
        className={`
          h-[2rem] lg:w-[13rem] w-[11rem] 
          bg-gradient-to-r from-red-500 to-red-600
          rounded-full flex items-center justify-end gap-3 pr-1
          shadow-lg ${props.className || ""}
          pointer-events-none select-none
        `}
        tabIndex={-1}
        aria-disabled="true"
      >
        <p className="text-small lg:text-body dark:text-foreground text-primary-foreground">NOT DISPATCHABLE</p>
        <div className="p-1 rounded-full bg-red-100/20">
          <Minus className="w-5 h-5 dark:text-foreground text-primary-foreground" />
        </div>
      </div>
    );
  }
  return null;
};



const VehicleRequestCard = (vehicleRequest: DispatchRequestDto) => {

const router = useRouter();
const [loading, setLoading] = React.useState(false);


  return (
    <article className='relative flex flex-col 
    items-center gap-8 vehicleCardBody p-sm shadow-md 
    w-[var(--size-vehicleCard)] h-[32rem] bg-background'>
      
<div className="relative vehicleCard flex items-center justify-center w-full h-[12rem] bg-blue-500 overflow-hidden">
  {/* Placeholder image covering the parent */}
  <img
    src="placeholder.png"
    alt="Vehicle"
    className="absolute inset-0 w-full h-[12rem] object-center object-cover"
  />
  <DispatchRequesterPill
    userName={vehicleRequest.dispatchRequester}
    userImage={vehicleRequest.userImage || undefined}
  />
  <StatusPills statusName={vehicleRequest.canDispatch ? "DISPATCHABLE" : "NOT_DISPATCHABLE"} className="absolute bottom-2 right-2" />
</div>



<div className="flex flex-col 
w-full pl-4
items-start justify-start gap-2">
<h5 className='text-normal-2'>
  {vehicleRequest.vehicleName}
</h5>

<div className="flex items-center justify-center gap-2">
<CircleHelp /><span className='text-small pl-2 font-[500] text-foreground'> DISPATCH REASON :</span>
<p className='text-small text-muted-foreground' >{vehicleRequest.dispatchReason} </p>
</div>


<div className="flex items-center justify-center gap-2">
<GitCommitVertical /> 

<span className='text-small pl-2 font-[500] text-foreground'> DISPATCH STATUS :</span>
<p className='text-small text-muted-foreground' >{vehicleRequest.dispatchStatus} </p>
</div>

<div className="flex items-center justify-center gap-2">
<Shield /> 
<span className='text-small pl-2 font-[500] text-foreground'>
  Safety Score :
</span>
<HealthText  value={vehicleRequest.safetyScore}/>
</div>


<div className="flex items-center justify-center gap-2">
<Timer/> 
<span className='text-small pl-2 font-[500] text-foreground'>
  Request Time : 
</span>
<span   className='text-small text-muted-foreground'>
  {new Date(vehicleRequest.dispatchRequestTime).toLocaleString()}
</span>
</div>




</div>


<button
  className={`text-normal bg-gradient-to-r from-blue-700
  dark:text-foreground text-primary-foreground
  via-blue-600 to-blue-800 cursor-pointer px-8 py-2 rounded-lg transition-all duration-200 shadow-md hover:from-blue-800 hover:via-blue-700 hover:to-blue-900 hover:scale-105 hover:shadow-xl focus:outline-none ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
  disabled={loading}
  onClick={async () => {
    setLoading(true);
    router.push(
      `vehicles/request?vehicleReq=${vehicleRequest.dispatchId}&vehicle=${vehicleRequest.dispatchVehicleId}`
    );
  }}
>
    {loading ? (
      <Loader2 className="animate-spin ml-2 stroke-foreground" />
  
    ) : null}
  Handle Dispatch
</button>
  
    </article>

)
}


export default VehicleRequestCard