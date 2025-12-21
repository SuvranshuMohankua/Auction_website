import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSellerAuth } from '../context/SellerAuthContext';
import {
    LuGavel,
    LuZap,
    LuShield,
    LuTrophy,
    LuTrendingUp,
    LuUsers,
    LuArrowRight
} from 'react-icons/lu';
import bgImage from '../images/29707.jpg';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { seller } = useSellerAuth();
    const [stats, setStats] = useState([
        { label: 'Active Auctions', value: '0', icon: LuGavel },
        { label: 'Total Volume', value: '$0', icon: LuTrendingUp },
        { label: 'Verified Users', value: '0', icon: LuUsers },
        { label: 'Items Sold', value: '0', icon: LuTrophy },
    ]);

    useEffect(() => {
        // Simulate counting animation
        const targets = [1200, 45, 85, 340];
        const duration = 2000;
        const steps = 50;
        const interval = duration / steps;

        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            if (currentStep <= steps) {
                setStats(prev => prev.map((stat, i) => {
                    const progress = currentStep / steps;
                    const value = Math.floor(targets[i] * progress);
                    const suffix = i === 1 ? 'M+' : 'k+';
                    const prefix = i === 1 ? '$' : '';
                    return { ...stat, value: prefix + value + suffix };
                }));
            } else {
                clearInterval(timer);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const features = [
        {
            icon: LuZap,
            title: "Real-Time Bidding",
            description: "Experience lag-free auctions with our advanced WebSocket technology. Watch bids happen instantly."
        },
        {
            icon: LuShield,
            title: "Secure Transactions",
            description: "Bank-grade encryption ensuring your payments and personal data are always protected."
        },
        {
            icon: LuTrophy,
            title: "Premium Items",
            description: "Curated collection of rare and exclusive items from verified sellers worldwide."
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* 3D Background - Spline */}
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <img
                    src={bgImage}
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlay for text readability - Adjusted for image visibility + text contrast */}
                <div className="absolute inset-0 bg-slate-900/70 light-mode:bg-white/60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none"></div>
            </div>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center relative z-10">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold tracking-wide uppercase animate-fade-in-up">
                        The Next Gen Auction Platform
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 font-['Outfit'] tracking-tight animate-fade-in-up animation-delay-200">
                        <span className="block text-slate-100 mb-2 light-mode:text-slate-900">Discover Exclusive</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse-glow">
                            Digital Artifacts
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 light-mode:text-slate-700 mb-12 leading-relaxed animate-fade-in-up animation-delay-400">
                        The premium destination for real-time auctions. Bid on rare items,
                        track market trends, and secure your digital legacy with verified ownership.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
                        <button
                            onClick={() => navigate(user ? '/auctions' : '/register')}
                            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(6_182_212_0.4)] hover:shadow-[0_0_30px_rgba(6_182_212_0.6)] transition-all transform hover:-translate-y-1 w-full sm:w-auto"
                        >
                            <div className="absolute inset-0 bg-white/20 blur-lg group-hover:opacity-40 transition-opacity opacity-0"></div>
                            <span className="relative flex items-center justify-center gap-2">
                                {user ? 'Browse Auctions' : 'Start Bidding'}
                                <LuGavel className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </span>
                        </button>

                        {!seller && (
                            <button
                                onClick={() => navigate('/seller/register')}
                                className="px-8 py-4 glass-premium rounded-xl font-bold text-slate-200 light-mode:text-slate-800 hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2 group w-full sm:w-auto justify-center"
                            >
                                Become a Seller
                                <LuArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up animation-delay-800">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card text-center group hover:bg-white/10 border-t border-white/10">
                            <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                            <div className="text-3xl font-bold text-white light-mode:text-slate-900 mb-2 font-['Space_Grotesk']">
                                {stat.value}
                            </div>
                            <div className="text-sm text-slate-400 light-mode:text-slate-600 uppercase tracking-wider font-semibold">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 relative z-10 bg-slate-900/50 light-mode:bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white light-mode:text-slate-900 mb-6 font-['Outfit']">
                            Why Choose <span className="text-cyan-400">Us?</span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="glass-premium p-8 rounded-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-cyan-500/20 transition-colors"></div>

                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                    <feature.icon className="w-8 h-8 text-cyan-400" />
                                </div>

                                <h3 className="text-2xl font-bold text-white light-mode:text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-400 light-mode:text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
