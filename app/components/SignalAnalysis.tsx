'use client';
import Image from 'next/image';
import Link from 'next/link';
import SaveButton from './SaveButton';
import { useMember } from '@/app/hooks/useMember'; // Import the hook

interface SignalAnalysisProps {
  studioName: string;
  context: string;
  method: string;
  tags: { label: string; value: string }[];
  images: string[];
}

export default function SignalAnalysis({ studioName, context, method, tags, images }: SignalAnalysisProps) {
  // 1. Connect to the Auth Brain
  const { isAuthenticated, isLoading } = useMember();

  // 2. Decide if locked (Wait for loading to finish so we don't flicker)
  const isLocked = !isLoading && !isAuthenticated;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-primary-bg border-t border-secondary-bg relative">
      
      {/* --- THE LOCKED OVERLAY --- */}
      {isLocked && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-primary-bg/60 backdrop-blur-xl transition-all duration-1000">
           <div className="text-center space-y-6 p-8 border border-accent-brown/20 bg-[#FDFBF7] shadow-2xl max-w-md">
              <span className="font-sans-body text-xs text-accent-brown uppercase tracking-widest">
                Members Only
              </span>
              <h3 className="font-serif-title text-3xl text-brand-ink">
                This Signal is Encrypted.
              </h3>
              <p className="font-sans-body text-sm text-gray-600">
                Join the Founding Cohort to access the Living Atlas.
              </p>
              <div className="flex flex-col space-y-3 pt-4">
                <Link 
                  href="/signup" 
                  className="bg-[#1A1A1A] text-[#FDFBF7] px-8 py-3 font-mono text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  Acquire Membership
                </Link>
                <Link href="/login" className="text-xs text-gray-500 hover:text-black border-b border-transparent hover:border-gray-300 self-center">
                  Member Login
                </Link>
              </div>
           </div>
        </div>
      )}

      {/* LEFT COLUMN (IMAGES) */}
      <div className={`relative md:sticky md:top-0 h-auto md:h-screen overflow-y-auto no-scrollbar bg-secondary-bg transition-all duration-1000 ${isLocked ? 'blur-sm grayscale' : ''}`}>
        <div className="flex flex-col">
          {images.map((img, i) => (
            <div key={i} className="relative w-full aspect-[4/5] md:aspect-auto md:h-screen group">
              {/* Use a placeholder if image is missing to prevent crash */}
              <Image 
                src={img || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000'} 
                alt={`Detail ${i}`} 
                fill 
                className="object-cover" 
              />
              {!isLocked && <SaveButton />}
              <div className="absolute bottom-4 left-4 text-primary-bg/80 font-sans-body text-[10px] uppercase tracking-widest drop-shadow-sm">
                Fig. {i + 1} — Evidence
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN (TEXT) */}
      <div className={`flex items-center justify-center p-8 md:p-24 bg-primary-bg transition-all duration-1000 ${isLocked ? 'blur-sm opacity-50 select-none pointer-events-none' : ''}`}>
        <div className="max-w-md space-y-12">
          <div className="space-y-4">
             <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] block">
               II. The Signal
             </span>
             <h2 className="font-serif-title text-4xl md:text-5xl text-brand-ink leading-tight">
               {studioName}
             </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 border border-accent-brown/20 rounded-full font-sans-body text-[10px] uppercase tracking-wide text-accent-brown">
                {tag.label}: {tag.value}
              </span>
            ))}
          </div>
          <div className="space-y-8 font-serif-title text-lg leading-relaxed text-brand-ink/80">
            <div>
                <strong className="block font-sans-body text-xs uppercase tracking-wider text-accent-brown mb-2">The Context</strong>
                <p>{context}</p>
            </div>
            <div>
                <strong className="block font-sans-body text-xs uppercase tracking-wider text-accent-brown mb-2">The Method</strong>
                <p>{method}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}