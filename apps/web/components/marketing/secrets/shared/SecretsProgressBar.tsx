'use client';

import { motion } from 'framer-motion';

interface SecretsProgressBarProps {
  unlocked: number;
  total: number;
  showLabel?: boolean;
}

export function SecretsProgressBar({ unlocked, total, showLabel = true }: SecretsProgressBarProps) {
  const percentage = (unlocked / total) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      {showLabel && (
        <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
          <span>Secrets Unlocked</span>
          <span className="text-orange-600">{unlocked}/{total}</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-orange-500 to-red-500"
        />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`w-2 h-2 rounded-full ${
              i < unlocked ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
