import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatInput from '../components/ChatInput';
import { initChatBubbleAnimations } from '../animations/chatBubbles';

// --- Major Swiper Imports ---
import { Major } from '@/contexts/InterestContext'; // Remove InterestProvider import
import { StudentInfoModal } from '@/components/modals/StudentInfoModal';
import { SwipeDeck } from '@/components/swipe/SwipeDeck';
import { InterestDrawer } from '@/components/drawer/InterestDrawer';
import { toast } from "react-hot-toast";
// --- End Major Swiper Imports ---

// Import university logo images
import aaupLogo from '../assets/logos/aaup.png';
import alqudsLogo from '../assets/logos/alquds.png';
import birzeitLogo from '../assets/logos/birzeit.png';
import bethlehemLogo from '../assets/logos/bethlehem.png';
import najahLogo from '../assets/logos/najah.png';
import polytechLogo from '../assets/logos/polytech.png';

// --- Navigation History Constants and Helpers ---
// const NAVIGATION_HISTORY_KEY = 'universityNavigationHistory_v1';

// const getNavigationHistory = (): string[] => {
//   try {
//     const history = sessionStorage.getItem(NAVIGATION_HISTORY_KEY);
//     return history ? JSON.parse(history) : [];
//   } catch (error) {
//     console.error("Error reading navigation history:", error);
//     return []; // Return empty array on error
//   }
// };

// const addUniversityToHistory = (uniIdToAdd: string) => {
//   if (!uniIdToAdd) return;
//   try {
//     let h = getNavigationHistory();
//     if (h.length === 0 || h[h.length - 1] !== uniIdToAdd) {
//       h.push(uniIdToAdd);
//       sessionStorage.setItem(NAVIGATION_HISTORY_KEY, JSON.stringify(h));
//     }
//   } catch (error) {
//     console.error("Error updating navigation history:", error);
//   }
// };
// --- End Navigation History ---

