"use client";

import { lazy, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import Loading from "@/components/ui/Loading";
import UnvalidatedPage from "@/components/utils/UnvalidatedPage";
import { useUserValidation } from "@/hooks/useUserValidation";

// Lazy-load the component only after validation
const VehicleRequestPage = lazy(() =>
  import(
    "@/components/ComponentBlocks/Vehicles/VehicleRequestPage"
  )
);

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🚗 Extract required query param
  const vehicle = searchParams.get("vehicle");

  // 🔒 User validation hook
  const { loading, isValidated, checkValidation } = useUserValidation();

  useEffect(() => {
    // 🧱 Defensive check: if vehicle param is missing, redirect and toast
    if (!vehicle) {
      toast.error("Invalid or missing vehicle information.");
      router.replace("/vehicles");
    }

    // ✅ Start validation
    checkValidation();
  }, []);

  // ⏳ Still validating
  if (loading || isValidated === null) {
    return <Loading />;
  }

  // 🚫 User is not authorized
  if (!isValidated) {
    return <UnvalidatedPage />;
  }

  // 🚀 All checks passed: render page
  if (isValidated && vehicle) {
    return (
      <Suspense fallback={<Loading />}>
        <VehicleRequestPage vehicleVin={vehicle} />
      </Suspense>
    );
  }

  // 🛑 Extra fallback (just in case)
  return null;
}
