interface ReviewInterval {
    easy: number;
    medium: number;
    hard: number;
}

const INTERVALS: ReviewInterval = {
    easy: 7, // days
    medium: 3,
    hard: 1
};

export const calculateNextReview = (difficulty: 'easy' | 'medium' | 'hard'): Date => {
    const now = new Date();
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + INTERVALS[difficulty]);
    return nextDate;
};

export const getDueCards = (cards: any[]) => {
    const now = new Date();
    return cards.filter(card => {
        if (!card.lastReviewed) return true;
        const reviewDate = new Date(card.lastReviewed);
        return reviewDate <= now;
    });
};
