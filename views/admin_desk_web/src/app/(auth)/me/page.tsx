"use client";

import UnvalidatedPage from "@/components/utils/UnvalidatedPage";
import { useUserValidation } from "@/hooks/useUserValidation";
import { UserPageData } from "@/types/authTypes";
import { lazy, Suspense, useEffect, useState } from "react";

// Lazy load the dashboard component
const UserDashboard = lazy(() => import('@/components/ui/UserDashboard'));

export default function Page() {
  const { returnMyData } = useUserValidation();

  const [userData, setUserData] = useState<UserPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalidUserData, setInvalidUserData] = useState(false);

  useEffect(() => {
    const handleUserData = async () => {
      try {
        const user = await returnMyData();

        // 🛑 Early exit if failed to fetch
        if (!user) {
          setUserData(null);
          return;
        }

        // ✅ Save fetched user
        setUserData(user);

        // 🚫 Check for missing critical fields
        if (!user.username || !user.licence || !user.licenceExp) {
          setInvalidUserData(true);
        }
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
  if (!userData) {
    return <UnvalidatedPage />;
  }

  // ❌ User exists but has broken/missing fields (optional)
  if (invalidUserData) {
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
      <UserDashboard userData={userData} />
    </Suspense>
  );
}
