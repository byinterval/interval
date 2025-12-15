'use client';
import Image from 'next/image';
import SaveButton from './SaveButton'; 
import { useMember } from '@/app/hooks/useMember'; // Import Auth

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
  const isLocked = !isAuthenticated;

  return (
    <div className="relative group w-full break-inside-avoid mb-6" onClick={isLocked ? login : undefined}>
      <div className={`relative w-full overflow-hidden bg-secondary-bg ${heightClass} cursor-pointer`}>
        
        {/* Visual Evidence - Always Visible */}
        <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-[800ms] ease-out">
            {image && (
              <Image 
                src={image} 
                alt={isLocked ? "Locked Signal" : `Visual evidence for ${studio}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            <div className="absolute inset-0 bg-brand-ink/10 mix-blend-multiply" />
        </div>

        {/* Save Action - Members Only */}
        {!isLocked && <SaveButton itemId={id} />}

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-brand-ink/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-10 flex flex-col justify-end p-6">
            
            {/* LOCKED STATE TOOLTIP */}
            {isLocked ? (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[#1A1A1A] text-[#FDFBF7] px-4 py-2 text-[10px] uppercase tracking-widest shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                     Member Access Required
                  </div>
               </div>
            ) : (
               /* UNLOCKED CONTENT */
               <div className="absolute bottom-0 left-0 w-full p-6 text-primary-bg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  <span className="inline-block font-sans-body text-[10px] uppercase tracking-[0.2em] mb-2 border-b border-primary-bg/30 pb-1">
                      {mood}
                  </span>
                  <h3 className="font-serif-title text-2xl leading-tight mb-1">
                      {studio}
                  </h3>
                  <p className="font-sans-body text-xs opacity-90 line-clamp-2">
                      {title}
                  </p>
               </div>
            )}
        </div>
      </div>
    </div>
  );
}