export interface CardHint {
    examples: string[];
    mnemonics: string[];
    grammarPoints: string[];
    usageNotes: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LearningInsight {
    strengthAreas: string[];
    improvementAreas: string[];
    nextLevelRequirements: string[];
    recommendedPractice: string[];
}
