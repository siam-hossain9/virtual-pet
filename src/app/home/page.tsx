'use client';

import { usePetStore } from '@/store/petStore';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import StatsPanel from '@/components/StatsPanel';
import QuickActions from '@/components/QuickActions';
import PetCharacter from '@/components/PetCharacter';
import SpeechBubble from '@/components/SpeechBubble';
import AchievementPopup from '@/components/AchievementPopup';
import DailyReward from '@/components/DailyReward';
import { getPetDialogue, getGreeting, PET_TYPES } from '@/lib/petAI';
import type { PetType, Emotion } from '@/store/petStore';
import Image from 'next/image';

// ============================================
// ADOPTION SCREEN
// ============================================

function AdoptionScreen() {
  const { adoptPet } = usePetStore();
  const [selectedType, setSelectedType] = useState<PetType | null>(null);
  const [petName, setPetName] = useState('');
  const [step, setStep] = useState<'choose' | 'name' | 'confirm'>('choose');
  const [hoveredType, setHoveredType] = useState<PetType | null>(null);

  const handleAdopt = () => {
    if (selectedType && petName.trim()) {
      adoptPet(selectedType, petName.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Title */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.span
          className="text-6xl mb-4 block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🐾
        </motion.span>
        <h1
          className="text-5xl md:text-6xl font-bold mb-3 neon-text"
          style={{ fontFamily: 'var(--font-fredoka)', color: '#FF6B9D' }}
        >
          PETVERSE
        </h1>
        <p className="text-lg opacity-60" style={{ fontFamily: 'var(--font-nunito)' }}>
          Choose your companion to begin your journey
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 'choose' && (
          <motion.div
            key="choose"
            className="w-full max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold text-center mb-8" style={{ fontFamily: 'var(--font-fredoka)' }}>
              Choose Your Companion
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {PET_TYPES.map((pet, i) => (
                <motion.button
                  key={pet.type}
                  className="relative p-6 rounded-2xl text-center transition-all"
                  style={{
                    background: selectedType === pet.type
                      ? `${pet.color}20`
                      : 'rgba(255,255,255,0.04)',
                    border: selectedType === pet.type
                      ? `2px solid ${pet.color}60`
                      : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: selectedType === pet.type
                      ? `0 0 25px ${pet.color}30`
                      : 'none',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ 
                    scale: 1.03,
                    borderColor: `${pet.color}40`,
                    boxShadow: `0 0 20px ${pet.color}20`,
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedType(pet.type)}
                  onMouseEnter={() => setHoveredType(pet.type)}
                  onMouseLeave={() => setHoveredType(null)}
                >
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <Image
                      src={`/pets/${pet.type}.png`}
                      alt={pet.name}
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                  <div className="text-3xl mb-2">{pet.icon}</div>
                  <div className="font-bold text-sm mb-1" style={{ fontFamily: 'var(--font-fredoka)', color: pet.color }}>
                    {pet.name}
                  </div>
                  <div className="text-xs opacity-50">{pet.personality}</div>
                  
                  <AnimatePresence>
                    {(hoveredType === pet.type || selectedType === pet.type) && (
                      <motion.div
                        className="mt-3 text-xs opacity-70 leading-relaxed"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {pet.description}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            <motion.div className="text-center mt-8">
              <button
                className="btn-primary text-lg px-10 py-4"
                disabled={!selectedType}
                onClick={() => setStep('name')}
              >
                Continue ✨
              </button>
            </motion.div>
          </motion.div>
        )}

        {step === 'name' && (
          <motion.div
            key="name"
            className="w-full max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <Image
                  src={`/pets/${selectedType}.png`}
                  alt="Your pet"
                  fill
                  className="object-contain animate-breathe"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>
                Name Your {PET_TYPES.find(p => p.type === selectedType)?.name}
              </h2>
              <p className="text-sm opacity-60">Give your companion a special name!</p>
            </div>

            <input
              type="text"
              value={petName}
              onChange={e => setPetName(e.target.value)}
              placeholder="Enter a name..."
              maxLength={20}
              className="w-full px-6 py-4 rounded-2xl text-center text-xl font-bold outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,107,157,0.2)',
                fontFamily: 'var(--font-fredoka)',
                color: '#fff',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(255,107,157,0.5)';
                e.target.style.boxShadow = '0 0 20px rgba(255,107,157,0.2)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,107,157,0.2)';
                e.target.style.boxShadow = 'none';
              }}
              autoFocus
            />

            <div className="flex gap-3 mt-6 justify-center">
              <button className="btn-secondary" onClick={() => setStep('choose')}>
                ← Back
              </button>
              <button
                className="btn-primary text-lg px-8"
                disabled={!petName.trim()}
                onClick={handleAdopt}
              >
                Adopt {petName || '...'} 💕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-10"
            style={{
              left: `${10 + (i * 6.3) % 90}%`,
              top: `${5 + (i * 7.1) % 90}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 4 + (i % 4),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {['🐾', '✨', '💕', '🌟', '🎀', '🌸'][i % 6]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// HOME SCREEN
// ============================================

function HomeScreen() {
  const store = usePetStore();
  const { petType, petName, updateStatsOverTime, getEmotion, lastVisit, consecutiveDays } = store;
  const [currentMessage, setCurrentMessage] = useState('');
  const [newAchievement, setNewAchievement] = useState<string | null>(null);
  const prevAchievementsRef = useRef(store.achievementsUnlocked.length);
  const emotion = getEmotion();

  // Update stats on mount
  useEffect(() => {
    updateStatsOverTime();
    
    // Set greeting message
    if (petType) {
      const hoursSince = (Date.now() - lastVisit) / (1000 * 60 * 60);
      const greeting = getGreeting(petType, petName, hoursSince, consecutiveDays);
      setCurrentMessage(greeting);
    }
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  // Auto-update stats every minute
  useEffect(() => {
    const interval = setInterval(() => updateStatsOverTime(), 60000);
    return () => clearInterval(interval);
  }, [updateStatsOverTime]);

  // Watch for new achievements
  useEffect(() => {
    if (store.achievementsUnlocked.length > prevAchievementsRef.current) {
      const newId = store.achievementsUnlocked[store.achievementsUnlocked.length - 1];
      setNewAchievement(newId);
      setTimeout(() => setNewAchievement(null), 5000);
    }
    prevAchievementsRef.current = store.achievementsUnlocked.length;
  }, [store.achievementsUnlocked]);

  // Random pet dialogue every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (petType) {
        const dialogue = getPetDialogue(emotion, petType);
        setCurrentMessage(dialogue);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [emotion, petType]);

  const handlePet = useCallback(() => {
    store.pet();
    if (petType) {
      const responses = [
        "That feels nice! 💕",
        "More pets please! 🥰",
        "I love you! ✨",
        "Mmm, right there! 😊",
        "Purrrr... 💗",
      ];
      setCurrentMessage(responses[Math.floor(Math.random() * responses.length)]);
    }
  }, [petType, store]);

  // Determine time-of-day background
  const hour = new Date().getHours();
  const isNight = hour >= 20 || hour < 6;
  const isSunset = hour >= 17 && hour < 20;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stats Panel - Left */}
          <div className="lg:col-span-3">
            <StatsPanel />
          </div>

          {/* Pet Scene - Center */}
          <div className="lg:col-span-5 flex flex-col items-center gap-4">
            {/* Room background */}
            <div 
              className="relative w-full rounded-3xl overflow-hidden p-8 flex flex-col items-center justify-center"
              style={{
                background: isNight
                  ? 'linear-gradient(180deg, #0D0B15 0%, #1A1625 50%, #2D2438 100%)'
                  : isSunset
                    ? 'linear-gradient(180deg, #2D1B3A 0%, #3A1B2D 40%, #2D2438 100%)'
                    : 'linear-gradient(180deg, #1A1625 0%, #231D32 50%, #2D2438 100%)',
                minHeight: 400,
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              {/* Window decoration */}
              <div className="absolute top-4 right-4 text-2xl">
                {isNight ? '🌙' : isSunset ? '🌅' : '☀️'}
              </div>

              {/* Decorative stars at night */}
              {isNight && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-xs"
                      style={{
                        left: `${15 + i * 18}%`,
                        top: `${10 + (i % 3) * 8}%`,
                        opacity: 0.3,
                      }}
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                    >
                      ⭐
                    </motion.div>
                  ))}
                </>
              )}

              {/* Speech Bubble */}
              <div className="mb-4 min-h-16">
                {currentMessage && (
                  <SpeechBubble 
                    message={currentMessage} 
                    duration={8000}
                    onDismiss={() => {}} 
                  />
                )}
              </div>

              {/* Pet Character */}
              <PetCharacter onPet={handlePet} emotion={emotion} />

              {/* Ground decoration */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-12"
                style={{
                  background: 'linear-gradient(180deg, transparent, rgba(45,36,56,0.5))',
                }}
              />
            </div>
          </div>

          {/* Actions & Info - Right */}
          <div className="lg:col-span-4 space-y-4">
            <QuickActions onPet={handlePet} />

            {/* Status Footer */}
            <motion.div
              className="glass-card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span>🔥</span>
                  <span className="font-bold" style={{ color: '#FF9800', fontFamily: 'var(--font-orbitron)' }}>
                    {consecutiveDays}
                  </span>
                  <span className="opacity-50 text-xs">day streak</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>💰</span>
                  <span className="font-bold" style={{ color: '#FFD700', fontFamily: 'var(--font-orbitron)' }}>
                    {store.coins.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>💎</span>
                  <span className="font-bold" style={{ color: '#E8B4F7', fontFamily: 'var(--font-orbitron)' }}>
                    {store.gems}
                  </span>
                </div>
              </div>

              {/* Evolution badge */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs opacity-50">Evolution</span>
                <span 
                  className="text-xs font-bold px-3 py-1 rounded-full" 
                  style={{ 
                    background: store.evolution === 'legendary' 
                      ? 'linear-gradient(135deg, #FFD700, #FF6B9D)' 
                      : 'rgba(232,180,247,0.15)',
                    color: store.evolution === 'legendary' ? '#1A1625' : '#E8B4F7',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                >
                  {store.evolution.charAt(0).toUpperCase() + store.evolution.slice(1)} · Day {store.age}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Achievement Popup */}
      <AchievementPopup achievementId={newAchievement} onDismiss={() => setNewAchievement(null)} />

      {/* Daily Reward */}
      <DailyReward />
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function Page() {
  const { isAdopted } = usePetStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-4xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🐾
        </motion.div>
      </div>
    );
  }

  return isAdopted ? <HomeScreen /> : <AdoptionScreen />;
}
