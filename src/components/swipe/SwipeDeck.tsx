import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, animate } from 'framer-motion';
import { MajorCard } from './MajorCard';
import { Major } from '@/contexts/InterestContext';
import { useInterest } from '@/contexts/InterestContext';
import { Button } from '@/components/ui/button';
import { X, Check, RotateCcw, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
// Import triggerSwipeConfetti if you want confetti on like
// import { triggerSwipeConfetti } from '@/animations/swipeConfetti';

interface SwipeDeckProps {
  majors: Major[];
  onDeckEmpty: () => void; // Callback when all cards are swiped
}

const SWIPE_THRESHOLD = 600; // Velocity threshold
const DRAG_BUFFER = 40; // Distance threshold for swipe

export const SwipeDeck: React.FC<SwipeDeckProps> = ({ majors: initialMajors, onDeckEmpty }) => {
  const [majors, setMajors] = useState<Major[]>(initialMajors);
  const { addMajor } = useInterest();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<'liked' | 'passed' | null>(null); // New state for feedback

  const x = useMotionValue(0);

  // Enhanced rotation based on x position with more natural curve
  const rotate = useTransform(x, [-250, 0, 250], [-25, 0, 25]);
  
  // Scale based on dragging distance - slightly more pronounced
  const scale = useTransform(
    x, 
    [-300, -150, 0, 150, 300], 
    [0.85, 0.92, 1, 0.92, 0.85]
  );
  
  // Opacity/color change based on x position
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["rgba(239, 68, 68, 0.45)", "rgba(255, 255, 255, 0)", "rgba(16, 185, 129, 0.35)"]
  );

  // Indicator states
  const likeOpacity = useTransform(x, [30, 120], [0, 1]); // Quicker fade-in
  const likeScale = useTransform(x, [0, 80, 150], [0.6, 1.15, 1]); // More pronounced pop
  
  const dislikeOpacity = useTransform(x, [-120, -30], [1, 0]); // Quicker fade-in
  const dislikeScale = useTransform(x, [-150, -80, 0], [1, 1.15, 0.6]); // More pronounced pop

  const currentMajor = majors[currentIndex];

  // Effect to reset card position when index changes
  useEffect(() => {
    if (majors[currentIndex]) { 
      const currentX = x.get();
      console.log(`SwipeDeck: currentIndex changed to ${currentIndex}. Current x before reset: ${currentX}`);
      animate(x, 0, { type: "tween", duration: 0.05 }); 
      console.log(`SwipeDeck: x tween animation to 0 initiated from ${currentX}.`);
      setSwipeDirection(null); // Reset swipe direction state
      setActionFeedback(null); // Reset feedback for the new card
    }
  }, [currentIndex, x, majors, animate, setActionFeedback]); 

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentMajor = majors[currentIndex];
    if (!currentMajor || isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(direction);
    setActionFeedback(direction === 'right' ? 'liked' : 'passed'); // Set feedback based on direction

    // Animate card off screen programmatically
    // The actual animation to move off-screen is now primarily handled by the exit animation
    // of AnimatePresence. We just need to trigger the state change.
    // x.set(targetX); // This might be redundant if exit animation is robust

    // Decide action based on direction
    if (direction === 'right') {
      addMajor(currentMajor);
      console.log('Liked:', currentMajor.title);
      // Optionally trigger confetti here
      // triggerSwipeConfetti();
    } else {
      console.log('Passed:', currentMajor.title);
    }

    // Use a timeout to ensure the card animation completes before index change
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= majors.length) {
        onDeckEmpty(); // Signal deck is empty
      } else {
        setCurrentIndex(nextIndex); // Trigger the AnimatePresence change
      }
      setIsAnimating(false);
    }, 450);
  };

  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    if (isAnimating) return;
    
    const { offset, velocity } = info;

    const offsetThreshold = DRAG_BUFFER * 2.5; // Increased threshold for offset-based swipe (e.g., 50 * 2.5 = 125)
    const velocityThreshold = SWIPE_THRESHOLD * 0.7; // Adjusted velocity threshold (e.g., 800 * 0.7 = 560)

    if (Math.abs(offset.x) > offsetThreshold || Math.abs(velocity.x) > velocityThreshold) {
      const direction = offset.x > 0 ? 'right' : 'left';
      handleSwipe(direction);
    } else {
      // Animate x back to 0 using framer-motion's animate function for a smooth spring back
      animate(x, 0, { type: "spring", stiffness: 500, damping: 40, mass: 0.5 });
    }
  };

  // Manual swipe buttons
  const swipeLeft = () => handleSwipe('left');
  const swipeRight = () => handleSwipe('right');

  // Reset deck - simple example, could reload from API
  const resetDeck = () => {
    setMajors(initialMajors); // Reset to initial list
    setCurrentIndex(0);
    x.set(0);
    setSwipeDirection(null);
  };

  // Button animations
  const buttonVariants = {
    idle: { y: 0, scale: 1 },
    hover: { 
      y: -5, // Slight lift on hover
      scale: 1 // Maintain scale 1 on hover
    },
    tap: { scale: 0.95, y: 0 } // Scale down on tap and reset y
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Exit Button */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 rounded-full z-10"
          onClick={onDeckEmpty}
          aria-label="Close swipe deck"
        >
          <X className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Card Stack Area */}
      <div className="relative w-full max-w-xs h-[500px] md:max-w-sm md:h-[550px] flex items-center justify-center mb-4">
        <AnimatePresence initial={false}>
          {currentMajor ? (
            <motion.div
              key={currentMajor.id}
              className="absolute w-full h-full cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -300, right: 300 }}
              style={{
                x,
                rotate,
                scale,
                willChange: 'transform'
              }}
              onDragEnd={onDragEnd}
              initial={{ x: 0, rotate: 0, y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{
                x: swipeDirection === 'right' ? 500 : -500,
                opacity: 1,
                scale: 0.7,
                rotate: swipeDirection === 'right' ? 15 : -15,
                transition: {
                  duration: 0.4,
                  ease: [0.68, -0.55, 0.27, 1.55]
                }
              }}
              transition={{
                y: { type: "spring", stiffness: 400, damping: 40, velocity: 2 },
                opacity: { type: "spring", stiffness: 400, damping: 40, velocity: 2 },
                scale: { type: "spring", stiffness: 400, damping: 40, velocity: 2 },
                x: { type: "tween", duration: 0.05 },
                rotate: { type: "tween", duration: 0.05 }
              }}
            >
              {/* Overlay for swipe color indication */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none z-[5]"
                style={{ background: actionFeedback ? 'transparent' : background }} // Hide overlay when feedback is active
              />

              {/* Like indicator */}
              <motion.div
                className="absolute top-6 right-6 bg-green-500 text-white rounded-full px-3 py-2 font-bold transform rotate-12 shadow-lg z-10 pointer-events-none flex items-center justify-center"
                style={{ 
                  opacity: likeOpacity,
                  scale: likeScale, 
                  x: useTransform(x, [0, 150], [-20, 0]) // Adjust x transform based on parent x
                }}
              >
                <Heart className="w-5 h-5 mr-1.5" />
                التخصص يناسبني!
              </motion.div>

              {/* Dislike indicator */}
              <motion.div
                className="absolute top-6 left-6 bg-rose-500 text-white rounded-full px-3 py-2 font-bold transform -rotate-12 shadow-lg z-10 pointer-events-none flex items-center justify-center"
                style={{ 
                  opacity: dislikeOpacity,
                  scale: dislikeScale, 
                  x: useTransform(x, [-150, 0], [0, 20]) // Adjust x transform based on parent x
                }}
              >
                <X className="w-5 h-5 mr-1.5" />
                لا يناسبني
              </motion.div>

              <MajorCard major={currentMajor} actionFeedback={actionFeedback} />
            </motion.div>
          ) : (
            <motion.div 
              className="text-center p-8 bg-white rounded-2xl shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.h2 
                className="text-2xl font-bold mb-4 text-emerald-600"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                🎉 انتهينا!
              </motion.h2>
              <motion.p 
                className="text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                ممتاز يا وحش! 😎 خلصت كل التخصصات المتاحة حسب اختيارك.
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
                  variant="outline"
                  className="bg-gradient-to-r from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 border-emerald-200"
                >
                  <RotateCcw className="w-4 h-4 ml-2" />
                  إعادة تحميل القائمة
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      {currentMajor && (
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 mt-4 items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Like Button - Now on the Left */}
          <motion.div
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-xl hover:shadow-emerald-400/60 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
              onClick={swipeRight}
              aria-label="Like major"
              disabled={isAnimating}
            >
              <Heart className="w-9 h-9" />
            </Button>
          </motion.div>
          
          {/* Dislike Button - Now on the Right */}
          <motion.div
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-700 text-white shadow-xl hover:shadow-rose-400/60 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800"
              onClick={swipeLeft}
              aria-label="Reject major"
              disabled={isAnimating}
            >
              <X className="w-10 h-10" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}; 