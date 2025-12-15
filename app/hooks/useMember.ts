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
    // Check for Memberful data on the window or cookies
    // Note: Memberful.js handles the overlay, but actual auth state is usually 
    // verified via a server-side cookie/token exchange in a real app.
    // For this frontend-only check, we look for the Memberful cookie or specific query params.
    
    // Simplistic check: If Memberful cookie exists (this is a heuristic)
    const hasCookie = document.cookie.includes('memberful_session');
    
    if (hasCookie) {
      // In a real implementation, you would fetch the actual member data 
      // from your own API endpoint that verifies the Memberful token.
      // For now, we simulate a logged-in user if the cookie is present.
      setMember({
        id: "mock-member-id", // Replace with real ID fetching logic later
        email: "member@example.com",
        isActive: true
      });
    }
    
    setIsLoading(false);
  }, []);

  return {
    id: member?.id,
    isAuthenticated: !!member,
    email: member?.email,
    isLoading,
    isActive: member?.isActive,
    // Helper to trigger login
    login: () => {
        // @ts-ignore
        if (window.Memberful) {
            // @ts-ignore
            window.Memberful.openOverlay();
        } else {
            window.location.href = "https://theinterval.memberful.com/join";
        }
    }
  };
}