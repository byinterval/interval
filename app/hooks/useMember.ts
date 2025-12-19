'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useMember() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      // 1. Read data from cookies (simulating a session check)
      // In a real app, you might verify the cookie with an API call here.
      // For now, we check if the cookie exists to update UI state.
      const hasCookie = document.cookie.includes('interval_session=true');
      
      const userId = localStorage.getItem('interval_user_id');
      const userEmail = localStorage.getItem('interval_user_email');
      
      setIsAuthenticated(hasCookie);
      setId(userId);
      setEmail(userEmail || 'member@theinterval.com');
      setIsLoading(false);
    };

    checkAuth();
    // Listen for storage changes in case other tabs update
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // --- ACTIONS ---

  const logout = () => {
    // 1. Clear Local Storage
    localStorage.removeItem('interval_user_id');
    localStorage.removeItem('interval_user_email');
    
    // 2. Clear Cookie (By setting it to expire in the past)
    document.cookie = "interval_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    // 3. Force UI Update
    window.dispatchEvent(new Event('storage'));
    setIsAuthenticated(false);
    
    // 4. Redirect Home
    router.push('/'); 
  };

  const openBilling = () => {
    // THE CUSTOMER PORTAL
    // Replace 'theinterval' with your actual Lemon Squeezy store subdomain if different.
    // This URL allows users to manage their own subscriptions safely.
    window.open('https://theinterval.lemonsqueezy.com/billing', '_blank');
  };

  const openSubscriptions = () => {
    // Currently, billing and subscriptions are the same portal
    openBilling();
  };

  return { 
    isAuthenticated, 
    isActive: isAuthenticated, 
    isLoading, 
    id, 
    email,
    login: () => {}, 
    logout,
    openBilling,
    openSubscriptions
  };
}