

import React from 'react'
import VehicleRequestCard from '../../ui/Vehicles/VehicleRequestCard';
import { dummyDispatchRequests } from '../../../../dummyData';



const VehicleRequestSection = () => {
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
    
          {
            dummyDispatchRequests.map((request, index) => {
              return (
                <VehicleRequestCard
                  key={index}
                  {...request}
                />
              )
            })

          }

        
    </section>
  )
}

export default VehicleRequestSection