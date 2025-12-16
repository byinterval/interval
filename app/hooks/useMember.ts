import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import this to listen for page changes

interface Member {
  id: string;
  email: string;
  isActive: boolean;
  role: 'member' | 'guest' | 'public';
}

export function useMember() {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname(); // This triggers a re-render on navigation

  const checkAuth = () => {
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
        email: "guest@partner.com",
        isActive: true,
        role: 'guest'
      });
    } else {
      setMember(null);
    }
    setIsLoading(false);
  };

  // Re-run auth check whenever the path changes (e.g. redirect from /login -> /atlas)
  useEffect(() => {
    checkAuth();
  }, [pathname]);

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
    
    login: () => window.location.href = "/login",
    logout: () => {
      // Clear Guest Cookie
      document.cookie = "interval_guest_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      safeMemberfulAction((m) => m.signout());
      window.location.href = "/";
    },
    openBilling: () => safeMemberfulAction((m) => m.openUpdateCard()),
    openSubscriptions: () => safeMemberfulAction((m) => m.openSubscriptions()),
  };
}