'use client';

import { motion } from 'framer-motion';

/**
 * Animated loading spinner with pulsing ring effect.
 */
export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: { container: 'w-4 h-4', ring: 'w-4 h-4 border-2' },
    md: { container: 'w-8 h-8', ring: 'w-8 h-8 border-[3px]' },
    lg: { container: 'w-12 h-12', ring: 'w-12 h-12 border-[3px]' },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${s.container} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className={`${s.ring} rounded-full border-primary-200 dark:border-dark-400 absolute inset-0`}
        />
        <div
          className={`${s.ring} rounded-full border-transparent border-t-primary-600 dark:border-t-primary-400 absolute inset-0`}
        />
      </motion.div>
    </div>
  );
}

/**
 * Skeleton loader with shimmer effect.
 */
export function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return (
    <div
      className={`skeleton ${rounded} ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s linear infinite',
      }}
    />
  );
}

/**
 * Full-page loading state.
 */
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-dark-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-500 dark:text-dark-700">Loading...</p>
      </motion.div>
    </div>
  );
}
