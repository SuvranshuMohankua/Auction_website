import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            {/* Animated 404 */}
            <div className="relative mb-8">
                <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 font-['Outfit'] leading-none animate-pulse-glow">
                    404
                </h1>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl -z-10"></div>
            </div>

            {/* Message */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-['Outfit']">
                Page Not Found
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/"
                    className="btn-primary px-8 py-3 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="px-8 py-3 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:border-white/30 transition-all font-medium"
                >
                    Go Back
                </button>
            </div>

            {/* Decorative Elements */}
            <div className="mt-16 grid grid-cols-3 gap-8 opacity-30">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 blur-xl"></div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 blur-xl"></div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-pink-500/5 blur-xl"></div>
            </div>
        </div>
    );
};

export default NotFound;
