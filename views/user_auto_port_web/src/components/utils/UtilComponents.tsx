"use client"

import React from 'react'
import { Button } from '../ui/button';

import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';






export const HealthText = ({value} : {value : number}) =>{
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





type DayButtonProps = {
  day: Date;
  isSelected: boolean;
  isInPast: boolean;
  onClick?: (date: Date) => void;
};

export function DayButton({ day, isSelected, isInPast, onClick }: DayButtonProps) {
  const formattedDay = format(day, "d");
  const isoDate = format(day, "yyyy-MM-dd");

  // Past day — disabled with tooltip
  if (isInPast) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button
              type="button"
              variant="ghost"
              className="w-9 p-0 font-normal"
              disabled
            >
              <time dateTime={isoDate}>{formattedDay}</time>
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>You can't dispatch back in time 🌀</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Future day — active button
  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "ghost"}
      className={cn(
        "w-9 p-0 font-normal",
        isSelected &&
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
      )}
      onClick={() => onClick?.(day)}
    >
      <time dateTime={isoDate}>{formattedDay}</time>
    </Button>
  );
}
