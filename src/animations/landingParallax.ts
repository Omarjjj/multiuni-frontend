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
    
    // Enhanced card parallax with smoother animations
    if (cards.length > 0) {
      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const cardCenter = cardRect.top + cardRect.height / 2;
        const scrollProgress = (window.innerHeight - cardCenter) / window.innerHeight;
        
        const translateY = Math.max(-20, Math.min(20, scrollProgress * 20));
        const scale = 0.98 + (Math.min(1, Math.max(0, scrollProgress)) * 0.02);
        
        gsap.set(cardElement, {
          y: translateY,
          scale: scale,
          rotationY: translateY * 0.5,
          ease: 'none'
        });
      });
    }
  } catch (error) {
    console.warn('Failed to initialize landing page parallax:', error);
    // Gracefully fail - parallax is a progressive enhancement
  }
};

export default initLandingParallax; 