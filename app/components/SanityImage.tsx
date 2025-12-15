'use client';
import Image from 'next/image';
import { useState } from 'react';

interface SanityImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function SanityImage({ src, alt, fill, className, sizes, priority }: SanityImageProps) {
  const [error, setError] = useState(false);

  // Debug: Log if src is missing
  if (!src) {
    return (
      <div className={`bg-secondary-bg flex flex-col items-center justify-center text-accent-brown/30 italic font-serif-title p-4 text-center ${className} ${fill ? 'absolute inset-0' : 'w-full h-full'}`}>
        <span className="text-sm">[Image Missing]</span>
        <span className="text-[10px] mt-1 opacity-50">Src is null/undefined</span>
      </div>
    );
  }

  // If Next.js Image fails to load the valid URL
  if (error) {
    return (
      <div className={`bg-secondary-bg flex flex-col items-center justify-center text-accent-brown/30 italic font-serif-title p-4 text-center ${className} ${fill ? 'absolute inset-0' : 'w-full h-full'}`}>
        <span className="text-sm">[Image Failed to Load]</span>
        {/* Visual Debugger: Show the URL that failed so we can check it */}
        <span className="text-[10px] mt-1 opacity-50 break-all max-w-full px-2">{src}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={(e) => {
        console.error("SanityImage Load Error:", src, e);
        setError(true);
      }} 
    />
  );
}