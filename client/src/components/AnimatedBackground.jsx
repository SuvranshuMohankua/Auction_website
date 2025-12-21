import React from 'react';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#030014] via-[#0a0a1f] to-[#030014]" />

            {/* Animated mesh gradient */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
                <div className="absolute top-0 -right-40 w-[600px] h-[600px] bg-cyan-500/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
                <div className="absolute -bottom-40 left-40 w-[600px] h-[600px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000" />
                <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-3000" />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    animation: 'grid-drift 20s linear infinite'
                }}
            />

            {/* Floating particles */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/10 animate-float-particle"
                        style={{
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 10 + 10}s`
                        }}
                    />
                ))}
            </div>

            {/* Glow lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
                <line
                    x1="0" y1="30%" x2="100%" y2="30%"
                    stroke="url(#line-gradient)"
                    strokeWidth="1"
                    className="animate-pulse-line"
                />
                <line
                    x1="0" y1="70%" x2="100%" y2="70%"
                    stroke="url(#line-gradient)"
                    strokeWidth="1"
                    className="animate-pulse-line animation-delay-2000"
                />
            </svg>

            {/* Radial vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030014_70%)]" />
        </div>
    );
};

export default AnimatedBackground;
