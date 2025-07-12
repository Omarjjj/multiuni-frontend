// Swipe confetti animation
// This module handles confetti animations for successful swipes

import confetti from 'react-confetti';

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: {
    x: number;
    y: number;
  };
  colors?: string[];
  duration?: number;
}

/**
 * Trigger a confetti burst when a user swipes right on a major
 * @param elementRect - The DOMRect of the element that was swiped
 */
export const triggerSwipeConfetti = (elementRect: DOMRect) => {
  // Check if we're in the browser
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  try {
    // Calculate origin relative to viewport (values between 0-1)
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    const origin = {
      // Center of the card, shifted slightly right
      x: (elementRect.left + elementRect.width * 0.75) / viewportWidth,
      // Near the top of the card
      y: (elementRect.top + elementRect.height * 0.3) / viewportHeight
    };
    
    // Confetti options
    const options: ConfettiOptions = {
      particleCount: 100,
      spread: 70,
      origin,
      colors: ['#2dd4bf', '#00bcd4', '#1F2D40', '#ffffff'],
      duration: 2000 // 2 seconds
    };
    
    // Fire confetti
    confetti(options);
  } catch (error) {
    console.warn('Failed to trigger confetti:', error);
    // Silently fail if confetti doesn't work - it's just a visual enhancement
  }
};

export default triggerSwipeConfetti; 