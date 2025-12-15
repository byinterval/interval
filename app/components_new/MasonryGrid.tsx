'use client';
import { ReactNode } from 'react';

interface MasonryProps {
  children: ReactNode;
}

export default function MasonryGrid({ children }: MasonryProps) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 px-6 md:px-20 lg:px-24">
      {children}
    </div>
  );
}