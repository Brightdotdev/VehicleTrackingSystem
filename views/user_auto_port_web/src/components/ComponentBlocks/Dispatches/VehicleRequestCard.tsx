import React from 'react'
import { DispatchRequestDto, DispatchStatus } from '@/types/VehicleTypes';
import {  Check, 
   CircleHelp, 
   GitCommitVertical, 
 Loader2, 
 Minus, Shield, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { handleDispatchValidatedTracking } from '@/lib/handleUserTracking';
import { toast } from 'sonner';

 

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
      <div className="bg-white rounded-full w-2 h-2"></div>
    )
  }
  <p className="text-small">
    Requsted by {userName}
  </p>
</div>
  )
}




  
    


const VehicleRequestCard = (vehicleRequest: DispatchRequestDto) => {

const router = useRouter();
const [worked, setWorked] = React.useState(false);
const [loading, setLoading] = React.useState(false);


  return (
    <article className='relative flex flex-col 
    items-center gap-8 vehicleCardBody p-sm shadow-md 
    w-[var(--size-vehicleCard)] h-[32rem] bg-background'>
      
<div className="relative vehicleCard flex items-center justify-center w-full h-[12rem] bg-blue-500 overflow-hidden">
  {/* Placeholder image covering the parent */}
  <img
    src={vehicleRequest.vehicleImage}
    alt="Vehicle"
    className="absolute inset-0 w-full h-[12rem] object-center object-cover"
  />


  
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
  className={`text-body-2 bg-gradient-to-r from-blue-700
  dark:text-foreground text-primary-foreground
  via-blue-600 to-blue-800 cursor-pointer px-8 py-2 rounded-lg transition-all duration-200 shadow-md hover:from-blue-800 hover:via-blue-700 hover:to-blue-900 hover:scale-105 hover:shadow-xl focus:outline-none ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
  disabled={loading}
  onClick={async () => {
   
   if (vehicleRequest.dispatchStatus === DispatchStatus.IN_PROGRESS) {
  toast.info("This is what we're doing o");
  await handleDispatchValidatedTracking(
    vehicleRequest.dispatchId,
    setLoading,
    setWorked
  );
  return;
}

setLoading(true);

router.push(
  `/dispatch/info?vehicleReqId=${vehicleRequest.dispatchId}&vehicleId=${vehicleRequest.dispatchVehicleId}`
);
  }}
>
    {loading ? (
      <Loader2 className="animate-spin ml-2 stroke-foreground" />
  
    ) :
    vehicleRequest.dispatchStatus === DispatchStatus.IN_PROGRESS ? "Get My Vehicle Now !":
" Check Dispatch Out"    
    }

  
</button>
  
    </article>

)
}


export default VehicleRequestCard