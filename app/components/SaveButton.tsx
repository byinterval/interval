'use client';
import { useState } from 'react';

// Mock hook - replace with actual Memberful auth logic later
const useMember = () => {
  return { id: "test-user-123", isAuthenticated: true }; // Placeholder
};

export default function SaveButton({ itemId }: { itemId?: string }) {
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const member = useMember();

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!member.isAuthenticated || !itemId) {
        alert("Please log in to save items."); // Or open login modal
        return;
    }

    setIsLoading(true);
    
    // Optimistic UI update
    setSaved(!saved);

    try {
      const res = await fetch('/api/save-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.id,
          itemId: itemId,
          action: saved ? 'unsave' : 'save'
        })
      });

      if (!res.ok) throw new Error('Failed to save');
      
    } catch (error) {
      console.error(error);
      setSaved(saved); // Revert on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleSave}
      disabled={isLoading}
      className="absolute top-4 right-4 z-30 p-2 rounded-full transition-all duration-300 group/btn"
      aria-label={saved ? "Remove from Atlas" : "Save to Atlas"}
    >
      {saved ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent-brown drop-shadow-sm">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-bg mix-blend-difference opacity-70 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      )}
    </button>
  );
}