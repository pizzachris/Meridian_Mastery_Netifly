import { FlashcardDeck } from '../types/flashcard';
import { koreanVocabularyPoints, meridianPoints } from './pointsData';

const convertPointsToLevel = (points: number): number => {
    if (points <= 100) return 1;
    if (points <= 200) return 2;
    if (points <= 300) return 3;
    if (points <= 400) return 4;
    return 5;
};

export const koreanDeck: FlashcardDeck = {
    id: 'korean-main',
    name: 'Korean Vocabulary',
    description: 'Complete Korean vocabulary based on point system',
    cards: koreanVocabularyPoints.map((item, index) => ({
        id: `k${index + 1}`,
        front: item.korean,
        back: item.english,
        category: item.category,
        level: convertPointsToLevel(item.points),
        points: item.points,
        romanization: item.romanization || '',
        examples: item.examples || []
    }))
};

export const getMeridianDecks = () => {
    const decks = {
        heart: {
            id: 'heart-meridian',
            name: 'Heart Meridian - Communication',
            description: 'Vocabulary for relationships and emotional expression',
            cards: []
        },
        lung: {
            id: 'lung-meridian',
            name: 'Lung Meridian - Structure',
            description: 'Core grammar and structural vocabulary',
            cards: []
        },
        liver: {
            id: 'liver-meridian',
            name: 'Liver Meridian - Planning',
            description: 'Action verbs and decision-making vocabulary',
            cards: []
        },
        kidney: {
            id: 'kidney-meridian',
            name: 'Kidney Meridian - Foundations',
            description: 'Essential core vocabulary',
            cards: []
        },
        spleen: {
            id: 'spleen-meridian',
            name: 'Spleen Meridian - Integration',
            description: 'Connecting words and phrases',
            cards: []
        },
        'maek-chi-ki': {
            id: 'maek-chi-ki',
            name: 'Maek Chi Ki - Pulse Positions',
            description: 'Vocabulary for pulse diagnosis positions',
            cards: [],
            color: '#8B0000' // Deep red for pulse diagnosis
        },
        'maek-cha-ki': {
            id: 'maek-cha-ki',
            name: 'Maek Cha Ki - Pulse Methods',
            description: 'Vocabulary for pulse taking methods',
            cards: [],
            color: '#800020' // Burgundy for pulse methods
        }
    };

    // Populate decks by meridian
    meridianPoints.forEach(point => {
        const card = {
            id: `${point.meridian}-${point.korean}`,
            front: point.korean,
            back: point.english,
            points: point.points,
            category: point.category,
            romanization: point.romanization
        };
        decks[point.meridian].cards.push(card);
    });

    return Object.values(decks);
};
