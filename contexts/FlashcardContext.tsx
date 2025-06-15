import React, { createContext, useContext, useState, useEffect } from 'react';
import { Flashcard, FlashcardDeck } from '../types/flashcard';
import { loadDecks, saveDecks } from '../utils/storage';
import { CardStatistics, StudySession } from '../types/statistics';
import { CardHint, LearningInsight } from '../types/gptHints';
import { fetchHintsFromGPT, generateLearningInsights } from '../services/gptService';

interface FlashcardContextType {
    // Core functionality
    decks: FlashcardDeck[];
    addDeck: (deck: FlashcardDeck) => void;
    addCard: (deckId: string, card: Flashcard) => void;
    removeCard: (deckId: string, cardId: string) => void;
    
    // Statistics tracking
    statistics: {
        cardStats: Record<string, CardStatistics>;
        sessions: StudySession[];
    };
    updateCardStats: (cardId: string, isCorrect: boolean, responseTime: number) => void;
    startStudySession: () => string;
    endStudySession: (sessionId: string) => void;

    // Navigation state
    navigation: {
        currentIndex: number;
        currentDeckId: string | null;
    };
    nextCard: () => void;
    prevCard: () => void;
    setCurrentDeck: (deckId: string) => void;

    // GPT hints functionality
    hints: {
        getHints: (cardId: string) => Promise<CardHint>;
        getLearningInsights: () => Promise<LearningInsight>;
        difficultyAssessment: Record<string, number>;
    };

    // Error handling
    errors: {
        message: string | null;
        clearError: () => void;
    };
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const FlashcardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Core state
    const [decks, setDecks] = useState<FlashcardDeck[]>(loadDecks());
    const [statistics, setStatistics] = useState<FlashcardContextType['statistics']>({
        cardStats: {},
        sessions: []
    });
    const [navigation, setNavigation] = useState({
        currentIndex: 0,
        currentDeckId: null as string | null
    });
    const [hintCache, setHintCache] = useState<Record<string, CardHint>>({});
    const [error, setError] = useState<string | null>(null);

    // Persistence
    useEffect(() => {
        saveDecks(decks);
    }, [decks]);

    // Error handling
    const handleError = (operation: string, err: Error) => {
        setError(`Failed to ${operation}: ${err.message}`);
        console.error(err);
    };

    // Core operations
    const addDeck = (deck: FlashcardDeck) => {
        setDecks([...decks, deck]);
    };

    const addCard = (deckId: string, card: Flashcard) => {
        setDecks(decks.map(deck => 
            deck.id === deckId 
                ? { ...deck, cards: [...deck.cards, card] }
                : deck
        ));
    };

    const removeCard = (deckId: string, cardId: string) => {
        setDecks(decks.map(deck =>
            deck.id === deckId
                ? { ...deck, cards: deck.cards.filter(card => card.id !== cardId) }
                : deck
        ));
    };

    // Statistics operations
    const updateCardStats = (cardId: string, isCorrect: boolean, responseTime: number) => {
        setStatistics(prev => ({
            ...prev,
            cardStats: {
                ...prev.cardStats,
                [cardId]: {
                    cardId,
                    correctCount: (prev.cardStats[cardId]?.correctCount || 0) + (isCorrect ? 1 : 0),
                    incorrectCount: (prev.cardStats[cardId]?.incorrectCount || 0) + (isCorrect ? 0 : 1),
                    streak: isCorrect ? ((prev.cardStats[cardId]?.streak || 0) + 1) : 0,
                    averageResponseTime: responseTime,
                    lastReviewed: new Date()
                }
            }
        }));
    };

    // Session management
    const startStudySession = () => {
        const sessionId = `session_${Date.now()}`;
        setStatistics(prev => ({
            ...prev,
            sessions: [...prev.sessions, {
                id: sessionId,
                date: new Date(),
                duration: 0,
                cardsReviewed: 0,
                correctAnswers: 0,
                incorrectAnswers: 0
            }]
        }));
        return sessionId;
    };

    const endStudySession = (sessionId: string) => {
        setStatistics(prev => ({
            ...prev,
            sessions: prev.sessions.map(session => 
                session.id === sessionId 
                    ? { ...session, endTime: new Date() } 
                    : session
            )
        }));
    };

    // Navigation operations
    const nextCard = () => {
        const currentDeck = decks.find(d => d.id === navigation.currentDeckId);
        if (!currentDeck) return;

        setNavigation(prev => ({
            ...prev,
            currentIndex: Math.min(prev.currentIndex + 1, currentDeck.cards.length - 1)
        }));
    };

    const prevCard = () => {
        setNavigation(prev => ({
            ...prev,
            currentIndex: Math.max(prev.currentIndex - 1, 0)
        }));
    };

    const setCurrentDeck = (deckId: string) => {
        setNavigation({
            currentIndex: 0,
            currentDeckId: deckId
        });
    };

    // GPT hints functionality
    const getHints = async (cardId: string): Promise<CardHint> => {
        if (hintCache[cardId]) return hintCache[cardId];
        
        const card = getCurrentCard();
        if (!card) throw new Error('No card selected');
        
        const hint = await fetchHintsFromGPT(card.korean, card.english);
        setHintCache(prev => ({ ...prev, [cardId]: hint }));
        return hint;
    };

    const getCurrentCard = () => {
        const deck = decks.find(d => d.id === navigation.currentDeckId);
        return deck?.cards[navigation.currentIndex];
    };

    const getLearningInsights = async (): Promise<LearningInsight> => {
        const stats = statistics.cardStats;
        // Implement API call to analyze learning patterns
        return await generateLearningInsights(stats);
    };

    return (
        <FlashcardContext.Provider value={{
            decks,
            addDeck,
            addCard,
            removeCard,
            statistics,
            updateCardStats,
            startStudySession,
            endStudySession,
            navigation,
            nextCard,
            prevCard,
            setCurrentDeck,
            hints: {
                getHints,
                getLearningInsights,
                difficultyAssessment: calculateDifficulty(statistics.cardStats)
            },
            errors: {
                message: error,
                clearError: () => setError(null)
            }
        }}>
            {children}
        </FlashcardContext.Provider>
    );
};

export const useFlashcards = () => {
    const context = useContext(FlashcardContext);
    if (!context) {
        throw new Error('useFlashcards must be used within a FlashcardProvider');
    }
    return context;
};
