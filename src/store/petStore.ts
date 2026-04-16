import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// TYPES
// ============================================

export type PetType = 'fox' | 'dragon' | 'cat' | 'bunny' | 'ghost';
export type Evolution = 'baby' | 'youth' | 'adult' | 'legendary';
export type Emotion = 'happy' | 'sad' | 'excited' | 'tired' | 'angry' | 'sick' | 'neutral';
export type BondTier = 'stranger' | 'friend' | 'bestfriend' | 'soulmate' | 'legendary';

export interface FoodItem {
  id: string;
  name: string;
  icon: string;
  hungerRestore: number;
  happinessBoost: number;
  rarity: 'common' | 'rare' | 'epic';
  price: number;
}

export interface OutfitItem {
  id: string;
  name: string;
  icon: string;
  category: 'hat' | 'outfit' | 'accessory' | 'effect';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  unlockLevel: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  coinReward: number;
  unlockedAt?: number;
}

export interface PetState {
  // Identity
  petType: PetType | null;
  petName: string;
  isAdopted: boolean;

  // Core Stats (0-100)
  health: number;
  hunger: number;
  happiness: number;
  energy: number;
  cleanliness: number;

  // Growth
  level: number;
  xp: number;
  xpToNext: number;
  evolution: Evolution;
  age: number; // days since adoption

  // Relationship
  bondLevel: number; // 1-10
  bondXp: number;
  bondTier: BondTier;

  // Inventory
  coins: number;
  gems: number;
  foodInventory: { id: string; qty: number }[];
  ownedOutfits: string[];
  equippedOutfits: { hat?: string; outfit?: string; accessory?: string; effect?: string };

  // Progress
  totalVisits: number;
  consecutiveDays: number;
  lastVisit: number; // timestamp
  createdAt: number;
  achievementsUnlocked: string[];
  minigameHighScores: Record<string, number>;

  // Daily
  lastDailyReward: string; // date string YYYY-MM-DD
  dailyRewardDay: number; // 1-7 cycle

  // Preferences (AI memory)
  favoriteFood: string;
  favoriteGame: string;
  interactionCounts: Record<string, number>;

  // Rooms
  currentRoom: string;
  unlockedRooms: string[];
  roomTheme: string;
}

export interface PetActions {
  // Setup
  adoptPet: (type: PetType, name: string) => void;
  resetPet: () => void;

  // Core Actions
  feed: (foodId: string) => void;
  pet: () => void;
  play: (game: string, xpEarned: number) => void;
  clean: () => void;
  rest: () => void;

  // Stats Management
  updateStatsOverTime: () => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;

  // Inventory
  buyFood: (food: FoodItem) => boolean;
  buyOutfit: (outfit: OutfitItem) => boolean;
  equipOutfit: (category: string, itemId: string) => void;
  unequipOutfit: (category: string) => void;

  // Progress
  claimDailyReward: () => { coins: number; item?: string } | null;
  unlockAchievement: (id: string) => void;
  updateHighScore: (game: string, score: number) => void;

  // Rooms
  changeRoom: (room: string) => void;
  unlockRoom: (room: string) => void;

  // Helpers
  getEmotion: () => Emotion;
  getBondTier: () => BondTier;
  getEvolution: () => Evolution;
}

// ============================================
// CONSTANTS
// ============================================

export const FOOD_ITEMS: FoodItem[] = [
  { id: 'bread', name: 'Bread', icon: '🍞', hungerRestore: 10, happinessBoost: 2, rarity: 'common', price: 10 },
  { id: 'apple', name: 'Apple', icon: '🍎', hungerRestore: 15, happinessBoost: 3, rarity: 'common', price: 15 },
  { id: 'fish', name: 'Fish', icon: '🐟', hungerRestore: 20, happinessBoost: 5, rarity: 'common', price: 25 },
  { id: 'sushi', name: 'Sushi', icon: '🍣', hungerRestore: 25, happinessBoost: 8, rarity: 'rare', price: 50 },
  { id: 'cake', name: 'Cake', icon: '🍰', hungerRestore: 20, happinessBoost: 15, rarity: 'rare', price: 60 },
  { id: 'steak', name: 'Steak', icon: '🥩', hungerRestore: 35, happinessBoost: 10, rarity: 'rare', price: 80 },
  { id: 'golden_apple', name: 'Golden Apple', icon: '✨🍎', hungerRestore: 50, happinessBoost: 20, rarity: 'epic', price: 200 },
  { id: 'star_candy', name: 'Star Candy', icon: '⭐🍬', hungerRestore: 30, happinessBoost: 30, rarity: 'epic', price: 150 },
];

