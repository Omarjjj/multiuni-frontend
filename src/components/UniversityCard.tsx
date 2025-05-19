import React, { useState, useMemo } from 'react';

interface UniversityCardProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const UniversityCard: React.FC<UniversityCardProps> = React.memo(({ name, icon, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Split university name without animations for better performance
  const words = useMemo(() => name.split(' '), [name]);
  
  return (
    <div
      className="university-card"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 6px 15px rgba(83, 231, 231, 0.5)' : '0 4px 12px rgba(64, 152, 163, 0.1)'
      }}
    >
      <div className="university-card-content">
        <div 
          className="university-card-icon"
        >
          {icon}
        </div>
        
        <div className="university-card-text">
          <h3 className="university-card-name">
            {words.map((word, i) => (
              <span key={i} className="word-wrapper">
                {word}{i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h3>
        </div>
        
        <div 
          className="university-card-divider"
          style={{ 
            width: isHovered ? '70%' : '40%' 
          }}
        />
        
        <div 
          className="card-arrow"
          style={{ 
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scaleX(-1) translateX(-5px)' : 'scaleX(-1) translateX(10px)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
});

export default UniversityCard; 