import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';



const VehicleInfoSection = lazy(() => import('./VehicleInfoSection'));

const VehiclePageComponent = () => {


  return (
    <main className='relative w-screen h-screen flex items-center justify-center'>
  
      <Suspense fallback={<div className='flex items-center justify-center gap-2'>
           <Loader2 className="animate-spin mr-2" />
         Getting your Vehicles ready...</div>}>
        <VehicleInfoSection />
      </Suspense>
    </main>
  );
};

export default VehiclePageComponent;