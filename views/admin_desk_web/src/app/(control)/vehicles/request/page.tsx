"use client";

import Loading from '@/components/ui/Loading';
import UnvalidatedPage from '@/components/UnvalidatedPage';
import InvalidLinkPage from '@/components/ui/InvalidLinkPage';
import { useUserValidation } from '@/hooks/useUserValidation';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { lazy, Suspense, useEffect, useState } from 'react';

// Lazy-load the main page
const DispatchRequestPage = lazy(() =>
  import('../../../../components/ComponentBlocks/Vehicles/DispatchRequestPage')
);

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get params
  const vehicleReqid = searchParams.get('vehicleReq');
  const vehicle = searchParams.get('vehicle');

  // Validation logic
  const { loading, isValidated, checkValidation } = useUserValidation();

  // Flags
  const [checkComplete, setCheckComplete] = useState(false);
  const [invalidParams, setInvalidParams] = useState(false);

  useEffect(() => {
    // Basic param presence check
    if (!vehicle || !vehicleReqid || isNaN(Number(vehicleReqid))) {
      setInvalidParams(true);
      return;
    }

    const runValidation = async () => {
      await checkValidation();
      setCheckComplete(true);
    };

    runValidation();
  }, []);

  // 🧯 Show invalid param page
  if (invalidParams) {
    return <InvalidLinkPage />;
  }

  // 🔄 Show loader while validating
  if (!checkComplete || loading || isValidated === null) {
    return <Loading />;
  }

  // ❌ Not validated? Block access
  if (!isValidated) {
    return <UnvalidatedPage />;
  }

  // ✅ Validated and good params — show main component
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center gap-2">
          <Loader2 className="animate-spin ml-2 stroke-foreground" />
          Dispatch Request Loading...
        </div>
      }
    >
      <DispatchRequestPage
        vehicleVin={vehicle!}
        dispatchReqId={Number(vehicleReqid)}
      />
    </Suspense>
  );
}
