'use client';
import { motion } from 'framer-motion';

interface Tag {
  label: string;
  value: string;
}

interface SignalAnalysisProps {
  studioName: string;
  context: string;
  method: string;
  images: string[];
  tags: Tag[];
}

export default function SignalAnalysis({ 
  studioName = "Unknown Studio", 
  context, 
  method, 
  images = [], 
  tags = [] 
}: SignalAnalysisProps) {
  
  return (
    <section className="py-24 px-6 md:px-12 bg-primary-bg min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* SECTION LABEL */}
        <span className="font-sans-body text-[10px] text-accent-brown uppercase tracking-[0.2em] mb-16 block opacity-50">
          II. The Signal
        </span>

        {/* GRID LAYOUT: 2 COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* COLUMN 1: TEXT ANALYSIS (Left) */}
          <div className="flex flex-col space-y-12">
            
            {/* Header */}
            <div>
               <h2 className="font-serif-title text-4xl md:text-5xl text-brand-ink mb-4">
                 {studioName}
               </h2>
               
               {/* Tags */}
               <div className="flex flex-wrap gap-3">
                 {tags.map((tag, i) => (
                   <span key={i} className="inline-block px-3 py-1 border border-accent-brown/20 rounded-full font-sans-body text-[9px] uppercase tracking-widest text-accent-brown">
                     {tag.value}
                   </span>
                 ))}
               </div>
            </div>

            {/* Context Block */}
            <div className="group">
               <span className="font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown/60 block mb-4 group-hover:text-accent-brown transition-colors">
                 Context
               </span>
               <p className="font-serif-title text-xl md:text-2xl leading-relaxed text-brand-ink opacity-90">
                 {context || "No context provided."}
               </p>
            </div>

            {/* Method Block */}
            <div className="group">
               <span className="font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown/60 block mb-4 group-hover:text-accent-brown transition-colors">
                 Method
               </span>
               <p className="font-serif-title text-xl md:text-2xl leading-relaxed text-brand-ink opacity-90">
                 {method || "No method provided."}
               </p>
            </div>

          </div>

          {/* COLUMN 2: IMAGES (Right) */}
          <div className="relative">
             {images && images.length > 0 ? (
               <div className="grid grid-cols-1 gap-8">
                 {images.map((src, index) => (
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
                 ))}
               </div>
             ) : (
               /* Empty State Visual if no images found */
               <div className="w-full aspect-[4/5] bg-accent-brown/5 border border-accent-brown/10 flex items-center justify-center">
                 <span className="font-sans-body text-[10px] uppercase tracking-widest text-accent-brown/40">
                   No visual data available
                 </span>
               </div>
             )}
          </div>

        </div>
      </div>
    </section>
  );
}