'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore } from '@/store/petStore';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Trophy, Star, Timer, RotateCcw } from 'lucide-react';
import Link from 'next/link';

// ============================================
// MEMORY MATCH GAME
// ============================================

const CARD_ICONS = ['🌸', '🍣', '⭐', '💎', '🦊', '🐉', '🎀', '🌙'];

function MemoryMatch() {
  const { play, addCoins, updateHighScore, unlockAchievement, achievementsUnlocked } = usePetStore();
  const [cards, setCards] = useState<{ id: number; icon: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initGame = useCallback(() => {
    const shuffled = [...CARD_ICONS, ...CARD_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, i) => ({ id: i, icon, flipped: false, matched: false }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setGameOver(false);
    setTimer(0);
    setIsPlaying(true);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, gameOver]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (newCards[first].icon === newCards[second].icon) {
        // Match!
        setTimeout(() => {
          const matched = [...cards];
          matched[first].matched = true;
          matched[second].matched = true;
          setCards(matched);
          setFlippedIndices([]);
          setMatches(m => {
            const newMatches = m + 1;
            if (newMatches === CARD_ICONS.length) {
              setGameOver(true);
              const score = Math.max(0, 1000 - moves * 10 - timer * 2);
              const xpEarned = 30 + Math.floor(score / 50);
              const coinsEarned = 20 + Math.floor(score / 100) * 10;
              play('memory', xpEarned);
              addCoins(coinsEarned);
              updateHighScore('memory', score);
              // Perfect game achievement
              if (moves + 1 === CARD_ICONS.length && !achievementsUnlocked.includes('memory_master')) {
                unlockAchievement('memory_master');
              }
            }
            return newMatches;
          });
        }, 300);
      } else {
        // No match - flip back
        setTimeout(() => {
          const unflipped = [...cards];
          unflipped[first].flipped = false;
          unflipped[second].flipped = false;
          setCards(unflipped);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Game Header */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2 glass-card px-4 py-2">
          <Timer size={16} className="text-cyan-400" />
          <span style={{ fontFamily: 'var(--font-orbitron)', color: '#4FACFE' }}>{timer}s</span>
        </div>
        <div className="flex items-center gap-2 glass-card px-4 py-2">
          <Star size={16} className="text-yellow-400" />
          <span style={{ fontFamily: 'var(--font-orbitron)', color: '#FFEB3B' }}>
            {matches}/{CARD_ICONS.length}
          </span>
        </div>
        <div className="glass-card px-4 py-2">
          <span className="text-xs opacity-50">Moves: </span>
          <span style={{ fontFamily: 'var(--font-orbitron)' }}>{moves}</span>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-4 gap-3 max-w-md">
        {cards.map((card, i) => (
          <motion.button
            key={card.id}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl cursor-pointer"
            style={{
              background: card.matched
                ? 'rgba(76,175,80,0.2)'
                : card.flipped
                  ? 'rgba(255,107,157,0.15)'
                  : 'rgba(255,255,255,0.06)',
              border: card.matched
                ? '2px solid rgba(76,175,80,0.4)'
                : card.flipped
                  ? '2px solid rgba(255,107,157,0.3)'
                  : '1px solid rgba(255,255,255,0.08)',
              boxShadow: card.flipped ? '0 0 15px rgba(255,107,157,0.2)' : 'none',
            }}
            whileHover={!card.flipped && !card.matched ? { scale: 1.05, borderColor: 'rgba(255,107,157,0.2)' } : {}}
            whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
            onClick={() => handleCardClick(i)}
            initial={{ rotateY: 180 }}
            animate={{ rotateY: card.flipped || card.matched ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {(card.flipped || card.matched) ? card.icon : '❓'}
          </motion.button>
        ))}
      </div>

      {/* Game Over */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="mt-8 glass-card p-8 text-center max-w-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka)', color: '#FFD700' }}>
              Victory!
            </h3>
            <p className="opacity-60 mb-4">
              Completed in {moves} moves · {timer}s
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <span className="text-sm font-bold" style={{ color: '#E8B4F7' }}>+XP</span>
              <span className="text-sm font-bold" style={{ color: '#FFD700' }}>+Coins</span>
            </div>
            <button className="btn-primary" onClick={initGame}>
              <RotateCcw size={16} className="inline mr-2" />
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// TREAT CATCH GAME
// ============================================

interface Treat {
  id: number;
  x: number;
  y: number;
  type: 'treat' | 'bomb' | 'golden';
  icon: string;
  speed: number;
}

function TreatCatch() {
  const { play, addCoins, updateHighScore } = usePetStore();
  const [treats, setTreats] = useState<Treat[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [catchEffect, setCatchEffect] = useState<{ x: number; y: number; text: string } | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const treatId = useRef(0);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setTreats([]);
    setGameOver(false);
    setIsPlaying(true);
  };

  // Timer
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameOver(true);
          setIsPlaying(false);
          const xpEarned = 20 + Math.floor(score / 10);
          const coinsEarned = Math.floor(score / 2);
          play('treat_catch', xpEarned);
          addCoins(coinsEarned);
          updateHighScore('treat_catch', score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, score, play, addCoins, updateHighScore]);

  // Spawn treats
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => {
      const id = treatId.current++;
      const rand = Math.random();
      const type = rand < 0.15 ? 'bomb' : rand < 0.25 ? 'golden' : 'treat';
      const icons = {
        treat: ['🍎', '🍰', '🍣', '🍪', '🧁'][Math.floor(Math.random() * 5)],
        bomb: '💣',
        golden: '⭐',
      };
      setTreats(prev => [...prev, {
        id,
        x: 10 + Math.random() * 80,
        y: -5,
        type,
        icon: icons[type],
        speed: 1 + Math.random() * 1.5,
      }]);
    }, 600);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  // Move treats down
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTreats(prev => prev
        .map(t => ({ ...t, y: t.y + t.speed * 1.5 }))
        .filter(t => t.y < 105)
      );
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleCatch = (treat: Treat) => {
    const points = treat.type === 'golden' ? 25 : treat.type === 'bomb' ? -15 : 10;
    setScore(s => Math.max(0, s + points));
    setTreats(prev => prev.filter(t => t.id !== treat.id));
    
    setCatchEffect({
      x: treat.x,
      y: treat.y,
      text: points > 0 ? `+${points}` : `${points}`,
    });
    setTimeout(() => setCatchEffect(null), 800);
  };

  return (
    <div className="flex flex-col items-center">
      {!isPlaying && !gameOver && (
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>
            Treat Catch!
          </h3>
          <p className="opacity-60 mb-6 max-w-xs">
            Click treats to catch them! Avoid bombs 💣 and grab golden stars ⭐ for bonus points!
          </p>
          <button className="btn-primary text-lg" onClick={startGame}>
            Start Game 🎮
          </button>
        </motion.div>
      )}

      {isPlaying && (
        <>
          {/* Header */}
          <div className="flex items-center gap-6 mb-4">
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Timer size={16} className="text-red-400" />
              <span style={{ 
                fontFamily: 'var(--font-orbitron)', 
                color: timeLeft <= 10 ? '#f44336' : '#4FACFE' 
              }}>
                {timeLeft}s
              </span>
            </div>
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Trophy size={16} className="text-yellow-400" />
              <span style={{ fontFamily: 'var(--font-orbitron)', color: '#FFD700' }}>{score}</span>
            </div>
          </div>

          {/* Game Area */}
          <div
            ref={gameAreaRef}
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            style={{
              height: 400,
              background: 'linear-gradient(180deg, #1A1625, #2D2438)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {treats.map(treat => (
              <motion.button
                key={treat.id}
                className="absolute text-3xl cursor-pointer select-none z-10"
                style={{
                  left: `${treat.x}%`,
                  top: `${treat.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => handleCatch(treat)}
              >
                {treat.icon}
              </motion.button>
            ))}

            {/* Catch effect */}
            <AnimatePresence>
              {catchEffect && (
                <motion.div
                  className="absolute text-lg font-bold pointer-events-none z-20"
                  style={{
                    left: `${catchEffect.x}%`,
                    top: `${catchEffect.y}%`,
                    color: catchEffect.text.startsWith('+') ? '#4CAF50' : '#f44336',
                    fontFamily: 'var(--font-orbitron)',
                  }}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -40, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {catchEffect.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {gameOver && (
        <motion.div
          className="glass-card p-8 text-center max-w-sm mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-5xl mb-4">{score >= 100 ? '🏆' : score >= 50 ? '🌟' : '👏'}</div>
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka)', color: '#FFD700' }}>
            {score >= 100 ? 'Amazing!' : score >= 50 ? 'Great Job!' : 'Nice Try!'}
          </h3>
          <p className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-orbitron)', color: '#FF6B9D' }}>
            {score} pts
          </p>
          <button className="btn-primary" onClick={startGame}>
            <RotateCcw size={16} className="inline mr-2" />
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// PLAY PAGE
// ============================================

type GameType = 'hub' | 'memory' | 'treat_catch';

export default function PlayPage() {
  const [activeGame, setActiveGame] = useState<GameType>('hub');
  const { level, minigameHighScores, energy } = usePetStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const games = [
    {
      id: 'memory' as GameType,
      name: 'Memory Match',
      icon: '🧩',
      description: 'Match pairs of cards!',
      unlockLevel: 1,
      color: '#E8B4F7',
    },
    {
      id: 'treat_catch' as GameType,
      name: 'Treat Catch',
      icon: '🎯',
      description: 'Catch falling treats!',
      unlockLevel: 1,
      color: '#FF9800',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeGame === 'hub' ? (
          <>
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka)', color: '#FF6B9D' }}>
                🎮 Mini Games
              </h1>
              <p className="opacity-60">Play games with your pet to earn XP and coins!</p>
              {energy < 10 && (
                <p className="text-sm mt-2" style={{ color: '#f44336' }}>
                  ⚠️ Your pet is too tired to play! Let them rest first.
                </p>
              )}
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {games.map((game, i) => {
                const locked = level < game.unlockLevel;
                const highScore = minigameHighScores[game.id] || 0;
                return (
                  <motion.button
                    key={game.id}
                    className="glass-card p-6 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={!locked ? { scale: 1.02 } : {}}
                    onClick={() => !locked && setActiveGame(game.id)}
                    style={{ opacity: locked ? 0.4 : 1, cursor: locked ? 'not-allowed' : 'pointer' }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="text-4xl w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: `${game.color}15` }}
                      >
                        {locked ? '🔒' : game.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-fredoka)', color: game.color }}>
                          {game.name}
                        </h3>
                        <p className="text-sm opacity-60 mt-1">{game.description}</p>
                        {highScore > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Trophy size={14} className="text-yellow-400" />
                            <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-orbitron)', color: '#FFD700' }}>
                              Best: {highScore}
                            </span>
                          </div>
                        )}
                        {locked && (
                          <p className="text-xs mt-2" style={{ color: '#f44336' }}>
                            Unlock at Level {game.unlockLevel}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : (
          <div>
            <button
              className="flex items-center gap-2 mb-6 opacity-60 hover:opacity-100 transition-opacity"
              onClick={() => setActiveGame('hub')}
              style={{ fontFamily: 'var(--font-fredoka)' }}
            >
              <ArrowLeft size={20} />
              Back to Games
            </button>
            {activeGame === 'memory' && <MemoryMatch />}
            {activeGame === 'treat_catch' && <TreatCatch />}
          </div>
        )}
      </main>
    </div>
  );
}
