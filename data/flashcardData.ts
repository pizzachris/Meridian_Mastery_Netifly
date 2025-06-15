import { FlashcardDeck } from '../types/flashcard';

export const meridianDecks: FlashcardDeck[] = [
    {
        id: 'maek-chi-ki',
        name: 'Pulse Positions',
        description: 'Fundamental pulse positions',
        category: 'pulse-diagnosis',
        cards: [
            {
                id: 'mck-1',
                front: '촌구',
                back: 'Chon Position',
                romanization: 'chon-gu',
                level: 1,
                type: 'pulse-position'
            },
            // ... more pulse position cards
        ]
    },
    {
        id: 'maek-cha-ki',
        name: 'Pulse Qualities',
        description: 'Pulse characteristic analysis',
        category: 'pulse-diagnosis',
        cards: [
            {
                id: 'mchk-1',
                front: '부맥',
                back: 'Floating Pulse',
                romanization: 'bu-maek',
                level: 1,
                type: 'pulse-quality'
            },
            // ... more pulse quality cards
        ]
    },
    // ... Continue with all meridian decks
];

// Would you like me to:
// 1. Add all 363 cards organized by meridian?
// 2. Include the complete maek chi ki set?
// 3. Include the complete maek cha ki set?
