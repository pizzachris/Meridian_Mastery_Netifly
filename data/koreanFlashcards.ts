import { FlashcardDeck } from '../types/flashcard';

export const koreanDeck: FlashcardDeck = {
    id: 'korean-main',
    name: 'Korean Complete Vocabulary',
    description: 'Comprehensive Korean vocabulary with 363 cards',
    cards: [
        {
            id: 'k1',
            korean: '안녕하세요',
            english: 'Hello (formal)',
            romanization: 'annyeonghaseyo',
            pronunciation: 'an-nyeong-ha-se-yo',
            category: 'greetings',
            level: 1,
            audio: {
                url: '/audio/안녕하세요.mp3',
                duration: 1.2
            }
        },
        // ... Add all 363 cards here
    ]
};
