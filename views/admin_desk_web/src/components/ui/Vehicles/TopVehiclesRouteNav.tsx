import React, { useState } from 'react'
import { Button } from '../button'
import { componentTypes } from '@/types/utilTypes'





const TopVehiclesRouteNav = (
    {setVisibleComponent,visibleComponent} : { 
        setVisibleComponent : (visibleComponent : componentTypes["vehicleComponent"] ) => void ,
        visibleComponent : componentTypes["vehicleComponent"]
    }
) => {

    const handleVehiclesComponent = () =>{
        setVisibleComponent("vehicles");}

    const handleRequestComponent = () =>{
        setVisibleComponent("requests");
    }


    return (
    <nav className="fixed lg:top-4 md:top-2 top-4 flex items-center justify-center z-5 w-full sm:w-[24rem]">

 <ul className='flex w-full'>

    <li className={`topNavButton ${visibleComponent === "requests" ? "activeVehicleText" : "unActiveVehicleText"}`} onClick={handleRequestComponent}>
 <p>
    Requests
 </p>
 </li>


<li
 className={`topNavButton  ${visibleComponent === "vehicles" ?  "activeVehicleText" : "unActiveVehicleText" }`} 
 onClick={handleVehiclesComponent}>
<p>
Vehicles

</p>
</li>
 </ul>
</nav>
  )
}

export default TopVehiclesRouteNav