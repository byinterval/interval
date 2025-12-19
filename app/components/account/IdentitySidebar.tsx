'use client';
import { useMember } from '@/app/hooks/useMember';

export default function IdentitySidebar() {
  const { email, logout, openBilling, isLoading } = useMember();

  if (isLoading) return null;

  return (
    <aside className="w-full md:w-[28%] md:h-screen md:sticky md:top-0 border-r border-accent-brown/10 p-8 flex flex-col justify-between bg-primary-bg">
      
      {/* TOP SECTION: Identity */}
      <div>
        <div className="mb-12">
            <span className="font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown/60 block mb-4">
                Identity
            </span>
            <div className="w-16 h-16 bg-[#E5E5E5] rounded-full mb-6 overflow-hidden">
                {/* Placeholder Avatar */}
                <div className="w-full h-full flex items-center justify-center text-accent-brown/20 font-serif-title italic text-xl">
                    {email ? email[0].toUpperCase() : 'M'}
                </div>
            </div>
            <h2 className="font-serif-title text-2xl text-brand-ink mb-1">
                Founding Member
            </h2>
            <p className="font-sans-body text-xs text-brand-ink/50">
                {email || 'Loading...'}
            </p>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-6">
            <div className="opacity-50 cursor-not-allowed group">
                <span className="font-sans-body text-xs uppercase tracking-widest text-brand-ink block mb-1">
                    My Collection
                </span>
                <span className="text-[10px] text-accent-brown/60 italic">Coming Soon</span>
            </div>
            
             <div className="opacity-50 cursor-not-allowed group">
                <span className="font-sans-body text-xs uppercase tracking-widest text-brand-ink block mb-1">
                    Ritual History
                </span>
                <span className="text-[10px] text-accent-brown/60 italic">Coming Soon</span>
            </div>
        </nav>
      </div>

      {/* BOTTOM SECTION: Management */}
      <div className="pt-12 border-t border-accent-brown/10 space-y-4">
        
        {/* BILLING BUTTON */}
        <button 
            onClick={openBilling}
            className="w-full text-left group"
        >
            <span className="font-sans-body text-xs uppercase tracking-widest text-brand-ink group-hover:text-accent-brown transition-colors">
                Manage Subscription
            </span>
            <span className="block text-[9px] text-brand-ink/40 mt-1">
                Update payment, view invoices
            </span>
        </button>

        {/* LOGOUT BUTTON */}
        <button 
            onClick={logout}
            className="w-full text-left pt-4"
        >
             <span className="font-sans-body text-xs uppercase tracking-widest text-red-900/40 hover:text-red-900 transition-colors">
                Sign Out
            </span>
        </button>

      </div>
    </aside>
  );
}