'use client';

import { usePetStore } from '@/store/petStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Gift, X } from 'lucide-react';

const DAILY_REWARDS_DISPLAY = [
  { day: 1, reward: '100 💰', icon: '💰' },
  { day: 2, reward: 'Bread 🍞', icon: '🍞' },
  { day: 3, reward: '200 💰', icon: '💰' },
  { day: 4, reward: 'Sushi 🍣', icon: '🍣' },
  { day: 5, reward: '300 💰', icon: '💰' },
  { day: 6, reward: 'Cute Bow 🎀', icon: '🎀' },
  { day: 7, reward: '1000 💰 + ⭐', icon: '🎉' },
];

export default function DailyReward() {
  const { lastDailyReward, dailyRewardDay, claimDailyReward, consecutiveDays } = usePetStore();
  const [showModal, setShowModal] = useState(false);
  const [claimedReward, setClaimedReward] = useState<{ coins: number; item?: string } | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const canClaim = lastDailyReward !== today;
  const nextDay = (dailyRewardDay % 7) + 1;

  const handleClaim = () => {
    const reward = claimDailyReward();
    if (reward) {
      setClaimedReward(reward);
      setTimeout(() => setClaimedReward(null), 3000);
    }
    setShowModal(false);
  };

  return (
    <>
      {/* Daily Reward Button */}
      {canClaim && (
        <motion.button
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FF9800)',
            boxShadow: '0 0 20px rgba(255,215,0,0.4), 0 4px 15px rgba(0,0,0,0.3)',
            fontFamily: 'var(--font-fredoka)',
            color: '#1A1625',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => setShowModal(true)}
        >
          <Gift size={20} />
          <span className="font-bold text-sm">Daily Reward!</span>
        </motion.button>
      )}

      {/* Claimed notification */}
      <AnimatePresence>
        {claimedReward && (
          <motion.div
            className="fixed bottom-6 left-6 z-50 px-6 py-4 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(45,36,56,0.97), rgba(26,22,37,0.98))',
              border: '1px solid rgba(255,215,0,0.3)',
              boxShadow: '0 0 20px rgba(255,215,0,0.2)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-fredoka)', color: '#FFD700' }}>
              🎉 Reward Claimed!
            </div>
            <div className="text-sm opacity-80 mt-1">
              +{claimedReward.coins} coins{claimedReward.item ? ` + ${claimedReward.item}` : ''}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Reward Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content w-full max-w-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-fredoka)', color: '#FFD700' }}>
                  🎁 Daily Rewards
                </h2>
                <button onClick={() => setShowModal(false)} className="opacity-60 hover:opacity-100">
                  <X size={24} />
                </button>
              </div>

              {/* Streak info */}
              <div className="text-center mb-6 p-3 rounded-xl" style={{ background: 'rgba(255,152,0,0.1)' }}>
                <span className="text-sm" style={{ fontFamily: 'var(--font-fredoka)' }}>
                  🔥 {consecutiveDays} Day Streak!
                </span>
              </div>

              {/* 7-day grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {DAILY_REWARDS_DISPLAY.map(reward => {
                  const isCompleted = reward.day < nextDay || (reward.day === nextDay && !canClaim);
                  const isCurrent = reward.day === nextDay && canClaim;
                  return (
                    <div
                      key={reward.day}
                      className="flex flex-col items-center p-2 rounded-xl transition-all"
                      style={{
                        background: isCurrent
                          ? 'rgba(255,215,0,0.15)'
                          : isCompleted
                            ? 'rgba(76,175,80,0.1)'
                            : 'rgba(255,255,255,0.04)',
                        border: isCurrent
                          ? '2px solid rgba(255,215,0,0.4)'
                          : '1px solid rgba(255,255,255,0.06)',
                        boxShadow: isCurrent ? '0 0 15px rgba(255,215,0,0.2)' : 'none',
                      }}
                    >
                      <span className="text-xs opacity-50 mb-1">Day {reward.day}</span>
                      <span className="text-xl mb-1">{isCompleted ? '✅' : reward.icon}</span>
                      <span className="text-xs opacity-70" style={{ fontSize: '0.6rem' }}>
                        {reward.reward.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Claim button */}
              <motion.button
                className="w-full py-4 rounded-2xl text-lg font-bold"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FF9800)',
                  color: '#1A1625',
                  fontFamily: 'var(--font-fredoka)',
                  boxShadow: '0 0 20px rgba(255,215,0,0.3)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaim}
              >
                🎁 Claim Day {nextDay} Reward!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
