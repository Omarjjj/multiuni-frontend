import React, { useState } from 'react';
import { featuresData, Feature } from '../data/featuresData';
import FeatureCard from './FeatureCard';
import FeatureExampleView from './FeatureExampleView'; // We will create this component next

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({ isOpen, onClose }) => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  if (!isOpen) return null;

  const handleOpenExample = (feature: Feature) => {
    setSelectedFeature(feature);
  };

  const handleCloseExample = () => {
    setSelectedFeature(null);
  };

  return (
    <>
      <div className="features-modal-overlay" onClick={onClose}>
        <div className="features-modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>✨ ميزات سارة الرهيبة ✨</h2>
          <p style={{textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--muted-foreground)'}}>
            أنا مش أي مساعد عادي! شوف شو بقدر أعمل عشانك، وكل هاد بلمسة فلسطينية شبابية بتجنن! 😉
          </p>
          <div className="features-grid">
            {featuresData.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onClick={() => handleOpenExample(feature)}
              />
            ))}
          </div>
          <button className="close-button" onClick={onClose}>فهمت، شكراً!</button>
        </div>
      </div>
      {selectedFeature && (
        <FeatureExampleView
          feature={selectedFeature}
          isOpen={!!selectedFeature}
          onClose={handleCloseExample}
        />
      )}
    </>
  );
};

export default FeaturesModal; 