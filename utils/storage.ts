import { FlashcardDeck } from '../types/flashcard';

const STORAGE_KEY = 'meridian_flashcards';

export const saveDecks = (decks: FlashcardDeck[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
};

export const loadDecks = (): FlashcardDeck[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};
