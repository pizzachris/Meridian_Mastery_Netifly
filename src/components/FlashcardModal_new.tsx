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
      default: return '/icons/metal element.PNG'; // fallback
    }
  };

  // Handle click on overlay to close modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
        
        {/* Header with element info */}
        <div className="bg-gray-700 text-white p-6 text-center">
          <div className="flex items-center justify-center space-x-4 mb-2">
            {/* Element symbol circle with mockup image */}
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-500">
              <img 
                src={getElementImage()} 
                alt={`${elementData.element} element`}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  console.log('Image failed to load:', getElementImage());
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h2 className="text-2xl font-bold">{elementData.element} Element</h2>
          </div>
          <p className="text-lg opacity-90">
            {elementData.season} • {elementData.meridians.join(', ')}
          </p>
        </div>

        {/* Content sections */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Emotional Aspects */}
          <div>
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">💭</span>
              <h3 className="text-lg font-semibold text-gray-800">Emotional Aspects</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-red-600 font-medium">Challenge:</span>
                <p className="text-gray-700">{elementData.emotion}</p>
              </div>
              <div>
                <span className="text-green-600 font-medium">Balance:</span>
                <p className="text-gray-700">{elementData.positiveEmotion}</p>
              </div>
            </div>
          </div>

          {/* Element Theory */}
          <div>
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">📚</span>
              <h3 className="text-lg font-semibold text-gray-800">Element Theory</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{elementData.theory}</p>
          </div>

          {/* Key Qualities */}
          <div>
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">✨</span>
              <h3 className="text-lg font-semibold text-gray-800">Key Qualities</h3>
            </div>
            <ul className="space-y-1">
              {elementData.qualities.map((quality, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  {quality}
                </li>
              ))}
            </ul>
          </div>

          {/* Physiological Functions */}
          <div>
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">⚕️</span>
              <h3 className="text-lg font-semibold text-gray-800">Physiological Functions</h3>
            </div>
            <ul className="space-y-1">
              {elementData.functions.map((func, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  {func}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Continue Button */}
        <div className="p-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-lg"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardModal;
