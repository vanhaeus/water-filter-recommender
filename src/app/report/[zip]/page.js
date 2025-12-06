import React from 'react';
import { getWaterData } from '../../../utils/dataFetcher';
import ReportCard from '../../../components/ReportCard';
import ProductRecommendation from '../../../components/ProductRecommendation';
import FilterGuide from '../../../components/FilterGuide';
import Link from 'next/link';

export async function generateMetadata({ params }) {
    const { zip } = await params;
    const data = await getWaterData(zip);

    if (!data) {
        return {
            title: 'Water Quality Report Not Found',
            description: 'No water quality data found for this zip code.',
        };
    }

    return {
        title: `Water Quality Report for ${data.city}, ${data.state} (${zip})`,
        description: `Is tap water safe in ${data.city}? Found ${data.contaminants.length} potential contaminants. See the full water quality report and filter recommendations.`,
        openGraph: {
            title: `Water Quality Report: ${data.city}, ${data.state}`,
            description: `Detailed water quality analysis for ${data.city}. Check for contaminants like PFAS, Lead, and Chlorine.`,
        },
    };
}

export default async function ReportPage({ params }) {
    const { zip } = await params;
    const data = await getWaterData(zip);

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Report Not Found</h1>
                <p className="text-slate-600 mb-8">We couldn't find water quality data for zip code {zip}.</p>
                <Link href="/" className="text-blue-600 hover:underline">
                    &larr; Back to Search
                </Link>
            </div>
        );
    }

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `Water Quality Report for ${data.city}, ${data.state}`,
        description: `Detailed analysis of tap water quality in ${data.city}, ${data.state} (${zip}).`,
        author: {
            '@type': 'Organization',
            name: 'Water Filter Recommender',
        },
        mainEntity: {
            '@type': 'Dataset',
            name: `Water Quality Data - ${zip}`,
            variableMeasured: data.contaminants.map(c => typeof c === 'string' ? c : c.name).join(', '),
            spatialCoverage: {
                '@type': 'Place',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: data.city,
                    addressRegion: data.state,
                    postalCode: zip,
                    addressCountry: 'US',
                },
            },
        },
    };

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <header className="mb-8 flex items-center justify-between">
                <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Search
                </Link>
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-slate-800">{data.city}, {data.state}</h1>
                    <p className="text-slate-500">Zip Code: {zip}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <ReportCard data={data} />
                <ProductRecommendation data={data} />
            </div>

            <FilterGuide contaminants={data.contaminants} />
        </main>
    );
}
