'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CalmItemProps {
  children: ReactNode;
}

export default function CalmGridItem({ children }: CalmItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="break-inside-avoid mb-6"
    >
      {children}
    </motion.div>
  );
}