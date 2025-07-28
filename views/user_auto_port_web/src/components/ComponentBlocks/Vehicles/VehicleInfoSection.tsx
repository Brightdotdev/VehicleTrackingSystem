
import React, { useEffect, useState } from 'react'
import VehicleInfoCard from '../../ui/Vehicles/VehicleInfoCard'
import { VehicleDTO } from '@/types/VehicleTypes';
import { getAvailableVehicles } from '@/lib/handleVehiclePage';




const VehicleInfoSection = () => {

 const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);


  useEffect(  () => {

    const getVehicles = async () => {
      const vehicleApi = await getAvailableVehicles()
      console.log(vehicleApi);
      setVehicles(vehicleApi);
    }

    getVehicles()

  }, []);  


  return (
<>
<h5 className="fixed top-6 flex items-center justify-center z-5 w-[24rem] text-normal-2">
  Available Vehicles
</h5>


    <section
      className="
        md:w-[90%] w-full rounded-xl 
        grid gap-4 place-items-center 
        md:bg-background2 items-start 
        md:p-4 py-6 justify-end 
        h-[80vh] md:h-[75vh] overflow-y-auto no-scrollbar
        [grid-template-columns:repeat(auto-fit,minmax(20rem,1fr))]
        sm:[grid-template-columns:repeat(auto-fit,minmax(20rem,1fr))]
        md:[grid-template-columns:repeat(auto-fit,minmax(21rem,1fr))]
        lg:[grid-template-columns:repeat(auto-fit,minmax(22rem,1fr))]
      "
    >
{
  vehicles.length === 0 ? (
    <div className="flex items-center justify-center">
      No Vehicle Data
    </div>
  ) : (
    [...vehicles].reverse().map((vehicle: VehicleDTO, index: number) => (
      <VehicleInfoCard
        key={index}
        {...vehicle}
      />
    ))
  )
}
    </section>
        </>
  )
}

export default VehicleInfoSection