'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useMember() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      // 1. CHECK EVERYWHERE
      // We check for the cookie AND the local storage.
      // If EITHER exists, we grant access.
      const hasCookie = document.cookie.includes('interval_session');
      const localStatus = localStorage.getItem('interval_membership_status');
      const storedEmail = localStorage.getItem('interval_user_email');
      
      const isMember = hasCookie || localStatus === 'active';

      // 2. UPDATE STATE
      setIsAuthenticated(isMember);
      setEmail(storedEmail || 'member@theinterval.com');
      setIsLoading(false);
    };

    checkAuth();
    
    // Check again every second (Polling) to ensure state never gets stale
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---

  const logout = () => {
    // Nuke everything
    localStorage.clear();
    document.cookie = "interval_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setIsAuthenticated(false);
    router.push('/');
    router.refresh(); // Hard refresh to clear server caches
  };

  const openBilling = () => {
     // Replace with your actual store URL if different
    window.open('https://theinterval.lemonsqueezy.com/billing', '_blank');
  };

  return { 
    isAuthenticated, 
    isActive: isAuthenticated, // Alias
    isLoading, 
    email,
    logout,
    openBilling,
    openSubscriptions: openBilling
  };
}