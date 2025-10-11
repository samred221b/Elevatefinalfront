import { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showFallback?: boolean;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-10 h-10',
  xl: 'w-20 h-20'
};

const fallbackTextSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg', 
  xl: 'text-3xl'
};

export function Logo({ size = 'md', className = '', showFallback = true }: LogoProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);


  const handleImageLoad = () => {
    console.log('Logo image loaded successfully');
    setImageLoaded(true);
    setImageError(false);
  };

  // Try multiple potential paths
  const logoSources = [
    '/Elevate.png',
    './Elevate.png',
    '/public/Elevate.png',
    '/Logo.png'
  ];

  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

  const handleNextSource = () => {
    if (currentSourceIndex < logoSources.length - 1) {
      setCurrentSourceIndex(currentSourceIndex + 1);
      setImageError(false);
    } else {
      setImageError(true);
    }
  };

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center relative ${className}`}>
      {/* Subtle glow effect behind logo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-pink-100/30 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg blur-sm"></div>
      
      {/* Main container with subtle border */}
      <div className="relative w-full h-full flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-purple-200/50 dark:border-purple-800/50 shadow-sm">
        {!imageError ? (
          <img 
            src={logoSources[currentSourceIndex]}
            alt="Elevate Logo" 
            className="w-4/5 h-4/5 object-contain drop-shadow-sm"
            onError={handleNextSource}
            onLoad={handleImageLoad}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
        ) : null}
        
        {(imageError || !imageLoaded) && showFallback && (
          <div className={`bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold ${fallbackTextSizes[size]} flex items-center justify-center w-4/5 h-4/5 rounded`}>
            E
          </div>
        )}
      </div>
    </div>
  );
}
