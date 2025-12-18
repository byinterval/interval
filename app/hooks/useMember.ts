'use client';
import { useState, useEffect } from 'react';

export function useMember() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // 1. Check the LocalStorage flag we set on the Welcome Page
      const localStatus = localStorage.getItem('interval_membership_status');
      
      // 2. If it says 'active', we are logged in!
      setIsAuthenticated(localStatus === 'active');
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
    login: () => {} // Placeholder
  };
}