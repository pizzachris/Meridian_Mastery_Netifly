import React from 'react';
import styled from 'styled-components';
import { useFlashcards } from '../contexts/FlashcardContext';
import { colors } from '../styles/colors';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    padding: 24px;
`;

const DeckCard = styled.div`
    background: ${colors.background};
    border: 2px solid ${colors.border};
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
        transform: translateY(-4px);
    }
`;

export const DeckGrid: React.FC = () => {
    const { decks, statistics, setCurrentDeck } = useFlashcards();

    return (
        <Grid>
            {decks.map(deck => (
                <DeckCard 
                    key={deck.id}
                    onClick={() => setCurrentDeck(deck.id)}
                >
                    <h2>{deck.name}</h2>
                    <p>{deck.cards.length} cards</p>
                    <div>
                        Level {calculateDeckLevel(deck.id, statistics)}
                    </div>
                </DeckCard>
            ))}
        </Grid>
    );
};
