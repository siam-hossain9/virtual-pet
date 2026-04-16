'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePetStore, OUTFIT_ITEMS } from '@/store/petStore';
import Navigation from '@/components/Navigation';
import Image from 'next/image';

type CustomizeTab = 'hat' | 'outfit' | 'accessory' | 'effect';

export default function CustomizePage() {
  const store = usePetStore();
  const { petType, petName, ownedOutfits, equippedOutfits, equipOutfit, unequipOutfit } = store;
  const [activeTab, setActiveTab] = useState<CustomizeTab>('hat');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const tabs = [
    { id: 'hat' as CustomizeTab, icon: '🎩', label: 'Hats' },
    { id: 'outfit' as CustomizeTab, icon: '👕', label: 'Outfits' },
    { id: 'accessory' as CustomizeTab, icon: '🎀', label: 'Accessories' },
    { id: 'effect' as CustomizeTab, icon: '✨', label: 'Effects' },
  ];

  const availableItems = OUTFIT_ITEMS.filter(
    item => item.category === activeTab && ownedOutfits.includes(item.id)
  );

  const lockedItems = OUTFIT_ITEMS.filter(
    item => item.category === activeTab && !ownedOutfits.includes(item.id)
  );

  const equippedId = equippedOutfits[activeTab as keyof typeof equippedOutfits];

  const handleEquip = (itemId: string) => {
    if (equippedId === itemId) {
      unequipOutfit(activeTab);
    } else {
      equipOutfit(activeTab, itemId);
    }
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
          👗 Customize
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview */}
          <div className="lg:col-span-1">
            <motion.div
              className="glass-card p-6 flex flex-col items-center sticky top-20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-sm font-bold opacity-60 mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>
                Preview
              </h3>
              <div className="relative w-48 h-48 mb-4">
                <Image
                  src={`/pets/${petType}.png`}
                  alt={petName}
                  fill
                  className="object-contain animate-breathe"
                />
                {/* Equipped items display */}
                {equippedOutfits.hat && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">
                    {OUTFIT_ITEMS.find(i => i.id === equippedOutfits.hat)?.icon}
                  </div>
                )}
                {equippedOutfits.accessory && (
                  <div className="absolute bottom-2 right-2 text-2xl">
                    {OUTFIT_ITEMS.find(i => i.id === equippedOutfits.accessory)?.icon}
                  </div>
                )}
              </div>
              <p className="font-bold" style={{ fontFamily: 'var(--font-fredoka)', color: '#FF6B9D' }}>
                {petName}
              </p>
              
              {/* Equipped list */}
              <div className="w-full mt-4 pt-4 border-t border-white/10 space-y-2">
                {Object.entries(equippedOutfits).map(([cat, id]) => {
                  if (!id) return null;
                  const item = OUTFIT_ITEMS.find(i => i.id === id);
                  return item ? (
                    <div key={cat} className="flex items-center justify-between text-xs">
                      <span className="opacity-50 capitalize">{cat}</span>
                      <span>{item.icon} {item.name}</span>
                    </div>
                  ) : null;
                })}
                {Object.values(equippedOutfits).every(v => !v) && (
                  <p className="text-xs opacity-30 text-center">No items equipped</p>
                )}
              </div>

              {/* Randomize button */}
              <motion.button
                className="btn-secondary mt-4 w-full text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Random equip from owned
                  tabs.forEach(tab => {
                    const items = OUTFIT_ITEMS.filter(i => i.category === tab.id && ownedOutfits.includes(i.id));
                    if (items.length > 0 && Math.random() > 0.3) {
                      equipOutfit(tab.id, items[Math.floor(Math.random() * items.length)].id);
                    } else {
                      unequipOutfit(tab.id);
                    }
                  });
                }}
              >
                🎲 Randomize
              </motion.button>
            </motion.div>
          </div>

          {/* Item Selection */}
          <div className="lg:col-span-2">
            {/* Category tabs */}
            <div className="flex items-center gap-2 mb-6">
              {tabs.map(tab => (
                <motion.button
                  key={tab.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
                  style={{
                    background: activeTab === tab.id ? 'rgba(255,107,157,0.15)' : 'rgba(255,255,255,0.04)',
                    border: activeTab === tab.id ? '1px solid rgba(255,107,157,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    color: activeTab === tab.id ? '#FF6B9D' : 'rgba(255,255,255,0.5)',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon} {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Owned items */}
            {availableItems.length > 0 && (
              <>
                <h3 className="text-sm font-bold opacity-50 mb-3" style={{ fontFamily: 'var(--font-fredoka)' }}>
                  Your Items
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {availableItems.map(item => (
                    <motion.button
                      key={item.id}
                      className="glass-card p-4 text-center"
                      style={{
                        borderColor: equippedId === item.id ? 'rgba(255,107,157,0.5)' : undefined,
                        boxShadow: equippedId === item.id ? '0 0 20px rgba(255,107,157,0.3)' : undefined,
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleEquip(item.id)}
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="text-sm font-bold" style={{ fontFamily: 'var(--font-fredoka)' }}>
                        {item.name}
                      </div>
                      {equippedId === item.id && (
                        <div className="text-xs mt-1" style={{ color: '#FF6B9D' }}>Equipped</div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </>
            )}

            {/* Locked items */}
            {lockedItems.length > 0 && (
              <>
                <h3 className="text-sm font-bold opacity-30 mb-3" style={{ fontFamily: 'var(--font-fredoka)' }}>
                  🔒 Locked — Visit the Shop!
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {lockedItems.map(item => (
                    <div key={item.id} className="glass-card p-4 text-center opacity-30">
                      <div className="text-3xl mb-2">🔒</div>
                      <div className="text-sm font-bold" style={{ fontFamily: 'var(--font-fredoka)' }}>
                        {item.name}
                      </div>
                      <div className="text-xs opacity-60 mt-1">
                        Lv.{item.unlockLevel} · 💰{item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {availableItems.length === 0 && lockedItems.length === 0 && (
              <div className="text-center py-16 opacity-40">
                <div className="text-5xl mb-4">👻</div>
                <p style={{ fontFamily: 'var(--font-fredoka)' }}>No items in this category yet!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
