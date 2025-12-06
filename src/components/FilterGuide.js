import React from 'react';
import { getContaminantInfo } from '../data/contaminantInfo';

const FilterGuide = ({ contaminants }) => {
    if (!contaminants || contaminants.length === 0) return null;

    // Get unique info objects for detected contaminants
    const infos = contaminants
        .map(c => typeof c === 'string' ? c : c.name) // Handle object/string mix
        .map(name => getContaminantInfo(name))
        .filter(info => info !== null && info !== undefined);

    // Deduplicate based on title (e.g. PFAS, PFOA, PFOS all map to same PFAS info)
    const uniqueInfos = Array.from(new Set(infos.map(i => i.title)))
        .map(title => infos.find(i => i.title === title));

    if (uniqueInfos.length === 0) return null;

    return (
        <div className="glass-card rounded-3xl p-8 mt-12 border border-blue-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4 text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                Filter Certifications & Advice
            </h2>

            <div className="space-y-10">
                {uniqueInfos.map((info, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-10 last:border-0 last:pb-0">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">{info.title}</h3>

                        <div className="bg-blue-50/50 p-6 rounded-2xl mb-6 border border-blue-100">
                            <p className="text-blue-800 font-bold mb-2 flex items-center">
                                <span className="mr-2">💡</span> Recommendation
                            </p>
                            <p className="text-slate-700 leading-relaxed">{info.advice}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4">Effective Filter Types</h4>
                                <ul className="space-y-3">
                                    {info.filterTypes.map((ft, i) => (
                                        <li key={i} className="flex items-start bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                            <div className="mt-1 mr-3 text-green-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-800 block">{ft.name}</span>
                                                <p className="text-sm text-slate-500 mt-1">{ft.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4">Look for Certifications</h4>
                                <ul className="space-y-3">
                                    {info.certifications.map((cert, i) => (
                                        <li key={i} className="flex items-center text-slate-700 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm font-medium">
                                            <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            {cert}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-slate-400 text-center">
                <p>Always verify certifications on the product packaging or manufacturer website. NSF/ANSI standards are the gold standard for water filtration safety.</p>
            </div>
        </div>
    );
};

export default FilterGuide;
