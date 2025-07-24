import React, { useEffect, useState, lazy, Suspense } from 'react';
import { componentTypes } from '@/types/utilTypes';
import TopVehiclesRouteNav from '../../ui/Vehicles/TopVehiclesRouteNav';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import SaveNewVehiclePopUp from '@/components/utils/SaveNewVehiclePopUp';
import { Button } from '@/components/ui/button';

// Lazy load the sections
const VehicleInfoSection = lazy(() => import('./VehicleInfoSection'));
const VehicleRequestSection = lazy(() => import('./VehicleRequestSection'));


const AddVehicleButton = () => {
const [open, setOpen] = useState(false);
return(
  <>
<Button className='absolute sm:top-4 z-20 right-4 bottom-18' onClick={() => setOpen(true)}>Add Vehicle</Button>
<SaveNewVehiclePopUp open={open} setOpen={setOpen} />
  </>
)
}



const VehiclePageComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL param if present
  const initialTab = searchParams.get("tab") as componentTypes["vehicleComponent"] | null;
  const [visibleComponent, setVisibleComponent] = useState<componentTypes["vehicleComponent"]>(
    initialTab === "vehicles" ? "vehicles" : "requests"
  );

  // Only update URL if tab actually changed
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab !== visibleComponent) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", visibleComponent);
      router.replace(`?${params.toString()}`); 
    }
    
  }, [visibleComponent]);



  return (
    <main className='relative w-screen h-screen flex items-center justify-center'>

      

      <AddVehicleButton/>
      <TopVehiclesRouteNav setVisibleComponent={setVisibleComponent} visibleComponent={visibleComponent} />
      <Suspense fallback={<div className='flex items-center justify-center gap-2'>
           <Loader2 className="animate-spin mr-2" />
          Loading Section...</div>}>
        {visibleComponent === "vehicles" ? <VehicleInfoSection /> : <VehicleRequestSection />}
      </Suspense>
    </main>
  );
};

export default VehiclePageComponent;