// Simple arrow icon for back button
const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Replace the simple UtilityIcon with an animated version
const UtilityIcon = () => (
  <motion.div 
    className="utility-icon-wrapper"
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 4H7C5.89543 4 5 4.89543 5 6V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V6C19 4.89543 18.1046 4 17 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 9H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 13H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 17H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    
    <motion.div 
      className="help-text-bubble"
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0.8, 1, 1, 0.8],
        y: [30, 0, 0, -30]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        repeatDelay: 2
      }}
    >
      <motion.span style={{ display: 'inline-block' }}>
        محتار
        <motion.span
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, 10, 0, -10, 0],
            color: ['var(--primary-foreground)', '#ffdd57', 'var(--primary-foreground)']
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
          style={{ display: 'inline-block', marginRight: '3px', marginLeft: '3px' }}
        >
          ؟
        </motion.span>
        اكبس علي
      </motion.span>
      
      <motion.div
        className="emoji-sparkles"
        style={{ position: 'absolute', top: '-15px', right: '10px' }}
        animate={{
          rotate: [0, 15, -15, 0],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        ✨
      </motion.div>
      
      <motion.div
        className="emoji-sparkles"
        style={{ position: 'absolute', bottom: '-10px', left: '10px' }}
        animate={{
          rotate: [0, -15, 15, 0],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 0.5
        }}
      >
        ✨
      </motion.div>
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

// Backend API URL - should be in environment variable in production
const API_URL = 'https://multi-uni-assistant.onrender.com'; // <-- MODIFIED LINE: Replace with your Render backend URL

// Define the typing speed (milliseconds per character)
const TYPING_SPEED_MS = 30;

const SESSION_ID_KEY = 'chat_session_id_v1'; // Key for sessionStorage

const ChatPage: React.FC = () => {
  // Ensure universityId from params is treated as a potential key of universityNames
  const { universityId: rawUniversityId } = useParams<{ universityId: string }>();
  const universityId = rawUniversityId as UniversityIdKey | undefined;

  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
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
  const [isMatchingLoading, setIsMatchingLoading] = useState(false); // For finding majors
  // --- End State for Major Swiper ---
  
  // State to manage the animated text for each assistant message
  const [animatedMessages, setAnimatedMessages] = useState<Map<string, string>>(new Map());
  // State to track which messages are currently animating
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null);
  
  // Ref to track if welcome effect has run for the current universityId in Strict Mode (dev only)
  const welcomeEffectForDevRef = useRef<string | null | undefined>(null);
  
  // --- BEGIN ADDED LOGGING ---
  useEffect(() => {
    console.log('ChatPage: animatingMessageId changed to:', animatingMessageId);
  }, [animatingMessageId]);
  // --- END ADDED LOGGING ---
  
  // Generate a unique session ID when the component mounts, or retrieve from sessionStorage
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
    // Exit early if universityId is not (yet) defined or not a valid key, or if sessionId not set
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
            welcomeEffectForDevRef.current = null; // Reset if invalid, so it can run if ID becomes valid
        }
        return;
    }

    // Strict Mode in DEV runs useEffect twice. This ref prevents double processing for welcome message.
    if (import.meta.env.DEV && welcomeEffectForDevRef.current === rawUniversityId) {
        console.log("ChatPage: Welcome effect already run for", rawUniversityId, "in dev strict mode.");
        return; // Already processed this universityId in the first pass of Strict Mode
    }
    
    const fetchInitialGreeting = async () => {
      setIsLoading(true); // Show loading indicator
      // Clear previous messages before setting the new welcome message from backend
      // This ensures only the backend's greeting is shown initially.
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
            message: "__INITIAL_GREETING__" // Special message to request greeting
          }),
        });

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json().catch(() => null); // Try to get error detail from apiResponse
          const detail = errorData?.detail || `Backend error: ${apiResponse.status}`;
          throw new Error(detail);
        }
        const responseData = await apiResponse.json(); // Use renamed variable, get data from apiResponse
        const welcomeMessageText = responseData.answer; // Get answer from responseData

        if (!welcomeMessageText) {
            console.warn("ChatPage: Received empty welcome message from backend.");
            // Keep backendStatus.connected as false or handle as an error
            throw new Error("Empty welcome message from backend.");
        }

        // If we successfully got a welcome message, assume backend is connected
        setBackendStatus(prevStatus => ({ ...prevStatus, connected: true, error: null }));

        const welcomeMessage: Message = {
          id: `welcome-${Date.now()}`,
          text: welcomeMessageText, // Backend provides the dynamic greeting
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setMessages([welcomeMessage]); // Set this as the first message
        // The animation useEffect will pick this up to type it out.

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
        setAnimatedMessages(prev => new Map(prev).set(displayErrorMessage.id, displayErrorMessage.text)); // Show error immediately
        // Update backend status on error
        setBackendStatus(prevStatus => ({ ...prevStatus, connected: false, error: errorText }));
      } finally {
        setIsLoading(false);
         // Mark this universityId as processed for the welcome message in dev/Strict Mode
        if (import.meta.env.DEV) {
            console.log("ChatPage: Welcome effect processing completed for", rawUniversityId);
            welcomeEffectForDevRef.current = rawUniversityId;
        }
      }
    };
    
    fetchInitialGreeting();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawUniversityId, universityId, sessionId]); // Added sessionId dependency, universityId for re-trigger if it changes
  
  // Effect to handle the typing animation for the latest assistant message
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];

    // Only process new assistant messages that haven't had their animation started/completed.
    // The `animatedMessages.has(id)` check is the main guard against re-processing.
    if (latestMessage?.sender === 'assistant' && !animatedMessages.has(latestMessage.id)) {
      const fullText = latestMessage.text;
      const isTable = fullText.includes('| --- |');

      if (isTable) {
        // If it's a table, display it fully immediately and mark as processed.
        setAnimatedMessages(prev => new Map(prev).set(latestMessage.id, fullText));
        console.log(`ChatPage: Animation - Table detected for ${latestMessage.id}. Setting animatingMessageId to null.`);
        setAnimatingMessageId(null); // Ensure input is enabled
      } else {
        // If not a table, proceed with character-by-character animation.
        console.log(`ChatPage: Animation - Starting for ${latestMessage.id}. Setting animatingMessageId.`);
        setAnimatingMessageId(latestMessage.id); // Signal animation start, disables input
        
        // Immediately mark this message in animatedMessages with empty string to prevent re-processing by this effect.
        // The interval will progressively update this map entry.
        setAnimatedMessages(prev => new Map(prev).set(latestMessage.id, '')); 

        let currentIndex = 0;
        const intervalId = setInterval(() => {
          currentIndex++;
          const currentAnimatedText = fullText.substring(0, currentIndex);
          setAnimatedMessages(prevMap => new Map(prevMap).set(latestMessage.id, currentAnimatedText));

          if (currentIndex >= fullText.length) {
            clearInterval(intervalId);
            console.log(`ChatPage: Animation - Completed for ${latestMessage.id}. Setting animatingMessageId to null.`);
            setAnimatingMessageId(null); // Signal animation end, enables input
          }
        }, TYPING_SPEED_MS);

        // Cleanup function for this specific animation interval
        return () => {
          clearInterval(intervalId);
          // If the effect re-runs (e.g. new message arrives) while this one was animating,
          // ensure its animationId is cleared and its full text is shown.
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
            // Only update if not already fully displayed or changed by a subsequent process
            if (prevMap.get(latestMessage.id) !== fullText) {
              return new Map(prevMap).set(latestMessage.id, fullText);
            }
            return prevMap;
          });
        };
      }
    }
  }, [messages, animatedMessages]); // Removed animatingMessageId from dependencies
  
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
    
    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true); // Start loading indicator
    setAnimatingMessageId(null); // Stop any previous animation
    
    try {
      // Make sure the university ID is valid
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
        // Update backend status on error
        const errorText = `Network response was not ok: ${response.status}`;
        setBackendStatus(prevStatus => ({ ...prevStatus, connected: false, error: errorText }));
        throw new Error(errorText);
      }
      
      // If response is ok, backend is connected
      setBackendStatus(prevStatus => ({ ...prevStatus, connected: true, error: null }));
      const data = await response.json();
      
      // IMPORTANT: Add assistant message BUT animation effect will handle display
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      // Add the complete message data, the useEffect will trigger animation
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message to user
      const errorMessageText = 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى لاحقاً. 🙁';
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessageText,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      // Ensure error message is displayed fully immediately
      setAnimatedMessages(prev => new Map(prev).set(errorMessage.id, errorMessage.text));
      // Update backend status on error
      const errorDetail = error instanceof Error ? error.message : 'Unknown error';
      setBackendStatus(prevStatus => ({ ...prevStatus, connected: false, error: errorDetail }));
    } finally {
      setIsLoading(false); // Stop loading indicator AFTER response/error
    }
  };
  
  // --- Function to call /match-majors endpoint ---
  interface StudentInfo {
    min_avg: number;
    branch: string;
    field?: string;
  }

  const handleFindMajors = async (studentInfo: StudentInfo) => {
    if (!universityId) {
      toast("University ID is missing.");
      return;
    }
    setIsMatchingLoading(true);
    console.log('Finding majors for:', { university: universityId, ...studentInfo });

    try {
      const response = await fetch(`${API_URL}/match-majors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          university: universityId,
          min_avg: studentInfo.min_avg,
          branch: studentInfo.branch,
          field: studentInfo.field,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch majors' }));
        throw new Error(errorData.detail || `Network error: ${response.status}`);
      }

      const majors: Major[] = await response.json();
      console.log('Matched majors:', majors);

      if (majors.length === 0) {
         toast("ما لقينا تخصصات تطابق بحثك بالضبط. جرب تغير الفلاتر شوي! 🤔");
         // Keep modal open or close? Let's close it for now.
         setShowStudentModal(false);
      } else {
        setMatchedMajors(majors);
        setShowStudentModal(false);
        setShowSwipeDeck(true);
      }

    } catch (error) {
      console.error('Error finding majors:', error);
      toast.error(`حدث خطأ أثناء البحث عن التخصصات: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Keep modal open on error so user can retry or close
    } finally {
      setIsMatchingLoading(false);
    }
  };
  // --- End Function to call /match-majors endpoint ---

  // Optimized throttle function with RAF
  const rafThrottle = useCallback((callback: Function) => {
    let ticking = false;
    return function(this: any, ...args: any[]) {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          callback.apply(this, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  }, []);

  // Add cursor effect similar to UniversitySelectionPage
  useEffect(() => {
    // Set initial position via refs to avoid flash
    if (cursorRef.current && cursorDotRef.current) {
      cursorRef.current.style.transform = `translate3d(-100px, -100px, 0) translate(-50%, -50%)`;
      cursorDotRef.current.style.transform = `translate3d(-100px, -100px, 0) translate(-50%, -50%)`;
    }
      
    // Use requestAnimationFrame for cursor updates - much more efficient
    const updateCursor = (e: MouseEvent) => {
      if (cursorRef.current && cursorDotRef.current) {
        const x = e.clientX;
        const y = e.clientY;

        // Update element directly using left/top for potentially better compatibility
        cursorRef.current.style.left = `${x}px`;
        cursorRef.current.style.top = `${y}px`;
        cursorDotRef.current.style.left = `${x}px`;
        cursorDotRef.current.style.top = `${y}px`;
        
        // Remove transform styles if they were previously set
        cursorRef.current.style.transform = ''; 
        cursorDotRef.current.style.transform = '';

        if (!hasInteracted) {
          setHasInteracted(true);
        }
      }
    };
    
    // Throttle with requestAnimationFrame for optimal performance
    const throttledUpdateCursor = rafThrottle(updateCursor);

    // Use more efficient handlers for cursor enlargement - only set attribute
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || 
          target.closest('a') || 
          target.closest('.chat-bubble') || 
          target.closest('.chat-input-container')) {
        if (cursorRef.current) {
          cursorRef.current.setAttribute('data-enlarged', 'true');
        }
      }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || 
          target.closest('a') || 
          target.closest('.chat-bubble') || 
          target.closest('.chat-input-container')) {
        if (cursorRef.current) {
          cursorRef.current.setAttribute('data-enlarged', 'false');
        }
      }
    };

    // Use passive event listeners for performance
    window.addEventListener('mousemove', throttledUpdateCursor, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', throttledUpdateCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [hasInteracted, rafThrottle]);
  
  // Optimized cursor component with refs
  const CustomCursor = () => (
    <>
      <div 
        ref={cursorRef}
        className="custom-cursor hardware-accelerated"
        style={{ transform: 'translate(-50%, -50%)' }} 
      />
      <div 
        ref={cursorDotRef}
        className="custom-cursor-dot hardware-accelerated"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );

  // Initialize chat bubble animations
  useEffect(() => {
    const cleanup = initChatBubbleAnimations();
    return cleanup;
  }, []);

  return (
    <motion.div 
      className="chat-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Static background elements */}
      {/* <div className="animated-background" /> */}
      {/* <div className="noise-overlay" /> */}
      {/* <div className="line-pattern-overlay" /> */}
      
      {/* Performance optimized cursor */}
      <CustomCursor />
      
      <div className="chat-container">
        <div className="chat-header">
          <button className="back-button" onClick={handleBackClick} aria-label="Go back">
            <ArrowLeftIcon />
          </button>
          {universityId && universityLogos[universityId as keyof typeof universityLogos] && (
            <img
              src={universityLogos[universityId as keyof typeof universityLogos]}
              alt={universityNames[universityId as keyof typeof universityNames] || 'University Logo'}
              className="university-logo header-logo"
            />
          )}
          <h2 className="chat-title">
            {universityId ? universityNames[universityId as keyof typeof universityNames] || 'University Chat' : 'University Chat'}
          </h2>
          <button 
            className="chat-utils-button" 
            aria-label="Chat options"
            onClick={() => setShowStudentModal(true)}
          >
            <UtilityIcon />
          </button>
        </div>
        
        <div className="chat-messages">
          {messages.map((message) => {
            // Determine if the current message is animating
            const isAnimating = message.id === animatingMessageId;
            // Get the text to display (either fully animated or currently animating)
            const displayText = animatedMessages.get(message.id) ?? (message.sender === 'assistant' ? '' : message.text);
            // Determine if this specific message is the one currently animating for keying
            const isThisMessageCurrentlyAnimating = message.sender === 'assistant' && message.id === animatingMessageId;
            const markdownRenderKey = message.id + (isThisMessageCurrentlyAnimating ? '_animating' : '_final');

            // For debugging table rendering
            // if (message.sender === 'assistant' && message.text.includes('| --- |')) {
            //   console.log("Table Markdown for ReactMarkdown:", displayText);
            // }

            return (
              <div
                key={message.id}
                className={`chat-bubble ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'} ${isAnimating ? 'typing-active' : ''}`}
              >
                {message.sender === 'assistant' && universityId && universityLogos[universityId as keyof typeof universityLogos] && (
                  <div className="chat-bubble-avatar">
                    <img
                      src={universityLogos[universityId as keyof typeof universityLogos]}
                      alt={universityNames[universityId as keyof typeof universityNames] || 'University Logo'}
                      className="message-avatar-logo"
                    />
                  </div>
                )}
                <div className="chat-bubble-content">
                  {message.sender === 'assistant' ? (
                    <div className="markdown-content">
                      <ReactMarkdown 
                        key={markdownRenderKey}
                        remarkPlugins={[remarkGfm]}
                      >{displayText}</ReactMarkdown>
                      <span className="message-timestamp">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="user-message-text">{message.text}</div>
                      <span className="message-timestamp user-timestamp">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="chat-bubble chat-bubble-assistant loading-indicator-bubble">
              {universityId && universityLogos[universityId as keyof typeof universityLogos] ? (
                <div className="chat-bubble-avatar">
                  <img
                    src={universityLogos[universityId as keyof typeof universityLogos]}
                    alt={universityNames[universityId as keyof typeof universityNames] || 'University Logo'}
                    className="message-avatar-logo"
                  />
                </div>
              ) : (
                <div className="chat-bubble-avatar">
                  {/* Placeholder avatar if university logo not available */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="12" fill="rgba(255, 255, 255, 0.1)"/>
                    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 20V18C6 16.9391 6.42143 15.9217 7.17157 15.1716C7.92172 14.4214 8.93913 14 10 14H14C15.0609 14 16.0783 14.4214 16.8284 15.1716C17.5786 15.9217 18 16.9391 18 18V20" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <div className="chat-bubble-content">
                <div className="loading-animation-container">
                  <div className="ai-loading-icon">
                    <div className="ai-loading-circle"></div>
                    <div className="ai-loading-circle"></div>
                    <div className="ai-loading-circle"></div>
                    <div className="ai-loading-circle"></div>
                  </div>
                  <div className="loading-text-container">
                    <p className="loading-text-primary">سارة عم بتفكر </p>
                    <p className="loading-text-secondary">شوي بس <span className="loading-dots"></span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Only show backend status problems to help with debugging */}
          {backendStatus.error && (
            <div className="backend-status-error">
              <p>Backend connection error: {backendStatus.error}</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input-wrapper">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            placeholder="اكتب رسالتك هنا..." 
            disabled={!backendStatus.connected || isLoading || animatingMessageId !== null}
          />
        </div>
      </div>

      {/* --- Render Major Swiper Components --- */}
      {universityId && (
        <StudentInfoModal
          universitySlug={universityId}
          isOpen={showStudentModal}
          onClose={() => setShowStudentModal(false)}
          onSubmit={handleFindMajors}
          isLoading={isMatchingLoading}
        />
      )}

      {showSwipeDeck && (
        <SwipeDeck
          majors={matchedMajors}
          onDeckEmpty={() => {
            setShowSwipeDeck(false);
            toast.success("وصلت لآخر القائمة! شوف اهتماماتك المحفوظة.");
          }}
        />
      )}

      <InterestDrawer />
      {/* --- End Render Major Swiper Components --- */}

    </motion.div>
  );
};

export default ChatPage; 
