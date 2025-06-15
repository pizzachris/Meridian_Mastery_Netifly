export interface CardStatistics {
    cardId: string;
    correctCount: number;
    incorrectCount: number;
    streak: number;
    averageResponseTime: number;
    lastReviewed: Date;
}

export interface StudySession {
    id: string;
    date: Date;
    duration: number;
    cardsReviewed: number;
    correctAnswers: number;
    incorrectAnswers: number;
}
