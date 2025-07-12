import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatInput from '../components/ChatInput';
import AITypingAnimation from '../components/AITypingAnimation';
import { initChatBubbleAnimations } from '../animations/chatBubbles';

// --- Major Swiper Imports ---
import { Major } from '@/contexts/InterestContext';
import { StudentInfoModal } from '@/components/modals/StudentInfoModal';
import { SwipeDeck } from '@/components/swipe/SwipeDeck';
import { InterestDrawer } from '@/components/drawer/InterestDrawer';
import { toast } from "react-hot-toast";
// --- End Major Swiper Imports ---

// Import university logo images
import aaupLogo from '../assets/logos/aaup.png';
import alqudsLogo from '../assets/logos/alquds.png';
import birzeitLogo from '../assets/logos/beirzet.png';
import bethlehemLogo from '../assets/logos/bethlahem.png';
import najahLogo from '../assets/logos/najah.png';
import polytechLogo from '../assets/logos/polytech.png';

// Enhanced arrow icon with animation
const ArrowLeftIcon = () => (
  <motion.svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    className="text-current"
    whileHover={{ x: -2 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </motion.svg>
);

// Enhanced UtilityIcon with sophisticated animations
const UtilityIcon = () => (
  <motion.div 
    className="utility-icon-wrapper relative"
    whileHover={{ scale: 1.1, rotate: 5 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <motion.svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none"
      className="text-current"
      animate={{ 
        rotate: [0, 5, -5, 0],
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <path d="M17 4H7C5.89543 4 5 4.89543 5 6V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V6C19 4.89543 18.1046 4 17 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 9H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 13H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 17H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </motion.svg>
    <motion.div 
      className="absolute -top-6 -right-20 bg-primary-600 text-white px-2 py-1 
                 rounded-2xl rounded-br-sm text-sm font-medium shadow-lg z-50
                 border border-primary-500/30 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0.8, 1, 1, 0.8],
        y: [10, 0, 0, -10]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut"
      }}
    >
      <motion.span className="block text-right text-xs">
        محتار
        <motion.span
          className="inline-block mx-1"
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, 15, -15, 0],
            color: ['#ffffff', '#ffd700', '#ffffff']
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          ؟
        </motion.span>
        اكبس علي
      </motion.span>
      
      {/* Tooltip tail */}
      <div className="absolute bottom-0 right-4 w-0 h-0 border-l-3 border-l-transparent 
                      border-r-3 border-r-transparent border-t-5 border-t-primary-600 
                      transform translate-y-full" />
      
      {/* Floating sparkles - reduced to 2 */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300 text-xs pointer-events-none"
          style={{ 
            top: `${15 + i * 20}%`,
            right: `${15 + i * 25}%`
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3
          }}
        >
          ✨
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// Define a type for university IDs to use with universityNames and logos
type UniversityIdKey = 'aaup' | 'birzeit' | 'ppu' | 'an-najah' | 'bethlehem' | 'alquds';

// Map university IDs to their full names
const universityNames: Record<UniversityIdKey, string> = {
  'aaup': 'Arab American University (AAUP)',
  'birzeit': 'Birzeit University',
  'ppu': 'Palestine Polytechnic University',
  'an-najah': 'An-Najah National University',
  'bethlehem': 'Bethlehem University',
  'alquds': 'Al-Quds University',
};

// Map university IDs to their logos
const universityLogos: Record<UniversityIdKey, string> = {
  'aaup': aaupLogo,
  'birzeit': birzeitLogo,
  'ppu': polytechLogo,
  'an-najah': najahLogo,
  'bethlehem': bethlehemLogo,
  'alquds': alqudsLogo,
};

// Backend API URL
const API_URL = 'https://multi-uni-assistant.onrender.com';

// Enhanced typing speed
const TYPING_SPEED_MS = 25;

const SESSION_ID_KEY = 'chat_session_id_v1';

const ChatPage: React.FC = () => {
  const { universityId: rawUniversityId } = useParams<{ universityId: string }>();
  const universityId = rawUniversityId as UniversityIdKey | undefined;

  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [hasInteracted] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{
    connected: boolean;
    namespaces: string[] | null;
    error: string | null;
  }>({
    connected: false,
    namespaces: null,
    error: null
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // --- State for Major Swiper ---
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showSwipeDeck, setShowSwipeDeck] = useState(false);
  const [matchedMajors, setMatchedMajors] = useState<Major[]>([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  // --- End State for Major Swiper ---
  
  // State to manage the animated text for each assistant message
  const [animatedMessages, setAnimatedMessages] = useState<Map<string, string>>(new Map());
  // State to track which messages are currently animating
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null);
  
  // Ref to track if welcome effect has run for the current universityId in Strict Mode (dev only)
  const welcomeEffectForDevRef = useRef<string | null | undefined>(null);

  // Animation variants for chat elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    }
  };

  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 30
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
        delay: 0.3
      }
    }
  };

  // Generate session ID
  useEffect(() => {
    let storedSessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (storedSessionId) {
      setSessionId(storedSessionId);
      console.log("ChatPage: Retrieved session ID from sessionStorage:", storedSessionId);
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
      setSessionId(newSessionId);
      console.log("ChatPage: Generated new session ID and stored:", newSessionId);
    }
  }, []);
  
  // Scroll to bottom of chat whenever messages or animated messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, animatedMessages]);
  
  // Check backend health and initialize welcome message
  useEffect(() => {
    if (!universityId || !universityNames[universityId] || !sessionId) {
        if (rawUniversityId && !universityNames[rawUniversityId as UniversityIdKey]) { 
             console.warn(`Invalid universityId: ${rawUniversityId}. Welcome message request skipped.`);
             const errorMessage: Message = {
                id: 'error-invalid-uni',
                text: `عذراً، يبدو أن رابط الجامعة (${rawUniversityId}) غير صحيح. الرجاء التأكد والمحاولة مرة أخرى.`,
                sender: 'assistant',
                timestamp: new Date()
              };
              setMessages([errorMessage]);
              setAnimatedMessages(prev => new Map(prev).set(errorMessage.id, errorMessage.text));
        }
        if (import.meta.env.DEV) {
            welcomeEffectForDevRef.current = null;
        }
        return;
    }

    if (import.meta.env.DEV && welcomeEffectForDevRef.current === rawUniversityId) {
        console.log("ChatPage: Welcome effect already run for", rawUniversityId, "in dev strict mode.");
        return;
    }
    
    const fetchInitialGreeting = async () => {
      setIsLoading(true);
      setMessages([]);
      setAnimatedMessages(new Map());

      try {
        console.log(`ChatPage: Fetching initial greeting for ${universityId} with session ${sessionId}`);
        const apiResponse = await fetch(`${API_URL}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            university: universityId,
            message: "__INITIAL_GREETING__"
          }),
        });

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json().catch(() => null);
          const detail = errorData?.detail || `Backend error: ${apiResponse.status}`;
          throw new Error(detail);
        }
        const responseData = await apiResponse.json();
        const welcomeMessageText = responseData.answer;

        if (!welcomeMessageText) {
            console.warn("ChatPage: Received empty welcome message from backend.");
            throw new Error("Empty welcome message from backend.");
        }

        setBackendStatus(prevStatus => ({ ...prevStatus, connected: true, error: null }));

        const welcomeMessage: Message = {
          id: `welcome-${Date.now()}`,
          text: welcomeMessageText,
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setMessages([welcomeMessage]);

      } catch (error) {
        console.error('ChatPage: Failed to fetch initial greeting:', error);
        const errorText = error instanceof Error ? error.message : 'Unknown error during greeting fetch';
        const displayErrorMessage: Message = {
          id: 'error-fetch-greeting',
          text: `ما قدرت أجيب رسالة الترحيب من السيرفر 😟 (${errorText}). بس بتقدر تبلش تسأل عادي!`,
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages([displayErrorMessage]);
        setAnimatedMessages(prev => new Map(prev).set(displayErrorMessage.id, displayErrorMessage.text));
        setBackendStatus(prevStatus => ({ ...prevStatus, connected: false, error: errorText }));
      } finally {
        setIsLoading(false);
         if (import.meta.env.DEV) {
            console.log("ChatPage: Welcome effect processing completed for", rawUniversityId);
            welcomeEffectForDevRef.current = rawUniversityId;
        }
      }
    };
    
    fetchInitialGreeting();
    
  }, [rawUniversityId, universityId, sessionId]);
  
  // Effect to handle the typing animation for the latest assistant message
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];

    if (latestMessage?.sender === 'assistant' && !animatedMessages.has(latestMessage.id)) {
      const fullText = latestMessage.text;
      const isTable = fullText.includes('| --- |');

      if (isTable) {
        setAnimatedMessages(prev => new Map(prev).set(latestMessage.id, fullText));
        console.log(`ChatPage: Animation - Table detected for ${latestMessage.id}. Setting animatingMessageId to null.`);
        setAnimatingMessageId(null);
      } else {
        console.log(`ChatPage: Animation - Starting for ${latestMessage.id}. Setting animatingMessageId.`);
        setAnimatingMessageId(latestMessage.id);
        
        setAnimatedMessages(prev => new Map(prev).set(latestMessage.id, ''));

        let currentIndex = 0;
        const intervalId = setInterval(() => {
          currentIndex++;
          const currentAnimatedText = fullText.substring(0, currentIndex);
          setAnimatedMessages(prevMap => new Map(prevMap).set(latestMessage.id, currentAnimatedText));

          if (currentIndex >= fullText.length) {
            clearInterval(intervalId);
            console.log(`ChatPage: Animation - Completed for ${latestMessage.id}. Setting animatingMessageId to null.`);
            setAnimatingMessageId(null);
          }
        }, TYPING_SPEED_MS);

        return () => {
          clearInterval(intervalId);
          console.log(`ChatPage: Animation - Cleanup for ${latestMessage.id}. Current animatingMessageId was ${animatingMessageId}. Attempting to clear if matched.`);
          setAnimatingMessageId(currentAnimatingId => {
            if (currentAnimatingId === latestMessage.id) {
              console.log(`ChatPage: Animation - Cleanup matched ${latestMessage.id}. Setting animatingMessageId to null.`);
              return null;
            }
            console.log(`ChatPage: Animation - Cleanup did NOT match ${latestMessage.id} (was ${currentAnimatingId}). No change to animatingMessageId.`);
            return currentAnimatingId;
          });
          setAnimatedMessages(prevMap => {
            if (prevMap.get(latestMessage.id) !== fullText) {
              return new Map(prevMap).set(latestMessage.id, fullText);
            }
            return prevMap;
          });
        };
      }
    }
  }, [messages, animatedMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleBackClick = () => {
    navigate('/');
  };
  
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !universityId) return;
    
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setAnimatingMessageId(null);
    
    try {
      if (!universityNames[universityId as keyof typeof universityNames]) {
        throw new Error(`Invalid university ID: ${universityId}`);
      }
      
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          university: universityId,
          message: message
        }),
      });
      
      if (!response.ok) {
        const errorText = `Network response was not ok: ${response.status}`;
        setBackendStatus(prevStatus => ({ ...prevStatus, connected: false, error: errorText }));
        throw new Error(errorText);
      }
      
      setBackendStatus(prevStatus => ({ ...prevStatus, connected: true, error: null }));
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessageText = 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى لاحقاً. 🙁';
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessageText,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setAnimatedMessages(prev => new Map(prev).set(errorMessage.id, errorMessage.text));
      const errorDetail = error instanceof Error ? error.message : 'Unknown error';
      setBackendStatus(prevStatus => ({ ...prevStatus, connected: false, error: errorDetail }));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Major matching functionality (keeping existing logic)
  interface StudentInfo {
    min_avg: number;
    branch: string;
    field?: string;
  }

  const handleMatchMajors = async (studentInfo: StudentInfo) => {
    console.log('🔍 handleMatchMajors called with:', studentInfo);
    setIsMatchingLoading(true);
    try {
      console.log('📡 Making API request to:', `${API_URL}/match-majors`);
      const response = await fetch(`${API_URL}/match-majors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          university: universityId,
          min_avg: studentInfo.min_avg,
          branch: studentInfo.branch,
          field: studentInfo.field,
        }),
      });

      console.log('📡 API Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ API Error response:', errorData);
        throw new Error(`Failed to match majors: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response data:', data);
      const majors: Major[] = data.majors || data; // Handle both possible response formats
      console.log('📚 Processed majors array:', majors);
      console.log('📊 Number of majors found:', majors.length);
      
      if (majors.length === 0) {
        console.warn('⚠️ No majors found for the given criteria');
        toast.error('لم يتم العثور على تخصصات مطابقة للمعايير المحددة');
        return;
      }
      
      setMatchedMajors(majors);
      setShowSwipeDeck(true);
      
      // Close the student modal after successful submission
      setShowStudentModal(false);
      
      console.log('🎯 Successfully set up swipe deck with', majors.length, 'majors');

    } catch (error) {
      console.error('💥 Error in handleMatchMajors:', error);
      toast.error('حدث خطأ أثناء البحث عن التخصصات المناسبة');
    } finally {
      setIsMatchingLoading(false);
      console.log('🏁 handleMatchMajors completed');
    }
  };

  // Custom cursor functionality (keeping existing logic)
  const updateCursor = (e: MouseEvent) => {
    if (cursorRef.current && cursorDotRef.current) {
      requestAnimationFrame(() => {
        const cursor = cursorRef.current;
        const cursorDot = cursorDotRef.current;
        if (cursor && cursorDot) {
          cursor.style.left = e.clientX + 'px';
          cursor.style.top = e.clientY + 'px';
          cursorDot.style.left = e.clientX + 'px';
          cursorDot.style.top = e.clientY + 'px';
        }
      });
    }
  };

  const handleMouseOver = (_e: MouseEvent) => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = 'scale(1.5)';
      cursorRef.current.style.backgroundColor = 'rgba(45, 212, 191, 0.3)';
    }
  };

  const handleMouseOut = (_e: MouseEvent) => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = 'scale(1)';
      cursorRef.current.style.backgroundColor = 'rgba(93, 83, 74, 0.1)';
    }
  };

  useEffect(() => {
    if (!hasInteracted) return;

    document.addEventListener('mousemove', updateCursor);
    const interactiveElements = document.querySelectorAll('button, a, input, [data-interactive="true"]');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseOver as EventListener);
      el.addEventListener('mouseleave', handleMouseOut as EventListener);
    });

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseOver as EventListener);
        el.removeEventListener('mouseleave', handleMouseOut as EventListener);
      });
    };
  }, [hasInteracted]);

  const CustomCursor = () => (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={cursorDotRef} className="custom-cursor-dot" />
    </>
  );

  // Initialize chat bubble animations
  useEffect(() => {
    const cleanup = initChatBubbleAnimations();
    return cleanup;
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-warm-light via-warm-medium to-warm-dark 
                 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(176,141,87,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(45,212,191,0.05)_0%,_transparent_50%)]" />
      </div>

      {/* Custom cursor */}
      <div className="custom-cursor-styles">
        <style dangerouslySetInnerHTML={{
          __html: `
            .custom-cursor {
              position: fixed;
              width: 20px;
              height: 20px;
              background-color: rgba(93, 83, 74, 0.1);
              border-radius: 50%;
              pointer-events: none;
              z-index: 9999;
              transition: transform 0.1s ease, background-color 0.2s ease;
              transform: translate(-50%, -50%);
            }
            .custom-cursor-dot {
              position: fixed;
              width: 4px;
              height: 4px;
              background-color: hsl(var(--primary));
              border-radius: 50%;
              pointer-events: none;
              z-index: 10000;
              transform: translate(-50%, -50%);
            }
          `
        }} />
      </div>
      {hasInteracted && <CustomCursor />}

      {/* Main chat container */}
      <motion.div 
        className="relative z-10 h-screen flex flex-col max-w-4xl mx-auto"
        variants={containerVariants}
      >
        {/* Enhanced chat header */}
        <motion.header 
          className="glass-medium border-b border-white/20 p-4 backdrop-blur-xl"
          variants={headerVariants}
        >
          <div className="flex items-center justify-between">
            {/* Back button */}
            <motion.button
              className="flex items-center justify-center w-12 h-12 rounded-2xl
                         bg-white/20 hover:bg-white/30 backdrop-blur-sm
                         border border-white/30 text-primary-700 hover:text-primary-800
                         transition-all duration-300 group"
              onClick={handleBackClick}
              whileHover={{ scale: 1.05, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              data-interactive="true"
            >
              <ArrowLeftIcon />
            </motion.button>

            {/* University info */}
            <div className="flex items-center gap-4 flex-1 justify-center">
              {universityId && universityLogos[universityId] && (
                <motion.img
                  src={universityLogos[universityId]}
                  alt={`${universityNames[universityId]} logo`}
                  className="w-12 h-12 object-contain rounded-xl 
                           bg-white/20 p-2 backdrop-blur-sm border border-white/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              <div className="text-center">
                <h1 className="text-xl font-bold text-primary-800 text-shadow-soft">
                  {universityId ? universityNames[universityId] : 'المساعد الذكي'}
                </h1>
                <motion.div 
                  className="flex items-center justify-center gap-2 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    backendStatus.connected ? 'bg-green-400' : 'bg-red-400'
                  } animate-pulse`} />
                  <span className="text-xs text-primary-600">
                    {backendStatus.connected ? 'متصل' : 'غير متصل'}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Utility button */}
            <motion.button
              className="flex items-center justify-center w-12 h-12 rounded-2xl
                         bg-white/20 hover:bg-white/30 backdrop-blur-sm
                         border border-white/30 text-primary-700 hover:text-primary-800
                         transition-all duration-300"
              onClick={() => setShowStudentModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-interactive="true"
            >
              <UtilityIcon />
            </motion.button>
          </div>
        </motion.header>

        {/* Messages area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-4 py-6 space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => {
                const displayText = message.sender === 'assistant' 
                  ? (animatedMessages.get(message.id) || '')
                  : message.text;

                return (
                  <motion.div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' 
                        ? 'justify-end' 
                        : 'justify-start'
                    }`}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Avatar */}
                    {message.sender === 'assistant' && universityId && (
                      <motion.div 
                        className="flex-shrink-0 w-10 h-10 rounded-2xl overflow-hidden
                                   bg-white/20 backdrop-blur-sm border border-white/30 p-2"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <img
                          src={universityLogos[universityId]}
                          alt="Assistant"
                          className="w-full h-full object-contain"
                        />
                      </motion.div>
                    )}

                    {/* Message bubble */}
                    <motion.div
                      className={`max-w-md px-4 py-3 rounded-3xl shadow-lg backdrop-blur-sm border ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white border-primary-400/30'
                          : 'bg-white/80 text-gray-800 border-white/30'
                      } ${
                        message.sender === 'user' 
                          ? 'rounded-br-lg' 
                          : 'rounded-bl-lg'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {message.sender === 'assistant' ? (
                        <div className="markdown-content">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: ({ node, ...props }) => (
                                <a 
                                  {...props} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary-600 underline underline-offset-2"
                                />
                              ),
                              p: ({ node, ...props }) => (
                                <p {...props} className="text-sm leading-relaxed mb-2 last:mb-0" />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul {...props} className="list-disc list-inside space-y-1 text-sm" />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol {...props} className="list-decimal list-inside space-y-1 text-sm" />
                              ),
                              li: ({ node, ...props }) => (
                                <li {...props} className="text-sm leading-relaxed" />
                              ),
                              strong: ({ node, ...props }) => (
                                <strong {...props} className="font-semibold text-primary-700" />
                              ),
                              em: ({ node, ...props }) => (
                                <em {...props} className="italic text-gray-700" />
                              ),
                              code: ({ node, ...props }) => (
                                <code {...props} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" />
                              )
                            }}
                          >
                            {displayText}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{displayText}</p>
                      )}
                      
                      {/* Timestamp */}
                      <div className={`text-xs mt-2 opacity-70 ${
                        message.sender === 'user' ? 'text-right text-white/80' : 'text-left text-gray-600'
                      }`}>
                        {message.timestamp.toLocaleTimeString('ar', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center gap-3">
                  {universityId && (
                    <div className="w-10 h-10 rounded-2xl overflow-hidden
                                   bg-white/20 backdrop-blur-sm border border-white/30 p-2">
                      <img
                        src={universityLogos[universityId]}
                        alt="Assistant"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-3xl rounded-bl-lg 
                                 border border-white/30 shadow-lg relative">
                    <AITypingAnimation />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Enhanced input area */}
        <motion.div 
          className="glass-medium border-t border-white/20 p-4 backdrop-blur-xl"
          variants={inputVariants}
        >
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading || animatingMessageId !== null}
            placeholder="اكتب رسالتك هنا..."
          />
        </motion.div>
      </motion.div>

      {/* Modals and overlays */}
      <AnimatePresence>
        {showStudentModal && (
          <StudentInfoModal
            isOpen={showStudentModal}
            onClose={() => setShowStudentModal(false)}
            onSubmit={handleMatchMajors}
            isLoading={isMatchingLoading}
            universitySlug={universityId || ''}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSwipeDeck && (
          <SwipeDeck
            majors={matchedMajors}
            onDeckEmpty={() => setShowSwipeDeck(false)}
          />
        )}
      </AnimatePresence>

      <InterestDrawer />
    </motion.div>
  );
};

export default ChatPage; 