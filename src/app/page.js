"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import LiquidBackground from '../components/LiquidBackground';

export default function Home() {
    const [zipCode, setZipCode] = useState('');
    const router = useRouter();
    const { scrollYProgress } = useScroll();

    // Parallax & Opacity transforms
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
    const searchY = useTransform(scrollYProgress, [0, 0.2], [100, 0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (zipCode.length === 5) {
            router.push(`/report/${zipCode}`);
        }
    };

    return (
        <main className="relative min-h-[200vh] bg-slate-50 text-slate-900 selection:bg-blue-200">
            <LiquidBackground />

            {/* Section 1: Immersive Hero */}
            <section className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="text-center z-10 px-4"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-blue-600 text-sm font-bold tracking-wide mb-6 shadow-sm">
                            TRUSTED WATER ANALYSIS
                        </span>
                    </motion.div>

                    <motion.h1
                        className="text-6xl md:text-8xl tracking-tighter mb-6 text-slate-900"
                        style={{ fontWeight: useTransform(scrollYProgress, [0, 0.2], [900, 100]) }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    >
                        Is Your Water <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-blue-600 animate-gradient-x">
                            Actually Safe?
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        Discover hidden contaminants and get expert filter recommendations tailored to your home's water quality.
                    </motion.p>

                    <motion.div
                        className="mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                    >
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Scroll to Analyze</p>
                        <motion.div
                            className="w-0.5 h-16 bg-gradient-to-b from-blue-400 to-transparent mx-auto mt-4"
                            animate={{ height: [0, 64, 0], opacity: [0, 1, 0], y: [0, 20, 40] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>
                </motion.div>
            </section>

            {/* Section 2: Morphing Search Interface */}
            <section className="relative z-20 min-h-screen flex items-center justify-center px-4 py-20">
                <motion.div
                    className="w-full max-w-md"
                    style={{ y: searchY }}
                >
                    <div className="glass-liquid rounded-[2.5rem] p-8 md:p-12 material-3d transform transition-all duration-500 hover:scale-[1.02]">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-800 mb-3">Check Your Tap</h2>
                            <p className="text-slate-500">Enter your zip code to access the EPA database.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Enter Zip Code (e.g. 98683)"
                                    className="w-full px-6 py-5 bg-white/50 backdrop-blur-sm border-2 border-white/60 rounded-2xl text-lg font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all shadow-inner"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    maxLength={5}
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                            >
                                <span className="relative z-10">Analyze Water Quality</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </form>

                        <div className="mt-8 flex items-center justify-center space-x-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data Source:</span>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/US_EPA_logo.svg" alt="EPA" className="h-8" />
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
