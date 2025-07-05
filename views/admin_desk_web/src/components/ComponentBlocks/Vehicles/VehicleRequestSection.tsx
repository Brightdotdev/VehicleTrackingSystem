import React, { useEffect, useState } from 'react'
import VehicleRequestCard from '../../ui/Vehicles/VehicleRequestCard'
import { DispatchRequestDto } from '@/types/VehicleTypes'
import { getAllDispatchRequests } from '@/lib/handleDsiaptchRequestPage'

const VehicleRequestSection = () => {
  // State to hold dispatch request data
  const [dispatches, setDispatches] = useState<DispatchRequestDto[]>([])

  // Fetch dispatch requests when component mounts
  useEffect(() => {
    const getDispatches = async () => {
      const dispatchApi = await getAllDispatchRequests()
      console.log(dispatchApi)
      setDispatches(dispatchApi) // ✅ Set dispatch requests
    }

    getDispatches()
  }, [])

  return (
    <section
      className="md:w-[90%] w-full rounded-xl grid gap-4 
        place-items-center bg-background2
        items-center md:p-4 md:pb-12
        justify-end content-start 
        h-[80vh] overflow-y-auto no-scrollbar"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))"
      }}
    >
      {
        // ✅ If the dispatch list is empty, show fallback
        dispatches.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full">
            No Dispatch Requests
          </div>
        ) : (
          // ✅ Otherwise, map through dispatches
          dispatches.map((request, index) => (
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
