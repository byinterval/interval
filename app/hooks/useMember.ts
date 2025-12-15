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
    // Check for Memberful cookie as a proxy for logged-in state
    const hasCookie = document.cookie.includes('memberful_session');
    
    if (hasCookie) {
      setMember({
        id: "current-member-id", 
        // In a real app, you'd fetch the real email from an API endpoint
        email: "member@theinterval.com", 
        isActive: true
      });
    }
    setIsLoading(false);
  }, []);

  // Helper to safely call Memberful window object
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
    login: () => safeMemberfulAction((m) => m.openOverlay()),
    logout: () => {
      safeMemberfulAction((m) => m.signout());
      window.location.href = "/"; // Redirect home after logout
    },
    openBilling: () => safeMemberfulAction((m) => m.openUpdateCard()),
    openSubscriptions: () => safeMemberfulAction((m) => m.openSubscriptions()),
  };
}