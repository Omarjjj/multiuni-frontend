import React from 'react';
import { motion } from 'framer-motion';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser }) => {
  return (
    <motion.div 
      className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      }}
    >
      {!isUser && (
        <div className="chat-bubble-avatar">
          <div className="chat-bubble-avatar-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="12" fill="rgba(223, 193, 193, 0.1)"/>
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 20V18C6 16.9391 6.42143 15.9217 7.17157 15.1716C7.92172 14.4214 8.93913 14 10 14H14C15.0609 14 16.0783 14.4214 16.8284 15.1716C17.5786 15.9217 18 16.9391 18 18V20" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}
      <div className="chat-bubble-content">
        <p>{message}</p>
      </div>
    </motion.div>
  );
};

export default ChatBubble; 