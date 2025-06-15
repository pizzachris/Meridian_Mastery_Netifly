export type StudyMode = 'standard' | 'timeAttack' | 'confidence';

export interface StudySettings {
    mode: StudyMode;
    timeLimit?: number; // for time attack mode
    confidenceLevels?: number; // 1-5 scale for confidence rating
    shuffleCards?: boolean;
}

export interface StudyProgress {
    currentCardIndex: number;
    timeRemaining?: number;
    score: number;
    correctAnswers: number;
    totalCards: number;
}
