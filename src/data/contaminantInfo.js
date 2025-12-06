export const CONTAMINANT_INFO = {
    'PFAS': {
        title: 'PFAS (Per- and Polyfluoroalkyl Substances)',
        filterTypes: [
            {
                name: 'Reverse Osmosis (RO)',
                description: 'Forces water through a thin barrier to separate chemicals. Highly effective.',
                cost: '$150 – $1,000'
            },
            {
                name: 'Granular Activated Carbon (GAC)',
                description: 'Traps chemicals in porous material. Effective for many organic contaminants.',
                cost: '$20 - $1,000'
            },
            {
                name: 'Ion Exchange Resin (IX)',
                description: 'Tiny beads act like magnets to hold contaminated materials.',
                cost: '$20 - $1,000'
            }
        ],
        certifications: [
            'NSF/ANSI 53 (PFAS Reduction)',
            'NSF/ANSI 58 (Reverse Osmosis)'
        ],
        advice: "Look on product labels for certification under NSF/ANSI 53 or NSF/ANSI 58 for PFAS reduction. EPA found that GAC, IX, and RO systems can greatly reduce PFAS levels.",
        link: "https://www.epa.gov/sciencematters/reducing-pfas-drinking-water-treatment-technologies"
    },
    'PFOA': {
        // PFOA is a type of PFAS, so we can reference the same info or duplicate it
        ref: 'PFAS'
    },
    'PFOS': {
        ref: 'PFAS'
    },
    'Lead': {
        title: 'Lead',
        filterTypes: [
            { name: 'Reverse Osmosis (RO)', description: 'Highly effective at removing lead.' },
            { name: 'Activated Carbon', description: 'Must be certified specifically for lead removal.' },
            { name: 'Distillation', description: 'Effective but slow and energy intensive.' }
        ],
        certifications: ['NSF/ANSI 53 (Lead Reduction)', 'NSF/ANSI 58 (Reverse Osmosis)'],
        advice: "Lead enters water from corroding pipes. Use a filter certified to NSF/ANSI 53 for lead reduction."
    },
    'Chlorine': {
        title: 'Chlorine',
        filterTypes: [
            { name: 'Activated Carbon', description: 'Very effective at removing chlorine taste and odor.' }
        ],
        certifications: ['NSF/ANSI 42 (Aesthetic Effects)'],
        advice: "Chlorine is used for disinfection but can affect taste. Carbon filters are excellent for removing it."
    },
    'Arsenic': {
        title: 'Arsenic',
        filterTypes: [
            { name: 'Reverse Osmosis (RO)', description: 'Effective for Arsenic V.' },
            { name: 'Distillation', description: 'Removes arsenic effectively.' }
        ],
        certifications: ['NSF/ANSI 58 (Reverse Osmosis)'],
        advice: "Arsenic is a toxic metalloid. RO systems are commonly used for reduction."
    },
    'Nitrate': {
        title: 'Nitrate',
        filterTypes: [
            { name: 'Reverse Osmosis (RO)', description: 'Effective at removing nitrates.' },
            { name: 'Ion Exchange', description: 'Specifically designed for nitrate removal.' }
        ],
        certifications: ['NSF/ANSI 58 (Reverse Osmosis)', 'NSF/ANSI 53'],
        advice: "Nitrates often come from fertilizer runoff. Boiling water concentrates nitrates and should be avoided."
    }
};

export const getContaminantInfo = (name) => {
    const key = Object.keys(CONTAMINANT_INFO).find(k => name.toUpperCase().includes(k.toUpperCase()));
    if (!key) return null;

    const info = CONTAMINANT_INFO[key];
    if (info.ref) return CONTAMINANT_INFO[info.ref];
    return info;
};
