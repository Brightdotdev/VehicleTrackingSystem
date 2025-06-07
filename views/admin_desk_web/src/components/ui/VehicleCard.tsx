import { Badge, Bike, BikeIcon, Bus, BusFront, CarFront, CheckCheck, LocateFixedIcon, LocateIcon, LocateOffIcon, LocationEdit, MapPin, Minus, Pointer, Shield, TriangleAlertIcon, Truck } from 'lucide-react';
import React from 'react'


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
absolute top-3 left-2 bg-gray-800 w-[13rem]
flex gap-3 h-[2.4rem] rounded-full
items-center justify-start shadow-xl
 ${userImage ? "pl-1" :  "pl-4"} 
 `}>

{
  userImage ? <img src={userImage} alt="user"  className='w-[2rem] h-[2rem] rounded-full object-center object-cover border-white border-2'/> :
<div className={`bg-red-800 rounded-full w-2 h-2`}>
</div>
}

<p className="text-small">
 Requsted by {userName}
</p>

</div>
  )
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
    | "NOT_DISPATCHABLE"
    | "DISPATCHABLE"
    | "DELIVERY";
    className?: string; };



const StatusPills = (props : StatusPillsProps) => {

    if(props.statusName === "AVAILABLE"){
          return(
  <div className={` h-[2rem] w-[10rem] bg-yellow-300/60
    rounded-full flex items-center justify-start gap-3 pl-4
    shadow-sm ${props.className || " "}
    `}>
<div className="w-2 h-2 rounded-full bg-yellow-600/80">
</div>
<p className="normalText">AVAILABLE</p></div>)}

else if(props.statusName === "IN_PROGRESS"){
          return(
  <div className={` h-[2rem] w-[10rem] bg-green-300/60
    rounded-full flex items-center justify-start gap-3 pl-4
    shadow-sm ${props.className || " "}
    `}>
<div className="w-2 h-2 rounded-full bg-green-600/80">
</div>
<p className="normalText">
 IN PROGRESS
</p>
</div>)}
else if(props.statusName === "PENDING"){
          return(
  <div className={` h-[2rem] w-[10rem] bg-blue-500/50
    rounded-full flex items-center justify-start gap-3 pl-4
    shadow-sm ${props.className || " "}
    `}>
<div className="w-2 h-2 rounded-full bg-blue-900/60">
</div>
<p className="normalText">
PENDING
</p>
</div>)}

else if(props.statusName === "IN_TRANSIT"){
          return(
  <div className={` h-[2rem] w-[10rem] bg-gray-500/50
    rounded-full flex items-center justify-start gap-3 pl-4
    shadow-sm ${props.className || " "}
    `}>
<div className="w-2 h-2 rounded-full bg-gray-900/60">
</div>
<p className="normalText">
IN TRANSIT
</p>
</div>)}

else if(props.statusName === "CARGO"){
          return(
  <div className={` h-[2rem] w-[10rem] bg-yellow-600
    rounded-full flex items-center justify-start gap-3 pl-4
    shadow-sm ${props.className || " "}`}>
<Truck/> 
<p className="normalText">
    CARGO
</p>
</div>)}
else if(props.statusName === "CLASSIFIED"){
          return(
  <div className={` h-[2rem] w-[10rem] bg-blue-900/80
    rounded-full flex items-center justify-start gap-3 pl-4
    shadow-sm ${props.className || " "}`}>
<Badge className='w-5 h-5'/> 
<p className="normalText">
    CLASSIFIED
</p>
</div>)}

else if(props.statusName === "DELIVERY"){
          return(
  <div className={` h-[2rem] w-[10rem] bg-blue-900/80
    rounded-full flex items-center justify-start gap-3 pl-4
    shadow-sm ${props.className || " "}`}>
<BikeIcon className='w-5 h-5'/> 
<p className="normalText">
    DELIVERY
</p>
</div>)}
else if(props.statusName === "REGULAR"){
          return(
  <div className={` h-[2rem] w-[10rem] bg-yellow-500/50
    rounded-full flex items-center justify-start gap-3 pl-4
    shadow-sm ${props.className || " "}`}>
<CarFront className='w-5 h-5'/> 
<p className="normalText">
    REGULAR
</p>
</div>)}

else if(props.statusName === "TRANSPORT"){
          return(
  <div className={` h-[2rem] w-[10rem] bg-orange-500/90
    rounded-full flex items-center justify-start gap-3 pl-4
    shadow-sm ${props.className || " "}`}>
<BusFront className='w-5 h-5'/> 
<p className="normalText">
    TRANSPORT
</p>
</div>)}
else if(props.statusName === "DISPATCHABLE"){
          return(
  <div className={` h-[2rem] w-[14rem] bg-green-500/90
    rounded-full flex items-center justify-start gap-3 pl-4
    shadow-sm ${props.className || " "}`}>
<p className="text-body">
    DISPATCHABLE
</p>

<div className="p-1 rounded-full bg-green-250/40">
<CheckCheck className='w-5 h-5'/> 
</div>

</div>)}
else if(props.statusName === "NOT_DISPATCHABLE"){
          return(
  <div className={` h-[2rem] w-[12rem] bg-red-500/70
    rounded-full flex items-center justify-end gap-3 pr-1
    shadow-sm ${props.className || " "}`}>
<p className="text-sm">
    NOT DISPATCHABLE
</p>

<div className="p-1 rounded-full bg-red-400/50">
<Minus className='w-5 h-5'/> 
</div>
</div>)}

}



const VehicleCard = () => {
  return (
    <article className='relative flex flex-col 
    items-center gap-8 vehicleCardBody p-sm shadow-md 
    w-[var(--size-vehicleCard)] h-[30rem] bg-background'>
      
<div className="relative vehicleCard flex items-center justify-center w-full h-[12rem] bg-blue-500 overflow-hidden">
  {/* Placeholder image covering the parent */}
  <img
    src="data:image/jpeg;base64,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"
    alt="Vehicle"
    className="absolute inset-0 w-full h-full object-cover"
  />
  <DispatchRequesterPill
    userName="Nicole"
    userImage="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&Sixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  />
  <StatusPills statusName="NOT_DISPATCHABLE" className="absolute bottom-2 right-2" />
</div>



<div className="flex flex-col 
w-full pl-4
items-start justify-start gap-2">
<h5 className='text-normal-2'>
  Car Name
</h5>

<div className="flex items-center justify-center gap-2">
<MapPin />
<p className='text-body-2' >IN Transit</p>
</div>
<div className="flex items-center justify-center gap-2">
<Shield />
<HealthText  value={80}/>

</div>

<div className=" flex items-center justify-center gap-2">
<TriangleAlertIcon />

<p className='text-body-2' >IN Transit</p>
</div>





</div>


<button 
className="text-normal bg-blue-700 px-8 py-2 rounded-lg">
  Handle Dispatch
</button>
  
    </article>

)
}


export default VehicleCard