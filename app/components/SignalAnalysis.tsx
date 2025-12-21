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
  
  // HELPER: Robust URL Resolver with Debugging
  const resolveImageUrl = (item: any) => {
    try {
      if (!item) return null;
      // 1. Is it already a string URL?
      if (typeof item === 'string') return item;
      // 2. Is it a standard Sanity Image object?
      if (item.asset) return urlFor(item).width(1200).url();
      // 3. Is it a simple object with a 'url' property?
      if (item.url) return item.url;
      
      return null;
    } catch (e) {
      console.error("Image Resolve Error:", e);
      return null;
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-primary-bg min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        
        <span className="font-sans-body text-[10px] text-accent-brown uppercase tracking-[0.2em] mb-16 block opacity-50">
          II. The Signal
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* TEXT */}
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
          </div>

          {/* IMAGES */}
          <div className="relative flex flex-col gap-8">
             {/* HEADER TO CONFIRM SECTION EXISTS */}
             <div className="p-2 bg-blue-50 text-blue-800 text-xs font-mono border border-blue-200">
                DEBUG: Image Count = {images ? images.length : '0'}
             </div>

             {images && images.length > 0 ? (
               images.map((rawItem, index) => {
                 const src = resolveImageUrl(rawItem);
                 
                 // RENDER ITEM (Even if broken)
                 return (
                   <div key={index} className="w-full mb-8">
                     {src ? (
                        // CASE A: WORKING IMAGE
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="w-full bg-gray-100 shadow-xl"
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
                     ) : (
                        // CASE B: BROKEN DATA (The "Loud" Error)
                        <div className="w-full p-4 bg-red-100 border border-red-400 text-red-900 rounded">
                           <p className="font-bold text-xs uppercase mb-2">Image {index + 1} Failed</p>
                           <p className="text-[10px] mb-1">We found an item, but could not get a URL.</p>
                           <pre className="text-[9px] overflow-auto bg-white/50 p-2 mt-2">
                             {JSON.stringify(rawItem, null, 2)}
                           </pre>
                        </div>
                     )}
                   </div>
                 );
               })
             ) : (
               // CASE C: EMPTY LIST
               <div className="w-full aspect-[4/5] bg-accent-brown/5 border border-accent-brown/10 flex items-center justify-center">
                 <span className="font-sans-body text-[10px] uppercase tracking-widest text-accent-brown/40">
                   Visuals List Is Empty
                 </span>
               </div>
             )}
          </div>

        </div>
      </div>
    </section>
  );
}