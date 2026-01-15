'use client';

import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';

interface UnlockAnimationProps {
  isUnlocked: boolean;
  size?: number;
}

export function UnlockAnimation({ isUnlocked, size = 24 }: UnlockAnimationProps) {
  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: isUnlocked ? [1, 1.2, 1] : 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {isUnlocked ? (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Check size={size} className="text-green-500" />
        </motion.div>
      ) : (
        <Lock size={size} className="text-gray-400" />
      )}
    </motion.div>
  );
}
