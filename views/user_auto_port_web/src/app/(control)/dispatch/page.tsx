"use client";

import { useUserValidation } from '@/hooks/useUserValidation';
import Link from 'next/link';
import { lazy, useEffect } from 'react';



const DispatchPageComponent = lazy(() => import("../../../components/ComponentBlocks/Dispatches/DispatchPageComponent"));

export default function Page() {
  const {loading, isValidated, checkValidation} = useUserValidation();

  useEffect(() => {
    checkValidation();
  }, []);
  
  if(isValidated && !loading) 
    return (
  
      <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen">

        <h2 className="subTitleText2">
        Yeah..the dispatch pagee was moved
        </h2>

        <Link href='/' className="text-normal text-muted-foreground underline underline-offset-6">Go To the New Page</Link>
      </div>
    ) 

  if(loading) return <>No Vehicle Page Provided...internal Server error </>;

}
