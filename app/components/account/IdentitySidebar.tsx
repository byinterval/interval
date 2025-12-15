'use client';
import { useMember } from '@/app/hooks/useMember';

export default function IdentitySidebar() {
  const { email, logout, openBilling, openSubscriptions } = useMember();

  return (
    <aside className="w-full md:w-[28%] md:h-screen md:sticky md:top-0 border-r border-accent-brown/10 p-6 md:p-12 flex flex-col bg-primary-bg">
      
      {/* 1. Member Profile */}
      <div className="mb-12">
        <h1 className="font-serif-title text-2xl text-brand-ink mb-2 truncate">
          {email || "Guest"}
        </h1>
        <div className="flex items-center space-x-3 mb-1">
          <span className="inline-block border border-accent-brown/30 rounded-full px-3 py-1 font-sans-body text-[10px] uppercase tracking-widest text-accent-brown">
            Member
          </span>
        </div>
        <p className="font-sans-body text-[10px] text-accent-brown/50 uppercase tracking-widest mt-2">
          The Private Study
        </p>
      </div>

      {/* 2. Admin Navigation */}
      <nav className="space-y-1">
        <button 
          onClick={openBilling}
          className="block w-full text-left py-3 border-b border-accent-brown/10 font-sans-body text-xs uppercase tracking-wider text-brand-ink/80 hover:text-accent-brown hover:pl-2 transition-all"
        >
          Billing & Invoices
        </button>
        <button 
          onClick={openSubscriptions}
          className="block w-full text-left py-3 border-b border-accent-brown/10 font-sans-body text-xs uppercase tracking-wider text-brand-ink/80 hover:text-accent-brown hover:pl-2 transition-all"
        >
          Membership Plan
        </button>
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-12">
        <button 
          onClick={logout}
          className="font-sans-body text-[10px] uppercase tracking-widest text-accent-brown/50 hover:text-red-800 transition-colors"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}