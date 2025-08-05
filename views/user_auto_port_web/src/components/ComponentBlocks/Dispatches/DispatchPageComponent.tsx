import React,  { useEffect, useState } from 'react'
import { DispatchRequestDto} from '@/types/VehicleTypes';
import Link from 'next/link';
import VehicleRequestCard from './VehicleRequestCard';
import { getMyValidDispatches } from '@/lib/handleUserDispatchPage';
import { ArrowUpRight, Info } from 'lucide-react';
import { useUserValidation } from '@/hooks/useUserValidation';


const DispatchPageComponent = () => {

 const [dispatches, setDipatches] = useState<DispatchRequestDto[]>([]);
  const {returnMyData}  = useUserValidation()
    const handleUserDispatchPage = async () => {

      const me  = await  returnMyData()
      console.log(me);

        const myActiveDisaptches = await getMyValidDispatches();
          console.log(myActiveDisaptches)
        if(myActiveDisaptches.length > 0){
          setDipatches(myActiveDisaptches);
        }else{
          setDipatches([]);
        }
      }



 useEffect(() => {

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
<div className="w-full h-full md:h-2/3 flex items-center justify-center gap-4 flex-col">
   
<div className="flex items-center flex-col gap-2">
     <Info className='size-8'/>
<h4 className="subTitleText2 ">
      You Have no ongoing dispatch yet.....
</h4>
</div>

<div className="flex items-center justify-center gap-2 bg-muted/80 p-3 rounded-full hover:bg-accent/70 group transition-colors border border-border shadow-sm dark:bg-muted/60 dark:hover:bg-accent/40">
  <Link href="/vehicles" className="text-primary font-medium  hover:text-accent-foreground transition-colors">
    checkout the vehicles to make one
  </Link>
  <ArrowUpRight className="transition-transform duration-200 group-hover:rotate-45 text-primary" />
</div>

    </div>
  ) : (
    [...dispatches].reverse().map((dispatch: DispatchRequestDto, index: number) => (
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

