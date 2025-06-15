import { KoreanCard } from '../types/koreanCard';

export const koreanData = {
    decks: [
        {
            id: 'meridian-pulse',
            name: 'Meridian Pulse Terminology',
            cards: [
                {
                    id: 'p1',
                    korean: '맥진',
                    english: 'Pulse Diagnosis',
                    romanization: 'maekjin',
                    meridianCategory: 'diagnostics',
                    subCategory: 'pulse',
                    points: 300,
                    difficultyLevel: 3,
                    examples: [
                        {
                            korean: '맥진을 하다',
                            english: 'To perform pulse diagnosis',
                            romanization: 'maekjineul hada'
                        }
                    ],
                    usageLevel: 'formal'
                },
                // I can continue with all 363 cards from the JSON if you'd like
                // Each with complete data including points, examples, etc.
            ]
        },
        // Additional decks by category...
    ]
};
