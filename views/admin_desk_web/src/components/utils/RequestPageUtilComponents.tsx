import { Badge, BikeIcon, BusFront, CarFront, Check, Minus, Truck } from 'lucide-react';
import React from 'react'


    
export type DispatchRequestPageStatusPillsProps = {
  statusName:
    "CANCELLED"
    |"EXPIRED"
    | "COMPLETED"
    |"REJECTED"
    |"ACTIVE"
    | "IN_TRANSIT"
    | "PENDING"
    | "IN_PROGRESS"
    | "DISPATCH_DATA"
    | "AVAILABLE"
    | "CLASSIFIED"
    | "CARGO"
    | "REGULAR"
    | "TRANSPORT"
    | "DELIVERY"
    | "NOT_DISPATCHABLE"
    | "DISPATCHABLE"
    className?: string;
    userName? : string;
    userImage? : string;
  };



export const DispatchRequestPageStatusPills = (props: DispatchRequestPageStatusPillsProps) => {

  const baseClass =
        "pointer-events-none select-none h-[2rem] rounded-full flex items-center justify-start gap-3 shadow-sm text-primary-foreground dark:text-foreground";

      if (props.statusName === "AVAILABLE") {
        return (
          <div
            className={`${baseClass} xl:w-[8rem] w-[6rem] bg-gradient-to-r from-yellow-900/60 to-yellow-800/60 pl-4 ${
              props.className || ""
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-yellow-600/80"></div>
            <p className="text-xs lg:text-small">AVAILABLE</p>
          </div>
        );
      } else if (props.statusName === "IN_PROGRESS") {
        return (
          <div
            className={`${baseClass} xl:w-[8rem] w-[7rem] bg-gradient-to-r from-green-900 to-green-800 pl-4 ${
              props.className || ""
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-green-600/80"></div>
            <p className="text-xs lg:text-small">IN PROGRESS</p>
          </div>
        );
      } else if (props.statusName === "PENDING") {
        return (
          <div
            className={`${baseClass} xl:w-[8rem] w-[6rem] bg-gradient-to-r from-teal-900 to-teal-800 pl-4 ${
              props.className || ""
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-white/80"></div>
            <p className="text-xs lg:text-small">PENDING</p>
          </div>
        );
      } else if (props.statusName === "IN_TRANSIT") {
        return (
          <div
            className={`${baseClass} xl:w-[8rem] w-[6rem] bg-gradient-to-r from-green-700/60 to-green-600/60 pl-4 ${
              props.className || ""
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <p className="text-xs lg:text-small">IN TRANSIT</p>
          </div>
        );
      } else if (props.statusName === "CARGO") {
        return (
          <div
            className={`${baseClass} w-[10rem] bg-gradient-to-r from-yellow-700 to-yellow-600 pl-6 ${
              props.className || ""
            }`}
          >
            <Truck />
            <p className="text-small lg:text-body">CARGO</p>
          </div>
        );
      } else if (props.statusName === "CLASSIFIED") {
        return (
          <div
            className={`${baseClass} w-[9rem] bg-gradient-to-r from-teal-900 to-teal-800 pl-4 ${
              props.className || ""
            }`}
          >
            <Badge className="size-3 lg:size-4" />
            <p className="text-small lg:text-body">CLASSIFIED</p>
          </div>
        );
      } else if (props.statusName === "DELIVERY") {
        return (
          <div
            className={`${baseClass} w-[10rem] bg-gradient-to-r from-blue-900/80 to-blue-800/80 pl-4 ${
              props.className || ""
            }`}
          >
            <BikeIcon className="size-3 lg:size-4" />
            <p className="text-small lg:text-body">DELIVERY</p>
          </div>
        );
      } else if (props.statusName === "REGULAR") {
        return (
          <div
            className={`${baseClass} xl:w-[9rem] w-[7rem] bg-gradient-to-r from-blue-900 to-blue-800 pl-4 ${
              props.className || ""
            }`}
          >
            <CarFront className="size-3 lg:size-4" />
            <p className="text-small xl:text-body">REGULAR</p>
          </div>
        );
      } else if (props.statusName === "TRANSPORT") {
        return (
          <div
            className={`${baseClass} lg:w-[12rem] w-[8rem] bg-gradient-to-r from-orange-500 to-orange-400 pl-4 ${
              props.className || ""
            }`}
          >
            <BusFront className="size-3 lg:size-5" />
            <p className="text-small lg:text-body">TRANSPORT</p>
          </div>
        );
      } else if (props.statusName === "DISPATCHABLE") {
    return (
      <div
        className={`
          h-[2rem] lg:w-[11.5rem]   w-[8rem] text-primary-foreground dark:text-foreground 
          bg-gradient-to-r from-green-800  to-green-900
          rounded-full flex items-center justify-start gap-4 pl-5
          shadow-lg ${props.className || ""}
          pointer-events-none select-none
        `}
        tabIndex={-1}
        aria-disabled="true"
      >
        <p className="text-small lg:text-body">DISPATCHABLE</p>
        <div className="p-1 rounded-full bg-green-100/20">
          <Check className="size-3 lg:size-4" />
        </div>
      </div>
    );
  } else if (props.statusName === "NOT_DISPATCHABLE") {
    return (
      <div
        className={`
          h-[2rem] w-[11.5rem]  text-primary-foreground dark:text-foreground 
          bg-gradient-to-r from-red-500 to-red-600
          rounded-full flex items-center justify-end gap-3 pr-1
          shadow-lg ${props.className || ""}
          pointer-events-none select-none
        `}
        tabIndex={-1}
        aria-disabled="true"
      >
        <p className="text-small lg:text-body">NOT DISPATCHABLE</p>
        <div className="p-1 rounded-full bg-red-100/40">
          <Minus className="size-3 lg:size-4" />
        </div>
      </div>
    );
  }
  else if (props.statusName === "DISPATCH_DATA") {
    return (
      <div className={`
 bg-gray-800 p-4 text-primary-foreground dark:text-foreground
flex gap-3 h-[2.4rem] rounded-full
items-center justify-start shadow-xl
 ${props.userImage ? "pl-1" :  "pl-4"} 
 ${props.className || ""}
 `} tabIndex={-1}  aria-disabled="true">
   {props.userImage ? 
 <img 
  src={props.userImage} alt="user"
  className='w-[2rem] h-[2rem] rounded-full object-center object-cover border-white border-2'/> :
<div className={`bg-white rounded-full w-2 h-2`}>
</div>
}

<p className="text-small">
   {props.userName}'s Requst Data
 </p>
      </div>
    );
  }

//extra dispatch pills

 else if (props.statusName === "ACTIVE") {
    return (
     <div
        className={`
       h-[2rem] w-[8rem]  text-primary-foreground dark:text-foreground
          bg-gradient-to-r from-green-500 to-green-600
          rounded-full flex items-center justify-start gap-3 pl-4
          shadow-lg ${props.className || ""}
          pointer-events-none select-none
        `}
        tabIndex={-1}
        aria-disabled="true">
        <div className="p-1 rounded-full bg-green-100/20">
        </div>
        <p className="text-xs lg:text-sm">ACTIVE</p>
      </div>
    );
  } 
 else if (props.statusName === "CANCELLED") {
    return (
     <div
        className={`
       h-[2rem] w-[8rem]  text-primary-foreground dark:text-foreground
          bg-gradient-to-r from-teal-500 to-teal-600
          rounded-full flex items-center justify-start gap-3 pl-4
          shadow-lg ${props.className || ""}
          pointer-events-none select-none
        `}
        tabIndex={-1}
        aria-disabled="true">
        <div className="p-1 rounded-full bg-green-100">
        </div>
        <p className="text-xs lg:text-sm">CANCELLED</p>
      </div>
    );
  } 
  else if (props.statusName === "REJECTED") {
    return (
     <div
        className={`
          h-[2rem] xl:w-[8rem] w-[7rem]  text-primary-foreground dark:text-foreground
          bg-gradient-to-r from-red-500 to-red-600
          rounded-full flex items-center justify-start gap-3 pl-4
          shadow-lg ${props.className || ""}
          pointer-events-none select-none
        `}
        tabIndex={-1}
        aria-disabled="true">
        <div className="p-1 rounded-full bg-red-100">
        </div>
        <p className="text-xs lg:text-sm">REJECTED</p>
      </div>
    );
  } 

  else if (props.statusName === "COMPLETED") {
    return (
     <div
        className={`
          h-[2rem] w-[8rem]  text-primary-foreground dark:text-foreground
          bg-gradient-to-r from-yellow-500 to-yellow-600
           rounded-full flex items-center justify-start gap-3 pl-4
          shadow-lg ${props.className || ""}
          pointer-events-none select-none
        `}
        tabIndex={-1}
        aria-disabled="true">
        <div className="p-1 rounded-full bg-yellow-100">
        </div>
        <p className="text-xs lg:text-sm">COMPLETED</p>
      </div>
    );
  } 
  else if (props.statusName === "EXPIRED") {
    return (
     <div
        className={`
          h-[2rem] w-[8rem]  text-primary-foreground dark:text-foreground
          bg-gradient-to-r from-yellow-700 to-yellow-800
           rounded-full flex items-center justify-start gap-3 pl-4
          shadow-lg ${props.className || ""}
          pointer-events-none select-none
        `}
        tabIndex={-1}
        aria-disabled="true">
        <div className="p-1 rounded-full bg-yellow-100/20">
        </div>
        <p className="text-xs lg:text-sm">EXPIRED</p>
      </div>
    );
  } 

  
  

  return null;
};