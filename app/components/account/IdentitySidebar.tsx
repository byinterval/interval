'use client';

export default function IdentitySidebar() {
  return (
    <aside className="w-full md:w-[28%] md:h-screen md:sticky md:top-0 border-r border-accent-brown/10 p-6 md:p-12 flex flex-col bg-primary-bg">
      
      {/* 1. Member Profile */}
      <div className="mb-12">
        <h1 className="font-serif-title text-3xl text-brand-ink mb-2">
          J. Doe
        </h1>
        <div className="flex items-center space-x-3 mb-1">
          <span className="inline-block border border-accent-brown/30 rounded-full px-3 py-1 font-sans-body text-[10px] uppercase tracking-widest text-accent-brown">
            Founding Member
          </span>
        </div>
        <p className="font-sans-body text-[10px] text-accent-brown/50 uppercase tracking-widest mt-2">
          Member Since 2025
        </p>
      </div>

      {/* 2. Hospitality Key (Conditional) */}
      <div className="mb-12 bg-secondary-bg p-4 border border-accent-brown/5">
        <span className="block font-sans-body text-[9px] uppercase tracking-widest text-accent-brown/70 mb-2">
          Access Provided By
        </span>
        <div className="flex items-center space-x-2">
           <div className="w-2 h-2 bg-brand-ink rounded-full" />
           <span className="font-serif-title text-sm text-brand-ink">Soho House London</span>
        </div>
      </div>

      {/* 3. Admin Navigation */}
      <nav className="space-y-1">
        {['Billing & Invoices', 'Membership Plan', 'Email Preferences'].map((item) => (
          <button key={item} className="block w-full text-left py-3 border-b border-accent-brown/10 font-sans-body text-xs uppercase tracking-wider text-brand-ink/80 hover:text-accent-brown hover:pl-2 transition-all">
            {item}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-12">
        <button className="font-sans-body text-[10px] uppercase tracking-widest text-accent-brown/50 hover:text-red-800 transition-colors">
          Log Out
        </button>
      </div>
    </aside>
  );
}