import { CardHint, LearningInsight } from '../types/gptHints';

const GPT_PROMPTS = {
    hints: (korean: string, english: string) => `
        Analyze this Korean-English pair: "${korean}" - "${english}"
        1. Provide 2 example sentences
        2. Create a memorable mnemonic
        3. Explain key grammar points
        4. Give usage context
    `,
    insights: (stats: any) => `
        Analyze these learning statistics and provide:
        1. Strong areas
        2. Areas for improvement
        3. Requirements for next level
        4. Practice recommendations
    `
};

export const fetchHintsFromGPT = async (korean: string, english: string): Promise<CardHint> => {
    // Implement your GPT API call here
    const response = await fetch('/api/gpt/hints', {
        method: 'POST',
        body: JSON.stringify({ prompt: GPT_PROMPTS.hints(korean, english) })
    });
    return response.json();
};

export const generateLearningInsights = async (stats: any): Promise<LearningInsight> => {
    const response = await fetch('/api/gpt/insights', {
        method: 'POST',
        body: JSON.stringify({ prompt: GPT_PROMPTS.insights(stats) })
    });
    return response.json();
};
