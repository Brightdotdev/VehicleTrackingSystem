import React,  { useEffect, useState } from 'react'
import { DispatchRequestDto} from '@/types/VehicleTypes';
import Link from 'next/link';
import VehicleRequestCard from './VehicleRequestCard';
import { getMyValidDispatches } from '@/lib/handleUserDispatchPage';
import Usernav from '@/components/ui/Usernav';


const DispatchPageComponent = () => {

 const [dispatches, setDipatches] = useState<DispatchRequestDto[]>([]);

 useEffect(() => {
      const handleUserDispatchPage = async () => {
        const myActiveDisaptches = await getMyValidDispatches();
          console.log(myActiveDisaptches)
        if(myActiveDisaptches.length > 0){
          setDipatches(myActiveDisaptches);
        }else{
          setDipatches([]);
        }
      }
       handleUserDispatchPage()
 },[])



  return (
    
<>
<h5 className="fixed top-6 flex items-center justify-center  w-[24rem] text-normal-2">
  My Dispatchs
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
  dispatches.length === 0 ? (
    <div className="flex items-center justify-center">
      You Have No dispatch requests yet..... <Link href="/vehicles">checkout the vehicles to make one </Link>
    </div>
  ) : (
    dispatches.map((dispatch: DispatchRequestDto, index: number) => (
      <VehicleRequestCard
        key={index}
        {...dispatch}
      />
    ))
  )
}
    </section>
        </>
  )
}

export default DispatchPageComponent

