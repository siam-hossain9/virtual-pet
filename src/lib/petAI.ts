import { Emotion, PetType } from '@/store/petStore';

// ============================================
// DIALOGUE SYSTEM
// ============================================

const dialogues: Record<Emotion, Record<PetType, string[]>> = {
  happy: {
    fox: ["Yip yip! I'm so happy! ✨", "Wanna play chase? 🦊", "You're my favorite human! 💕", "Life is wonderful! 🌸"],
    dragon: ["Rawr! I feel amazing! 🔥", "Let's go on an adventure! ⚔️", "I could fly all day! 🐉", "You make me happy! 💗"],
    cat: ["Purrrr... life is good 😸", "I suppose you're acceptable... just kidding, you're great! 💜", "Meow~ ✨", "Feeling fabulous today! 🌟"],
    bunny: ["Hippity hop, I'm so happy! 🐰", "Let's play in the garden! 🌷", "Boing boing! 💕", "Everything feels wonderful! ✨"],
    ghost: ["Wooo~ I feel floaty and happy! 👻", "Being a ghost is fun with you! ✨", "Boo! Just kidding, I'm happy! 💜", "Floating on cloud nine! ☁️"],
  },
  sad: {
    fox: ["My tummy is grumbling... 🥺", "I miss playing with you...", "Can we do something fun? 😢", "I feel a bit down..."],
    dragon: ["Even dragons get sad sometimes... 😢", "I need a hug... or a snack 🥺", "The sky looks gray today...", "Will you cheer me up?"],
    cat: ["*sigh* ...meow 😿", "I don't feel like doing anything...", "Could you pet me? Maybe? 🥺", "I'm not angry, just... sad"],
    bunny: ["My ears are drooping... 🥺", "I don't feel like hopping today...", "Please come back soon... 😢", "A carrot might help..."],
    ghost: ["I feel so invisible... 👻💧", "Even ghosts can feel lonely...", "I'm fading a little... 🥺", "Please don't forget about me..."],
  },
  excited: {
    fox: ["YIPPEE! Let's go let's go! 🎉🦊", "I CAN'T STOP WAGGING MY TAIL! ✨", "THIS IS THE BEST DAY! 🌟", "More treats more treats!! 🍖"],
    dragon: ["ROARRR! I'M ON FIRE! 🔥🔥🔥", "LET'S FLY TO THE MOON! 🌙", "I feel LEGENDARY! ⚡", "ADVENTURE AWAITS! ⚔️✨"],
    cat: ["ZOOMIES! 🏃💨", "I can't contain myself! Meow meow meow! ✨", "Did someone say treats?! 🤩", "CATCH ME IF YOU CAN! 🌟"],
    bunny: ["BOING BOING BOING! 🐰✨", "I'M SO EXCITED I CAN'T STOP JUMPING! 🎉", "EVERYTHING IS AMAZING! 🌈", "Let's play ALL the games! 🎮"],
    ghost: ["WOOOOO! I'm GLOWING! ✨👻", "SO MUCH ENERGY! I might break through a wall! 💥", "BEST. DAY. EVER! 🌟", "I'm literally vibrating! ⚡"],
  },
  tired: {
    fox: ["*yawwwwn* ...so sleepy 😴", "Can I take a nap? 💤", "Five more minutes... zzz", "My paws are heavy..."],
    dragon: ["Even mighty dragons... *yawn* ...need rest 😴", "I'll guard treasure later... zzz 💤", "Need... sleep... fire... later...", "*curls up* zzz"],
    cat: ["I was BORN to nap 😸💤", "*stretches* Time for my 15th nap today...", "Don't wake me... zzz 😴", "Sleep is my favorite hobby..."],
    bunny: ["*flop* Too tired to hop... 😴", "Can I sleep in? 💤", "My ears won't stay up... zzz", "Counting sheep to fall asleep... 🐑"],
    ghost: ["Ghosts need beauty sleep too... 😴👻", "Fading... into... dreamland... 💤", "Even the afterlife is tiring...", "Going transparent... so sleepy... zzz"],
  },
  angry: {
    fox: ["Hmph! Leave me alone! 😤", "I'm NOT happy right now! 🦊💢", "Too many pokes! Stop it!", "I need some space! 😠"],
    dragon: ["GRRRR! Don't push me! 🔥😤", "My fire is HOT right now! 💢", "Back off! I'm not in the mood!", "Even dragons have limits! 😠"],
    cat: ["Do. Not. Touch. Me. 😾", "I will scratch you! 💢", "You've crossed the line, human! 🐱😤", "HISSS! 😠"],
    bunny: ["*stomps foot* I'm upset! 😤", "Even bunnies get mad! 💢", "No! I don't want to play!", "Leave me alone for a bit... 😠"],
    ghost: ["BOO! And I mean it this time! 👻😤", "I'll haunt your dreams! 💢", "I'm going through a WALL! 😠", "Don't bother me right now!"],
  },
  sick: {
    fox: ["I don't feel so good... 🤒", "My tummy hurts... 😷", "Can you help me feel better? 🥺", "Everything feels wobbly..."],
    dragon: ["My fire won't light... 🤒", "I think I caught a cold... 😷", "Even my scales feel wrong...", "Need medicine... or magic... 🥺"],
    cat: ["*weak meow* ...I'm sick 🤒", "Can't groom myself today... 😷", "I need rest and care... 🥺", "Everything hurts..."],
    bunny: ["My hop is all wobbly... 🤒", "I feel dizzy... 😷", "Please take care of me... 🥺", "Need cuddles and medicine..."],
    ghost: ["I'm more see-through than usual... 🤒", "Can ghosts get sick? Apparently yes... 😷", "I feel like I'm fading... 🥺", "Help me feel solid again..."],
  },
  neutral: {
    fox: ["Hey there! What's up? 🦊", "Just hanging around! 👋", "Got any plans? 🤔", "Nice to see you!"],
    dragon: ["Greetings, friend! 🐉", "Just guarding my hoard... 💎", "What adventure awaits? ⚔️", "The skies are clear today!"],
    cat: ["Oh, it's you. 🐱", "I was just napping... what? 😼", "Meow. 🐾", "I guess I'm glad to see you..."],
    bunny: ["Hi there! 🐰", "Just nibbling on some greens! 🥬", "Want to hang out? 🌸", "Happy to see you!"],
    ghost: ["Boo! Oh wait, hi! 👻", "Just floating around! ☁️", "What should we do? 🤔", "I've been haunting peacefully!"],
  },
};

