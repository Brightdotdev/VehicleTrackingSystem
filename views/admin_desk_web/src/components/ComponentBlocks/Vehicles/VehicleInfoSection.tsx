
import React from 'react'
import VehicleInfoCard from '../../ui/Vehicles/VehicleInfoCard'
import { testVehicles } from '../../../../dummyData';




const VehicleInfoSection = () => {
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
    testVehicles.map((vehicle, index) => {
      return (
        <VehicleInfoCard
          key={index}
         {...vehicle}
        />
      )
    })
  
}


    </section>
  )
}

export default VehicleInfoSection