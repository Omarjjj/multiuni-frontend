import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
// Import index.css to ensure its styles are loaded globally,
// especially the body styles and background animations.
import './index.css';
import ChatPage from './pages/ChatPage';
import UniversitySelectionPage from './pages/UniversitySelectionPage';

// Enhanced page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    filter: "blur(10px)"
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  },
  out: {
    opacity: 0,
    scale: 1.05,
    y: -20,
    filter: "blur(5px)",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Loading screen component
const LoadingScreen: React.FC = () => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center 
               bg-gradient-to-br from-warm-light via-warm-medium to-warm-dark"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center">
      <motion.div
        className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br 
                   from-primary-400 to-primary-600 flex items-center justify-center
                   shadow-2xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <motion.div
          className="w-3 h-3 bg-white rounded-full"
          animate={{
            scale: [1, 0.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      <motion.h2
        className="text-2xl font-bold text-primary-700 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        مساعدك الذكي
      </motion.h2>
      
      <motion.p
        className="text-primary-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        جاري التحضير...
      </motion.p>
      
      <motion.div
        className="mt-6 flex justify-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  </motion.div>
);

// Route wrapper with animations
const AnimatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      className="min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Enhanced error boundary state
  const [hasError, setHasError] = useState(false);

  // Error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setHasError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Error fallback component
  if (hasError) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center 
                   bg-gradient-to-br from-warm-light via-warm-medium to-warm-dark
                   p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center max-w-md">
          <motion.div
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br 
                       from-red-400 to-red-600 flex items-center justify-center
                       shadow-2xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-4xl">😅</span>
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            عذراً، حدث خطأ ما
          </h2>
          
          <p className="text-gray-600 mb-6">
            لا تقلق! يمكنك إعادة تحميل الصفحة والمحاولة مرة أخرى.
          </p>
          
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600
                       text-white rounded-2xl font-medium shadow-lg
                       hover:shadow-xl transition-all duration-300"
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إعادة تحميل الصفحة
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Enhanced background effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-warm-light via-warm-medium to-warm-dark" />
              
              {/* Animated background elements */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary-300/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-30, 30],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.5, 1.5, 0.5],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Main content with route animations */}
            <div className="relative z-10 min-h-screen">
              <AnimatePresence mode="wait" initial={false}>
                <Routes location={location} key={location.pathname}>
                  <Route 
                    path="/" 
                    element={
                      <AnimatedRoute>
                        <UniversitySelectionPage />
                      </AnimatedRoute>
                    } 
                  />
                  <Route 
                    path="/chat/:universityId" 
                    element={
                      <AnimatedRoute>
                        <ChatPage />
                      </AnimatedRoute>
                    } 
                  />
                </Routes>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
