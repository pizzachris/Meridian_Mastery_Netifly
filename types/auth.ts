export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
}

export interface SharedDeck {
    deckId: string;
    sharedBy: string;
    sharedWith: string[];
    permissions: 'read' | 'edit';
}
