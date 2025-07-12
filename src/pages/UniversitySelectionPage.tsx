import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UniversityCard from '../components/UniversityCard';
import { InterestDrawer } from '../components/drawer/InterestDrawer';
import '../styles/UniversityCard.css';
import '../styles/LandingPage.css';
import '../styles/BetaNotification.css';
import FeaturesModal from '../components/FeaturesModal.tsx';

// Import university logo images
import aaupLogo from '../assets/logos/aaup.png';
import alqudsLogo from '../assets/logos/alquds.png';
import birzeitLogo from '../assets/logos/beirzet.png';
import bethlehemLogo from '../assets/logos/bethlahem.png';
import najahLogo from '../assets/logos/najah.png';
import polytechLogo from '../assets/logos/polytech.png';

// University data with Arabic names and enhanced metadata
const universities = [
  { 
    id: 'aaup', 
    name: 'الجامعة العربية الأمريكية', 
    icon: <img src={aaupLogo} alt="شعار AAUP" className="w-full h-full object-contain" />,
    description: 'جامعة رائدة في التعليم العالي'
  },
  { 
    id: 'birzeit', 
    name: 'جامعة بيرزيت', 
    icon: <img src={birzeitLogo} alt="شعار بيرزيت" className="w-full h-full object-contain" />,
    description: 'تاريخ عريق في التميز الأكاديمي'
  },
  { 
    id: 'ppu', 
    name: 'جامعة بوليتكنك فلسطين', 
    icon: <img src={polytechLogo} alt="شعار PPU" className="w-full h-full object-contain" />,
    description: 'التخصص في الهندسة والتكنولوجيا'
  },
  { 
    id: 'an-najah', 
    name: 'جامعة النجاح الوطنية', 
    icon: <img src={najahLogo} alt="شعار النجاح" className="w-full h-full object-contain" />,
    description: 'أكبر جامعة فلسطينية'
  },
  { 
    id: 'bethlehem', 
    name: 'جامعة بيت لحم', 
    icon: <img src={bethlehemLogo} alt="شعار بيت لحم" className="w-full h-full object-contain" />,
    description: 'جامعة الفنون والثقافة'
  },
  { 
    id: 'alquds', 
    name: 'جامعة القدس', 
    icon: <img src={alqudsLogo} alt="شعار القدس" className="w-full h-full object-contain" />,
    description: 'جامعة القدس الأبدية'
  },
];

const UniversitySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [saraVisible, setSaraVisible] = useState(false);
  const [saraMessage, setSaraMessage] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [, setLoadingComplete] = useState(false);
  const [showBetaNotification, setShowBetaNotification] = useState(() => {
    const hasBeenShown = sessionStorage.getItem('betaNotificationShownSession');
    return !hasBeenShown;
  });
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Enhanced Sara messages in Arabic
  const saraMessages = useMemo(() => [
    "هلا والله! أنا سارة، رح أساعدك بالطريق.",
    "يلا اختار جامعة ونبلش!",
    "محتاج مساعدة؟ أنا موجودة.",
    "كل جامعة عندها ستايل خاص، شوف اللي بناسبك!",
    "أي جامعة بتفكر فيها؟ حكيلي.",
    "خلينا نكتشف الجامعات مع بعض، يلا!",
    "مشوار التعليم رحلة حلوة، تعال معي!",
    "كل خطوة مهمة في مستقبلك، اختار بحكمة!"
  ], []);

  // Animation variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const titleVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
        duration: 0.8
      }
    }
  };

  const subtitleVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.6
      }
    }
  };

  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      rotateY: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25
      }
    }
  };

  const floatingElementVariants: Variants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: [0.4, 0.0, 0.2, 1] // Custom cubic bezier instead of string
      }
    }
  };

  useEffect(() => {
    setLoadingComplete(true);

    // Enhanced beta notification timer
    if (showBetaNotification) {
      sessionStorage.setItem('betaNotificationShownSession', 'true');
      const timer = setTimeout(() => {
        setShowBetaNotification(false);
      }, 12000); // Extended to 12 seconds
      return () => clearTimeout(timer);
    }

    // Enhanced Sara interaction system
    const saraMessageInterval = setInterval(() => {
      if (saraVisible) {
        const randomIndex = Math.floor(Math.random() * saraMessages.length);
        setSaraMessage(saraMessages[randomIndex]);
      }
    }, 8000); // More frequent updates

    const showSaraWithMessage = (index: number) => {
      setSaraMessage(saraMessages[index]);
      setSaraVisible(true);
    };

    const initialInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        showSaraWithMessage(0);
        window.removeEventListener('mousemove', initialInteraction);
        window.removeEventListener('touchstart', initialInteraction);
        window.removeEventListener('scroll', initialInteraction);
      }
    };

    // Multiple interaction triggers
    window.addEventListener('mousemove', initialInteraction, { passive: true });
    window.addEventListener('touchstart', initialInteraction, { passive: true });
    window.addEventListener('scroll', initialInteraction, { passive: true });

    // Auto-show Sara after 3 seconds if no interaction
    const autoShowTimer = setTimeout(() => {
      if (!hasInteracted) {
        setHasInteracted(true);
        showSaraWithMessage(0);
      }
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', initialInteraction);
      window.removeEventListener('touchstart', initialInteraction);
      window.removeEventListener('scroll', initialInteraction);
      clearInterval(saraMessageInterval);
      clearTimeout(autoShowTimer);
    };
  }, [hasInteracted, saraVisible, saraMessages, showBetaNotification]);

  const handleSelectUniversity = useCallback((universityId: string) => {
    setShowFeaturesModal(false);
    navigate(`/chat/${universityId}`);
  }, [navigate]);

  const handleOpenFeaturesModal = useCallback(() => {
    setShowFeaturesModal(true);
  }, []);

  const handleCloseFeaturesModal = useCallback(() => {
    setShowFeaturesModal(false);
  }, []);

  const handleSaraClick = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * saraMessages.length);
    setSaraMessage(saraMessages[randomIndex]);
  }, [saraMessages]);

  const handleCloseBetaNotification = useCallback(() => {
    setShowBetaNotification(false);
    sessionStorage.setItem('betaNotificationShownSession', 'true');
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" ref={containerRef}>
      {/* Enhanced background with minimal effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-light via-warm-medium to-warm-dark opacity-90" />
        {/* Reduced and contained radial gradients */}
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_30%_20%,_rgba(176,141,87,0.08)_0%,_transparent_40%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_70%_80%,_rgba(45,212,191,0.03)_0%,_transparent_40%)]" />
      </div>

      {/* Reduced floating background elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-300/15 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 80}%`, // Keep within viewport
            }}
            variants={floatingElementVariants}
            animate="animate"
            transition={{ delay: i * 0.8 }}
          />
        ))}
      </div>

      {/* Beta notification with enhanced styling */}
      <AnimatePresence>
        {showBetaNotification && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pt-100 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md mx-4 
                         shadow-2xl border border-white/20 text-center"
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              dir="rtl"
            >
              <button 
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 
                           flex items-center justify-center transition-colors"
                onClick={handleCloseBetaNotification} 
                aria-label="إغلاق"
              >
                ×
              </button>
              
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-primary-600 
                           rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <span className="text-2xl">✨</span>
              </motion.div>
              
              <h3 className="text-xl font-bold text-primary-800 mb-4">النسخة التجريبية</h3>
              <p className="text-gray-700 mb-2">
                أنتم الآن تستخدمون <span className="font-bold text-primary-600">النسخة التجريبية</span> من مساعدنا الذكي.
              </p>
              <p className="text-gray-700 mb-4">
                قاعد يصير <span className="font-bold text-primary-600">أفخم كل يوم</span>، فاستعدوا لتحديثات نار! 🚀
              </p>
              <p className="text-sm text-gray-600">
                شكراً لكونكم جزء من الرحلة! 🙏
              </p>
              
              <motion.div 
                className="mt-6 h-1 bg-gradient-to-r from-primary-200 via-primary-500 to-primary-200 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 12 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Sara persona - Fixed positioning improved */}
      <AnimatePresence>
        {saraVisible && (
          <motion.div 
            className="fixed bottom-4 md:bottom-6 left-4 md:left-6 z-50 cursor-pointer max-w-sm"
            initial={{ opacity: 0, x: -100, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -100, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={handleSaraClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-end gap-3">
              {/* Sara message bubble */}
              <motion.div 
                className="bg-white/95 backdrop-blur-xl rounded-2xl rounded-bl-sm p-4 
                           shadow-xl border border-white/30 max-w-xs"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 25 }}
              >
                <p className="text-gray-800 text-sm leading-relaxed font-arabic text-right">
                  {saraMessage}
                </p>
                <div className="absolute bottom-0 right-4 w-0 h-0 border-l-8 border-l-transparent 
                               border-r-8 border-r-transparent border-t-8 border-t-white/95 
                               transform translate-y-full" />
              </motion.div>

              {/* Sara avatar */}
              <motion.div 
                className="relative flex-shrink-0"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 
                               shadow-lg flex items-center justify-center text-white text-xl font-bold border-4 border-white/30">
                  س
                </div>
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-primary-400"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - Remove parallax effects */}
      <motion.div 
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header section */}
        <motion.div 
          className="text-center mb-16 max-w-4xl"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-primary-800 mb-6 text-shadow-medium"
            variants={titleVariants}
          >
            <span className="inline-block">اختر</span>{' '}
            <motion.span 
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              الجامعة
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 leading-relaxed font-arabic"
            variants={subtitleVariants}
          >
            اختر جامعتك للبدء في الاستكشاف مع سارة
          </motion.p>
          
          <motion.button 
            className="mt-8 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 
                       text-white rounded-full font-bold text-lg shadow-lg 
                       hover:shadow-xl hover:scale-105 transition-all duration-300
                       border border-primary-400/50 backdrop-blur-sm"
            onClick={handleOpenFeaturesModal}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            variants={subtitleVariants}
          >
            مش فاهم؟ اكتشف المزيد ✨
          </motion.button>
        </motion.div>

        {/* University grid - Reduced animations */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
          variants={gridVariants}
        >
          {universities.map((university) => (
            <motion.div
              key={university.id}
              variants={cardVariants}
              whileHover={{ y: -3 }} // Reduced hover animation
            >
              <UniversityCard
                name={university.name}
                icon={university.icon}
                onClick={() => handleSelectUniversity(university.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Interest drawer and features modal */}
      <InterestDrawer />
      <FeaturesModal isOpen={showFeaturesModal} onClose={handleCloseFeaturesModal} />
    </div>
  );
};

export default React.memo(UniversitySelectionPage); 