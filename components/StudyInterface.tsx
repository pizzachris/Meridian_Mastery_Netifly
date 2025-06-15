import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFlashcards } from '../contexts/FlashcardContext';
import { FlashcardDisplay } from './FlashcardDisplay';
import { HintPanel } from './HintPanel';

const StudyContainer = styled.div`
    display: flex;
    min-height: 100vh;
    background: ${colors.background};
`;

const ProgressBar = styled.div<{ progress: number }>`
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    width: ${props => props.progress}%;
    background: ${colors.text.korean};
    transition: width 0.3s ease;
`;

export const StudyInterface: React.FC = () => {
    const { navigation, decks, startStudySession, endStudySession } = useFlashcards();
    const [sessionId, setSessionId] = useState<string | null>(null);
    
    useEffect(() => {
        const id = startStudySession();
        setSessionId(id);
        return () => {
            if (sessionId) endStudySession(sessionId);
        };
    }, []);

    const currentDeck = decks.find(d => d.id === navigation.currentDeckId);
    const currentCard = currentDeck?.cards[navigation.currentIndex];
    
    return (
        <StudyContainer>
            <ProgressBar 
                progress={(navigation.currentIndex / (currentDeck?.cards.length || 1)) * 100} 
            />
            {currentCard && (
                <FlashcardDisplay 
                    card={currentCard}
                    level={calculateCardLevel(currentCard.id)}
                />
            )}
        </StudyContainer>
    );
};
