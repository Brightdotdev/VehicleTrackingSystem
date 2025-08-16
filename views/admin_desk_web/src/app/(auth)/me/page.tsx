"use client";


import UnvalidatedPage from "@/components/UnvalidatedPage";
import { useUserValidation } from "@/hooks/useUserValidation";
import { AdminDetails } from "@/types/authTypes";
import { lazy, Suspense, useEffect, useState } from "react";

// Lazy load the dashboard component
const UserDashboard = lazy(() => import('@/components/ui/UserDashboard'));

export default function Page() {
  const { adminDetails, checkValidation } = useUserValidation();

  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const handleUserData = async () => {
      try {
       await checkValidation();

      
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    handleUserData();
  }, []);

  // ⏳ Block rendering while loading
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  // ❌ Show unvalidated if not logged in
  if (!adminDetails) {
    return <UnvalidatedPage />;
  }

  // ❌ User exists but has broken/missing fields (optional)
  if (adminDetails.email === null || adminDetails.licenceExp === null || adminDetails.licenceExp === null ) {
    return <UnvalidatedPage/>;
  }

  // ✅ Render the dashboard with validated userData
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center">
          Loading dashboard...
        </div>
      }
    >
      <UserDashboard userData={adminDetails} />
    </Suspense>
  );
}
