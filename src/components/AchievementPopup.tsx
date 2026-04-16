'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ALL_ACHIEVEMENTS } from '@/store/petStore';

interface AchievementPopupProps {
  achievementId: string | null;
  onDismiss: () => void;
}

export default function AchievementPopup({ achievementId, onDismiss }: AchievementPopupProps) {
  const achievement = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);

  const rarityColors: Record<string, string> = {
    common: '#9E9E9E',
    rare: '#4FACFE',
    epic: '#E8B4F7',
    legendary: '#FFD700',
  };

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed top-20 right-4 z-[200] max-w-sm"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div
            className="rounded-2xl p-5 cursor-pointer relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(45,36,56,0.97), rgba(26,22,37,0.98))',
              border: `1px solid ${rarityColors[achievement.rarity]}40`,
              boxShadow: `0 0 30px ${rarityColors[achievement.rarity]}30, 0 8px 32px rgba(0,0,0,0.4)`,
            }}
            onClick={onDismiss}
          >
            {/* Sparkle background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 1,
                    repeat: Infinity,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4">
              <motion.div
                className="text-5xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {achievement.icon}
              </motion.div>
              <div>
                <div className="text-xs font-bold mb-1" style={{ 
                  color: rarityColors[achievement.rarity],
                  fontFamily: 'var(--font-orbitron)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}>
                  🏆 Achievement Unlocked!
                </div>
                <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-fredoka)' }}>
                  {achievement.name}
                </div>
                <div className="text-xs opacity-60 mt-0.5">
                  {achievement.description}
                </div>
                <div className="flex gap-3 mt-2">
                  <span className="text-xs font-bold" style={{ color: '#E8B4F7' }}>
                    +{achievement.xpReward} XP
                  </span>
                  <span className="text-xs font-bold" style={{ color: '#FFD700' }}>
                    +{achievement.coinReward} 💰
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
