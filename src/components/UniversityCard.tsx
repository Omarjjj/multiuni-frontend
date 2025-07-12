import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface UniversityCardProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const UniversityCard: React.FC<UniversityCardProps> = React.memo(({ name, icon, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Split university name for enhanced typography
  const words = useMemo(() => name.split(' '), [name]);
  
  // Animation variants for sophisticated effects
  const cardVariants = {
    initial: {
      y: 0,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
    },
    hover: {
      y: -6,
      scale: 1.02,
      rotateY: 2,
      rotateX: 2,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        mass: 0.6,
      }
    },
    tap: {
      scale: 0.98,
      y: -4,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
      }
    }
  };

  const iconVariants = {
    initial: { 
      scale: 1, 
      rotate: 0,
      filter: "brightness(1) drop-shadow(0 0 0 transparent)"
    },
    hover: {
      scale: 1.05,
      rotate: -2,
      filter: "brightness(1.05) drop-shadow(0 4px 8px rgba(176, 141, 87, 0.2))",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 20,
      }
    }
  };

  const arrowVariants = {
    initial: { 
      x: 0, 
      opacity: 0.8,
      scale: 0.95
    },
    hover: {
      x: -4,
      opacity: 1,
      scale: 1.05,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      }
    }
  };

  const shimmerVariants = {
    initial: { x: "-100%" },
    hover: {
      x: "100%",
      transition: {
        duration: 0.6,
        ease: "easeInOut" as const,
        delay: 0.1
      }
    }
  };

  return (
    <motion.div
      className="relative group perspective-1000"
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main card with glass morphism - Reduced size */}
      <div className="relative h-56 md:h-64 cursor-pointer overflow-hidden">
        {/* Glass morphism background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 
                        backdrop-blur-xl border border-white/20 rounded-2xl 
                        transition-all duration-300 ease-out
                        before:absolute before:inset-0 before:rounded-2xl 
                        before:bg-gradient-to-br before:from-primary-100/30 before:via-transparent before:to-primary-200/20
                        before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300" />
        
        {/* Simplified shimmer effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                       -skew-x-12 w-1/3"
            variants={shimmerVariants}
            initial="initial"
            animate={isHovered ? "hover" : "initial"}
          />
        </div>
        
        {/* Content container */}
        <div className="relative h-full flex flex-col items-center justify-between p-4 md:p-6 z-10">
          
          {/* University logo section - Reduced size */}
          <motion.div
            className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center
                       bg-gradient-to-br from-white/40 to-white/20 rounded-xl
                       backdrop-blur-sm border border-white/30
                       transition-all duration-300"
            variants={iconVariants}
          >
            <div className="w-full h-full flex items-center justify-center p-2">
              {icon}
            </div>
          </motion.div>

          {/* University name with enhanced typography */}
          <div className="text-center flex-grow flex flex-col justify-center px-2">
            <h3 className="text-lg md:text-xl font-bold text-primary-800 
                           group-hover:text-primary-900 transition-colors duration-300
                           text-shadow-soft leading-tight mb-2">
              {words.map((word, i) => (
                <motion.span 
                  key={i} 
                  className="inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  {word}{i < words.length - 1 ? ' ' : ''}
                </motion.span>
              ))}
            </h3>
            
            {/* Simplified divider */}
            <motion.div
              className="h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent 
                         rounded-full mx-auto transition-all duration-300"
              initial={{ width: "30%" }}
              animate={{ width: isHovered ? "60%" : "30%" }}
            />
          </div>

          {/* Action area with enhanced arrow - Reduced size */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <motion.div
              className="w-10 h-10 md:w-12 md:h-12 rounded-full 
                         bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600
                         flex items-center justify-center text-white
                         border border-primary-300/50 backdrop-blur-sm
                         transition-all duration-300"
              variants={arrowVariants}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="transform transition-transform duration-300 group-hover:scale-105"
              >
                <path 
                  d="M19 12H5M5 12L12 5M5 12L12 19" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Simplified glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 pointer-events-none
                        bg-gradient-to-br from-primary-500/3 via-transparent to-accent-500/3" />
      </div>

      {/* Simplified floating particles effect - Reduced count */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-primary-400 rounded-full opacity-60"
              initial={{ 
                x: Math.random() * 200 + 50,
                y: Math.random() * 200 + 50,
                scale: 0,
                opacity: 0 
              }}
              animate={{ 
                y: -30,
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: 1.5,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
});

UniversityCard.displayName = 'UniversityCard';

export default UniversityCard; 