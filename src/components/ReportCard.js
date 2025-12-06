import React from 'react';

const ReportCard = ({ data }) => {
    if (!data) return null;

    const { city, state, hardness, contaminants } = data;

    // Simple logic to determine grade based on contaminant count
    const getGrade = (contaminants) => {
        const count = contaminants.length;
        if (count === 0) return 'A';
        if (count === 1) return 'B';
        if (count === 2) return 'C';
        return 'D';
    };

    const grade = getGrade(contaminants);
    const gradeColor = grade === 'A' ? 'text-green-500 border-green-500' : grade === 'B' ? 'text-blue-500 border-blue-500' : grade === 'C' ? 'text-yellow-500 border-yellow-500' : 'text-red-500 border-red-500';

    return (
        <div className="glass-card rounded-3xl p-8 h-full flex flex-col">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">Water Quality</h2>
                    <p className="text-slate-500 font-medium">{city}, {state}</p>
                </div>
                <div className={`text-5xl font-extrabold ${gradeColor} border-4 rounded-2xl w-20 h-20 flex items-center justify-center shadow-sm`}>
                    {grade}
                </div>
            </div>

            <div className="space-y-6 flex-1">
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Water Hardness</h3>
                    <p className="text-xl font-bold text-slate-800">{hardness}</p>
                </div>

                <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100 flex-1">
                    <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4">Contaminants Detected</h3>
                    {contaminants.length > 0 ? (
                        <ul className="space-y-3">
                            {data.contaminants.map((contaminant, index) => {
                                // Handle both string (legacy/mock) and object (new API) formats
                                const name = typeof contaminant === 'string' ? contaminant : contaminant.name;
                                const level = typeof contaminant === 'object' && contaminant.level ? contaminant.level : null;
                                const unit = typeof contaminant === 'object' && contaminant.unit ? contaminant.unit : '';

                                return (
                                    <li key={index} className="flex items-center justify-between text-slate-700 bg-white p-3 rounded-xl shadow-sm border border-red-100">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 text-red-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                            </div>
                                            <span className="font-semibold">{name}</span>
                                        </div>
                                        {level && (
                                            <span className="text-xs font-bold bg-red-100 px-2 py-1 rounded-lg text-red-700">
                                                {level} {unit}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="flex items-center text-green-600 bg-green-50 p-4 rounded-xl border border-green-100">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            <span className="font-medium">No major contaminants detected.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportCard;
