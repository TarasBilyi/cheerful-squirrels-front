'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

interface RequireGuestProps {
  children: React.ReactNode;
}

const RequireGuest = ({ children }: RequireGuestProps) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isInitializing = useAuthStore(state => state.isInitializing);

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace('/profile');
    }
  }, [isInitializing, isAuthenticated, router]);

  if (isInitializing || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default RequireGuest;
