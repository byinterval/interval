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

  // If no source is provided, or if it errored previously, show placeholder
  if (!src || error) {
    return (
      <div className={`bg-secondary-bg flex items-center justify-center text-accent-brown/30 italic font-serif-title ${className} ${fill ? 'absolute inset-0' : 'w-full h-full'}`}>
        <span className="text-sm">[Image Unavailable: {alt}]</span>
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
      onError={() => setError(true)} // Catch broken URLs
    />
  );
}