export const OUTFIT_ITEMS: OutfitItem[] = [
  { id: 'flower_crown', name: 'Flower Crown', icon: '🌸', category: 'hat', rarity: 'common', price: 100, unlockLevel: 1 },
  { id: 'witch_hat', name: 'Witch Hat', icon: '🧙', category: 'hat', rarity: 'rare', price: 300, unlockLevel: 5 },
  { id: 'halo', name: 'Angel Halo', icon: '😇', category: 'hat', rarity: 'epic', price: 500, unlockLevel: 10 },
  { id: 'crown', name: 'Royal Crown', icon: '👑', category: 'hat', rarity: 'legendary', price: 1000, unlockLevel: 20 },
  { id: 'hoodie', name: 'Cozy Hoodie', icon: '🧥', category: 'outfit', rarity: 'common', price: 150, unlockLevel: 1 },
  { id: 'cape', name: 'Magic Cape', icon: '🦸', category: 'outfit', rarity: 'rare', price: 400, unlockLevel: 8 },
  { id: 'armor', name: 'Knight Armor', icon: '⚔️', category: 'outfit', rarity: 'epic', price: 800, unlockLevel: 15 },
  { id: 'bow', name: 'Cute Bow', icon: '🎀', category: 'accessory', rarity: 'common', price: 80, unlockLevel: 1 },
  { id: 'glasses', name: 'Star Glasses', icon: '🤩', category: 'accessory', rarity: 'rare', price: 200, unlockLevel: 5 },
  { id: 'wings', name: 'Angel Wings', icon: '🪽', category: 'accessory', rarity: 'epic', price: 600, unlockLevel: 12 },
  { id: 'sparkle_trail', name: 'Sparkle Trail', icon: '✨', category: 'effect', rarity: 'rare', price: 350, unlockLevel: 10 },
  { id: 'heart_aura', name: 'Heart Aura', icon: '💗', category: 'effect', rarity: 'epic', price: 700, unlockLevel: 18 },
  { id: 'flame_effect', name: 'Flame Effect', icon: '🔥', category: 'effect', rarity: 'legendary', price: 1200, unlockLevel: 25 },
];

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_friend', name: 'New Friend', description: 'Adopt your first pet', icon: '🐣', rarity: 'common', xpReward: 50, coinReward: 100 },
  { id: 'first_meal', name: 'First Meal', description: 'Feed your pet for the first time', icon: '🍖', rarity: 'common', xpReward: 30, coinReward: 50 },
  { id: 'show_love', name: 'Show Love', description: 'Pet your companion 10 times', icon: '💕', rarity: 'common', xpReward: 50, coinReward: 80 },
  { id: 'playtime', name: 'Playtime!', description: 'Play a mini-game', icon: '🎾', rarity: 'common', xpReward: 40, coinReward: 60 },
  { id: 'squeaky_clean', name: 'Squeaky Clean', description: 'Give your pet a bath', icon: '🧼', rarity: 'common', xpReward: 30, coinReward: 50 },
  { id: 'week_warrior', name: 'Week Warrior', description: '7-day login streak', icon: '🔥', rarity: 'rare', xpReward: 200, coinReward: 500 },
  { id: 'level_10', name: 'Level 10!', description: 'Reach level 10', icon: '🌟', rarity: 'rare', xpReward: 300, coinReward: 500 },
  { id: 'coin_collector', name: 'Coin Collector', description: 'Earn 1,000 coins total', icon: '💰', rarity: 'rare', xpReward: 200, coinReward: 200 },
  { id: 'fashion_forward', name: 'Fashion Forward', description: 'Own 5 outfit items', icon: '🎨', rarity: 'rare', xpReward: 150, coinReward: 300 },
  { id: 'monthly_marvel', name: 'Monthly Marvel', description: '30-day login streak', icon: '📅', rarity: 'epic', xpReward: 500, coinReward: 1000 },
  { id: 'level_25', name: 'Leveling Legend', description: 'Reach level 25', icon: '🏅', rarity: 'epic', xpReward: 500, coinReward: 1000 },
  { id: 'game_master', name: 'Game Master', description: 'Win 50 mini-games', icon: '🎮', rarity: 'epic', xpReward: 400, coinReward: 800 },
  { id: 'legendary_bond', name: 'Legendary Bond', description: 'Reach max bond level', icon: '👑', rarity: 'legendary', xpReward: 1000, coinReward: 2000 },
  { id: 'ultimate_evo', name: 'Ultimate Evolution', description: 'Reach legendary evolution', icon: '🌈', rarity: 'legendary', xpReward: 1000, coinReward: 2000 },
  { id: 'max_level', name: 'Max Level', description: 'Reach level 50', icon: '⭐', rarity: 'legendary', xpReward: 2000, coinReward: 5000 },
  { id: 'night_owl', name: 'Night Owl', description: 'Visit at 3 AM', icon: '🌙', rarity: 'epic', xpReward: 200, coinReward: 300 },
  { id: 'memory_master', name: 'Memory Master', description: 'Perfect score in memory match', icon: '🧠', rarity: 'epic', xpReward: 300, coinReward: 500 },
  { id: 'treat_hunter', name: 'Treat Hunter', description: 'Score 500+ in treat catch', icon: '🎯', rarity: 'rare', xpReward: 200, coinReward: 300 },
  { id: 'shopaholic', name: 'Shopaholic', description: 'Purchase 20 items', icon: '🛍️', rarity: 'rare', xpReward: 200, coinReward: 300 },
  { id: 'true_love', name: 'True Love', description: 'Max all stats to 100', icon: '💝', rarity: 'legendary', xpReward: 500, coinReward: 1000 },
];

