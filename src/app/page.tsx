'use client'

import { SpiralAnimation } from "@/components/ui/spiral-animation"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [startVisible, setStartVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()
  
  // Fade in the Enter button after animation loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartVisible(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  const handleEnter = () => {
    setIsTransitioning(true)
    // Brief transition effect before navigating
    setTimeout(() => {
      router.push('/home')
    }, 800)
  }
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden" style={{ background: '#120E1C' }}>
      {/* Spiral Animation Background */}
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>
      
      {/* Subtle gradient overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(18, 14, 28, 0.4) 100%)',
        }}
      />

      {/* Content Overlay */}
      <div 
        className={`
          absolute inset-0 z-10 flex flex-col items-center justify-center
          transition-all duration-1000 ease-out
          ${isTransitioning ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}
        `}
      >
        {/* Title - appears first */}
        <div 
          className={`
            text-center mb-16 transition-all duration-1000 ease-out
            ${startVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
          `}
        >
          <h1 
            className="text-5xl md:text-7xl font-bold mb-3 tracking-wider"
            style={{ 
              fontFamily: 'var(--font-fredoka)',
              color: '#FF6B9D',
              textShadow: `
                0 0 10px rgba(255, 107, 157, 0.8),
                0 0 20px rgba(255, 107, 157, 0.5),
                0 0 40px rgba(255, 107, 157, 0.3),
                0 0 80px rgba(255, 107, 157, 0.15)
              `,
            }}
          >
            PETVERSE
          </h1>
          <p 
            className="text-sm md:text-base tracking-[0.3em] uppercase"
            style={{ 
              fontFamily: 'var(--font-nunito)',
              color: 'rgba(232, 180, 247, 0.6)',
              textShadow: '0 0 10px rgba(232, 180, 247, 0.3)',
            }}
          >
            Your Digital Companion Awaits
          </p>
        </div>

        {/* Enter Button */}
        <div 
          className={`
            transition-all duration-[1500ms] ease-out
            ${startVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
          style={{ transitionDelay: '500ms' }}
        >
          <button 
            onClick={handleEnter}
            className="
              relative group cursor-pointer
              text-white text-xl md:text-2xl tracking-[0.25em] uppercase font-extralight
              px-10 py-4
              transition-all duration-700
              hover:tracking-[0.4em]
            "
            style={{
              fontFamily: 'var(--font-fredoka)',
              color: '#E8B4F7',
              textShadow: '0 0 15px rgba(232, 180, 247, 0.5)',
            }}
          >
            {/* Button glow border */}
            <span 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 107, 157, 0.3)',
                boxShadow: '0 0 20px rgba(255, 107, 157, 0.15), inset 0 0 20px rgba(255, 107, 157, 0.05)',
              }}
            />
            
            {/* Pulsing dot */}
            <span className="inline-block w-2 h-2 rounded-full mr-4 animate-pulse" 
              style={{ background: '#FF6B9D', boxShadow: '0 0 8px rgba(255, 107, 157, 0.8)' }} 
            />
            Enter
            <span className="inline-block w-2 h-2 rounded-full ml-4 animate-pulse" 
              style={{ background: '#4FACFE', boxShadow: '0 0 8px rgba(79, 172, 254, 0.8)' }} 
            />
          </button>
        </div>
        
        {/* Subtle paw print decorations */}
        <div 
          className={`
            absolute bottom-8 text-center transition-all duration-1000 ease-out
            ${startVisible ? 'opacity-30' : 'opacity-0'}
          `}
          style={{ transitionDelay: '1200ms' }}
        >
          <span className="text-2xl tracking-[1em]" style={{ filter: 'blur(0.5px)' }}>
            🐾 🐾 🐾
          </span>
        </div>
      </div>
    </div>
  )
}
