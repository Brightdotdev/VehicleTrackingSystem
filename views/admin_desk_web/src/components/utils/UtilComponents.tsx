"use client"

import React from 'react'


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