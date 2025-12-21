import React from 'react';
import { Link } from 'react-router-dom';
import AuctionStatusBadge from './AuctionStatusBadge';
import Countdown from './Countdown';

import { useAuth } from '../context/AuthContext';
import { LuHeart } from 'react-icons/lu';

const AuctionCard = ({ auction }) => {
    const { user, toggleWatchlist } = useAuth();
    const isEnded = new Date() > new Date(auction.endTime) || auction.status === 'closed';
    const isWatched = user?.watchlist?.includes(auction._id);

    const handleWatchlistClick = async (e) => {
        e.preventDefault();
        if (!user) return; // Or show login toast
        await toggleWatchlist(auction._id);
    };

    return (
        <div className="glass-card group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-60 z-10 pointer-events-none"></div>
            <div className="p-0">
                <div className="relative h-56 overflow-hidden rounded-xl mb-4">
                    <img
                        src={auction.imageUrl}
                        alt={auction.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 right-3 z-20">
                        <AuctionStatusBadge status={auction.status} endTime={auction.endTime} />
                    </div>
                    {user && (
                        <button
                            onClick={handleWatchlistClick}
                            className={`absolute top-3 left-3 z-20 p-2 rounded-full glass-premium border border-white/10 transition-all ${isWatched ? 'text-red-500 bg-red-500/10' : 'text-white/70 hover:text-white hover:bg-white/20'}`}
                        >
                            <LuHeart className={`w-5 h-5 ${isWatched ? 'fill-current' : ''}`} />
                        </button>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-300 font-['Outfit']">
                    {auction.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2 font-light leading-relaxed">
                    {auction.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Bid</p>
                        <p className="text-xl font-bold text-cyan-400 font-['Space_Grotesk'] tracking-wide">${auction.currentBid?.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                            {isEnded ? 'Status' : 'Ends In'}
                        </p>
                        {isEnded ? (
                            <p className="text-sm font-medium text-slate-400">Ended</p>
                        ) : (
                            <Countdown endTime={auction.endTime} />
                        )}
                    </div>
                </div>

                <Link
                    to={`/auction/${auction._id}`}
                    className="btn-primary flex items-center justify-center gap-2 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                >
                    {isEnded ? 'View Details' : 'Place Bid'}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default AuctionCard;
