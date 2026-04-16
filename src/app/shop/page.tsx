'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore, FOOD_ITEMS, OUTFIT_ITEMS, type FoodItem, type OutfitItem } from '@/store/petStore';
import Navigation from '@/components/Navigation';
import { ShoppingBag, Package, Shirt, Sparkles, X, Check } from 'lucide-react';

type ShopTab = 'food' | 'outfits' | 'mystery';

export default function ShopPage() {
  const store = usePetStore();
  const { coins, gems, level, buyFood, buyOutfit, ownedOutfits, addCoins } = store;
  const [activeTab, setActiveTab] = useState<ShopTab>('food');
  const [purchaseMsg, setPurchaseMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleBuyFood = (food: FoodItem) => {
    if (buyFood(food)) {
      setPurchaseMsg(`Bought ${food.name}! ${food.icon}`);
      setTimeout(() => setPurchaseMsg(''), 2000);
    }
  };

  const handleBuyOutfit = (outfit: OutfitItem) => {
    if (buyOutfit(outfit)) {
      setPurchaseMsg(`Got ${outfit.name}! ${outfit.icon}`);
      setTimeout(() => setPurchaseMsg(''), 2000);
    }
  };

  const handleMysteryBox = () => {
    if (coins < 500) return;
    addCoins(-500);
    const allItems = [...FOOD_ITEMS.filter(f => f.rarity !== 'common'), ...OUTFIT_ITEMS.filter(o => !ownedOutfits.includes(o.id))];
    const reward = allItems[Math.floor(Math.random() * allItems.length)];
    if (reward) {
      if ('hungerRestore' in reward) {
        buyFood(reward as FoodItem);
        addCoins(reward.price); // Refund since buyFood deducts
      } else {
        const outfit = reward as OutfitItem;
        if (!ownedOutfits.includes(outfit.id)) {
          buyOutfit(outfit);
          addCoins(outfit.price); // Refund
        }
      }
      setPurchaseMsg(`Mystery Box: ${reward.name}! 🎉`);
    } else {
      addCoins(200); // Refund + bonus if nothing to give
      setPurchaseMsg('Mystery Box: 200 bonus coins! 💰');
    }
    setTimeout(() => setPurchaseMsg(''), 3000);
  };

  const tabs = [
    { id: 'food' as ShopTab, icon: <Package size={18} />, label: 'Food' },
    { id: 'outfits' as ShopTab, icon: <Shirt size={18} />, label: 'Outfits' },
    { id: 'mystery' as ShopTab, icon: <Sparkles size={18} />, label: 'Mystery' },
  ];

  const rarityColors: Record<string, string> = {
    common: '#9E9E9E',
    rare: '#4FACFE',
    epic: '#E8B4F7',
    legendary: '#FFD700',
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka)', color: '#FF6B9D' }}>
            🛒 Shop
          </h1>
          <div className="flex items-center justify-center gap-6 mt-3">
            <span className="text-lg font-bold" style={{ color: '#FFD700', fontFamily: 'var(--font-orbitron)' }}>
              💰 {coins.toLocaleString()}
            </span>
            <span className="text-lg font-bold" style={{ color: '#E8B4F7', fontFamily: 'var(--font-orbitron)' }}>
              💎 {gems}
            </span>
          </div>
        </motion.div>

        {/* Purchase notification */}
        <AnimatePresence>
          {purchaseMsg && (
            <motion.div
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-3 flex items-center gap-2"
              style={{ borderColor: 'rgba(76,175,80,0.3)', boxShadow: '0 0 20px rgba(76,175,80,0.2)' }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Check size={18} className="text-green-400" />
              <span className="font-bold" style={{ fontFamily: 'var(--font-fredoka)', color: '#4CAF50' }}>
                {purchaseMsg}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all"
              style={{
                background: activeTab === tab.id ? 'rgba(255,107,157,0.15)' : 'rgba(255,255,255,0.04)',
                border: activeTab === tab.id ? '1px solid rgba(255,107,157,0.3)' : '1px solid rgba(255,255,255,0.06)',
                color: activeTab === tab.id ? '#FF6B9D' : 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-fredoka)',
              }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'food' && (
            <motion.div
              key="food"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {FOOD_ITEMS.map((food, i) => (
                <motion.div
                  key={food.id}
                  className="glass-card p-5 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="text-4xl mb-3">{food.icon}</div>
                  <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-fredoka)' }}>{food.name}</h3>
                  <div className="text-xs opacity-60 mb-2">
                    +{food.hungerRestore} 🍖 · +{food.happinessBoost} 😊
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                    background: `${rarityColors[food.rarity]}20`,
                    color: rarityColors[food.rarity],
                  }}>
                    {food.rarity}
                  </span>
                  <motion.button
                    className="w-full mt-4 py-2.5 rounded-xl font-bold text-sm"
                    style={{
                      background: coins >= food.price
                        ? 'linear-gradient(135deg, #FFD700, #FF9800)'
                        : 'rgba(255,255,255,0.05)',
                      color: coins >= food.price ? '#1A1625' : 'rgba(255,255,255,0.3)',
                      fontFamily: 'var(--font-fredoka)',
                      cursor: coins >= food.price ? 'pointer' : 'not-allowed',
                    }}
                    whileHover={coins >= food.price ? { scale: 1.03 } : {}}
                    whileTap={coins >= food.price ? { scale: 0.97 } : {}}
                    onClick={() => handleBuyFood(food)}
                    disabled={coins < food.price}
                  >
                    💰 {food.price}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'outfits' && (
            <motion.div
              key="outfits"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {OUTFIT_ITEMS.map((outfit, i) => {
                const owned = ownedOutfits.includes(outfit.id);
                const levelLocked = level < outfit.unlockLevel;
                return (
                  <motion.div
                    key={outfit.id}
                    className="glass-card p-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ opacity: levelLocked ? 0.4 : 1 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{levelLocked ? '🔒' : outfit.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold" style={{ fontFamily: 'var(--font-fredoka)' }}>{outfit.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{
                            background: `${rarityColors[outfit.rarity]}20`,
                            color: rarityColors[outfit.rarity],
                          }}>
                            {outfit.rarity}
                          </span>
                          <span className="text-xs opacity-50 capitalize">{outfit.category}</span>
                        </div>
                        {levelLocked && (
                          <span className="text-xs mt-1 block" style={{ color: '#f44336' }}>
                            Unlock at Level {outfit.unlockLevel}
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      className="w-full mt-4 py-2.5 rounded-xl font-bold text-sm"
                      style={{
                        background: owned
                          ? 'rgba(76,175,80,0.15)'
                          : coins >= outfit.price && !levelLocked
                            ? 'linear-gradient(135deg, #FFD700, #FF9800)'
                            : 'rgba(255,255,255,0.05)',
                        color: owned
                          ? '#4CAF50'
                          : coins >= outfit.price && !levelLocked
                            ? '#1A1625'
                            : 'rgba(255,255,255,0.3)',
                        fontFamily: 'var(--font-fredoka)',
                        cursor: owned || levelLocked || coins < outfit.price ? 'default' : 'pointer',
                      }}
                      whileHover={!owned && !levelLocked && coins >= outfit.price ? { scale: 1.03 } : {}}
                      disabled={owned || levelLocked || coins < outfit.price}
                      onClick={() => handleBuyOutfit(outfit)}
                    >
                      {owned ? '✅ Owned' : `💰 ${outfit.price}`}
                    </motion.button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'mystery' && (
            <motion.div
              key="mystery"
              className="max-w-md mx-auto text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.div
                className="glass-card p-10"
                animate={{ boxShadow: ['0 0 20px rgba(232,180,247,0.2)', '0 0 40px rgba(255,107,157,0.3)', '0 0 20px rgba(232,180,247,0.2)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  className="text-7xl mb-6"
                  animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎁
                </motion.div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka)', color: '#E8B4F7' }}>
                  Mystery Box
                </h3>
                <p className="opacity-60 mb-6">
                  Contains a random rare item! Could be food, outfits, or something special...
                </p>
                <motion.button
                  className="py-4 px-8 rounded-2xl text-xl font-bold"
                  style={{
                    background: coins >= 500
                      ? 'linear-gradient(135deg, #E8B4F7, #FF6B9D)'
                      : 'rgba(255,255,255,0.05)',
                    color: coins >= 500 ? '#1A1625' : 'rgba(255,255,255,0.3)',
                    fontFamily: 'var(--font-fredoka)',
                    cursor: coins >= 500 ? 'pointer' : 'not-allowed',
                    boxShadow: coins >= 500 ? '0 0 25px rgba(232,180,247,0.3)' : 'none',
                  }}
                  whileHover={coins >= 500 ? { scale: 1.05 } : {}}
                  whileTap={coins >= 500 ? { scale: 0.95 } : {}}
                  onClick={handleMysteryBox}
                >
                  💰 500 — Open Box!
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
