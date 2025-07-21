"use client"

import Loading from '@/components/ui/Loading';
import { useUserValidation } from '@/hooks/useUserValidation';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

const AdminHomePage = dynamic(() => import('@/components/ComponentBlocks/AdminHomePage'), {
  loading: () => <Loading />,
  ssr: false,
});

const AdminWelcomePage = dynamic(() => import('@/components/ComponentBlocks/AdminWelcomePage'), {
  loading: () => <Loading />,
  ssr: false,
});

export default function Page() {
  const { isValidated, loading, checkValidation } = useUserValidation();
  const searchParams = useSearchParams();
  const redirected = searchParams.get("redirected");

  useEffect(() => {
      checkValidation();
    console.log(isValidated)

    console.log(loading)
    if (redirected === "already-logged-in") {
      toast.error(`You're already logged in`);
    }
  }, [redirected]);

  // Handle auth state
  if (loading && isValidated == null) return <>Validating...</>;
  
  if (!isValidated) return <AdminWelcomePage />;
  if (isValidated) return <AdminHomePage />;
}
