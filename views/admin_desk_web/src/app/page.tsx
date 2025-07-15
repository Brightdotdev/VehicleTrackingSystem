"use client"

import Loading from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
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
  const { isAuthenticated, authLoading } = useAuth();
  const searchParams = useSearchParams();
  const redirected = searchParams.get("redirected");

  useEffect(() => {
    if (redirected === "already-logged-in") {
      toast.error(`You're already logged`);
    }
  }, [redirected]);

  // Handle auth state
  if (authLoading && !isAuthenticated) return <>Validating...</>;

  if (!isAuthenticated) return <AdminWelcomePage />;
  if (isAuthenticated) return <AdminHomePage />;
}
