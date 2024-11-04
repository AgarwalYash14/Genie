import React from "react";
import {
    animate,
    AnimatePresence,
    motion,
    useMotionValue,
    useTransform,
} from "framer-motion";
import { useEffect } from "react";

export default function Loader() {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);
    const displayCount = useTransform(rounded, (value) => `${value}`);

    useEffect(() => {
        const animation = animate(count, 100, { duration: 6 });
        return animation.stop;
    }, []);

    return (
        <div className="fixed inset-0">
            <AnimatePresence>
                <motion.div
                    className="relative w-full h-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="relative z-10 h-full flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center flex items-center -ml-4"
                        >
                            <svg
                                id="logoSVG"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                            >
                                <linearGradient
                                    id="SVWh9cggY6XRmAk4jI_jaa"
                                    x1="13.491"
                                    x2="34.07"
                                    y1="12.52"
                                    y2="37.564"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop offset="0" stopColor="#32bdef" />
                                    <stop offset="1" stopColor="#1ea2e4" />
                                </linearGradient>
                                <path
                                    fill="url(#SVWh9cggY6XRmAk4jI_jaa)"
                                    d="M26.975,3.23C26.982,3.162,27,3.074,27,3c0-0.552-0.448-1-1-1c-0.235,0-0.4,0.088-0.464,0.113	C22.141,3.439,9,16.516,9,28c0,8.284,6.716,15,15,15c9.109,0,15-7.673,15-15C39,15.813,24.637,13.563,26.975,3.23z"
                                />
                            </svg>
                            <motion.h1
                                className="text-6xl logo"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, type: "spring" }}
                            >
                                GENIE
                            </motion.h1>
                        </motion.div>
                        <div className="flex flex-col items-center mt-5 bottom-14">
                            <motion.div
                                className="w-56 h-1 bg-blue-100 rounded-full overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#32bdef] to-[#1ea2e4]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                        duration: 6,
                                        ease: "easeInOut",
                                    }}
                                />
                            </motion.div>

                            {/* Loading Percentage */}
                            {/* <motion.div
                                className="mt-4 text-2xl font-semibold"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <motion.span>{displayCount}</motion.span>%
                            </motion.div> */}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
