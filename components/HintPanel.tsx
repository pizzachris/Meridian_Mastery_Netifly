import React from 'react';
import styled from 'styled-components';
import { CardHint } from '../types/gptHints';
import { colors } from '../styles/colors';

const HintContainer = styled.div`
    position: absolute;
    right: -320px;
    width: 300px;
    background: rgba(0, 0, 0, 0.9);
    padding: 20px;
    border-left: 2px solid ${colors.border};
    height: 100%;
    overflow-y: auto;
    transition: transform 0.3s ease;
    transform: translateX(${props => props.isVisible ? '0' : '320px'});
`;

const HintSection = styled.div`
    margin-bottom: 20px;
    color: ${colors.text.english};
`;

interface HintPanelProps {
    hint: CardHint | null;
    isVisible: boolean;
}

export const HintPanel: React.FC<HintPanelProps> = ({ hint, isVisible }) => {
    if (!hint) return null;

    return (
        <HintContainer isVisible={isVisible}>
            <HintSection>
                <h3>Examples</h3>
                {hint.examples.map((ex, i) => (
                    <div key={i}>{ex}</div>
                ))}
            </HintSection>
            <HintSection>
                <h3>Memory Aid</h3>
                {hint.mnemonics.map((m, i) => (
                    <div key={i}>{m}</div>
                ))}
            </HintSection>
            <HintSection>
                <h3>Grammar Points</h3>
                {hint.grammarPoints.map((point, i) => (
                    <div key={i}>{point}</div>
                ))}
            </HintSection>
        </HintContainer>
    );
};
