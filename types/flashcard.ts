export interface Flashcard {
    id: string;
    korean: string;
    english: string;
    romanization: string;
    type: 'maek-chi-ki' | 'maek-cha-ki';
    level: number;
    position?: 'chon' | 'gwan' | 'cheok';  // For maek-chi-ki cards
    quality?: string;                       // For maek-cha-ki cards
    examples: string[];
}

export interface FlashcardDeck {
    id: string;
    name: string;
    type: 'maek-chi-ki' | 'maek-cha-ki';
    cards: Flashcard[];
}
