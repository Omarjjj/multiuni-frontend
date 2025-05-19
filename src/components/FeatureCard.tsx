import React from 'react';
import { Feature } from '../data/featuresData'; // Assuming Feature type is exported from featuresData.ts

interface FeatureCardProps {
  feature: Feature;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onClick }) => {
  return (
    <div className="feature-card" onClick={onClick}>
      <div className="feature-card-icon">{feature.icon}</div>
      <div className="feature-card-content">
        <h3 className="feature-card-title">{feature.title_ar}</h3>
        <p className="feature-card-description">{feature.description_ar}</p>
      </div>
      <div className="feature-card-action">
        <span>شاهد مثال</span>
        <span className="arrow">➔</span>
      </div>
    </div>
  );
};

export default FeatureCard; 