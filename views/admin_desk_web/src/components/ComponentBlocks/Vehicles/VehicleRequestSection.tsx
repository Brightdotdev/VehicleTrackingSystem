

import React, { useEffect, useState } from 'react'
import VehicleRequestCard from '../../ui/Vehicles/VehicleRequestCard';
import { DispatchRequestDto } from '@/types/VehicleTypes';
import { getAllDispatchRequests } from '@/lib/handleDsiaptchRequestPage';



const VehicleRequestSection = () => {


  const [dispatches, setDispatches] = useState<DispatchRequestDto[]>([]);
  
  
    useEffect(() => {
  
      const getDispatches = async () => {
        const dispatchApi = await getAllDispatchRequests()
        
        console.log(dispatchApi)
        setDispatches(dispatchApi);
      }
  
      getDispatches()

    }, []);  

  


  return (
    <section 
      className="md:w-[90%] w-full rounded-xl grid gap-4 
        place-items-center  bg-background2
        items-center  md:p-4  md:pb-12
        justify-end content-st8art 
        h-[80vh] overflow-y-auto no-scrollbar"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))"
      }}
    >
      {dispatches === undefined || dispatches.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full">
          {dispatches.length === 0 ? "No Dispatch Requests" : "Loading..."}
        </div>
      ) : (
        dispatches.map((request, index) => (
          <VehicleRequestCard
            key={index}
            {...request}
          />
        ))
      )}
    </section>
  )
}

export default VehicleRequestSection