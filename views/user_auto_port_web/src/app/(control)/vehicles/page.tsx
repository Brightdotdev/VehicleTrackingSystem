"use client";
import { useEffect, lazy, Suspense } from "react";

import Loading from "@/components/ui/Loading";
import UnvalidatedPage from "@/components/utils/UnvalidatedPage";
import { useUserValidation } from "@/hooks/useUserValidation";

// Lazy load the protected component
const VehiclePageComponent = lazy(() =>
  import("@/components/ComponentBlocks/Vehicles/VehiclePageComponent")
);

export default function Page() {
  const { loading, isValidated, checkValidation } = useUserValidation();

  // 🔒 Kick off validation on page load
  useEffect(() => {
    checkValidation();
  }, []);

  // ⏳ Still checking user
  if (loading || isValidated === null) {
    return <Loading />;
  }

  // ❌ User is not validated
  if (!isValidated) {
    return <UnvalidatedPage />;
  }

  // ✅ User is validated, load the vehicle dashboard
  return (
    <Suspense fallback={<Loading />}>
      <VehiclePageComponent />
    </Suspense>
  );
}
