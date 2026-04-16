'use client';

import { usePetStore, FOOD_ITEMS } from '@/store/petStore';
import { Drumstick, Gamepad2, Heart, Moon, Sparkles, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
  color?: string;
}

function ActionButton({ icon, label, onClick, disabled, tooltip, color = '#FF6B9D' }: ActionButtonProps) {
  return (
    <motion.button
      className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all"
      style={{
        background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)'}`,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      whileHover={disabled ? {} : { 
        scale: 1.05, 
        boxShadow: `0 0 20px ${color}50`,
        borderColor: `${color}40`,
      }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={() => !disabled && onClick()}
      title={disabled ? tooltip : label}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ 
          background: disabled ? 'rgba(255,255,255,0.05)' : `${color}20`,
          color: disabled ? 'rgba(255,255,255,0.3)' : color,
        }}
      >
        {icon}
      </div>
      <span className="text-xs font-semibold" style={{ 
        fontFamily: 'var(--font-fredoka)',
        color: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)',
      }}>
        {label}
      </span>
    </motion.button>
  );
}

export default function QuickActions({ onPet }: { onPet: () => void }) {
  const { hunger, energy, feed, play, clean, rest, foodInventory, addCoins } = usePetStore();
  const [showFeedMenu, setShowFeedMenu] = useState(false);
  const [feedMessage, setFeedMessage] = useState('');
  const router = useRouter();

  const handleFeed = useCallback((foodId: string) => {
    const food = FOOD_ITEMS.find(f => f.id === foodId);
    if (food) {
      feed(foodId);
      setFeedMessage(`Fed ${food.name}! +${food.hungerRestore} 🍖`);
      setTimeout(() => setFeedMessage(''), 2000);
    }
    setShowFeedMenu(false);
  }, [feed]);

  const handlePlay = useCallback(() => {
    router.push('/play');
  }, [router]);

  const handlePhoto = useCallback(() => {
    // Cute screenshot effect
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:white;z-index:9999;animation:flash 0.5s ease-out forwards;';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);
    addCoins(5);
  }, [addCoins]);

  const hasFood = foodInventory.some(f => f.qty > 0);
  const isHungerFull = hunger >= 95;
  const isTired = energy < 10;

  return (
    <>
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-sm font-bold mb-3 opacity-60" style={{ fontFamily: 'var(--font-fredoka)' }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <ActionButton
            icon={<Drumstick size={24} />}
            label="Feed"
            onClick={() => setShowFeedMenu(true)}
            disabled={!hasFood || isHungerFull}
            tooltip={!hasFood ? "No food! Visit the shop" : "Pet isn't hungry"}
            color="#FF9800"
          />
          <ActionButton
            icon={<Gamepad2 size={24} />}
            label="Play"
            onClick={handlePlay}
            disabled={isTired}
            tooltip="Too tired to play!"
            color="#9C27B0"
          />
          <ActionButton
            icon={<Heart size={24} />}
            label="Pet"
            onClick={onPet}
            color="#E91E63"
          />
          <ActionButton
            icon={<Moon size={24} />}
            label="Rest"
            onClick={rest}
            disabled={energy >= 95}
            tooltip="Already well rested!"
            color="#3F51B5"
          />
          <ActionButton
            icon={<Sparkles size={24} />}
            label="Clean"
            onClick={clean}
            color="#00BCD4"
          />
          <ActionButton
            icon={<Camera size={24} />}
            label="Photo"
            onClick={handlePhoto}
            color="#4CAF50"
          />
        </div>

        {/* Feed Message */}
        <AnimatePresence>
          {feedMessage && (
            <motion.div
              className="mt-3 text-center text-sm font-bold"
              style={{ color: '#FF9800', fontFamily: 'var(--font-fredoka)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {feedMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feed Menu Modal */}
      <AnimatePresence>
        {showFeedMenu && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeedMenu(false)}
          >
            <motion.div
              className="modal-content w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-fredoka)', color: '#FF9800' }}>
                  🍽️ Feed Your Pet
                </h2>
                <button onClick={() => setShowFeedMenu(false)} className="opacity-60 hover:opacity-100 transition-opacity">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-3">
                {foodInventory.filter(item => item.qty > 0).map(item => {
                  const food = FOOD_ITEMS.find(f => f.id === item.id);
                  if (!food) return null;
                  return (
                    <motion.button
                      key={item.id}
                      className="w-full flex items-center gap-4 p-4 rounded-xl transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        borderColor: 'rgba(255,152,0,0.3)',
                        boxShadow: '0 0 15px rgba(255,152,0,0.2)',
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFeed(item.id)}
                    >
                      <span className="text-3xl">{food.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold" style={{ fontFamily: 'var(--font-fredoka)' }}>
                          {food.name}
                        </div>
                        <div className="text-xs opacity-60">
                          +{food.hungerRestore} Hunger · +{food.happinessBoost} Happiness
                        </div>
                      </div>
                      <div className="text-sm font-bold opacity-60" style={{ fontFamily: 'var(--font-orbitron)' }}>
                        ×{item.qty}
                      </div>
                    </motion.button>
                  );
                })}
                {foodInventory.filter(i => i.qty > 0).length === 0 && (
                  <div className="text-center py-8 opacity-50">
                    <p className="text-4xl mb-3">🥺</p>
                    <p style={{ fontFamily: 'var(--font-fredoka)' }}>No food in inventory!</p>
                    <p className="text-sm mt-1">Visit the shop to buy some treats</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
