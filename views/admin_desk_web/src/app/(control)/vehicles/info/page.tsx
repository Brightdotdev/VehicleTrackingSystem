"use client";

import InvalidLinkPage from '@/components/ui/InvalidLinkPage';
import Loading from '@/components/ui/Loading';
import UnvalidatedPage from '@/components/UnvalidatedPage';

import { useUserValidation } from '@/hooks/useUserValidation';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { lazy, Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Lazy load the actual page content
const VehicleInfoPage = lazy(() =>
  import('../../../../components/ComponentBlocks/Vehicles/VehicleInfoPage')
);

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawVehicle = searchParams.get('vehicle');
  const vehicle = rawVehicle ?? null;

  const { loading, isValidated, checkValidation } = useUserValidation();

  const [checkComplete, setCheckComplete] = useState(false);
  const [invalidParams, setInvalidParams] = useState(false);

  useEffect(() => {
    // 🔒 Check if required query param is missing
    if (!vehicle) {
      toast.error("Invalid or missing vehicle parameter");
      setInvalidParams(true);
      return;
    }

    // ✅ Proceed to run auth validation
    const validate = async () => {
      await checkValidation();
      setCheckComplete(true);
    };

    validate();
  }, []);

  // ⏳ Block premature rendering
  if (!checkComplete || loading || isValidated === null) {
    return <Loading />;
  }

  // ❌ Invalid user
  if (!isValidated) {
    return <UnvalidatedPage />;
  }

  // ❌ Invalid link — Show back button to recover
  if (invalidParams) {
    return <InvalidLinkPage />;
  }

  // ✅ All good — render main content
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center size-screen gap-2">
          <Loader2 className="animate-spin stroke-foreground" />
          Vehicle Info page loading...
        </div>
      }
    >
      <VehicleInfoPage vehicleVin={vehicle!} />
    </Suspense>
  );
}
