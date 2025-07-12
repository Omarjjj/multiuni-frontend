// Route transition animations using GSAP
// This module handles animations between page transitions

// Import GSAP directly 
import gsap from 'gsap';

const animateRoute = () => {
  // Create timeline with default settings
  const tl = gsap.timeline({ 
    defaults: { 
      ease: 'power3.inOut', 
      duration: 0.8 
    }
  });

  // Animate out university cards and header first
  tl.to('.university-card', { y: -50, opacity: 0, stagger: 0.05 })
    .to('.landing-header', { y: -30, opacity: 0 }, '<') // Start at same time as cards
    
    // Then animate in chat components
    .from('.chat-header', { y: -100, opacity: 0 })
    .from('.chat-window', { scale: 0.92, opacity: 0 }, '<0.1'); // Start slightly after header

  return tl;
};

// Check for reduced motion preference
const shouldAnimate = () => {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Export the animation function with a check for motion preferences
export const animateRouteTransition = () => {
  if (shouldAnimate()) {
    return animateRoute();
  }
  // Return null for consistent API when animations are disabled
  return null;
};

export default animateRouteTransition; 