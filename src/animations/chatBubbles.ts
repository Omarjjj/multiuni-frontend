import gsap from 'gsap';

// Initialize message bubble animations
export const initChatBubbleAnimations = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  // Set up hover animations for SVG icons in chat
  const animateIcons = () => {
    // Get all SVG icons in the chat
    const icons = document.querySelectorAll('.chat-window svg, .chat-page svg');
    
    icons.forEach(icon => {
      const paths = icon.querySelectorAll('path, circle, rect');
      
      // Set up hover animation
      icon.parentElement?.addEventListener('mouseenter', () => {
        gsap.to(paths, {
          fill: '#ac9169',
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out'
        });
        
        gsap.to(icon, {
          scale: 1.15,
          duration: 0.4,
          ease: 'back.out(1.7)'
        });
      });
      
      // Reset on mouse leave
      icon.parentElement?.addEventListener('mouseleave', () => {
        gsap.to(paths, {
          fill: '',
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out'
        });
        
        gsap.to(icon, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });
  };
  
  // Enhance chat bubble animations
  const enhanceChatBubbles = () => {
    // Get all chat bubbles
    const chatBubbles = document.querySelectorAll('.chat-bubble');
    
    // Set up interaction animations
    chatBubbles.forEach(bubble => {
      bubble.addEventListener('mouseenter', () => {
        gsap.to(bubble, {
          y: -5,
          boxShadow: '0 8px 20px rgba(172, 145, 105, 0.15)',
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      bubble.addEventListener('mouseleave', () => {
        gsap.to(bubble, {
          y: 0,
          boxShadow: bubble.classList.contains('chat-bubble-user') 
            ? '0 3px 10px rgba(172, 145, 105, 0.2)' 
            : '0 3px 10px rgba(0, 0, 0, 0.03)',
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });
  };

  // Animate chat input field
  const enhanceChatInput = () => {
    const chatInput = document.querySelector('.chat-input-container');
    const chatInputField = document.querySelector('.chat-input');
    
    if (chatInput && chatInputField) {
      // Focus on input field container
      chatInputField.addEventListener('focus', () => {
        gsap.to(chatInput, {
          boxShadow: '0 8px 24px rgba(172, 145, 105, 0.2)',
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      // Blur from input field
      chatInputField.addEventListener('blur', () => {
        gsap.to(chatInput, {
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.04)',
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    }
  };

  // Animate send button for RTL
  const enhanceSendButton = () => {
    const sendButton = document.querySelector('.chat-send-button');
    
    if (sendButton) {
      sendButton.addEventListener('mouseenter', () => {
        gsap.to(sendButton, {
          scale: 1.1,
          rotate: -10,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
      });
      
      sendButton.addEventListener('mouseleave', () => {
        gsap.to(sendButton, {
          scale: 1,
          rotate: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }
  };
  
  // Initialize animations
  const initAnimations = () => {
    // Get the chat container
    const chatContainer = document.querySelector('.chat-messages');
    
    if (chatContainer) {
      // Create a mutation observer to watch for new messages
      const observer = new MutationObserver(() => {
        enhanceChatBubbles();
      });
      
      // Start observing the chat container for changes
      observer.observe(chatContainer, { 
        childList: true,
        subtree: true 
      });
      
      // Initialize existing elements
      animateIcons();
      enhanceChatBubbles();
      enhanceChatInput();
      enhanceSendButton();
      
      return () => {
        observer.disconnect();
      };
    }
  };
  
  // Initialize after a short delay to ensure DOM is ready
  setTimeout(initAnimations, 500);
};

// Create a timeline for new message animation
export const createMessageAnimation = (element: HTMLElement) => {
  const tl = gsap.timeline();
  
  // Detect if it's a user or assistant message
  const isUserMessage = element.classList.contains('chat-bubble-user');
  
  tl.fromTo(element, 
    { 
      opacity: 0, 
      scale: 0.8,
      x: isUserMessage ? -20 : 20, // RTL adjusted animations
      y: 10
    },
    {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    }
  );
  
  return tl;
};

// Export default function for easy importing
export default initChatBubbleAnimations; 