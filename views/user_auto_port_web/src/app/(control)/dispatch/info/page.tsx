"use client";

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { lazy, Suspense } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import UnvalidatedPage from '@/components/utils/UnvalidatedPage';
import { useUserValidation } from '@/hooks/useUserValidation';

// Lazy import of the page component
const DispatchInfoPage = lazy(() =>
  import('@/components/ComponentBlocks/Dispatches/DispatchInfoPage')
);

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get vehicle parameters from the URL
  const vehicleReqIdParam = searchParams.get('vehicleReqId');
  const vehicleId = searchParams.get('vehicleId');

  // Validation states from custom hook
  const { loading, isValidated, checkValidation } = useUserValidation();

  // Parse and memoize vehicle request ID to number
  const vehicleReqId = useMemo(() => {
    const num = Number(vehicleReqIdParam);
    return isNaN(num) ? null : num;
  }, [vehicleReqIdParam]);

  useEffect(() => {
    // Check for missing or invalid params
    if (!vehicleId || vehicleReqId === null) {
      toast.error("No valid params for page.");
      router.replace("/vehicles");
      return;
    }

    // Start validation
    checkValidation();
  }, [vehicleId, vehicleReqId]);

  // ⏳ Show loading spinner while validating
  if (loading || isValidated === null) {
    return (
      <div className="flex items-center justify-center size-screen">
        <Loader2 className="animate-spin mr-2 stroke-foreground" />
        Loading Dispatch information...
      </div>
    );
  }

  // ❌ Show unvalidated page if user fails validation
  if (!isValidated) {
    return <UnvalidatedPage />;
  }

  

  // ✅ Render page if all checks pass
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center size-screen">
          <Loader2 className="animate-spin mr-2 stroke-foreground" />
          Vehicle info page loading...
        </div>
      }
    >
      <DispatchInfoPage vehicleVin={vehicleId!} vehicleReqId={vehicleReqId!} />
    </Suspense>
  );
}
