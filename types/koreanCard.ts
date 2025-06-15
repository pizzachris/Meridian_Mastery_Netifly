export interface KoreanCard extends Flashcard {
    korean: string;
    english: string;
    romanization: string;
    hanja?: string;
    meridianCategory: string;
    subCategory: string;
    difficultyLevel: number;
    points: number;
    examples: {
        korean: string;
        english: string;
        romanization: string;
    }[];
    notes?: string;
    grammarPoints?: string[];
    usageLevel: 'formal' | 'informal' | 'casual';
    relatedTerms?: string[];
}
