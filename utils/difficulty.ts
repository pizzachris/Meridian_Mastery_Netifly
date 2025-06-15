import { CardStatistics } from '../types/statistics';

export const calculateDifficulty = (stats: Record<string, CardStatistics>): Record<string, number> => {
    const difficulties: Record<string, number> = {};
    
    Object.entries(stats).forEach(([cardId, stat]) => {
        const total = stat.correctCount + stat.incorrectCount;
        if (total === 0) {
            difficulties[cardId] = 1;
            return;
        }
        
        const accuracy = stat.correctCount / total;
        const difficulty = Math.max(1, Math.min(5, (1 - accuracy) * 5));
        difficulties[cardId] = difficulty;
    });
    
    return difficulties;
};
