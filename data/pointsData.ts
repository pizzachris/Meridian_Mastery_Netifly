interface PointData {
    korean: string;
    english: string;
    points: number;
    category: string;
    romanization?: string;
    examples?: string[];
}

export const koreanVocabularyPoints: PointData[] = [
    {
        korean: "네",
        english: "Yes",
        points: 50,
        category: "basics",
        romanization: "ne"
    },
    {
        korean: "아니요",
        english: "No",
        points: 50,
        category: "basics",
        romanization: "aniyo"
    }
    // Would you like me to paste in the full points data here?
];

export interface MeridianPoint {
    korean: string;
    english: string;
    points: number;
    meridian: 'heart' | 'lung' | 'liver' | 'kidney' | 'spleen' | 'maek-chi-ki' | 'maek-cha-ki';
    category: string;
    romanization: string;
    technicalNotes?: string;
}

export const meridianPoints: MeridianPoint[] = [
    // Maek Chi Ki (Pulse Diagnosis Positions)
    {
        korean: "관",
        english: "Gwan position (middle)",
        points: 200,
        meridian: "maek-chi-ki",
        category: "pulse_positions",
        romanization: "gwan",
        technicalNotes: "Middle position, measures spleen and stomach"
    },
    {
        korean: "촌",
        english: "Chon position (distal)",
        points: 200,
        meridian: "maek-chi-ki",
        category: "pulse_positions",
        romanization: "chon",
        technicalNotes: "Distal position, measures heart and lungs"
    },
    {
        korean: "척",
        english: "Cheok position (proximal)",
        points: 200,
        meridian: "maek-chi-ki",
        category: "pulse_positions",
        romanization: "cheok",
        technicalNotes: "Proximal position, measures kidneys"
    },

    // Maek Cha Ki (Pulse Taking Methods)
    {
        korean: "부맥",
        english: "Floating pulse",
        points: 250,
        meridian: "maek-cha-ki",
        category: "pulse_qualities",
        romanization: "bumaek",
        technicalNotes: "Felt with light pressure, indicates surface conditions"
    },
    {
        korean: "침맥",
        english: "Sinking pulse",
        points: 250,
        meridian: "maek-cha-ki",
        category: "pulse_qualities",
        romanization: "chimmaek",
        technicalNotes: "Felt with deep pressure, indicates internal conditions"
    },
    // ... Add all pulse diagnosis terminology
    
    // Regular meridian vocabulary continues below
    // ...existing code...
];
