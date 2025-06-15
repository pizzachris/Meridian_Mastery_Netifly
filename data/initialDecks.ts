import { FlashcardDeck } from '../types/flashcard';
import { koreanVocabulary } from './koreanVocabulary';

function createCards(vocab: any[], category: string) {
    return vocab.map((item, index) => ({
        id: `${category}_${index}`,
        front: item.korean,
        back: item.english,
        category,
        level: item.level
    }));
}

export const initialDecks: FlashcardDeck[] = [
    {
        id: 'basics',
        name: 'Korean Basics',
        description: 'Essential Korean phrases and greetings',
        cards: [
            ...createCards(koreanVocabulary.basic.greetings, 'greetings'),
            ...createCards(koreanVocabulary.basic.numbers, 'numbers')
        ]
    },
    {
        id: 'intermediate',
        name: 'Intermediate Korean',
        description: 'Emotions and weather expressions',
        cards: [
            ...createCards(koreanVocabulary.intermediate.emotions, 'emotions'),
            ...createCards(koreanVocabulary.intermediate.weather, 'weather')
        ]
    },
    {
        id: 'advanced',
        name: 'Advanced Korean',
        description: 'Korean idioms and advanced expressions',
        cards: createCards(koreanVocabulary.advanced.idioms, 'idioms')
    },
    {
        id: 'maek-chi-ki',
        name: 'Pulse Positions',
        type: 'maek-chi-ki',
        cards: [
            {
                id: 'mck1',
                korean: '촌',
                english: 'Distal Position',
                romanization: 'chon',
                type: 'maek-chi-ki',
                level: 1,
                position: 'chon',
                examples: ['촌구', '촌맥']
            }
            // Add other position cards
        ]
    },
    {
        id: 'maek-cha-ki',
        name: 'Pulse Qualities',
        type: 'maek-cha-ki',
        cards: [
            // Add pulse quality cards
        ]
    }
];
