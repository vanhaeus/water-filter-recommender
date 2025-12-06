import React from 'react';
import { getRecommendation } from '../utils/waterData';

const ProductRecommendation = ({ data }) => {
    if (!data) return null;

    // Calculate recommendation based on data
    const recommendation = getRecommendation(data.contaminants);
    if (!recommendation) return null;

    return (
        <div className="glass-card rounded-3xl p-8 h-full flex flex-col relative overflow-hidden border-2 border-blue-400/30">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-xs tracking-wider uppercase shadow-lg">
                Recommended Solution
            </div>

            <div className="flex flex-col h-full">
                <div className="mb-6 mt-2">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 leading-tight">{recommendation.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{recommendation.description}</p>
                </div>

                <div className="mt-auto space-y-4">
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-200 shadow-inner">
                        <span className="text-sm font-medium">Product Image Placeholder</span>
                    </div>

                    <a
                        href={recommendation.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 active:scale-95"
                    >
                        Check Price & Availability
                    </a>
                    <p className="text-xs text-slate-400 text-center">
                        *We may earn a commission from qualifying purchases.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductRecommendation;
