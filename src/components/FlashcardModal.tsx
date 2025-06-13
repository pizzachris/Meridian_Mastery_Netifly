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

  // Handle click events to ensure modal closes
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔴 Modal close button clicked');
    if (onClose) {
      onClose();
    }
  };

  // Handle background click to close
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose(e);
    }
  };

  // Get element-specific colors matching mockups exactly
  const getElementStyles = () => {
    switch (element.toLowerCase()) {
      case 'metal':
        return {
          bg: 'from-gray-200 via-gray-300 to-gray-400',
          accent: 'bg-gray-700',
          button: 'bg-gray-700 hover:bg-gray-800'
        };
      case 'wood':
        return {
          bg: 'from-green-200 via-green-300 to-green-400',
          accent: 'bg-green-700',
          button: 'bg-green-700 hover:bg-green-800'
        };
      case 'fire':
        return {
          bg: 'from-red-200 via-red-300 to-red-400',
          accent: 'bg-red-700',
          button: 'bg-red-700 hover:bg-red-800'
        };
      case 'earth':
        return {
          bg: 'from-yellow-200 via-yellow-300 to-yellow-400',
          accent: 'bg-yellow-700',
          button: 'bg-yellow-700 hover:bg-yellow-800'
        };
      case 'water':
        return {
          bg: 'from-blue-200 via-blue-300 to-blue-400',
          accent: 'bg-blue-700',
          button: 'bg-blue-700 hover:bg-blue-800'
        };
      default:
        return {
          bg: 'from-gray-200 via-gray-300 to-gray-400',
          accent: 'bg-gray-700',
          button: 'bg-gray-700 hover:bg-gray-800'
        };
    }
  };

  const styles = getElementStyles();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={handleBackgroundClick}
    >
      <div className="relative bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl">
        
        {/* Header with element image background */}
        <div 
          className={`relative bg-gradient-to-br ${styles.bg} p-6 text-center`}
          style={{
            backgroundImage: `url(${getElementImage()})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="relative bg-black bg-opacity-30 -m-6 p-6">
            <h2 className="text-2xl font-bold text-white mb-1">
              {elementData.element} Element
            </h2>
            <p className="text-white text-sm opacity-90">
              {elementData.season} • {elementData.meridians.join(' & ')}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-96">
          
          {/* Theory */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Element Theory</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{elementData.theory}</p>
          </div>

          {/* Emotions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-red-600 mb-1">Challenge</h4>
              <p className="text-sm text-gray-700">{elementData.emotion}</p>
            </div>
            <div>
              <h4 className="font-medium text-green-600 mb-1">Balance</h4>
              <p className="text-sm text-gray-700">{elementData.positiveEmotion}</p>
            </div>
          </div>

          {/* Functions */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Key Functions</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {elementData.functions.slice(0, 3).map((func, index) => (
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
            type="button"
            onClick={handleClose}
            className={`${styles.button} w-full py-3 px-6 rounded-lg font-semibold text-white text-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95`}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardModal;