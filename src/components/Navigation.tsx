'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, Shirt, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePetStore } from '@/store/petStore';

const NAV_ITEMS = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/play', icon: Gamepad2, label: 'Play' },
  { href: '/customize', icon: Shirt, label: 'Dress' },
  { href: '/shop', icon: ShoppingBag, label: 'Shop' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { coins, gems, consecutiveDays } = usePetStore();

  return (
    <motion.nav
      className="sticky top-0 z-50 px-4 py-2"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="max-w-5xl mx-auto flex items-center justify-between rounded-2xl px-2 py-2"
        style={{
          background: 'rgba(26, 22, 37, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 px-3">
          <span className="text-xl">🐾</span>
          <span 
            className="text-lg font-bold neon-text hidden sm:inline"
            style={{ fontFamily: 'var(--font-fredoka)', color: '#FF6B9D' }}
          >
            Petverse
          </span>
        </Link>

        {/* Nav Items */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className="relative flex flex-col items-center px-3 py-1.5 rounded-xl transition-all"
                  style={{
                    background: isActive ? 'rgba(255,107,157,0.15)' : 'transparent',
                    color: isActive ? '#FF6B9D' : 'rgba(255,255,255,0.5)',
                  }}
                  whileHover={{ 
                    backgroundColor: 'rgba(255,107,157,0.1)',
                    color: '#FF6B9D',
                  }}
                >
                  <item.icon size={20} />
                  <span className="text-xs mt-0.5 font-semibold" style={{ fontFamily: 'var(--font-nunito)' }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-0.5 w-6 h-0.5 rounded-full"
                      style={{ background: '#FF6B9D', boxShadow: '0 0 8px rgba(255,107,157,0.5)' }}
                      layoutId="navIndicator"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Status Bar */}
        <div className="hidden md:flex items-center gap-3 px-3">
          {consecutiveDays > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold" style={{ color: '#FF9800' }}>
              🔥 {consecutiveDays}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs font-bold" style={{ color: '#FFD700' }}>
            💰 {coins.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold" style={{ color: '#E8B4F7' }}>
            💎 {gems}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
