'use client';
import { motion } from 'framer-motion';
import { urlFor } from '@/lib/image';

interface Tag {
  label: string;
  value: string;
}

interface SignalAnalysisProps {
  studioName: string;
  context: string;
  method: string;
  images: any[]; 
  tags: Tag[];
}

export default function SignalAnalysis({ 
  studioName = "Unknown Studio", 
  context, 
  method, 
  images = [], 
  tags = [] 
}: SignalAnalysisProps) {
  
  // HELPER: Try to find an image source no matter how deep it is nested
  const resolveImageUrl = (item: any) => {
    try {
      if (!item) return null;
      // 1. Direct Image Object
      if (item.asset) return urlFor(item).width(1200).url();
      // 2. Nested "Image" Property
      if (item.image?.asset) return urlFor(item.image).width(1200).url();
      // 3. Nested "Photo" Property
      if (item.photo?.asset) return urlFor(item.photo).width(1200).url();
      // 4. Already a URL string?
      if (typeof item === 'string') return item;
    } catch (e) {
      return null;
    }
    return null;
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-primary-bg min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        
        <span className="font-sans-body text-[10px] text-accent-brown uppercase tracking-[0.2em] mb-16 block opacity-50">
          II. The Signal
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* TEXT COLUMN */}
          <div className="flex flex-col space-y-12">
             <div>
               <h2 className="font-serif-title text-4xl md:text-5xl text-brand-ink mb-4">
                 {studioName}
               </h2>
               <div className="flex flex-wrap gap-3">
                 {tags.map((tag, i) => (
                   <span key={i} className="inline-block px-3 py-1 border border-accent-brown/20 rounded-full font-sans-body text-[9px] uppercase tracking-widest text-accent-brown">
                     {tag.value}
                   </span>
                 ))}
               </div>
            </div>

            <div className="group">
               <span className="font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown/60 block mb-4">Context</span>
               <p className="font-serif-title text-xl md:text-2xl leading-relaxed text-brand-ink opacity-90">{context}</p>
            </div>

            <div className="group">
               <span className="font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown/60 block mb-4">Method</span>
               <p className="font-serif-title text-xl md:text-2xl leading-relaxed text-brand-ink opacity-90">{method}</p>
            </div>
            
            {/* DEBUG: If images are missing, this text will appear to tell us why */}
            {(!images || images.length === 0) && (
               <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-mono">
                  DEBUG: No 'signalImages' or 'images' found in data.
               </div>
            )}
          </div>

          {/* IMAGE COLUMN */}
          <div className="relative">
             {images && images.length > 0 ? (
               <div className="grid grid-cols-1 gap-8">
                 {images.map((rawItem, index) => {
                   
                   const src = resolveImageUrl(rawItem);
                   if (!src) return null; // Skip items we can't resolve

                   return (
                     <motion.div
                       key={index}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.8, delay: index * 0.2 }}
                       viewport={{ once: true }}
                       className="w-full bg-gray-100 overflow-hidden shadow-xl"
                     >
                       <img 
                         src={src} 
                         alt={`Signal detail ${index + 1}`}
                         className="w-full h-auto object-cover block"
                       />
                       <div className="p-3 bg-white border-t border-gray-100">
                          <span className="font-sans-body text-[9px] uppercase tracking-widest text-gray-400">
                             Fig. {index + 1}
                          </span>
                       </div>
                     </motion.div>
                   );
                 })}
               </div>
             ) : (
               <div className="w-full aspect-[4/5] bg-accent-brown/5 border border-accent-brown/10 flex items-center justify-center">
                 <span className="font-sans-body text-[10px] uppercase tracking-widest text-accent-brown/40">
                   Visuals Pending
                 </span>
               </div>
             )}
          </div>

        </div>
      </div>
    </section>
  );
}