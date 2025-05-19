// Landing page parallax effect using GSAP ScrollTrigger
// This creates a subtle parallax effect for university cards when scrolling

const initLandingParallax = async () => {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  try {
    // Dynamically import GSAP and ScrollTrigger to reduce initial bundle size
    const gsapModule = await import('gsap');
    const gsap = gsapModule.default;
    
    // Need to import ScrollTrigger as a plugin
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    
    // Register the plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Get all university cards on the page
    const cards = gsap.utils.toArray('.university-card');
    
    // Apply parallax effect to each card
    cards.forEach((card: HTMLElement) => {
      gsap.to(card, {
        yPercent: -10, // Move up by 10% of the element's height
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom', // Start when the top of the card hits the bottom of the viewport
          end: 'bottom top',   // End when the bottom of the card hits the top of the viewport
          scrub: 1,            // Smooth scrubbing effect with 1 second lag
        }
      });
    });
  } catch (error) {
    console.warn('Failed to initialize landing page parallax:', error);
    // Gracefully fail - parallax is a progressive enhancement
  }
};

export default initLandingParallax; 