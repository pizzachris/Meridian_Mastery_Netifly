import React from 'react';
import { Flashcard } from '../types/flashcard';

interface FlashcardListProps {
    cards: Flashcard[];
    onCardSelect: (card: Flashcard) => void;
}

export const FlashcardList: React.FC<FlashcardListProps> = ({ cards, onCardSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {cards.map(card => (
                <div 
                    key={card.id}
                    className="border rounded-lg p-4 cursor-pointer hover:shadow-lg"
                    onClick={() => onCardSelect(card)}
                >
                    <h3 className="font-bold mb-2">{card.category}</h3>
                    <p>{card.front}</p>
                </div>
            ))}
        </div>
    );
};
