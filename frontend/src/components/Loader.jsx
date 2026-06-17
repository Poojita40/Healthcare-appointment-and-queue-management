import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({ size = 'medium', text = 'Loading SmartCare...' }) {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className={`${sizeClasses[size]} rounded-full border-brand-100 border-t-brand-600`}
        id="sc-loader-spinner"
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          className="mt-4 text-sm font-medium text-gray-500 tracking-wide font-display text-center"
          id="sc-loader-text"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
