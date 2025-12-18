'use client';
import { useState, useEffect } from 'react';

export function useMember() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // NEW: State to hold the user ID
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      // 1. Check the LocalStorage flags
      const localStatus = localStorage.getItem('interval_membership_status');
      const userId = localStorage.getItem('interval_user_id'); // We will look for this
      
      // 2. Update State
      setIsAuthenticated(localStatus === 'active');
      setId(userId);
      setIsLoading(false);
    };

    // Run immediately on mount
    checkAuth();

    // Listen for updates (in case we log in/out in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return { 
    isAuthenticated, 
    isLoading, 
    id, // <--- This was the missing property causing the build error
    login: () => {} 
  };
}