import { useState, useEffect } from 'react';

interface Member {
  id: string;
  email: string;
  isActive: boolean;
}

export function useMember() {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasCookie = document.cookie.includes('memberful_session');
    
    if (hasCookie) {
      setMember({
        id: "current-member-id", 
        email: "member@theinterval.com", 
        isActive: true
      });
    }
    setIsLoading(false);
  }, []);

  const safeMemberfulAction = (action: (m: any) => void) => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.Memberful) {
      // @ts-ignore
      action(window.Memberful);
    } else {
      console.warn("Memberful script not loaded");
    }
  };

  return {
    id: member?.id,
    isAuthenticated: !!member,
    email: member?.email,
    isLoading,
    isActive: member?.isActive,
    
    // Actions
    login: () => window.location.href = "/login", // Redirect to custom login page
    logout: () => {
      safeMemberfulAction((m) => m.signout());
      window.location.href = "/"; 
    },
    openBilling: () => safeMemberfulAction((m) => m.openUpdateCard()),
    openSubscriptions: () => safeMemberfulAction((m) => m.openSubscriptions()),
  };
}