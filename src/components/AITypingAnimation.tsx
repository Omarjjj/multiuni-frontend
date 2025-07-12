import React from 'react';
import { motion } from 'framer-motion';

const AITypingAnimation: React.FC = () => {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      {/* Simple Brain Animation */}
      <motion.div
        className="w-8 h-8 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simple Brain Outline */}
          <g>
            {/* Brain Shape */}
            <motion.path
              d="M16 8 C20 8 22 10 22 14 C22 16 21 18 20 19 C19 20 17 20 16 20 C15 20 13 20 12 19 C11 18 10 16 10 14 C10 10 12 8 16 8 Z"
              stroke="url(#brownGradient)"
              strokeWidth="1.5"
              fill="none"
              animate={{ 
                opacity: [0.6, 1, 0.6],
                strokeWidth: [1.5, 2, 1.5]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Brain Division */}
            <motion.path
              d="M16 8 C16 12 16 16 16 20"
              stroke="url(#brownGradient)"
              strokeWidth="1"
              animate={{ 
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            
            {/* Thinking Dots */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={20 + i * 2}
                cy={6 - i}
                r="0.8"
                fill="url(#brownGradient)"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.3 
                }}
              />
            ))}
          </g>



          {/* Simple Brown Gradient */}
          <defs>
            <linearGradient id="brownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a0785d" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#8b6b47" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6b5b37" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Simple Arabic Text */}
      <motion.span 
        className="text-sm font-medium text-amber-800 mr-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
         شوي بس سارة عم بتفكر
      </motion.span>
    </div>
  );
};

export default AITypingAnimation; 