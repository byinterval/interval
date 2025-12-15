'use client';
import SanityImage from './SanityImage'; 
import SaveButton from './SaveButton'; 
import { useMember } from '@/app/hooks/useMember'; // Auth Hook

interface SignalProps {
  id: string; 
  title: string;
  studio: string;
  mood: string;
  image: string;
  heightClass?: string;
}

export default function SignalCard({ 
  id, 
  title, 
  studio, 
  mood, 
  image, 
  heightClass = "aspect-[3/4]" 
}: SignalProps) {
  const { isAuthenticated, login } = useMember();

  return (
    <div className="relative group w-full break-inside-avoid mb-6" onClick={!isAuthenticated ? login : undefined}>
      <div className={`relative w-full overflow-hidden bg-secondary-bg ${heightClass} cursor-pointer`}>
        
        {/* Visual Evidence (Always Visible - The Hook) */}
        <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-[800ms] ease-out">
            <SanityImage 
              src={image} 
              alt={`Visual evidence for ${studio}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-brand-ink/10 mix-blend-multiply" />
        </div>

        {/* Save Action (Only for Members) */}
        {isAuthenticated && <SaveButton itemId={id} />}

        {/* Scrim Overlay */}
        <div className={`absolute inset-0 bg-brand-ink/50 transition-opacity duration-500 ease-out z-10 flex flex-col justify-end p-6 
          ${isAuthenticated ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100 cursor-lock'}`}>
            
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                
                {/* Metadata */}
                <span className="inline-block font-sans-body text-[10px] uppercase tracking-[0.2em] mb-2 border-b border-primary-bg/30 pb-1 text-primary-bg">
                    {mood}
                </span>
                
                {/* Title (Redacted for Non-Members) */}
                <h3 className={`font-serif-title text-2xl leading-tight mb-1 text-primary-bg ${!isAuthenticated ? 'blur-[6px] select-none opacity-80' : ''}`}>
                    {studio}
                </h3>
                
                {/* Description (Redacted for Non-Members) */}
                <p className={`font-sans-body text-xs opacity-90 line-clamp-2 text-primary-bg ${!isAuthenticated ? 'blur-[4px] select-none mt-2' : ''}`}>
                    {title}
                </p>

                {/* Lock Indicator */}
                {!isAuthenticated && (
                  <div className="absolute bottom-6 right-6 text-primary-bg flex items-center space-x-2">
                    <span className="text-[9px] uppercase tracking-widest opacity-80">Member Access</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}