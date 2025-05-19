import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// University data with Arabic names
const universities = [
  { id: 'aaup', name: 'الجامعة العربية الأمريكية ', icon: <img src={aaupLogo} alt="شعار AAUP" className="university-logo" /> },
  { id: 'birzeit', name: 'جامعة بيرزيت', icon: <img src={birzeitLogo} alt="شعار بيرزيت" className="university-logo" /> },
  { id: 'ppu', name: 'جامعة بوليتكنك فلسطين', icon: <img src={polytechLogo} alt="شعار PPU" className="university-logo" /> },
  { id: 'an-najah', name: 'جامعة النجاح الوطنية', icon: <img src={najahLogo} alt="شعار النجاح" className="university-logo" /> },
  { id: 'bethlehem', name: 'جامعة بيت لحم', icon: <img src={bethlehemLogo} alt="شعار بيت لحم" className="university-logo" /> },
  { id: 'alquds', name: 'جامعة القدس', icon: <img src={alqudsLogo} alt="شعار القدس" className="university-logo" /> },
];

const UniversitySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [saraVisible, setSaraVisible] = useState(false);
  const [saraMessage, setSaraMessage] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showBetaNotification, setShowBetaNotification] = useState(() => {
    const hasBeenShown = sessionStorage.getItem('betaNotificationShownSession');
    return !hasBeenShown;
  });
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  
  // Sara messages in Arabic
  const saraMessages = useMemo(() => [
    "هلا والله! أنا سارة، رح أساعدك بالطريق.",
    "يلا اختار جامعة ونبلش!",
    "محتاج مساعدة؟ أنا موجودة.",
    "كل جامعة عندها ستايل خاص، شوف اللي بناسبك!",
    "أي جامعة بتفكر فيها؟ حكيلي.",
    "خلينا نكتشف الجامعات مع بعض، يلا!"
  ], []);

  useEffect(() => {
    // Skip animated shapes entirely for better performance
    setLoadingComplete(true);

    // Beta notification timer and sessionStorage flag
    if (showBetaNotification) {
      sessionStorage.setItem('betaNotificationShownSession', 'true'); // Set flag when shown
      const timer = setTimeout(() => {
        setShowBetaNotification(false);
      }, 10000); // Hide after 10 seconds
      return () => clearTimeout(timer);
    }

    // Reduced frequency of Sara message updates
    const saraMessageInterval = setInterval(() => {
      if (saraVisible) {
        const randomIndex = Math.floor(Math.random() * saraMessages.length);
        setSaraMessage(saraMessages[randomIndex]);
      }
    }, 10000); // Increased from 7000ms to 10000ms

    const showSaraWithMessage = (index: number) => {
      setSaraMessage(saraMessages[index]);
      setSaraVisible(true);
    };

    // Initial interaction check
    const initialInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        showSaraWithMessage(0);
        window.removeEventListener('mousemove', initialInteraction);
        window.removeEventListener('touchstart', initialInteraction);
      }
    };

    // Use passive event listeners for performance - Linter doesn't like passive here, removing it
    window.addEventListener('mousemove', initialInteraction);
    window.addEventListener('touchstart', initialInteraction);

    return () => {
      window.removeEventListener('mousemove', initialInteraction);
      window.removeEventListener('touchstart', initialInteraction);
      clearInterval(saraMessageInterval);
    };
  }, [hasInteracted, saraVisible, saraMessages, showBetaNotification]); // Removed rafThrottle from dependency array

  const handleSelectUniversity = useCallback((universityId: string) => {
    setShowFeaturesModal(false); // Ensure modal is closed before navigating
    navigate(`/chat/${universityId}`);
  }, [navigate]);

  const handleOpenFeaturesModal = () => {
    setShowFeaturesModal(true);
  };

  const handleCloseFeaturesModal = () => {
    setShowFeaturesModal(false);
  };

  const handleSaraClick = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * saraMessages.length);
    setSaraMessage(saraMessages[randomIndex]);
  }, [saraMessages]);

  // Memoize animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const handleCloseBetaNotification = () => {
    setShowBetaNotification(false);
    sessionStorage.setItem('betaNotificationShownSession', 'true'); // Also set flag when manually closed
  };

  return (
    <div className="university-selection-page">
      <AnimatePresence>
        {showBetaNotification && (
          <motion.div
            className="beta-notification-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="beta-notification"
              initial={{ y: "-50%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-50%", opacity: 0, transition: {duration: 0.2} }}
              transition={{ type: "spring", stiffness: 260, damping: 25, delay: 0.1 }}
              dir="rtl"
            >
              <button className="beta-notification-close" onClick={handleCloseBetaNotification} aria-label="إغلاق">
                &times;
              </button>
              <div className="beta-notification-header">
                <div className="sparkle-svg-container">
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L14.1465 9.85355L22 12L14.1465 14.1465L12 22L9.85355 14.1465L2 12L9.85355 9.85355L12 2Z"/>
                  </svg>
                </div>
              </div>
              <p>
                انتبهوا يا جماعة! 🚀 أنتم الآن تستخدمون <span className="highlight">النسخة التجريبية</span> من مساعدنا الذكي.
              </p>
              <p>
                قاعد يصير <span className="highlight">أفخم كل يوم</span>، فاستعدوا لتحديثات نار! ✨
              </p>
              <p>
                خليكم مستمتعين وشكراً لكونكم جزء من الرحلة! 🙏
              </p>
              <div className="beta-progress-bar-container">
                <div className="beta-progress-bar"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static background elements */}
      {/* <div className="background-pattern" /> */}
      {/* <div className="noise-overlay" /> */}
      {/* <div className="line-pattern-overlay" /> */}
      {/* <div className="animated-shapes" /> */}
      
      {/* Sara persona - conditionally rendered for performance */}
      {saraVisible && (
        <motion.div 
          className="sara-container will-change-transform"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} // Reduced animation complexity
          onClick={handleSaraClick}
        >
          <div className="sara-avatar hardware-accelerated">
            <span className="sara-avatar-text">س</span>
          </div>
          <div className="sara-message">
            {saraMessage}
          </div>
        </motion.div>
      )}

      <div className="university-selection-container">
        <div className="university-selection-header">
          <h1 className="university-selection-title">
            <span className="title-decoration">✦</span> اختر الجامعة <span className="title-decoration">✦</span>
          </h1>
          
          <p className="university-selection-subtitle">
            اختر جامعتك للبدء في الاستكشاف مع سارة
          </p>
          <button className="feature-explanation-button" onClick={handleOpenFeaturesModal}>
            مش فاهم ؟
          </button>
        </div>

        {/* Only render grid when loaded - simplified animation */}
        {loadingComplete && (
          <div className="university-grid">
            {universities.map((university) => (
              <UniversityCard
                key={university.id}
                name={university.name}
                icon={university.icon}
                onClick={() => handleSelectUniversity(university.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add InterestDrawer */}
      <InterestDrawer />

      <FeaturesModal isOpen={showFeaturesModal} onClose={handleCloseFeaturesModal} />
    </div>
  );
};

export default React.memo(UniversitySelectionPage); 