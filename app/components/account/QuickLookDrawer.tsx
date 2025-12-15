'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface DrawerProps {
  item: any | null;
  onClose: () => void;
}

export default function QuickLookDrawer({ item, onClose }: DrawerProps) {
  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-ink/20 z-[60] backdrop-blur-sm"
          />
          
          {/* Drawer Panel */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-primary-bg z-[70] shadow-2xl overflow-y-auto border-l border-secondary-bg"
          >
            <div className="p-8 md:p-12 h-full flex flex-col">
              <button onClick={onClose} className="self-end mb-8 text-accent-brown hover:text-brand-ink">
                Close [ESC]
              </button>

              <div className="relative w-full aspect-square bg-secondary-bg mb-8">
                 <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>

              <span className="font-sans-body text-xs uppercase tracking-widest text-accent-brown mb-4 block">
                {item.subtitle}
              </span>
              <h2 className="font-serif-title text-3xl text-brand-ink mb-6">{item.title}</h2>
              <p className="font-sans-body text-brand-ink/70 leading-relaxed mb-12">
                This item was saved from Issue 048. Use this reference for your project or collection.
                (This would be the full summary text).
              </p>

              <div className="mt-auto">
                <button className="w-full bg-brand-ink text-primary-bg py-4 font-sans-body text-xs uppercase tracking-widest hover:bg-accent-brown transition-colors">
                  {item.type === 'artifact' ? 'Acquire Item' : 'View Full Signal'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}