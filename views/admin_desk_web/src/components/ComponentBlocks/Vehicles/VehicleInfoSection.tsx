
import React, { useEffect, useState } from 'react'
import VehicleInfoCard from '../../ui/Vehicles/VehicleInfoCard'
import { VehicleDTO } from '@/types/VehicleTypes';
import { getAllVehicles } from '@/lib/handleVehiclePage';




const VehicleInfoSection = () => {

  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);

useEffect(() => {
    // Function to fetch all vehicle data
    const getVehicles = async () => {
      const vehicleApi = await getAllVehicles()
      console.log(vehicleApi)
      setVehicles(vehicleApi) // ✅ Keep this
    }

    getVehicles()
  }, [])

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
  vehicles.length === 0 ? (
    <div className="flex items-center justify-center">
      No Vehicle Data
    </div>
  ) : (
    vehicles.map((vehicle: VehicleDTO, index: number) => (
      <VehicleInfoCard
        key={index}
        {...vehicle}
      />
    ))
  )
}

    </section>
  )
}

export default VehicleInfoSection