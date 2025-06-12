import { VehicleDTO } from '@/types/VehicleTypes';
import { Badge, BikeIcon,  BusFront, CarFront,
   IdCard, Info, Loader2, Settings, Shield, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'




const VehicleModelNamePill = (
  {vehicleName} : {vehicleName : string }
) => {
  return(


<div
  className="
    absolute top-3 left-2
    bg-gradient-to-r from-background to-background2
    p-2 flex gap-3 h-[2.4rem] rounded-full
    items-center justify-start shadow-xl pl-3
  "
>
  <div className="bg-white rounded-full w-2 h-2"></div>
  <p className="text-small text-foreground">
    {vehicleName.toLocaleUpperCase()}
  </p>
</div>
  )
}



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


type StatusPillsProps = {
  statusName:
    | "IN_TRANSIT"
    | "PENDING"
    | "IN_PROGRESS"
    | "AVAILABLE"
    | "CLASSIFIED"
    | "CARGO"
    | "REGULAR"
    | "TRANSPORT"
    | "DELIVERY";
    className?: string; };


    const StatusPills = (props: StatusPillsProps) => {
      // Utility for disabling mouse interactions
      const baseClass =
        "pointer-events-none select-none h-[2rem] rounded-full flex items-center justify-start gap-3 shadow-sm";

      if (props.statusName === "AVAILABLE") {
        return (
          <div
            className={`${baseClass} w-[8rem] bg-gradient-to-r from-yellow-900/60 to-yellow-800/60 pl-4 ${
              props.className || ""
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-yellow-600/80"></div>
            <p className="text-small lg:text-body dark:text-foreground text-primary-foreground">AVAILABLE</p>
          </div>
        );
      } else if (props.statusName === "IN_PROGRESS") {
        return (
          <div
            className={`${baseClass} w-[8rem] bg-gradient-to-r from-green-900/60 to-green-800/60 pl-4 ${
              props.className || ""
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-green-400/80"></div>
            <p className="text-small lg:text-body dark:text-foreground text-primary-foreground">IN PROGRESS</p>
          </div>
        );
      } else if (props.statusName === "PENDING") {
        return (
          <div
            className={`${baseClass} w-[8rem] bg-gradient-to-r from-teal-900/60 to-teal-800/60 pl-4 ${
              props.className || ""
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-white/80"></div>
            <p className="text-small lg:text-body dark:text-foreground text-primary-foreground">PENDING</p>
          </div>
        );
      } else if (props.statusName === "IN_TRANSIT") {
        return (
          <div
            className={`${baseClass} w-[8rem] bg-gradient-to-r from-green-700/60 to-green-600/60 pl-4 ${
              props.className || ""
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <p className="text-small lg:text-body dark:text-foreground text-primary-foreground">IN TRANSIT</p>
          </div>
        );
      } else if (props.statusName === "CARGO") {
        return (
          <div
            className={`${baseClass} w-[10rem] bg-gradient-to-r from-yellow-700 to-yellow-600 pl-6 ${
              props.className || ""
            }`}
          >
            <Truck className="w-5 h-5 dark:text-foreground text-primary-foreground" />
            <p className="text-small lg:text-body dark:text-foreground text-primary-foreground">CARGO</p>
          </div>
        );
      } else if (props.statusName === "CLASSIFIED") {
        return (
          <div
            className={`${baseClass} w-[9rem] bg-gradient-to-r from-teal-900 to-teal-800 pl-4 ${
              props.className || ""
            }`}
          >
            <Badge className="w-5 h-5 dark:text-foreground text-primary-foreground" />
            <p className="text-small lg:text-body dark:text-foreground text-primary-foreground">CLASSIFIED</p>
          </div>
        );
      } else if (props.statusName === "DELIVERY") {
        return (
          <div
            className={`${baseClass} w-[10rem] bg-gradient-to-r from-blue-900/80 to-blue-800/80 pl-4 ${
              props.className || ""
            }`}
          >
            <BikeIcon className="w-5 h-5 dark:text-foreground text-primary-foreground" />
            <p className="text-small lg:text-body dark:text-foreground text-primary-foreground">DELIVERY</p>
          </div>
        );
      } else if (props.statusName === "REGULAR") {
        return (
          <div
            className={`${baseClass} w-[9rem] bg-gradient-to-r from-blue-900 to-blue-800 pl-4 ${
              props.className || ""
            }`}
          >
            <CarFront className="w-5 h-5 dark:text-foreground text-primary-foreground" />
            <p className="text-small lg:text-body dark:text-foreground text-primary-foreground">REGULAR</p>
          </div>
        );
      } else if (props.statusName === "TRANSPORT") {
        return (
          <div
            className={`${baseClass} w-[10rem] bg-gradient-to-r from-orange-500 to-orange-400 pl-4 ${
              props.className || ""
            }`}
          >
            <BusFront className="w-5 h-5 dark:text-foreground text-primary-foreground" />
            <p className="text-small lg:text-body dark:text-foreground text-primary-foreground">TRANSPORT</p>
          </div>
        );
      }
      return null;
    };




const VehicleInfoCard = (vehicleInfo : VehicleDTO) => {
const [loading, setLoading] = React.useState(false);

  const router =  useRouter();
  return (
    <article className='relative flex flex-col h-[32rem] pb-4
    items-center  gap-12 vehicleCardBody  shadow-md 
    w-[var(--size-vehicleCard)]  bg-background'>
      
<div className="relative vehicleCard flex items-center justify-center w-full h-[12rem] bg-blue-500 overflow-hidden">
  {/* Placeholder image covering the parent */}
  <img
    src={vehicleInfo?.vehicleImages[0]}
    alt="Vehicle Image grah"
    className="absolute inset-0 w-full h-full object-cover"
  />
  <VehicleModelNamePill vehicleName={vehicleInfo.model} />
  <StatusPills statusName={vehicleInfo.vehicleStatus} className="absolute bottom-2 right-2" />
</div>


<StatusPills statusName={vehicleInfo.dispatchStatus} className="absolute top-[38%] right-2 w-[5rem] text-body" />

<div className="flex flex-col 
w-full pl-4 relative 
items-start justify-start gap-6">

<div className="flex items-center justify-center gap-2">
<IdCard   className='text-body-2 text-foreground' />
<p className='text-small pl-2 font-[500] text-foreground'>PLATE NUMBER : </p>
<span className='text-small text-muted-foreground'>
{vehicleInfo.licensePlate}
</span>
</div>

<div className="flex items-center justify-center gap-2">
<Settings className='text-body-2 text-foreground' />
<p className='text-small pl-2 font-[500] text-foreground'>ENGINE TYPE : </p>
<span className='text-small text-muted-foreground'>
{vehicleInfo.engineType}
</span>
</div>

<div className="flex items-center justify-center gap-2">
<Shield className='text-body-2 text-foreground' /> <span className='text-small pl-2 font-[500] text-foreground' >HEALTH SCORE :</span>
<HealthText  value={80}/>
</div>

<div className="flex items-center justify-center gap-2">
<Info  className='text-body-2 text-foreground' />
<span className='text-small pl-2 font-[500] text-foreground'>
{vehicleInfo.vehicleMetadata}
</span>
</div>


</div>


<button
  onClick={async () => {
    setLoading(true);
    router.push(
      `vehicles/info?vehicle=${vehicleInfo.vehicleIdentificationNumber}`
    );
  }}
  disabled={loading}
  className={`text-normal bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600
    cursor-pointer px-14 py-1 rounded-lg shadow-md
    transition-all duration-200
    hover:from-blue-600 hover:via-blue-500 hover:to-blue-700
    hover:scale-105 hover:shadow-lg
    text-white flex items-center justify-center gap-2
    ${loading ? "opacity-70 cursor-not-allowed" : ""}
  `}
>
  {loading ? (
    <Loader2 className="animate-spin ml-2 " />

  ) : null}
  Vehicle Info
</button>
    </article>

)
}


export default VehicleInfoCard