'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { getWaterData, getRecommendation } from '../../utils/waterData';
import ReportCard from '../../components/ReportCard';
import ProductRecommendation from '../../components/ProductRecommendation';
import FilterGuide from '../../components/FilterGuide';

function ResultsContent() {
    const searchParams = useSearchParams();
    const zip = searchParams.get('zip');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (zip) {
            const fetchData = async () => {
                try {
                    const result = await getWaterData(zip);
                    setData(result);
                } catch (error) {
                    console.error("Failed to load data", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [zip]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50/50">
                <div className="w-full max-w-4xl p-6 space-y-8">
                    <div className="h-8 bg-blue-200/50 rounded w-1/3 mx-auto animate-pulse"></div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="h-64 bg-white rounded-3xl shadow-sm animate-pulse"></div>
                        <div className="h-64 bg-white rounded-3xl shadow-sm animate-pulse"></div>
                    </div>
                </div>
                <p className="text-blue-600 font-medium mt-8 animate-pulse">Analyzing water samples...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Data Not Found</h1>
                <p className="text-slate-600 mb-8">We couldn't find water quality data for Zip Code: {zip}</p>
                <Link
                    href="/"
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30"
                >
                    Try Another Zip Code
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-6 md:p-12 pb-24">
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-slate-500 hover:text-blue-600 font-medium transition flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Search
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold text-slate-900">{data.city}, {data.state}</h1>
                        <p className="text-slate-500 text-sm">Zip Code: {data.zipCode}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <ReportCard data={data} />
                    <ProductRecommendation data={data} />
                </div>

                <FilterGuide contaminants={data.contaminants} />
            </div>
        </main>
    );
}

export default function Results() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultsContent />
        </Suspense>
    );
}
