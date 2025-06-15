import { CardStatistics } from '../types/statistics';

export const calculateCardLevel = (stats: CardStatistics): number => {
    if (!stats) return 1;
    const { correctCount, incorrectCount, streak } = stats;
    const accuracy = correctCount / (correctCount + incorrectCount) || 0;
    return Math.floor(accuracy * streak * 0.5) + 1;
};

export const calculateDeckLevel = (deckId: string, statistics: Record<string, CardStatistics>): number => {
    const deckStats = Object.values(statistics).filter(stat => stat.deckId === deckId);
    const avgLevel = deckStats.reduce((acc, stat) => acc + calculateCardLevel(stat), 0) / deckStats.length;
    return Math.max(1, Math.floor(avgLevel));
};