const DAILY_REWARDS = [
  { day: 1, coins: 100, item: null },
  { day: 2, coins: 50, item: 'bread' },
  { day: 3, coins: 200, item: null },
  { day: 4, coins: 100, item: 'sushi' },
  { day: 5, coins: 300, item: null },
  { day: 6, coins: 150, item: 'bow' },
  { day: 7, coins: 1000, item: 'star_candy' },
];

// ============================================
// INITIAL STATE
// ============================================

const initialState: PetState = {
  petType: null,
  petName: '',
  isAdopted: false,

  health: 100,
  hunger: 100,
  happiness: 100,
  energy: 100,
  cleanliness: 100,

  level: 1,
  xp: 0,
  xpToNext: 100,
  evolution: 'baby',
  age: 0,

  bondLevel: 1,
  bondXp: 0,
  bondTier: 'stranger',

  coins: 500,
  gems: 5,
  foodInventory: [
    { id: 'bread', qty: 5 },
    { id: 'apple', qty: 3 },
  ],
  ownedOutfits: [],
  equippedOutfits: {},

  totalVisits: 0,
  consecutiveDays: 0,
  lastVisit: 0,
  createdAt: 0,
  achievementsUnlocked: [],
  minigameHighScores: {},

  lastDailyReward: '',
  dailyRewardDay: 0,

  favoriteFood: '',
  favoriteGame: '',
  interactionCounts: {},

  currentRoom: 'home',
  unlockedRooms: ['home'],
  roomTheme: 'cozy',
};

// ============================================
// STORE
// ============================================

