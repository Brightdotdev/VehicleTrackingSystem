"use client";

import Loading from '@/components/ui/Loading';
import dynamic from 'next/dynamic';
import { useUserValidation } from '@/hooks/useUserValidation';
import React, { useEffect, useState } from 'react';

// Lazy load your pages for performance
const AdminHomePage = dynamic(() => import('@/components/ComponentBlocks/AdminHomePage'), {
  loading: () => <Loading />,
  ssr: false,
});

const AdminWelcomePage = dynamic(() => import('@/components/ComponentBlocks/AdminWelcomePage'), {
  loading: () => <Loading />,
  ssr: false,
});

export default function Page() {
  const { isValidated, loading, checkValidation, adminDetails } = useUserValidation();

  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const runValidation = async () => {
      await checkValidation();
      setInitialCheckDone(true);
    };

    runValidation();
  }, []);

  
  if (!initialCheckDone || loading) return <Loading />;

  
  const missingDetails =
    !adminDetails?.username || !adminDetails.licence || !adminDetails.licenceExp;

  if (missingDetails) return <AdminWelcomePage />;

  return isValidated ? <AdminHomePage /> : <AdminWelcomePage />;
}
