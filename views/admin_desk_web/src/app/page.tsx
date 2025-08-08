"use client"

import Loading from '@/components/ui/Loading';
import UnvalidatedPage from '@/components/UnvalidatedPage';
import { useUserValidation } from '@/hooks/useUserValidation';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';

const AdminHomePage = dynamic(() => import('@/components/ComponentBlocks/AdminHomePage'), {
  loading: () => <Loading />,
  ssr: false,
});

const AdminWelcomePage = dynamic(() => import('@/components/ComponentBlocks/AdminWelcomePage'), {
  loading: () => <Loading />,
  ssr: false,
});

export default function Page() {
  const { isValidated, loading, checkValidation ,adminDetails } = useUserValidation();
 
  

useEffect(() => {
  checkValidation();
}, []);

    
if (loading) return <Loading />;

if (!adminDetails?.username || !adminDetails.licence || !adminDetails.licenceExp) return <UnvalidatedPage />;

return isValidated ? <AdminHomePage /> : <AdminWelcomePage />;

}
