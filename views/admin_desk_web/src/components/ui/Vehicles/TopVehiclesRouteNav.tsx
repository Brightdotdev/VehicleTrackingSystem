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
    <nav className="fixed top-6 flex items-center justify-center z-5 w-[24rem]">
  
<Button
    className={`navButtonLeft topNavButton
        ${visibleComponent === "requests" ? "activeVehicleText" : "unActiveVehicleText"}
        `}
    onClick={handleRequestComponent}
>
    Requests
</Button>

 <Button className={`navButtonRight topNavButton
  ${visibleComponent === "vehicles" ?  "activeVehicleText" : "unActiveVehicleText" } 
   
  `} 
 onClick={handleVehiclesComponent}
 >Vehicles</Button>

</nav>
  )
}

export default TopVehiclesRouteNav