export const testDeck = {
    id: 'test-deck-1',
    name: 'Basic Korean Test',
    description: 'Test deck with audio',
    cards: [
        {
            id: 'card-1',
            korean: '안녕하세요',
            english: 'Hello (formal)',
            romanization: 'annyeonghaseyo',
            audio: {
                url: '/audio/annyeonghaseyo.mp3',
                duration: 1.5
            }
        },
        {
            id: 'card-2',
            korean: '감사합니다',
            english: 'Thank you',
            romanization: 'gamsahamnida',
            audio: {
                url: '/audio/gamsahamnida.mp3',
                duration: 1.2
            }
        }
    ]
};
