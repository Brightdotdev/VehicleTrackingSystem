import React, { useEffect, useState } from 'react'
import VehicleRequestCard from '../../ui/Vehicles/VehicleRequestCard'
import { DispatchRequestDto } from '@/types/VehicleTypes'
import { getAllDispatchRequests } from '@/lib/handleDsiaptchRequestPage'

const VehicleRequestSection = () => {
  // State to hold dispatch request data
  const [dispatches, setDispatches] = useState<DispatchRequestDto[]>([])
    const [loading, setLoading] = useState(false);
  

  // Fetch dispatch requests when component mounts
  useEffect(() => {
    const getDispatches = async () => {
      setLoading(true)
      const dispatchApi = await getAllDispatchRequests()
      console.log(dispatchApi)
      setDispatches(dispatchApi) // ✅ Set dispatch requests
      setLoading(false)
    }

    getDispatches()
  }, [])



  
  if(loading) return <>Loading Vehicle Data</>


  return (
    <section
      className="md:w-[90%] w-full rounded-xl grid gap-4 
        place-items-center 
        items-center md:p-4 md:pb-12
        justify-end content-start 
        h-[80vh] overflow-y-auto no-scrollbar"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))"
      }}
    >
      {
      
        dispatches.length === 0 ? (
     
    <div className="mt-20 flex  items-center justify-center">
      No Dispatch Requests for now
    </div>
        ) : (
          // ✅ Otherwise, map through dispatches
          [...dispatches].reverse().map((request, index) => (
            <VehicleRequestCard
              key={index}
              {...request}
            />
          ))
        )
      }
    </section>
  )
}

export default VehicleRequestSection
