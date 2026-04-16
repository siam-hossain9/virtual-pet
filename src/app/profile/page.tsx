'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePetStore, ALL_ACHIEVEMENTS } from '@/store/petStore';
import Navigation from '@/components/Navigation';
import { PET_TYPES, getEvolutionInfo } from '@/lib/petAI';
import Image from 'next/image';
import { Calendar, Clock, Trophy, Heart, Star, Flame, RotateCcw } from 'lucide-react';

export default function ProfilePage() {
  const store = usePetStore();
  const [mounted, setMounted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const petInfo = PET_TYPES.find(p => p.type === store.petType);
  const evoInfo = getEvolutionInfo(store.evolution);

  const totalAchievements = ALL_ACHIEVEMENTS.length;
  const unlockedCount = store.achievementsUnlocked.length;

  const handleReset = () => {
    store.resetPet();
    window.location.href = '/home';
  };

  const rarityColors: Record<string, string> = {
    common: '#9E9E9E',
    rare: '#4FACFE',
    epic: '#E8B4F7',
    legendary: '#FFD700',
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <motion.h1
          className="text-4xl font-bold text-center mb-8"
          style={{ fontFamily: 'var(--font-fredoka)', color: '#FF6B9D' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          👤 Profile
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pet Info Card */}
          <motion.div
            className="glass-card p-6 text-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image src={`/pets/${store.petType}.png`} alt={store.petName} fill className="object-contain" />
            </div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-fredoka)', color: '#FF6B9D' }}>
              {store.petName}
            </h2>
            <p className="text-sm opacity-60 mt-1" style={{ color: petInfo?.color }}>
              {petInfo?.icon} {petInfo?.name}
            </p>
            <div 
              className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold"
              style={{ 
                background: `${evoInfo.color}20`, 
                color: evoInfo.color,
                fontFamily: 'var(--font-fredoka)',
              }}
            >
              {evoInfo.label} Evolution
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <Star size={16} className="mx-auto mb-1 text-yellow-400" />
                <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  {store.level}
                </div>
                <div className="text-xs opacity-40">Level</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <Calendar size={16} className="mx-auto mb-1 text-blue-400" />
                <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  {store.age}
                </div>
                <div className="text-xs opacity-40">Days</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <Flame size={16} className="mx-auto mb-1 text-orange-400" />
                <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  {store.consecutiveDays}
                </div>
                <div className="text-xs opacity-40">Streak</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <Heart size={16} className="mx-auto mb-1 text-pink-400" />
                <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  {store.bondLevel}
                </div>
                <div className="text-xs opacity-40">Bond</div>
              </div>
            </div>

            {/* Total visits */}
            <div className="mt-4 pt-4 border-t border-white/10 text-xs opacity-50 space-y-1">
              <div className="flex justify-between">
                <span>Total Visits</span>
                <span style={{ fontFamily: 'var(--font-orbitron)' }}>{store.totalVisits}</span>
              </div>
              <div className="flex justify-between">
                <span>Coins Earned</span>
                <span style={{ fontFamily: 'var(--font-orbitron)' }}>{store.coins.toLocaleString()} 💰</span>
              </div>
              <div className="flex justify-between">
                <span>Outfits Owned</span>
                <span style={{ fontFamily: 'var(--font-orbitron)' }}>{store.ownedOutfits.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="lg:col-span-2 glass-card p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: 'var(--font-fredoka)' }}>
                <Trophy size={20} className="text-yellow-400" />
                Achievements
              </h3>
              <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-orbitron)', color: '#E8B4F7' }}>
                {unlockedCount}/{totalAchievements}
              </span>
            </div>

            {/* Progress bar */}
            <div className="progress-bar mb-6 !h-3">
              <motion.div
                className="progress-fill xp"
                animate={{ width: `${(unlockedCount / totalAchievements) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {ALL_ACHIEVEMENTS.map((achievement, i) => {
                const unlocked = store.achievementsUnlocked.includes(achievement.id);
                return (
                  <motion.div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{
                      background: unlocked ? `${rarityColors[achievement.rarity]}10` : 'rgba(255,255,255,0.02)',
                      border: unlocked ? `1px solid ${rarityColors[achievement.rarity]}30` : '1px solid rgba(255,255,255,0.04)',
                      opacity: unlocked ? 1 : 0.4,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: unlocked ? 1 : 0.4, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <span className="text-2xl">{unlocked ? achievement.icon : '🔒'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate" style={{ fontFamily: 'var(--font-fredoka)' }}>
                        {achievement.name}
                      </div>
                      <div className="text-xs opacity-60 truncate">{achievement.description}</div>
                    </div>
                    {unlocked && (
                      <div className="text-xs" style={{ color: rarityColors[achievement.rarity] }}>✓</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Danger Zone */}
        <motion.div
          className="mt-8 glass-card p-6"
          style={{ borderColor: 'rgba(244,67,54,0.2)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-fredoka)', color: '#f44336' }}>
            ⚠️ Danger Zone
          </h3>
          <p className="text-sm opacity-60 mb-4">
            Reset your pet and start fresh. This cannot be undone!
          </p>
          {!showResetConfirm ? (
            <button
              className="px-6 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                background: 'rgba(244,67,54,0.1)',
                border: '1px solid rgba(244,67,54,0.3)',
                color: '#f44336',
                fontFamily: 'var(--font-fredoka)',
              }}
              onClick={() => setShowResetConfirm(true)}
            >
              <RotateCcw size={14} className="inline mr-2" />
              Reset Pet
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80">Are you sure?</span>
              <button
                className="px-6 py-2 rounded-xl text-sm font-bold"
                style={{
                  background: '#f44336',
                  color: 'white',
                  fontFamily: 'var(--font-fredoka)',
                }}
                onClick={handleReset}
              >
                Yes, Reset Everything
              </button>
              <button
                className="btn-secondary text-sm"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
