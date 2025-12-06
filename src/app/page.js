'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [zipCode, setZipCode] = useState('');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (zipCode.length === 5) {
            router.push(`/report/${zipCode}`);
        } else {
            alert('Please enter a valid 5-digit Zip Code');
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 text-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="max-w-4xl w-full space-y-12 animate-fade-in-up">
                <div className="space-y-6">
                    <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4 tracking-wide uppercase">
                        Trusted Water Analysis
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
                        Is Your Tap Water <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Safe?</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Check your local water quality and find the right filter for your home in seconds.
                    </p>
                </div>

                <div className="glass-card p-10 rounded-3xl mt-12 max-w-2xl mx-auto transform transition-all hover:shadow-2xl">
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter Zip Code"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 text-lg border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all text-gray-900 placeholder-gray-400 bg-gray-50/50"
                                maxLength={5}
                                pattern="[0-9]*"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/30 active:scale-95"
                        >
                            Analyze Water
                        </button>
                    </form>
                    <p className="text-sm text-gray-400 mt-4 font-medium">
                        Popular: <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => setZipCode('10001')}>10001</span>, <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => setZipCode('90210')}>90210</span>, <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => setZipCode('98683')}>98683</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
                    {[
                        { icon: '💧', title: 'Real-Time Data', desc: 'Direct from EPA databases for your specific area.' },
                        { icon: '🛡️', title: 'Health First', desc: 'Identify harmful contaminants like PFAS & Lead.' },
                        { icon: '✅', title: 'Expert Picks', desc: 'Get matched with the exact filter you need.' }
                    ].map((feature, idx) => (
                        <div key={idx} className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all">
                            <div className="text-4xl mb-4 bg-blue-50 w-16 h-16 flex items-center justify-center rounded-2xl">{feature.icon}</div>
                            <h3 className="font-bold text-slate-900 mb-2 text-lg">{feature.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
