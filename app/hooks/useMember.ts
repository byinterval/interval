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
      // 1. Read all data from LocalStorage
      const localStatus = localStorage.getItem('interval_membership_status');
      const userId = localStorage.getItem('interval_user_id');
      const userEmail = localStorage.getItem('interval_user_email'); // We'll add this saving logic later if needed
      
      // 2. Update State
      const active = localStatus === 'active';
      setIsAuthenticated(active);
      setId(userId);
      setEmail(userEmail || 'member@example.com'); // Fallback so sidebar doesn't crash
      setIsLoading(false);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // --- ACTIONS ---

  const logout = () => {
    localStorage.removeItem('interval_membership_status');
    localStorage.removeItem('interval_user_id');
    localStorage.removeItem('interval_user_email');
    // Force update other tabs/components
    window.dispatchEvent(new Event('storage'));
    router.push('/'); // Send them home
    setIsAuthenticated(false);
  };

  const openBilling = () => {
    // Placeholder: You can link to LemonSqueezy customer portal here later
    window.open('https://billing.lemonsqueezy.com', '_blank');
  };

  const openSubscriptions = () => {
    // Placeholder
    console.log("Open Subscriptions");
  };

  return { 
    isAuthenticated, 
    isActive: isAuthenticated, // Alias for 'isAuthenticated' that Sidebar uses
    isLoading, 
    id, 
    email,
    login: () => {}, // Placeholder
    logout,
    openBilling,
    openSubscriptions
  };
}