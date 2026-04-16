'use client';

import { usePetStore, type Emotion } from '@/store/petStore';
import { motion, useAnimation } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';

interface PetCharacterProps {
  onPet: () => void;
  emotion: Emotion;
}

function HeartParticle({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="particle particle-heart text-2xl"
      style={{ left: x, top: y }}
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -80, scale: 1.2, x: (Math.random() - 0.5) * 60 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {['❤️', '💕', '💗', '💖', '✨'][Math.floor(Math.random() * 5)]}
    </motion.div>
  );
}

function ZzzParticle({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="particle text-xl font-bold"
      style={{ left: x, top: y, color: '#4FACFE' }}
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -50, x: 30, scale: 1.5 }}
      transition={{ duration: 2.5, ease: 'easeOut' }}
    >
      💤
    </motion.div>
  );
}

function SparkleParticle({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="particle text-lg"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: 360 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      ✨
    </motion.div>
  );
}

export default function PetCharacter({ onPet, emotion }: PetCharacterProps) {
  const { petType, evolution, petName } = usePetStore();
  const controls = useAnimation();
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [zzz, setZzz] = useState<{ id: number; x: number; y: number }[]>([]);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleId = useRef(0);

  // Emotion-based animations
  const emotionAnimations: Record<Emotion, object> = {
    happy: { y: [0, -5, 0], rotate: [0, 2, -2, 0] },
    sad: { y: [0, 3, 0], rotate: [0, -2, 0] },
    excited: { y: [0, -15, 0, -10, 0], scale: [1, 1.05, 1, 1.03, 1] },
    tired: { y: [0, 2, 0], scale: [1, 0.98, 1] },
    angry: { x: [-3, 3, -3, 3, 0], rotate: [0, -1, 1, -1, 0] },
    sick: { x: [-2, 2, -1, 1, 0], y: [0, 1, 0] },
    neutral: { y: [0, -3, 0] },
  };

  useEffect(() => {
    controls.start({
      ...emotionAnimations[emotion],
      transition: { 
        duration: emotion === 'excited' ? 0.8 : 2.5, 
        repeat: Infinity, 
        ease: 'easeInOut' 
      },
    });
  }, [emotion, controls]);

  // Tired zzz particles
  useEffect(() => {
    if (emotion !== 'tired') return;
    const interval = setInterval(() => {
      const id = particleId.current++;
      setZzz(prev => [...prev, { id, x: 150 + Math.random() * 30, y: 80 }]);
      setTimeout(() => setZzz(prev => prev.filter(p => p.id !== id)), 3000);
    }, 2000);
    return () => clearInterval(interval);
  }, [emotion]);

  // Excited sparkles
  useEffect(() => {
    if (emotion !== 'excited') return;
    const interval = setInterval(() => {
      const id = particleId.current++;
      setSparkles(prev => [...prev, { 
        id, 
        x: 50 + Math.random() * 200, 
        y: 50 + Math.random() * 200 
      }]);
      setTimeout(() => setSparkles(prev => prev.filter(p => p.id !== id)), 2000);
    }, 500);
    return () => clearInterval(interval);
  }, [emotion]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Spawn heart
    const id = particleId.current++;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHearts(prev => [...prev, { id, x, y }]);
    setTimeout(() => setHearts(prev => prev.filter(p => p.id !== id)), 1500);
    
    // Pet reaction animation
    controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });

    onPet();
  }, [onPet, controls]);

  const getEmotionFilter = () => {
    switch (emotion) {
      case 'sad': return 'brightness(0.8) saturate(0.7)';
      case 'sick': return 'brightness(0.7) saturate(0.5) hue-rotate(30deg)';
      case 'tired': return 'brightness(0.85) saturate(0.8)';
      case 'angry': return 'brightness(0.9) saturate(1.2) hue-rotate(-10deg)';
      case 'excited': return 'brightness(1.15) saturate(1.3)';
      default: return 'brightness(1) saturate(1)';
    }
  };

  const getScaleForEvolution = () => {
    switch (evolution) {
      case 'baby': return 0.85;
      case 'youth': return 1;
      case 'adult': return 1.15;
      case 'legendary': return 1.3;
      default: return 1;
    }
  };

  if (!petType) return null;

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col items-center justify-center cursor-pointer select-none"
      style={{ minHeight: 300 }}
    >
      {/* Emotion Aura */}
      {(emotion === 'excited' || emotion === 'happy') && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 250,
            height: 250,
            background: emotion === 'excited'
              ? 'radial-gradient(circle, rgba(255,107,157,0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(232,180,247,0.1) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Legendary glow */}
      {evolution === 'legendary' && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 280,
            height: 280,
            background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(255,107,157,0.1) 40%, transparent 70%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Pet Image */}
      <motion.div
        animate={controls}
        onClick={handleClick}
        style={{ 
          filter: getEmotionFilter(),
          transform: `scale(${getScaleForEvolution()})`,
        }}
        className="relative z-10"
      >
        <Image
          src={`/pets/${petType}.png`}
          alt={petName || 'Your pet'}
          width={220}
          height={220}
          className="drop-shadow-2xl"
          style={{ 
            imageRendering: 'auto',
            filter: 'drop-shadow(0 0 20px rgba(255,107,157,0.3))',
          }}
          priority
        />
      </motion.div>

      {/* Pet Name Badge */}
      <motion.div
        className="mt-2 px-4 py-1.5 rounded-full text-sm font-bold"
        style={{
          background: 'rgba(255,107,157,0.15)',
          border: '1px solid rgba(255,107,157,0.2)',
          fontFamily: 'var(--font-fredoka)',
          color: '#FF6B9D',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {petName}
      </motion.div>

      {/* Heart particles */}
      {hearts.map(h => <HeartParticle key={h.id} x={h.x} y={h.y} />)}
      {/* Zzz particles */}
      {zzz.map(z => <ZzzParticle key={z.id} x={z.x} y={z.y} />)}
      {/* Sparkle particles */}
      {sparkles.map(s => <SparkleParticle key={s.id} x={s.x} y={s.y} />)}
    </div>
  );
}
