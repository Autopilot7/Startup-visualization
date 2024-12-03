'use client';

import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const useProtectedRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to access this page.');
      router.push('/login');
    }
  }, [isAuthenticated, router]);
};

export default useProtectedRoute;
