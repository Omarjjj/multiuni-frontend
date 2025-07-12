import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, animate } from 'framer-motion';
import { Heart, X, ArrowLeft, ArrowRight, Sparkles, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MajorCard } from './MajorCard';
import { Major, useInterest } from '@/contexts/InterestContext';

interface SwipeDeckProps {
  majors: Major[];
  onDeckEmpty: () => void;
}

const SWIPE_THRESHOLD = 100;
const DRAG_BUFFER = 50;

export const SwipeDeck: React.FC<SwipeDeckProps> = ({ majors: initialMajors, onDeckEmpty }) => {
  console.log('🎴 SwipeDeck initialized with majors:', initialMajors);
  
  const [majors, setMajors] = useState<Major[]>(initialMajors);
  const { addMajor } = useInterest();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<'liked' | 'passed' | null>(null);
  const [isDragReady, setIsDragReady] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  
  // Ref for the draggable card element (needed for Framer Motion drag)
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Optimized motion values for better performance
  const x = useMotionValue(0);
  const scale = useSpring(1, { stiffness: 400, damping: 30 });
  
  // Reset motion values when card changes
  useEffect(() => {
    x.set(0);
    scale.set(1);
  }, [cardKey, x, scale]);

  // Optimized transformations for better performance
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20]);
  const rotateY = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  
  const cardScale = useTransform(
    x, 
    [-300, -150, 0, 150, 300], 
    [0.85, 0.95, 1, 0.95, 0.85]
  );
  
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["rgba(239, 68, 68, 0.15)", "rgba(255, 255, 255, 0)", "rgba(16, 185, 129, 0.15)"]
  );

  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const likeScale = useTransform(x, [0, 60, 120], [0.5, 1.2, 1]);
  const likeRotate = useTransform(x, [0, 150], [0, 12]);
  
  const dislikeOpacity = useTransform(x, [-100, -20], [1, 0]);
  const dislikeScale = useTransform(x, [-120, -60, 0], [1, 1.2, 0.5]);
  const dislikeRotate = useTransform(x, [-150, 0], [-12, 0]);

  const currentMajor = majors[currentIndex];
  console.log('🎯 Current major at index', currentIndex, ':', currentMajor?.title || 'No major available');

  // Reset card position when index changes
  useEffect(() => {
    if (currentMajor) { 
      console.log(`SwipeDeck: currentIndex changed to ${currentIndex}. Resetting position.`);
      setIsDragReady(false); // Disable drag during transition
      setCardKey(prev => prev + 1); // Force complete remount with new key
      
      // Immediately reset all motion values to neutral position
      x.set(0);
      scale.set(1);
      
      setSwipeDirection(null);
      setActionFeedback(null);
    }
  }, [currentIndex, x, scale, currentMajor]);

  // Enable drag when card and ref are ready using layoutEffect for better timing
  useLayoutEffect(() => {
    if (currentMajor && cardKey) {
      setIsDragReady(false); // Reset first
      
      const checkRef = () => {
        if (cardRef.current) {
          // Double-check the element is actually in the DOM
          if (cardRef.current.isConnected) {
            // Extra wait to ensure Framer Motion is fully initialized
            setTimeout(() => {
              setIsDragReady(true);
              console.log('✅ Drag enabled for:', currentMajor.title, 'with key:', cardKey);
            }, 200);
          } else {
            // Retry if element isn't connected yet
            setTimeout(checkRef, 100);
          }
        } else {
          // Retry if ref isn't set yet
          setTimeout(checkRef, 100);
        }
      };
      
      // Longer delay to ensure render is complete and stable
      const timer = setTimeout(checkRef, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentMajor, cardKey]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      console.log('🧹 SwipeDeck cleanup');
      setIsDragReady(false);
      setIsAnimating(false);
    };
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    try {
      if (!currentMajor || isAnimating) {
        console.log('🚫 Swipe ignored - currentMajor:', !!currentMajor, 'isAnimating:', isAnimating);
        return;
      }

      console.log('🎯 Starting swipe animation:', direction, 'for major:', currentMajor.title);
      setIsAnimating(true);
      setIsDragReady(false); // Disable drag immediately during animation
      setSwipeDirection(direction);
      setActionFeedback(direction === 'right' ? 'liked' : 'passed');

      // Optimized exit animation
      const targetX = direction === 'right' ? 400 : -400;
      animate(x, targetX, { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      });
      
      scale.set(0.85);

      if (direction === 'right') {
        addMajor(currentMajor);
        console.log('❤️ Liked:', currentMajor.title);
      } else {
        console.log('👋 Passed:', currentMajor.title);
      }

      setTimeout(() => {
        try {
          const nextIndex = currentIndex + 1;
          if (nextIndex >= majors.length) {
            console.log('🎉 Deck completed, calling onDeckEmpty');
            onDeckEmpty();
          } else {
            console.log('➡️ Moving to next card:', nextIndex);
            setCurrentIndex(nextIndex);
          }
        } catch (error) {
          console.error('🚨 Error in handleSwipe timeout:', error);
          onDeckEmpty(); // Fallback to close deck on error
        } finally {
          setIsAnimating(false);
        }
      }, 400);
    } catch (error) {
      console.error('🚨 Error in handleSwipe:', error);
      setIsAnimating(false);
      setIsDragReady(false);
      // Reset to safe state
      animate(x, 0, { type: "spring", stiffness: 600, damping: 40 });
      scale.set(1);
    }
  };

  const onDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    try {
      if (isAnimating || !isDragReady) {
        console.log('🚫 Drag end ignored - isAnimating:', isAnimating, 'isDragReady:', isDragReady);
        return;
      }
      
      // Additional safety check for ref
      if (!cardRef.current || !cardRef.current.isConnected) {
        console.warn('⚠️ Card ref not available during drag end');
        return;
      }
      
      const { offset, velocity } = info;
      
      if (!offset || typeof offset.x !== 'number' || !velocity || typeof velocity.x !== 'number') {
        console.warn('⚠️ Invalid drag info:', info);
        animate(x, 0, { type: "spring", stiffness: 600, damping: 40 });
        scale.set(1);
        return;
      }
      
      const offsetThreshold = DRAG_BUFFER * 2;
      const velocityThreshold = SWIPE_THRESHOLD;

      if (Math.abs(offset.x) > offsetThreshold || Math.abs(velocity.x) > velocityThreshold) {
        const direction = offset.x > 0 ? 'right' : 'left';
        console.log('🎯 Triggering swipe:', direction, 'offset:', offset.x, 'velocity:', velocity.x);
        handleSwipe(direction);
      } else {
        console.log('🔄 Resetting card position');
        animate(x, 0, { type: "spring", stiffness: 600, damping: 40 });
        scale.set(1);
      }
    } catch (error) {
      console.error('🚨 Error in onDragEnd:', error);
      // Fallback to safe state
      animate(x, 0, { type: "spring", stiffness: 600, damping: 40 });
      scale.set(1);
    }
  };

  const swipeLeft = () => handleSwipe('left');
  const swipeRight = () => handleSwipe('right');

  const resetDeck = () => {
    setMajors(initialMajors);
    setCurrentIndex(0);
    x.set(0);
    scale.set(1);
    setSwipeDirection(null);
    setActionFeedback(null);
    setIsAnimating(false);
  };

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const cardStackVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const buttonVariants = {
    idle: { scale: 1, y: 0 },
    hover: { 
      scale: 1.1,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { 
      scale: 0.95, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 30
      }
    }
  };

  // Reduce floating particles for better performance
  const backgroundParticles = [...Array(8)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-primary-300/20 rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [-10, 10],
        opacity: [0.1, 0.4, 0.1],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
        ease: "easeInOut"
      }}
    />
  ));

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center 
                 bg-gradient-to-br from-primary-900/80 via-primary-800/60 to-accent-900/80 
                 backdrop-blur-xl overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Enhanced background with floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(176,141,87,0.1)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(45,212,191,0.05)_0%,_transparent_70%)]" />
        {backgroundParticles}
      </div>

      {/* Enhanced header with better desktop spacing */}
      <motion.div
        className="text-center mb-4 md:mb-8 z-10 px-4"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-center gap-3 mb-2 md:mb-4">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-shadow-strong">
            اكتشف تخصصك المثالي
          </h2>
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
        </div>
        <p className="text-white/80 text-sm md:text-lg">
          اسحب يمين للإعجاب، يسار للتمرير
        </p>
      </motion.div>

      {/* Enhanced exit button */}
      <motion.div
        className="absolute top-4 md:top-6 right-4 md:right-6 z-20"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 25 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm
                     border border-white/20 text-white hover:text-white
                     transition-all duration-300"
          onClick={onDeckEmpty}
          aria-label="Close swipe deck"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </Button>
      </motion.div>

      {/* Progress indicator with better desktop spacing */}
      <motion.div 
        className="absolute top-4 md:top-6 left-4 md:left-6 right-16 md:right-20 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white/10 rounded-full h-2 backdrop-blur-sm border border-white/20">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ 
              width: `${((currentIndex + 1) / majors.length) * 100}%` 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <p className="text-white/70 text-xs md:text-sm mt-1 md:mt-2 text-center">
          {currentIndex + 1} من {majors.length}
        </p>
      </motion.div>

      {/* Enhanced card stack area */}
      <motion.div 
        className="relative w-full max-w-sm h-[600px] md:max-w-md md:h-[650px] 
                   flex items-center justify-center mb-8 perspective-1000"
        variants={cardStackVariants}
      >
        <AnimatePresence>
          {currentMajor ? (
            <motion.div
              ref={cardRef}
              key={`${currentMajor.id}-${cardKey}`}
              className="absolute w-full h-full cursor-grab active:cursor-grabbing"
              drag={isDragReady ? "x" : false}
              dragConstraints={isDragReady ? { left: -400, right: 400 } : { left: 0, right: 0 }}
              dragElastic={isDragReady ? 0.1 : 0}
              style={{
                x,
                rotate,
                rotateY,
                scale: cardScale,
                willChange: 'transform'
              }}
              onDragEnd={isDragReady ? onDragEnd : undefined}
              onDragStart={() => {
                // Ensure drag state is consistent
                if (!isDragReady || !cardRef.current || !cardRef.current.isConnected) {
                  console.warn('⚠️ Drag started but not ready');
                  return false;
                }
                console.log('🎯 Drag started for:', currentMajor.title);
              }}
              initial={{ 
                x: 0, 
                rotate: 0,
                rotateY: 0,
                rotateX: 0,
                y: 100, 
                opacity: 0, 
                scale: 0.8
              }}
              animate={{ 
                x: 0,
                rotate: 0,
                rotateY: 0,
                rotateX: 0,
                y: 0, 
                opacity: 1, 
                scale: 1
              }}
              exit={{
                x: swipeDirection === 'right' ? 400 : -400,
                opacity: 0,
                scale: 0.6,
                rotate: swipeDirection === 'right' ? 20 : -20,
                rotateY: swipeDirection === 'right' ? 30 : -30,
                transition: {
                  duration: 0.4,
                  ease: [0.68, -0.55, 0.27, 1.55]
                }
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onAnimationComplete={() => {
                console.log('🎭 Card animation completed for:', currentMajor.title);
              }}
            >
              {/* Enhanced overlay for swipe indication */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none z-[5]
                           border-4 border-transparent transition-all duration-300"
                style={{ 
                  background: actionFeedback ? 'transparent' : background,
                  borderColor: actionFeedback === 'liked' ? '#10b981' : 
                              actionFeedback === 'passed' ? '#ef4444' : 'transparent'
                }}
              />

              {/* Enhanced like indicator */}
              <motion.div
                className="absolute top-8 right-8 bg-gradient-to-br from-emerald-400 to-green-600 
                           text-white rounded-2xl px-4 py-3 font-bold shadow-xl z-10 
                           pointer-events-none flex items-center justify-center gap-2
                           border-2 border-white/30 backdrop-blur-sm"
                style={{ 
                  opacity: likeOpacity,
                  scale: likeScale,
                  rotate: likeRotate
                }}
              >
                <Heart className="w-5 h-5" fill="currentColor" />
                <span className="text-sm">مناسب لي!</span>
              </motion.div>

              {/* Enhanced dislike indicator */}
              <motion.div
                className="absolute top-8 left-8 bg-gradient-to-br from-rose-400 to-red-600 
                           text-white rounded-2xl px-4 py-3 font-bold shadow-xl z-10 
                           pointer-events-none flex items-center justify-center gap-2
                           border-2 border-white/30 backdrop-blur-sm"
                style={{ 
                  opacity: dislikeOpacity,
                  scale: dislikeScale,
                  rotate: dislikeRotate
                }}
              >
                <X className="w-5 h-5" />
                <span className="text-sm">ليس لي</span>
              </motion.div>

              <MajorCard major={currentMajor} actionFeedback={actionFeedback} />
              
              {/* Loading overlay while drag is not ready */}
              {!isDragReady && (
                <motion.div
                  className="absolute inset-0 bg-black/10 backdrop-blur-[1px] rounded-3xl 
                            flex items-center justify-center z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="text-sm text-gray-700">جاري التحضير...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            // No major state
            <motion.div 
              className="text-center p-8 bg-gradient-to-br from-white/95 via-primary-50/20 to-accent-50/20 
                         backdrop-blur-xl rounded-3xl shadow-2xl border border-primary-200/50 max-w-md"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-accent-600 
                           rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-bold mb-4 text-primary-700"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                🎉 انتهينا!
              </motion.h2>
              
              <motion.p 
                className="text-gray-700 mb-6 leading-relaxed text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                ممتاز! 😎 خلصت كل التخصصات المتاحة حسب اختيارك.
                <br />
                شوف قائمة اهتماماتك أو غير الفلاتر وجرب مرة تانية.
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  onClick={resetDeck} 
                  className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700
                             text-white font-bold py-3 px-6 rounded-2xl shadow-lg
                             transition-all duration-300 border border-primary-400/50"
                >
                  <RotateCcw className="w-5 h-5 ml-2" />
                  إعادة تحميل القائمة
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced control buttons with swapped positions */}
      {currentMajor && !isAnimating && (
        <motion.div 
          className="flex items-center justify-center gap-8 z-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Like Button (Now on the left) */}
          <motion.div
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="secondary"
              size="lg"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 
                         hover:from-emerald-600 hover:to-green-700 text-white shadow-2xl 
                         border-4 border-white/30 backdrop-blur-sm
                         transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300"
              onClick={swipeRight}
              aria-label="Like major"
              disabled={isAnimating}
            >
              <Heart className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" />
            </Button>
          </motion.div>
          
          {/* Pass Button (Now on the right) */}
          <motion.div
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="secondary"
              size="lg"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 
                         hover:from-rose-600 hover:to-pink-700 text-white shadow-2xl 
                         border-4 border-white/30 backdrop-blur-sm
                         transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-300"
              onClick={swipeLeft}
              aria-label="Pass major"
              disabled={isAnimating}
            >
              <ArrowLeft className="w-8 h-8 md:w-10 md:h-10" />
            </Button>
          </motion.div>
        </motion.div>
      )}


    </motion.div>
  );
}; 