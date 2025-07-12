import React, { useState, useEffect, useRef } from 'react';
import { Feature, FeatureExampleMessage } from '../data/featuresData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AITypingAnimation from './AITypingAnimation';
import '../styles/ChatPage.css'; // Re-use some chat page styles
import saraLogo from '../assets/logos/sara.png'; // Import Sara's logo
import '../styles/FeatureExampleView.css'; // THIS LINE WAS COMMENTED OUT, UNCOMMENTING IT

// Simple close icon
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface FeatureExampleViewProps {
  feature: Feature;
  isOpen: boolean;
  onClose: () => void;
}

const TYPING_SPEED_MS = 15; // Increased typing speed (was 40)

const FeatureExampleView: React.FC<FeatureExampleViewProps> = ({ feature, isOpen, onClose }) => {
  const [displayedMessages, setDisplayedMessages] = useState<FeatureExampleMessage[]>([]);
  const [animatedTexts, setAnimatedTexts] = useState<Map<number, string>>(new Map());
  const [currentAnimatingIndex, setCurrentAnimatingIndex] = useState<number | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setDisplayedMessages([]);
    setAnimatedTexts(new Map());
    setCurrentAnimatingIndex(0); // Start with the first message
    setShouldAutoScroll(true);
    setIsUserScrolling(false);

  }, [isOpen, feature]); // Reset when modal opens or feature changes

  useEffect(() => {
    if (currentAnimatingIndex === null || currentAnimatingIndex >= feature.example_dialogue.length) {
      return;
    }

    const messageToDisplay = feature.example_dialogue[currentAnimatingIndex];
    const messageKey = currentAnimatingIndex; // Use index as key for animatedTexts map

    // Add message to displayedMessages (will initially be empty for assistant)
    setDisplayedMessages(prev => [...prev, messageToDisplay]);

    if (messageToDisplay.sender === 'assistant') {
      const fullText = messageToDisplay.text;
      const isTable = fullText.includes('| --- |');

      if (isTable) {
        // Display table immediately
        setAnimatedTexts(prev => new Map(prev).set(messageKey, fullText));
        // Move to next message after a short delay
        setTimeout(() => {
          setCurrentAnimatingIndex(prevIndex => (prevIndex === null ? 0 : prevIndex + 1));
        }, 300); // Delay before next message (table display is quick)
      } else {
        // Regular typing animation
        setAnimatedTexts(prev => new Map(prev).set(messageKey, '')); // Initialize with empty for animation
        let charIndex = 0;

        const intervalId = setInterval(() => {
          charIndex++;
          const currentAnimatedText = fullText.substring(0, charIndex);
          setAnimatedTexts(prevMap => new Map(prevMap).set(messageKey, currentAnimatedText));

          if (charIndex >= fullText.length) {
            clearInterval(intervalId);
            // Move to next message after a short delay
            setTimeout(() => {
              setCurrentAnimatingIndex(prevIndex => (prevIndex === null ? 0 : prevIndex + 1));
            }, 500); // Delay before next message starts
          }
        }, TYPING_SPEED_MS);

        return () => {
          clearInterval(intervalId);
          // Ensure full text is shown if component unmounts or effect re-runs
          setAnimatedTexts(prevMap => {
              if (prevMap.get(messageKey) !== fullText) {
                return new Map(prevMap).set(messageKey, fullText);
              }
              return prevMap;
            });
        };
      }
    } else {
      // User message, display immediately and move to next
      setAnimatedTexts(prev => new Map(prev).set(messageKey, messageToDisplay.text));
      setTimeout(() => {
        setCurrentAnimatingIndex(prevIndex => (prevIndex === null ? 0 : prevIndex + 1));
      }, 100); // Shorter delay for user messages
    }
  }, [currentAnimatingIndex, feature.example_dialogue, isOpen]);

  // Handle auto-scrolling only when new messages are added, not during typing
  useEffect(() => {
    if (shouldAutoScroll && !isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedMessages.length, shouldAutoScroll, isUserScrolling]); // Only depend on message count, not animatedTexts

  // Handle user scroll detection
  useEffect(() => {
    const chatArea = chatAreaRef.current;
    if (!chatArea) return;

    let scrollTimeout: number;

    const handleScroll = () => {
      setIsUserScrolling(true);
      setShouldAutoScroll(false);
      
      // Reset auto-scroll after user stops scrolling for 2 seconds
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsUserScrolling(false);
        setShouldAutoScroll(true);
      }, 2000);
    };

    chatArea.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      chatArea.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  if (!isOpen) return null;

  // Use a consistent Sara avatar, similar to a generic assistant
  // const saraAvatarUrl = 'https://via.placeholder.com/40/D3A27F/FFFFFF?text=س'; // Placeholder Sara
  const saraAvatarUrl = saraLogo; // Use imported Sara logo

  return (
    <div className="feature-example-modal-overlay" onClick={onClose}>
      <div className="feature-example-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="feature-example-header">
          <div className="feature-example-title-container">
            <span className="feature-icon-header">{feature.icon}</span>
            <h3>مثال على: {feature.title_ar}</h3>
          </div>
          <button className="feature-example-close-button" onClick={onClose} aria-label="إغلاق">
            <CloseIcon />
          </button>
        </div>
        <div className="feature-example-chat-area" ref={chatAreaRef}>
          {displayedMessages.map((msg, index) => {
            const displayText = animatedTexts.get(index) ?? (msg.sender === 'assistant' ? '' : msg.text);
            const isAssistant = msg.sender === 'assistant';
            const isTable = isAssistant && displayText.includes('| --- |');

            return (
              <div
                key={index} // Using index as key is acceptable here as order is stable for examples
                className={`chat-bubble ${isAssistant ? 'chat-bubble-assistant' : 'chat-bubble-user'}`}
              >
                {isAssistant && (
                  <div className="chat-bubble-avatar">
                    <img src={saraAvatarUrl} alt="Sara Avatar" className="message-avatar-logo" />
                  </div>
                )}
                <div className="chat-bubble-content">
                  {isAssistant ? (
                    <div className={`markdown-content ${isTable ? 'table-view' : ''}`}>
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
                    <div className="user-message-text-example">{displayText}</div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
          {currentAnimatingIndex !== null && currentAnimatingIndex < feature.example_dialogue.length && feature.example_dialogue[currentAnimatingIndex]?.sender === 'assistant' &&
           !animatedTexts.get(currentAnimatingIndex)?.includes('| --- |') && // Only show loading if not a table being shown instantly
           (!animatedTexts.has(currentAnimatingIndex) || animatedTexts.get(currentAnimatingIndex) !== feature.example_dialogue[currentAnimatingIndex].text) && // And if text is not yet fully displayed
            (
            <div className="chat-bubble chat-bubble-assistant loading-indicator-bubble">
              <div className="chat-bubble-avatar">
                <img src={saraAvatarUrl} alt="Sara Avatar" className="message-avatar-logo" />
              </div>
              <div className="chat-bubble-content">
                <AITypingAnimation />
              </div>
            </div>
          )}
        </div>
        <div className="feature-example-footer">
          <p>هذا مثال توضيحي، التفاعل الحقيقي مع سارة أكثر حيوية! 😉</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureExampleView; 