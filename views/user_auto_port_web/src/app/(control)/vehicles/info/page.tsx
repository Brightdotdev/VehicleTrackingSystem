"use client";

import { lazy, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import Loading from "@/components/ui/Loading";
import UnvalidatedPage from "@/components/utils/UnvalidatedPage";
import { useUserValidation } from "@/hooks/useUserValidation";

// Lazy-load the Vehicle Info Page component
const VehicleInfoPage = lazy(() =>
  import(
    "@/components/ComponentBlocks/Vehicles/VehicleInfoPage"
  )
);

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🚗 Get the vehicle VIN from query string
  const vehicle = searchParams.get("vehicle");

  // 🔒 Hook to check if user is validated
  const { loading, isValidated, checkValidation } = useUserValidation();

  useEffect(() => {
    // 🧱 No vehicle param → show error and redirect
    if (!vehicle) {
      toast.error("No valid vehicle selected.");
      router.replace("/vehicles");
    }

    // ✅ Start user validation
    checkValidation();
  }, []);

  // ⏳ While validating or loading...
  if (loading || isValidated === null) {
    return (
      <div className="flex items-center justify-center size-screen">
        <Loader2 className="animate-spin mr-2 stroke-foreground" />
        Loading vehicle information...
      </div>
    );
  }

  // ❌ If user is not validated
  if (!isValidated) {
    return <UnvalidatedPage />;
  }

  // ✅ All checks passed
  if (isValidated && vehicle) {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center size-screen">
            <Loader2 className="animate-spin mr-2 stroke-foreground" />
            Vehicle info page loading...
          </div>
        }
      >
        <VehicleInfoPage vehicleVin={vehicle} />
      </Suspense>
    );
  }

  // 🛑 Final guard (should never hit)
  return <>Something Went wrong...try going back</>;
}
