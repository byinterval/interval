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
      const hasCookie = document.cookie.includes('interval_session');
      const localStatus = localStorage.getItem('interval_membership_status');
      const storedEmail = localStorage.getItem('interval_user_email');
      
      // If EITHER exists, we grant access.
      const isMember = hasCookie || localStatus === 'active';

      // 2. UPDATE STATE
      setIsAuthenticated(isMember);
      setEmail(storedEmail || 'member@theinterval.com');
      setIsLoading(false);
    };

    checkAuth();
    
    // Polling to keep state fresh
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---

  const logout = () => {
    localStorage.clear();
    document.cookie = "interval_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setIsAuthenticated(false);
    router.push('/');
    router.refresh(); 
  };

  const openBilling = () => {
    window.open('https://theinterval.lemonsqueezy.com/billing', '_blank');
  };

  // THE MISSING PIECE
  const login = () => {
    router.push('/signup');
  };

  return { 
    isAuthenticated, 
    isActive: isAuthenticated, 
    isLoading, 
    email,
    login, // <--- Added back to fix the error
    logout,
    openBilling,
    openSubscriptions: openBilling
  };
}