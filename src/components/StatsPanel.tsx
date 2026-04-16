'use client';

import { usePetStore } from '@/store/petStore';
import { Heart, Drumstick, Smile, Zap, Sparkles, Star, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatBarProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  maxValue?: number;
  colorClass: string;
  emoji?: string;
}

function StatBar({ icon, label, value, maxValue = 100, colorClass, emoji }: StatBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const isLow = percentage < 30;
  const isCritical = percentage < 15;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold opacity-80" style={{ fontFamily: 'var(--font-nunito)' }}>
            {label}
          </span>
        </div>
        <span 
          className="text-xs font-bold" 
          style={{ 
            fontFamily: 'var(--font-orbitron)',
            color: isCritical ? '#f44336' : isLow ? '#FF9800' : 'rgba(255,255,255,0.7)'
          }}
        >
          {Math.round(value)}/{maxValue} {emoji}
        </span>
      </div>
      <div className="progress-bar">
        <motion.div
          className={`progress-fill ${colorClass} ${isLow ? 'low' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function StatsPanel() {
  const { health, hunger, happiness, energy, cleanliness, level, xp, xpToNext, bondLevel, bondXp } = usePetStore();

  const bondTierNames: Record<number, string> = {
    1: 'Stranger', 2: 'Stranger',
    3: 'Friend', 4: 'Friend',
    5: 'Best Friend', 6: 'Best Friend',
    7: 'Soulmate', 8: 'Soulmate',
    9: 'Legendary', 10: 'Legendary',
  };

  const bondTierColors: Record<number, string> = {
    1: '#CD7F32', 2: '#CD7F32',
    3: '#C0C0C0', 4: '#C0C0C0',
    5: '#FFD700', 6: '#FFD700',
    7: '#E8B4F7', 8: '#E8B4F7',
    9: '#FF6B9D', 10: '#FF6B9D',
  };

  return (
    <motion.div
      className="glass-card p-5 w-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Level Badge */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold animate-pulse-glow"
          style={{ 
            background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
            fontFamily: 'var(--font-orbitron)',
            boxShadow: '0 0 20px rgba(255,107,157,0.4)',
          }}
        >
          {level}
        </div>
        <div className="flex-1">
          <div className="text-xs opacity-60 mb-1" style={{ fontFamily: 'var(--font-nunito)' }}>
            LEVEL {level}
          </div>
          <div className="progress-bar !h-2">
            <motion.div
              className="progress-fill xp"
              animate={{ width: `${(xp / xpToNext) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-xs opacity-50 mt-1" style={{ fontFamily: 'var(--font-orbitron)' }}>
            {xp}/{xpToNext} XP
          </div>
        </div>
      </div>

      {/* Status Bars */}
      <StatBar
        icon={<Heart size={16} className="text-red-400" />}
        label="Health"
        value={health}
        colorClass="health"
        emoji={health < 30 ? '💔' : '❤️'}
      />
      <StatBar
        icon={<Drumstick size={16} className="text-orange-400" />}
        label="Hunger"
        value={hunger}
        colorClass="hunger"
        emoji={hunger < 30 ? '😫' : '🍖'}
      />
      <StatBar
        icon={<Smile size={16} className="text-yellow-400" />}
        label="Happiness"
        value={happiness}
        colorClass="happiness"
        emoji={happiness < 30 ? '😢' : '😊'}
      />
      <StatBar
        icon={<Zap size={16} className="text-blue-400" />}
        label="Energy"
        value={energy}
        colorClass="energy"
        emoji={energy < 30 ? '😴' : '⚡'}
      />
      <StatBar
        icon={<Sparkles size={16} className="text-cyan-400" />}
        label="Cleanliness"
        value={cleanliness}
        colorClass="cleanliness"
        emoji={cleanliness < 30 ? '💩' : '✨'}
      />

      {/* Bond Level */}
      <div className="mt-5 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HeartHandshake size={16} style={{ color: bondTierColors[bondLevel] }} />
            <span className="text-sm font-semibold opacity-80">Bond</span>
          </div>
          <span 
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ 
              background: bondTierColors[bondLevel] + '30',
              color: bondTierColors[bondLevel],
              fontFamily: 'var(--font-fredoka)',
            }}
          >
            {bondTierNames[bondLevel]}
          </span>
        </div>
        <div className="progress-bar !h-2">
          <motion.div
            className="progress-fill bond"
            animate={{ width: `${(bondXp / (bondLevel * 50)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs opacity-40" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Lv.{bondLevel}
          </span>
          <span className="text-xs opacity-40">
            💝 {bondXp}/{bondLevel * 50}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
