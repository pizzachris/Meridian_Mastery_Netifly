export const koreanMeridianData = {
    theory: points.theory.map(p => ({
        id: `th-${p.id}`,
        front: p.korean,
        back: p.english,
        hanja: p.hanja,
        romanization: p.romanization,
        category: 'theory',
        points: p.points,
        examples: p.examples,
        relatedTerms: p.relatedTerms
    })),

    meridians: {
        lung: points.lung.map(p => ({
            id: `lu-${p.id}`,
            front: p.korean,
            back: p.english,
            hanja: p.hanja,
            romanization: p.romanization,
            category: 'lung',
            points: p.points,
            examples: p.examples,
            relatedTerms: p.relatedTerms
        })),
        // ... other meridians from excel_to_json.py
    },

    diagnosis: {
        pulse: points.pulse.map(p => ({
            id: `pu-${p.id}`,
            front: p.korean,
            back: p.english,
            hanja: p.hanja,
            romanization: p.romanization,
            category: 'pulse',
            points: p.points,
            examples: p.examples,
            relatedTerms: p.relatedTerms
        }))
    }
};
