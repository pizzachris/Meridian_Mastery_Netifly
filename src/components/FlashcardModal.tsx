import React from 'react';
import elementTheoryData from '../data/elementTheoryData.json';

interface FlashcardModalProps {
  element: string;
  onClose: () => void;
}

const FlashcardModal: React.FC<FlashcardModalProps> = ({ element, onClose }) => {
  const elementData = elementTheoryData[element.toLowerCase() as keyof typeof elementTheoryData];

  if (!elementData) {
    return null;
  }

  // Get element mockup image path
  const getElementImage = () => {
    switch (element.toLowerCase()) {
      case 'metal': return '/icons/metal element.PNG';
      case 'wood': return '/icons/wood element.PNG';
      case 'fire': return '/icons/fire element.PNG';
      case 'earth': return '/icons/earth element.PNG';
      case 'water': return '/icons/water element.PNG';
      default: return '/icons/earth element.PNG'; // fallback
    }
  };

  // Get element-specific styling based on mockups
  const getElementStyles = () => {
    switch (element.toLowerCase()) {
      case 'metal':
        return {
          overlayBg: 'bg-gray-900 bg-opacity-70',
          modalBg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          accent: 'bg-gray-600',
          text: 'text-gray-800',
          border: 'border-gray-300',
          button: 'bg-gray-600 hover:bg-gray-700 text-white'
        };
      case 'wood':
        return {
          overlayBg: 'bg-green-900 bg-opacity-70',
          modalBg: 'bg-gradient-to-br from-green-50 to-green-100',
          accent: 'bg-green-600',
          text: 'text-green-800',
          border: 'border-green-300',
          button: 'bg-green-600 hover:bg-green-700 text-white'
        };
      case 'fire':
        return {
          overlayBg: 'bg-red-900 bg-opacity-70',
          modalBg: 'bg-gradient-to-br from-red-50 to-red-100',
          accent: 'bg-red-600',
          text: 'text-red-800',
          border: 'border-red-300',
          button: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'earth':
        return {
          overlayBg: 'bg-yellow-900 bg-opacity-70',
          modalBg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
          accent: 'bg-yellow-600',
          text: 'text-yellow-800',
          border: 'border-yellow-300',
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
      case 'water':
        return {
          overlayBg: 'bg-blue-900 bg-opacity-70',
          modalBg: 'bg-gradient-to-br from-blue-50 to-blue-100',
          accent: 'bg-blue-600',
          text: 'text-blue-800',
          border: 'border-blue-300',
          button: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      default:
        return {
          overlayBg: 'bg-gray-900 bg-opacity-70',
          modalBg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          accent: 'bg-gray-600',
          text: 'text-gray-800',
          border: 'border-gray-300',
          button: 'bg-gray-600 hover:bg-gray-700 text-white'
        };
    }
  };

  const styles = getElementStyles();
  return (
    <div className={`fixed inset-0 ${styles.overlayBg} flex items-center justify-center p-4 z-50`}>
      <div className={`relative ${styles.modalBg} ${styles.border} border-2 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl`}>
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${getElementImage()})`,
            filter: 'blur(1px)'
          }}
        />
        
        {/* Content Container with backdrop */}
        <div className="relative bg-white bg-opacity-85 h-full overflow-y-auto">
          
          {/* Header */}
          <div className={`${styles.accent} text-white p-6 relative`}>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <img 
                  src={getElementImage()} 
                  alt={`${elementData.element} element`}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h2 className="text-3xl font-bold">{elementData.element} Element</h2>
            </div>
            <div className="text-center mt-2 text-lg opacity-90">
              {elementData.season} • {elementData.meridians.join(', ')}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            
            {/* Emotions */}
            <div className={`${styles.text} bg-white bg-opacity-80 rounded-lg p-4 border border-opacity-30 ${styles.border}`}>
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <span className="mr-2">💭</span>
                Emotional Aspects
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-red-600">Challenge:</span> 
                  <div className="mt-1">{elementData.emotion}</div>
                </div>
                <div>
                  <span className="font-medium text-green-600">Balance:</span> 
                  <div className="mt-1">{elementData.positiveEmotion}</div>
                </div>
              </div>
            </div>

            {/* Theory */}
            <div className={`${styles.text} bg-white bg-opacity-80 rounded-lg p-4 border border-opacity-30 ${styles.border}`}>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <span className="mr-2">📚</span>
                Element Theory
              </h3>
              <p className="text-sm leading-relaxed">{elementData.theory}</p>
            </div>

            {/* Qualities */}
            <div className={`${styles.text} bg-white bg-opacity-80 rounded-lg p-4 border border-opacity-30 ${styles.border}`}>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <span className="mr-2">✨</span>
                Key Qualities
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {elementData.qualities.map((quality, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2 text-blue-500">•</span>
                    {quality}
                  </li>
                ))}
              </ul>
            </div>

            {/* Functions */}
            <div className={`${styles.text} bg-white bg-opacity-80 rounded-lg p-4 border border-opacity-30 ${styles.border}`}>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <span className="mr-2">⚕️</span>
                Physiological Functions
              </h3>
              <ul className="space-y-1 text-sm">
                {elementData.functions.map((func, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-blue-500">•</span>
                    {func}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0">
            <button
              onClick={onClose}
              className={`${styles.button} w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-md hover:shadow-lg`}
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardModal;
