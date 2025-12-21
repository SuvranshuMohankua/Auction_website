import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuctionCard from './AuctionCard';

const AuctionList = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, ending

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/auctions');
                setAuctions(response.data);
            } catch (error) {
                console.error("Error fetching auctions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    const filteredAuctions = auctions.filter(auction => {
        const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            auction.description.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        const now = new Date();
        const endTime = new Date(auction.endTime);
        const isActive = endTime > now;

        if (filter === 'active') matchesFilter = isActive;
        if (filter === 'ending') matchesFilter = isActive && (endTime - now < 24 * 60 * 60 * 1000); // Ends in 24h

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gradient mb-3">Live Auctions</h1>
                    <p className="text-slate-400 text-lg">Discover unique items and place your bids in real-time.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {/* Search Input */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search auctions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 bg-slate-900/90 text-white px-4 py-3 pl-10 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all"
                            />
                            <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-white/5 backdrop-blur-sm">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'active' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilter('ending')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'ending' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Ends Soon
                        </button>
                    </div>
                </div>
            </div>

            {filteredAuctions.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                    <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-slate-500 text-xl font-light">No auctions found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAuctions.map((auction, index) => (
                        <div
                            key={auction._id}
                            className="animate-fade-in-up opacity-0"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <AuctionCard auction={auction} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AuctionList;
