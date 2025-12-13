'use client';
import { ReactNode } from 'react';

interface MasonryProps {
  children: ReactNode;
}

export default function MasonryGrid({ children }: MasonryProps) {
  return (
    // The 'columns' utility creates the masonry effect
    // 1 col (mobile), 2 cols (tablet), 3 cols (desktop)
    // gap-6 provides the 24px gutter specified in the design doc
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 px-6 md:px-20 lg:px-24">
      {children}
    </div>
  );
}