import React, { useState } from 'react';
import { Flashcard } from '../types/flashcard';

interface FlashcardStudyProps {
    card: Flashcard;
    onNext: () => void;
}

export const FlashcardStudy: React.FC<FlashcardStudyProps> = ({ card, onNext }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="max-w-lg mx-auto p-4">
            <div 
                className="border rounded-lg p-8 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className="text-center">
                    <p className="text-xl">{isFlipped ? card.back : card.front}</p>
                    <p className="text-sm text-gray-500 mt-4">Click to flip</p>
                </div>
            </div>
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={onNext}
            >
                Next Card
            </button>
        </div>
    );
};
