"use client";

import { lazy, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import Loading from "@/components/ui/Loading";
import UnvalidatedPage from "@/components/utils/UnvalidatedPage";
import { useUserValidation } from "@/hooks/useUserValidation";

// Lazy load the page component
const VehicleRequestPage = lazy(() =>
  import("@/components/ComponentBlocks/Vehicles/VehicleRequestPage")
);

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🚗 Grab required query params
  const vehicle = searchParams.get("vehicle");
  const vehicleReqid = searchParams.get("vehicleReq");

  const { loading, isValidated, checkValidation } = useUserValidation();

  useEffect(() => {
    // 🚫 No required params → error + redirect
    if (!vehicle || !vehicleReqid) {
      toast.error("Missing required vehicle or request ID.");
      router.replace("/vehicles");
    }

    // 🔒 Start validation
    checkValidation();
  }, []);

  // ⏳ Still validating/loading
  if (loading || isValidated === null) {
    return <Loading />;
  }

  // ❌ Not validated
  if (!isValidated) {
    return <UnvalidatedPage />;
  }

  // ✅ All good → render with fallback
  if (isValidated && vehicle && vehicleReqid) {
    return (
      <Suspense
        fallback={
          <div className="w-screen h-screen flex items-center justify-center gap-2">
            <Loader2 className="animate-spin ml-2 stroke-foreground" />
            Dispatch Request Loading...
          </div>
        }
      >
        <VehicleRequestPage vehicleVin={vehicle} />
      </Suspense>
    );
  }

  // 🛑 Edge guard
  return <>Something Went wrong try loging in again</>;
}
