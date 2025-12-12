// app/components/CalmEntry.tsx
'use client';
import { motion } from 'framer-motion';

export default function CalmEntry({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      // Slow-fade page loads (0.8s) to mimic calm 
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}