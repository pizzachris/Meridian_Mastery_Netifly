import { MeridianPoint } from '../types/meridianPoints';

export const meridianPoints: MeridianPoint[] = [
    {
        id: "LU-001",
        korean: "폐",
        english: "Lung",
        hanja: "肺",
        romanization: "pye",
        category: "lung",
        subCategory: "organ",
        points: 500,
        level: 1,
        examples: [
            {
                korean: "폐가 약하다",
                english: "The lungs are weak",
                romanization: "pyega yakada"
            }
        ],
        relatedPoints: ["기관", "호흡"]
    },
    // ... Adding all 363 points exactly as structured in excel_to_json.py
    {
        id: "HT-001",
        korean: "심장",
        english: "Heart",
        hanja: "心臟",
        romanization: "simjang",
        category: "heart",
        subCategory: "organ",
        points: 500,
        level: 1,
        examples: [
            {
                korean: "심장이 뛰다",
                english: "The heart is beating",
                romanization: "simjangi tteuida"
            }
        ],
        relatedPoints: ["혈액", "맥박"]
    },
    // ... Continue with all points from Excel data
];

export const categoryStructure = {
    theory: ["기본", "원리", "개념"],
    diagnostic: ["맥진", "관찰", "문진"],
    treatment: ["침법", "약재", "수기요법"],
    organs: {
        lung: ["호흡", "피부", "면역"],
        heart: ["혈액순환", "정신", "감정"],
        spleen: ["소화", "대사", "근육"],
        liver: ["해독", "근건", "혈액저장"],
        kidney: ["생식", "뼈", "내분비"]
    }
};