export const usePetStore = create<PetState & PetActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ---- SETUP ----
      adoptPet: (type, name) => {
        const now = Date.now();
        set({
          petType: type,
          petName: name,
          isAdopted: true,
          createdAt: now,
          lastVisit: now,
          totalVisits: 1,
          consecutiveDays: 1,
          health: 100,
          hunger: 100,
          happiness: 100,
          energy: 100,
          cleanliness: 100,
        });
        // Unlock first achievement
        get().unlockAchievement('first_friend');
      },

      resetPet: () => set(initialState),

      // ---- CORE ACTIONS ----
      feed: (foodId) => {
        const food = FOOD_ITEMS.find(f => f.id === foodId);
        if (!food) return;

        const inv = get().foodInventory;
        const item = inv.find(i => i.id === foodId);
        if (!item || item.qty <= 0) return;

        set(state => {
          const newInv = state.foodInventory.map(i =>
            i.id === foodId ? { ...i, qty: i.qty - 1 } : i
          ).filter(i => i.qty > 0);

          const counts = { ...state.interactionCounts };
          counts['feed'] = (counts['feed'] || 0) + 1;
          counts[`food_${foodId}`] = (counts[`food_${foodId}`] || 0) + 1;

          // Track favorite
          let fav = state.favoriteFood;
          const foodCounts = FOOD_ITEMS.map(f => ({
            id: f.id,
            count: counts[`food_${f.id}`] || 0
          }));
          const topFood = foodCounts.sort((a, b) => b.count - a.count)[0];
          if (topFood) fav = topFood.id;

          return {
            hunger: Math.min(100, state.hunger + food.hungerRestore),
            happiness: Math.min(100, state.happiness + food.happinessBoost),
            foodInventory: newInv,
            interactionCounts: counts,
            favoriteFood: fav,
          };
        });

        get().addXp(5);

        // Achievement check
        if (!get().achievementsUnlocked.includes('first_meal')) {
          get().unlockAchievement('first_meal');
        }
      },

      pet: () => {
        set(state => {
          const counts = { ...state.interactionCounts };
          counts['pet'] = (counts['pet'] || 0) + 1;
          return {
            happiness: Math.min(100, state.happiness + 5),
            interactionCounts: counts,
          };
        });
        get().addXp(3);

        // Bond XP
        set(state => {
          let bondXp = state.bondXp + 2;
          let bondLevel = state.bondLevel;
          const needed = bondLevel * 50;
          if (bondXp >= needed && bondLevel < 10) {
            bondLevel += 1;
            bondXp = bondXp - needed;
          }
          return { bondXp, bondLevel };
        });

        // Achievement
        if ((get().interactionCounts['pet'] || 0) >= 10 && !get().achievementsUnlocked.includes('show_love')) {
          get().unlockAchievement('show_love');
        }
      },

      play: (game, xpEarned) => {
        set(state => {
          const counts = { ...state.interactionCounts };
          counts['play'] = (counts['play'] || 0) + 1;
          counts[`game_${game}`] = (counts[`game_${game}`] || 0) + 1;

          let favGame = state.favoriteGame;
          const games = ['memory', 'treat_catch', 'fetch'];
          const gameCounts = games.map(g => ({ id: g, count: counts[`game_${g}`] || 0 }));
          const topGame = gameCounts.sort((a, b) => b.count - a.count)[0];
          if (topGame) favGame = topGame.id;

          return {
            energy: Math.max(0, state.energy - 10),
            happiness: Math.min(100, state.happiness + 15),
            interactionCounts: counts,
            favoriteGame: favGame,
          };
        });
        get().addXp(xpEarned);

        if (!get().achievementsUnlocked.includes('playtime')) {
          get().unlockAchievement('playtime');
        }
        if ((get().interactionCounts['play'] || 0) >= 50 && !get().achievementsUnlocked.includes('game_master')) {
          get().unlockAchievement('game_master');
        }
      },

      clean: () => {
        set(state => {
          const counts = { ...state.interactionCounts };
          counts['clean'] = (counts['clean'] || 0) + 1;
          return {
            cleanliness: 100,
            happiness: Math.min(100, state.happiness + 10),
            interactionCounts: counts,
          };
        });
        get().addXp(15);
        if (!get().achievementsUnlocked.includes('squeaky_clean')) {
          get().unlockAchievement('squeaky_clean');
        }
      },

      rest: () => {
        set({
          energy: 100,
          happiness: Math.min(100, get().happiness + 5),
        });
      },

      // ---- STATS MANAGEMENT ----
      updateStatsOverTime: () => {
        const now = Date.now();
        const { lastVisit } = get();
        if (!lastVisit) return;

        const hoursPassed = Math.min((now - lastVisit) / (1000 * 60 * 60), 72); // Cap at 72 hours
        if (hoursPassed < 0.01) return;

        // Calculate days since adoption
        const daysSinceAdoption = Math.floor((now - get().createdAt) / (1000 * 60 * 60 * 24));
        
        // Check consecutive days
        const lastDate = new Date(lastVisit).toDateString();
        const today = new Date().toDateString();
        const yesterday = new Date(now - 86400000).toDateString();

        let consecutiveDays = get().consecutiveDays;
        if (lastDate !== today) {
          if (lastDate === yesterday) {
            consecutiveDays += 1;
          } else if (hoursPassed > 48) {
            consecutiveDays = 1; // Reset if more than 2 days
          }
        }

        set(state => ({
          hunger: Math.max(0, state.hunger - hoursPassed * 4),
          cleanliness: Math.max(0, state.cleanliness - hoursPassed * 2),
          energy: state.hunger > 50
            ? Math.min(100, state.energy + hoursPassed * 3)
            : Math.max(0, state.energy - hoursPassed * 1),
          happiness: hoursPassed > 8
            ? Math.max(0, state.happiness - (hoursPassed - 8) * 3)
            : state.happiness,
          health: state.hunger < 20 || state.cleanliness < 30
            ? Math.max(0, state.health - hoursPassed * 1)
            : Math.min(100, state.health + hoursPassed * 0.5),
          lastVisit: now,
          totalVisits: state.totalVisits + (lastDate !== today ? 1 : 0),
          consecutiveDays,
          age: daysSinceAdoption,
        }));

        // Evolution check
        const age = daysSinceAdoption;
        const bond = get().bondLevel;
        let evo: Evolution = 'baby';
        if (age >= 51 && bond >= 8) evo = 'legendary';
        else if (age >= 22) evo = 'adult';
        else if (age >= 8) evo = 'youth';
        set({ evolution: evo });

        // Streak achievements
        if (consecutiveDays >= 7 && !get().achievementsUnlocked.includes('week_warrior')) {
          get().unlockAchievement('week_warrior');
        }
        if (consecutiveDays >= 30 && !get().achievementsUnlocked.includes('monthly_marvel')) {
          get().unlockAchievement('monthly_marvel');
        }

        // Night owl
        const hour = new Date().getHours();
        if (hour >= 2 && hour <= 4 && !get().achievementsUnlocked.includes('night_owl')) {
          get().unlockAchievement('night_owl');
        }

        // True love
        const s = get();
        if (s.health >= 100 && s.hunger >= 100 && s.happiness >= 100 && s.energy >= 100 && s.cleanliness >= 100) {
          if (!s.achievementsUnlocked.includes('true_love')) {
            get().unlockAchievement('true_love');
          }
        }
      },

      addXp: (amount) => {
        set(state => {
          let xp = state.xp + amount;
          let level = state.level;
          let xpToNext = state.xpToNext;
          let coins = state.coins;

          while (xp >= xpToNext && level < 50) {
            xp -= xpToNext;
            level += 1;
            xpToNext = level * 100;
            coins += level * 20; // Level up bonus
          }

          return { xp, level, xpToNext, coins };
        });

        // Level achievements
        const lvl = get().level;
        if (lvl >= 10 && !get().achievementsUnlocked.includes('level_10')) get().unlockAchievement('level_10');
        if (lvl >= 25 && !get().achievementsUnlocked.includes('level_25')) get().unlockAchievement('level_25');
        if (lvl >= 50 && !get().achievementsUnlocked.includes('max_level')) get().unlockAchievement('max_level');
      },

      addCoins: (amount) => set(state => ({ coins: state.coins + amount })),
      addGems: (amount) => set(state => ({ gems: state.gems + amount })),

      // ---- INVENTORY ----
      buyFood: (food) => {
        if (get().coins < food.price) return false;
        set(state => {
          const inv = [...state.foodInventory];
          const existing = inv.find(i => i.id === food.id);
          if (existing) {
            existing.qty += 1;
          } else {
            inv.push({ id: food.id, qty: 1 });
          }

          const counts = { ...state.interactionCounts };
          counts['purchase'] = (counts['purchase'] || 0) + 1;

          return {
            coins: state.coins - food.price,
            foodInventory: inv,
            interactionCounts: counts,
          };
        });
        return true;
      },

      buyOutfit: (outfit) => {
        if (get().coins < outfit.price) return false;
        if (get().ownedOutfits.includes(outfit.id)) return false;
        if (get().level < outfit.unlockLevel) return false;

        set(state => {
          const counts = { ...state.interactionCounts };
          counts['purchase'] = (counts['purchase'] || 0) + 1;

          return {
            coins: state.coins - outfit.price,
            ownedOutfits: [...state.ownedOutfits, outfit.id],
            interactionCounts: counts,
          };
        });

        if (get().ownedOutfits.length >= 5 && !get().achievementsUnlocked.includes('fashion_forward')) {
          get().unlockAchievement('fashion_forward');
        }
        if ((get().interactionCounts['purchase'] || 0) >= 20 && !get().achievementsUnlocked.includes('shopaholic')) {
          get().unlockAchievement('shopaholic');
        }

        return true;
      },

      equipOutfit: (category, itemId) => {
        set(state => ({
          equippedOutfits: { ...state.equippedOutfits, [category]: itemId },
        }));
      },

      unequipOutfit: (category) => {
        set(state => {
          const eq = { ...state.equippedOutfits };
          delete eq[category as keyof typeof eq];
          return { equippedOutfits: eq };
        });
      },

      // ---- PROGRESS ----
      claimDailyReward: () => {
        const today = new Date().toISOString().split('T')[0];
        if (get().lastDailyReward === today) return null;

        const nextDay = (get().dailyRewardDay % 7) + 1;
        const reward = DAILY_REWARDS.find(r => r.day === nextDay) || DAILY_REWARDS[0];

        set(state => ({
          coins: state.coins + reward.coins,
          lastDailyReward: today,
          dailyRewardDay: nextDay,
        }));

        if (reward.item) {
          const food = FOOD_ITEMS.find(f => f.id === reward.item);
          if (food) {
            set(state => {
              const inv = [...state.foodInventory];
              const existing = inv.find(i => i.id === reward.item);
              if (existing) existing.qty += 1;
              else inv.push({ id: reward.item!, qty: 1 });
              return { foodInventory: inv };
            });
          }
        }

        return { coins: reward.coins, item: reward.item || undefined };
      },

      unlockAchievement: (id) => {
        if (get().achievementsUnlocked.includes(id)) return;
        const achievement = ALL_ACHIEVEMENTS.find(a => a.id === id);
        if (!achievement) return;

        set(state => ({
          achievementsUnlocked: [...state.achievementsUnlocked, id],
          xp: state.xp + achievement.xpReward,
          coins: state.coins + achievement.coinReward,
        }));
      },

      updateHighScore: (game, score) => {
        const current = get().minigameHighScores[game] || 0;
        if (score > current) {
          set(state => ({
            minigameHighScores: { ...state.minigameHighScores, [game]: score },
          }));
        }
        if (game === 'treat_catch' && score >= 500 && !get().achievementsUnlocked.includes('treat_hunter')) {
          get().unlockAchievement('treat_hunter');
        }
      },

      // ---- ROOMS ----
      changeRoom: (room) => {
        if (get().unlockedRooms.includes(room)) {
          set({ currentRoom: room });
        }
      },

      unlockRoom: (room) => {
        if (!get().unlockedRooms.includes(room)) {
          set(state => ({
            unlockedRooms: [...state.unlockedRooms, room],
          }));
        }
      },

      // ---- HELPERS ----
      getEmotion: () => {
        const { hunger, happiness, energy, health, cleanliness } = get();
        if (health < 30) return 'sick';
        if (hunger < 25 || happiness < 30) return 'sad';
        if (energy < 25) return 'tired';
        if (hunger > 70 && happiness > 80 && energy > 60) return 'excited';
        if (happiness > 55) return 'happy';
        return 'neutral';
      },

      getBondTier: () => {
        const level = get().bondLevel;
        if (level >= 9) return 'legendary';
        if (level >= 7) return 'soulmate';
        if (level >= 5) return 'bestfriend';
        if (level >= 3) return 'friend';
        return 'stranger';
      },

      getEvolution: () => get().evolution,
    }),
    {
      name: 'petverse-save',
    }
  )
);
