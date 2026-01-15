"use client";

import { motion } from "framer-motion";

const LiquidBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50">
            {/* Blob 1: Blue/Teal */}
            <motion.div
                className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-blue-400/30 rounded-full blur-[100px] mix-blend-multiply filter"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />

            {/* Blob 2: Cyan/Green */}
            <motion.div
                className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] bg-teal-300/30 rounded-full blur-[100px] mix-blend-multiply filter"
                animate={{
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />

            {/* Blob 3: Pink/Purple Accent */}
            <motion.div
                className="absolute -bottom-[10%] left-[20%] w-[60vw] h-[60vw] bg-purple-300/30 rounded-full blur-[100px] mix-blend-multiply filter"
                animate={{
                    x: [0, 50, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
            </div>
        </div>
    );
};

export default LiquidBackground;
