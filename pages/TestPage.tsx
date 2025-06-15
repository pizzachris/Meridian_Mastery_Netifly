import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useFlashcards } from '../contexts/FlashcardContext';
import { koreanData } from '../data/koreanData';
import { FlashcardDisplay } from '../components/FlashcardDisplay';

const TestContainer = styled.div`
    min-height: 100vh;
    background: #000;
    padding: 20px;
    color: white;
`;

const ErrorBanner = styled.div`
    background: #4A0404;
    color: white;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
`;

export const TestPage: React.FC = () => {
    const { addDeck, setCurrentDeck, errors } = useFlashcards();

    useEffect(() => {
        // Load the complete Korean deck
        addDeck(koreanData);
        setCurrentDeck(koreanData.id);
    }, []);

    return (
        <TestContainer>
            {errors.message && (
                <ErrorBanner onClick={errors.clearError}>
                    {errors.message}
                </ErrorBanner>
            )}
            <h1 style={{ color: '#fff' }}>
                Card {navigation.currentIndex + 1} of {koreanData.cards.length}
            </h1>
            <FlashcardDisplay />
        </TestContainer>
    );
};
