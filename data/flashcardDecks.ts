import { FlashcardDeck } from '../types/flashcard';

export const meridianFlashcards = {
    decks: [
        {
            id: 'lung-meridian',
            name: 'Lung Meridian Points',
            description: 'Main lung meridian points',
            cards: [
                {
                    id: 'LU1',
                    korean: '중부',
                    english: 'Central Treasury',
                    hanja: '中府',
                    romanization: 'jungbu',
                    category: 'lung',
                    level: 3,
                    examples: ['중부혈']
                },
                // ... add remaining lung meridian points from excel_to_json.py
            ]
        },
        // ... add remaining meridian decks from excel_to_json.py
        {
            id: 'maek-chi-ki',
            name: 'Pulse Positions',
            description: 'Pulse diagnosis positions',
            cards: [
                // ... add maek chi ki data from excel_to_json.py
            ]
        },
        {
            id: 'maek-cha-ki',
            name: 'Pulse Qualities',
            description: 'Pulse diagnosis qualities',
            cards: [
                // ... add maek cha ki data from excel_to_json.py
            ]
        }
    ]
};
