import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-blue-600`} />
    </div>
  );
};

export default Loader;