'use client';
import { urlFor } from '@/lib/image';
import Image from 'next/image';
import SaveButton from './SaveButton'; 
import { useMember } from '@/app/hooks/useMember'; // Import auth hook

interface ArtifactProps {
  id?: string;
  title: string;
  link: string;
  image?: any;
  category?: string;
  description?: string; 
}

export default function ArtifactButton({ id, link, title, image, category = "Ritual Object", description }: ArtifactProps) {
  const { isAuthenticated } = useMember(); // Check auth status
  // Generate URL if image object exists
  const imageUrl = image ? urlFor(image).width(600).url() : null;

  // Determine if content should be locked (Public View)
  const isLocked = !isAuthenticated;

  return (
    <div className="group block w-full h-full relative">
      {id && isAuthenticated && <SaveButton itemId={id} />}
      
      <a 
        href={isLocked ? "/signup" : link} // Redirect to signup if locked
        target={isLocked ? "_self" : "_blank"}
        rel="noopener noreferrer"
        // FIX: Force white background and dark text to prevent Dark Mode inversion issues
        className="flex flex-col h-full bg-[#FFFFFF] border border-[#E5E5E5] transition-all duration-500 hover:shadow-xl hover:border-[#5D514C]/20 relative"
      >
        
        {/* 1. Visual: High-Fidelity Product Shot */}
        <div className="relative w-full aspect-[4/5] bg-[#F2F2F2] overflow-hidden flex items-center justify-center p-8 group/image">
          {imageUrl ? (
            <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
               <Image 
                 src={imageUrl} 
                 alt={title}
                 fill
                 className="object-contain drop-shadow-lg" 
               />
            </div>
          ) : (
            <div className="text-[#5D514C]/30 font-serif-title italic text-center px-4">
              [Totemic Object]
            </div>
          )}

          {/* HOVER TOOLTIP FOR LOCKED STATE */}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
               <div className="bg-[#1A1A1A] text-[#FDFBF7] px-4 py-2 text-[10px] uppercase tracking-widest shadow-lg transform translate-y-2 group-hover/image:translate-y-0 transition-transform">
                 Member Access Required
               </div>
            </div>
          )}
        </div>

        {/* 2. Text Content (Museum Placard Style) */}
        <div className="p-6 flex flex-col flex-grow text-center relative overflow-hidden">
          
          {/* Label */}
          <span className="block font-sans-body text-[10px] uppercase tracking-[0.2em] text-[#5D514C] mb-3">
            {category}
          </span>

          {/* Title - Redacted if Locked */}
          <h4 className={`font-serif-title text-xl text-[#1A1A1A] mb-3 leading-tight transition-colors line-clamp-2 ${isLocked ? 'blur-[4px] select-none opacity-60' : 'group-hover:text-[#5D514C]'}`}>
            {isLocked ? "Redacted Artifact Title" : title}
          </h4>

          {/* Description - Redacted if Locked */}
          <p className={`font-sans-body text-[11px] text-[#1A1A1A]/60 mb-6 leading-relaxed line-clamp-3 px-2 ${isLocked ? 'blur-[4px] select-none opacity-40' : ''}`}>
            {isLocked ? "This description is reserved for members only. It contains the provenance and context." : (description || "A souvenir of meaning.")}
          </p>

          {/* 3. The Button (Discreet Action) */}
          <div className="mt-auto pt-4 border-t border-[#E5E5E5] flex justify-center">
            {isLocked ? (
               <div className="flex items-center space-x-2 text-xs font-sans-body uppercase tracking-wider text-[#5D514C]/50">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                   <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                 </svg>
                 <span>Members Only</span>
               </div>
            ) : (
              <div className="flex items-center space-x-2 text-xs font-sans-body uppercase tracking-wider text-[#1A1A1A] border-b border-transparent group-hover:border-[#5D514C] group-hover:text-[#5D514C] transition-all pb-0.5">
                <span>Acquire the Artifact</span>
                <span>→</span>
              </div>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}