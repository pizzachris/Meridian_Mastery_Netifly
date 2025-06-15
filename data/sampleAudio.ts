export const sampleDeck = {
    id: 'sample-deck',
    name: 'Test Korean Vocabulary',
    description: 'Sample deck with audio',
    cards: [
        {
            id: 'card1',
            korean: '안녕하세요',
            english: 'Hello (formal)',
            romanization: 'annyeonghaseyo',
            pronunciation: 'ahn-nyeong-ha-se-yo',
            audio: {
                url: '/audio/samples/hello.mp3',
                duration: 1.2
            },
            level: 1
        }
        // Add more sample cards as needed
    ]
};
