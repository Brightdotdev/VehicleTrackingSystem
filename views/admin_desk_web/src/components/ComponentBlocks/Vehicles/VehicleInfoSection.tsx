
import React, { use, useEffect, useState } from 'react'
import VehicleInfoCard from '../../ui/Vehicles/VehicleInfoCard'
import { VehicleDTO } from '@/types/VehicleTypes';
import { getAllVehicles } from '@/lib/handleVehiclePage';
import UnvalidatedPage from '@/components/UnvalidatedPage';
import { useUserValidation } from '@/hooks/useUserValidation';




const VehicleInfoSection = () => {

  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const {isValidated}  = useUserValidation() 
useEffect(() => {
    // Function to fetch all vehicle data
    const getVehicles = async () => {
      setLoading(true)
      const vehicleApi = await getAllVehicles()
      console.log(vehicleApi)
      setVehicles(vehicleApi)
      setLoading(false)
    }

    getVehicles()
  }, [])


  
    if (loading || isValidated === null) 
     return <>Loading Vehicle Data</>
  


  if (!isValidated) {
    return (
     <UnvalidatedPage/>
    );
  }

  
  return (
    <section 
         className="md:w-[90%] w-full rounded-xl grid  gap-8 md:gap-10
        place-items-center 
        items-center  md:p-4  md:pb-12
        justify-end content-start 
        h-[80vh] overflow-y-auto no-scrollbar"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))"
        }}
    >

{
  vehicles.length === 0 ? (
    <div className="mt-20 flex items-center justify-center">


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