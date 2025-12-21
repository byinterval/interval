'use client';
import { motion } from 'framer-motion';

interface SignalAnalysisProps {
  studioName: string;
  context: string;
  method: string;
  images: string[]; // NOW EXPECTING SIMPLE STRINGS
  tags: { label: string; value: string }[];
}

export default function SignalAnalysis({ 
  studioName, 
  context, 
  method, 
  images = [], 
  tags = [] 
}: SignalAnalysisProps) {
  
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
          <div className="relative grid grid-cols-1 gap-8">
             {images.length > 0 ? (
               images.map((src, index) => (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8 }}
                   className="w-full bg-gray-100 shadow-xl"
                 >
                   <img 
                     src={src} 
                     alt={`Signal ${index + 1}`}
                     className="w-full h-auto object-cover block"
                   />
                   <div className="p-3 bg-white border-t border-gray-100">
                      <span className="font-sans-body text-[9px] uppercase tracking-widest text-gray-400">
                         Fig. {index + 1}
                      </span>
                   </div>
                 </motion.div>
               ))
             ) : (
                <div className="p-8 bg-gray-100 text-center font-mono text-xs text-gray-500">
                   No Images Returned from Server
                </div>
             )}
          </div>

        </div>
      </div>
    </section>
  );
}