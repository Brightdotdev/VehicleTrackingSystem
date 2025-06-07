import React, { useEffect, useState } from 'react'
import { componentTypes } from '@/types/utilTypes'
import TopVehiclesRouteNav from '../ui/TopVehiclesRouteNav'

import { useRouter, useSearchParams } from 'next/navigation'
import VehicleCard from '../ui/VehicleCard'








const VehiclePageComponent = () => {
    const [visibleComponent,setVisibleComponent] = useState<componentTypes["vehicleComponent"]>("vehicles")
    const router = useRouter();
    const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", visibleComponent);
    router.push(`?${params.toString()}`);
  }, [visibleComponent]);
  
  return (
    <main className='relative  w-screen h-screen flex items-center justify-center '>
<TopVehiclesRouteNav setVisibleComponent={setVisibleComponent} visibleComponent={visibleComponent}/>
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
        <VehicleCard />
        <VehicleCard />
        <VehicleCard />
        <VehicleCard />
        <VehicleCard />
        <VehicleCard />
      </section>
    </main>
  )
}

export default VehiclePageComponent