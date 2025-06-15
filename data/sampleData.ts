import { FlashcardDeck } from '../types/flashcard';

export const sampleDecks: FlashcardDeck[] = [
    {
        id: 'deck1',
        name: 'Basic Korean Greetings',
        description: 'Common greetings and introductions',
        cards: [
            {
                id: 'card1',
                front: '안녕하세요',
                back: 'Hello (formal)',
                category: 'greetings',
                level: 1
            },
            {
                id: 'card2',
                front: '감사합니다',
                back: 'Thank you (formal)',
                category: 'greetings',
                level: 1
            }
        ]
    }
];