export function getPetDialogue(emotion: Emotion, petType: PetType): string {
  const options = dialogues[emotion]?.[petType] || dialogues.neutral[petType];
  return options[Math.floor(Math.random() * options.length)];
}

// ============================================
// GREETING SYSTEM
// ============================================

export function getGreeting(
  petType: PetType,
  petName: string,
  hoursSinceLastVisit: number,
  consecutiveDays: number
): string {
  const hour = new Date().getHours();

  // Time-based greeting prefix
  let timeGreeting = '';
  if (hour >= 5 && hour < 12) timeGreeting = 'Good morning';
  else if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
  else if (hour >= 17 && hour < 21) timeGreeting = 'Good evening';
  else timeGreeting = "It's late! You should rest soon";

  // Return-based messages
  if (hoursSinceLastVisit < 0.5) {
    return `Back already? I missed you! 💕`;
  } else if (hoursSinceLastVisit < 6) {
    return `${timeGreeting}! Ready for more fun? ✨`;
  } else if (hoursSinceLastVisit < 24) {
    return `${timeGreeting}! Welcome back, friend! 🌟`;
  } else if (hoursSinceLastVisit < 72) {
    return `You're back! I was getting worried... 🥺`;
  } else if (hoursSinceLastVisit < 168) {
    return `Where have you been?! I missed you SO much! 😢💕`;
  } else {
    return `You came back! I thought you forgot about me... 😢 But I'm so happy to see you! 💗`;
  }
}

// ============================================
// EMOTION DETECTION
// ============================================

export function getEmotionEmoji(emotion: Emotion): string {
  const emojis: Record<Emotion, string> = {
    happy: '😊',
    sad: '😢',
    excited: '🤩',
    tired: '😴',
    angry: '😠',
    sick: '🤒',
    neutral: '😐',
  };
  return emojis[emotion];
}

export function getEmotionColor(emotion: Emotion): string {
  const colors: Record<Emotion, string> = {
    happy: '#FFEB3B',
    sad: '#4FACFE',
    excited: '#FF6B9D',
    tired: '#9E9E9E',
    angry: '#f44336',
    sick: '#4CAF50',
    neutral: '#E8B4F7',
  };
  return colors[emotion];
}

// ============================================
// PET TYPE INFO
// ============================================

export interface PetTypeInfo {
  type: PetType;
  name: string;
  icon: string;
  personality: string;
  description: string;
  color: string;
  bgGradient: string;
}

export const PET_TYPES: PetTypeInfo[] = [
  {
    type: 'fox',
    name: 'Fox Spirit',
    icon: '🦊',
    personality: 'Playful & Mischievous',
    description: 'A spirited kitsune who loves adventures and tricks. Grows more tails as your bond deepens!',
    color: '#FF8C42',
    bgGradient: 'linear-gradient(135deg, #FF6B35, #FF8C42, #FFB347)',
  },
  {
    type: 'dragon',
    name: 'Dragon Hatchling',
    icon: '🐉',
    personality: 'Curious & Adventurous',
    description: 'A tiny dragon ready to explore the world. Wings grow bigger as it evolves!',
    color: '#7C4DFF',
    bgGradient: 'linear-gradient(135deg, #6C3CF5, #7C4DFF, #B388FF)',
  },
  {
    type: 'cat',
    name: 'Cat Familiar',
    icon: '🐱',
    personality: 'Independent & Affectionate',
    description: 'A magical cat with mystical powers. Changes fur patterns based on mood!',
    color: '#FF6B9D',
    bgGradient: 'linear-gradient(135deg, #E91E63, #FF6B9D, #F48FB1)',
  },
  {
    type: 'bunny',
    name: 'Bunny Companion',
    icon: '🐰',
    personality: 'Gentle & Energetic',
    description: 'An adorable moon rabbit full of energy. Its ears change with its emotions!',
    color: '#4FACFE',
    bgGradient: 'linear-gradient(135deg, #2196F3, #4FACFE, #80D8FF)',
  },
  {
    type: 'ghost',
    name: 'Ghost Friend',
    icon: '👻',
    personality: 'Shy & Curious',
    description: 'A friendly spirit seeking companionship. Transparency changes with energy level!',
    color: '#43E97B',
    bgGradient: 'linear-gradient(135deg, #00C853, #43E97B, #B9F6CA)',
  },
];

// ============================================
// EVOLUTION INFO
// ============================================

export function getEvolutionInfo(evolution: string) {
  switch(evolution) {
    case 'baby': return { label: 'Baby', scale: 0.8, color: '#FFB88C' };
    case 'youth': return { label: 'Youth', scale: 1.0, color: '#4FACFE' };
    case 'adult': return { label: 'Adult', scale: 1.2, color: '#E8B4F7' };
    case 'legendary': return { label: 'Legendary', scale: 1.4, color: '#FFD700' };
    default: return { label: 'Baby', scale: 0.8, color: '#FFB88C' };
  }
}
