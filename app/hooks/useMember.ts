import { useState, useEffect } from 'react';

// EXTENDED INTERFACE
interface Member {
  id: string;
  email?: string;
  isActive: boolean;
  role: 'member' | 'guest' | 'public'; // New Role Logic
}

export function useMember() {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check for Memberful (Active Member)
    const memberfulCookie = document.cookie.includes('memberful_session');
    
    // 2. Check for Guest Session (Hospitality)
    const guestCookie = document.cookie.includes('interval_guest_session');

    if (memberfulCookie) {
      setMember({
        id: "member-id", 
        email: "member@theinterval.com",
        isActive: true,
        role: 'member'
      });
    } else if (guestCookie) {
      setMember({
        id: "guest-session",
        isActive: true,
        role: 'guest' // B2B Access
      });
    }

    setIsLoading(false);
  }, []);

  const safeMemberfulAction = (action: (m: any) => void) => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.Memberful) {
      // @ts-ignore
      action(window.Memberful);
    }
  };

  return {
    id: member?.id,
    isAuthenticated: !!member,
    role: member?.role || 'public',
    email: member?.email,
    isLoading,
    isActive: member?.isActive,
    
    login: () => window.location.href = "/login", // Redirect to our custom page now
    logout: () => {
      // Clear Guest Cookie
      document.cookie = "interval_guest_session=; path=/; max-age=0";
      safeMemberfulAction((m) => m.signout());
      window.location.href = "/";
    },
    openBilling: () => safeMemberfulAction((m) => m.openUpdateCard()),
    openSubscriptions: () => safeMemberfulAction((m) => m.openSubscriptions()),
  };
}