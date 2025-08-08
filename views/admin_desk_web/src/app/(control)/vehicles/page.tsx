"use client";

import Loading from '@/components/ui/Loading';
import UnvalidatedPage from '@/components/UnvalidatedPage';
import { useUserValidation } from '@/hooks/useUserValidation';
import { lazy, Suspense, useEffect, useState } from 'react';

// Lazy load the main vehicle page
const VehiclePageComponent = lazy(() =>
  import("../../../components/ComponentBlocks/Vehicles/VehiclePageComponent")
);

export default function Page() {
  const { loading, isValidated, checkValidation } = useUserValidation();

  // ✅ Track when validation check is done to avoid early rendering
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    const run = async () => {
      await checkValidation(); // Run your validation
      setCheckComplete(true);  // Mark as done
    };

    run();
  }, []);

  // ⏳ Still waiting for validation check to complete
  if (!checkComplete || loading || isValidated === null) {
    return <Loading />;
  }

  // ❌ User is not validated — show fallback page
  if (!isValidated) {
    return <UnvalidatedPage />;
  }

  // ✅ Validated — show main content
  return (
    <Suspense fallback={<Loading />}>
      <VehiclePageComponent />
    </Suspense>
  );
}
