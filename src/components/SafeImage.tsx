import { useState } from 'react';
import { Car } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function SafeImage({ src, alt, className = '', fallbackLabel }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1D24] to-[#2B303A] text-white/80 p-4 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Car className="w-8 h-8 mb-2 text-[#D9232E]" />
        <span className="text-xs font-medium tracking-wide text-center">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
