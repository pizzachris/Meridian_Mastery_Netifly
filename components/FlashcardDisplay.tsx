import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { colors } from '../styles/colors';
import { CardHint } from '../types/gptHints';
import { HintPanel } from './HintPanel';
import { useFlashcards } from '../contexts/FlashcardContext';
import { AudioControls } from './AudioControls';

const flipAnimation = keyframes`
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(180deg); }
`;

const CardContainer = styled.div<{ isFlipping: boolean }>`
    background: ${colors.background};
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    perspective: 1000px;
    ${({ isFlipping }) => isFlipping && css`
        animation: ${flipAnimation} 0.6s ease-in-out;
    `}
`;

const LevelBadge = styled.div`
    border: 1px solid ${colors.border};
    background: ${colors.border};
    color: ${colors.text.navigation};
    padding: 8px 24px;
    border-radius: 20px;
    font-family: 'Times New Roman', serif;
    font-size: 24px;
    margin: 20px 0;
`;

const KoreanText = styled.h1`
    color: ${colors.text.korean};
    font-size: 48px;
    font-family: 'Noto Sans KR', sans-serif;
    margin: 40px 0;
`;

const EnglishText = styled.h2`
    color: ${colors.text.english};
    font-size: 32px;
    font-family: 'Times New Roman', serif;
    margin: 20px 0;
`;

const NavigationControls = styled.div`
    position: fixed;
    bottom: 40px;
    display: flex;
    gap: 20px;
    align-items: center;
`;

const NavButton = styled.button`
    background: ${colors.border};
    color: ${colors.text.navigation};
    border: none;
    padding: 12px 24px;
    border-radius: 20px;
    cursor: pointer;
    font-family: 'Times New Roman', serif;
    &:hover { opacity: 0.9; }
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

const PronunciationGuide = styled.div`
    color: ${colors.text.korean}80;
    font-size: 18px;
    margin-top: 8px;
    font-family: 'Times New Roman', serif;
`;

const Examples = styled.div`
    margin-top: 20px;
    padding: 10px;
    border-top: 1px solid ${colors.border};
`;

const AudioButton = styled.button`
    background: ${colors.border};
    color: ${colors.text.navigation};
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 10px 0;
    
    &:hover {
        opacity: 0.9;
    }
`;

interface FlashcardDisplayProps {
    korean: string;
    english: string;
    level: number;
    isFlipped: boolean;
    onFlip: () => void;
    onNext: () => void;
    onPrev: () => void;
    currentIndex: number;
    totalCards: number;
}

export const FlashcardDisplay: React.FC<FlashcardDisplayProps> = ({
    korean,
    english,
    level,
    isFlipped,
    onFlip,
    onNext,
    onPrev,
    currentIndex,
    totalCards
}) => {
    const [isFlipping, setIsFlipping] = useState(false);
    const [hints, setHints] = useState<CardHint | null>(null);
    const touchStart = useRef<number | null>(null);

    const { hints: hintService, audio } = useFlashcards();

    useEffect(() => {
        if (isFlipped) {
            hintService.getHints(card.id).then(setHints);
        }
    }, [isFlipped, card.id]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart.current) return;
        
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart.current - touchEnd;

        if (Math.abs(diff) > 50) {
            if (diff > 0) onNext();
            else onPrev();
        }
        touchStart.current = null;
    };

    const handleFlip = () => {
        setIsFlipping(true);
        onFlip();
        setTimeout(() => setIsFlipping(false), 600);
    };

    return (
        <CardContainer 
            isFlipping={isFlipping}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleFlip}
        >
            <ProgressBar progress={(currentIndex / totalCards) * 100} />
            <LevelBadge>LV {level} ↔</LevelBadge>
            {isFlipped ? (
                <EnglishText>{english}</EnglishText>
            ) : (
                <KoreanText>{korean}</KoreanText>
            )}
            <PronunciationGuide>
                {card.romanization} • {card.pronunciation}
            </PronunciationGuide>
            <Examples>
                {card.examples.map((example, index) => (
                    <div key={index}>
                        <div>{example.korean}</div>
                        <div>{example.romanization}</div>
                        <div>{example.english}</div>
                    </div>
                ))}
            </Examples>
            <AudioControls audioUrl={card.audio.url} />
            <NavigationControls>
                <NavButton onClick={onPrev}>←</NavButton>
                <NavButton onClick={onNext}>→</NavButton>
            </NavigationControls>
            <HintPanel hint={hints} isVisible={isFlipped} />
        </CardContainer>
    );
};
