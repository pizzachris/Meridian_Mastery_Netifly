export interface MeridianPoint {
    id: string;
    korean: string;
    english: string;
    hanja?: string;
    romanization: string;
    category: MeridianCategory;
    subCategory: string;
    points: number;
    level: number;
    examples: Example[];
    relatedPoints: string[];
    notes?: string;
}

export type MeridianCategory = 
    | 'lung' 
    | 'heart' 
    | 'spleen' 
    | 'liver' 
    | 'kidney'
    | 'pulse'
    | 'theory'
    | 'diagnostic';

export interface Example {
    korean: string;
    english: string;
    romanization: string;
}
