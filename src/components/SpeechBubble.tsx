'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SpeechBubbleProps {
  message: string;
  duration?: number;
  onDismiss?: () => void;
}

export default function SpeechBubble({ message, duration = 5000, onDismiss }: SpeechBubbleProps) {
  const [visible, setVisible] = useState(true);
  const [displayText, setDisplayText] = useState('');

  // Typing effect
  useEffect(() => {
    setDisplayText('');
    setVisible(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setDisplayText(message.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    const timeout = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [message, duration, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="speech-bubble max-w-xs cursor-pointer"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
        >
          <span style={{ fontFamily: 'var(--font-bubblegum)' }}>
            {displayText}
          </span>
          {displayText.length < message.length && (
            <span className="inline-block w-0.5 h-4 bg-white/60 ml-1 animate-pulse" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
