// Import structure directly from excel_to_json.py output
export const koreanData = {
    theory: {
        basic: [
            {
                id: 'TH001',
                korean: '음양',
                english: 'Yin and Yang',
                hanja: '陰陽',
                romanization: 'eum-yang',
                points: 500,
                examples: ['음양의 조화', '음양의 균형'],
                category: 'theory',
                subCategory: 'basic',
                relatedTerms: ['음', '양', '기']
            },
            // ... rest of theory points from excel_to_json.py
        ]
    },
    meridians: {
        lung: [
            // ... lung meridian points from excel_to_json.py
        ],
        heart: [
            // ... heart meridian points from excel_to_json.py
        ],
        // ... other meridians from excel_to_json.py
    },
    diagnosis: {
        pulse: [
            // ... pulse diagnosis points from excel_to_json.py
        ],
        // ... other diagnosis methods from excel_to_json.py
    }
};
