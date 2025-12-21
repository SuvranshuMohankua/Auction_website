import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AuctionStatusBadge from '../components/AuctionStatusBadge';
import Countdown from '../components/Countdown';

const MyBids = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchMyBids();
    }, [user]);

    const fetchMyBids = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3001/api/bids/my-bids', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBids(res.data);
        } catch (error) {
            console.error('Error fetching bids:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3 font-['Outfit']">
                    My Bids
                </h1>
                <p className="text-slate-400 font-light text-lg">Track all your bidding activity</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="glass-card bg-gradient-to-br from-cyan-900/30 to-cyan-900/10 border border-cyan-500/20">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Total Auctions</p>
                    <p className="text-4xl font-bold text-white font-['Space_Grotesk']">{bids.length}</p>
                </div>
                <div className="glass-card bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-500/20">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Currently Winning</p>
                    <p className="text-4xl font-bold text-green-400 font-['Space_Grotesk']">
                        {bids.filter(b => b.isWinning && !b.isEnded).length}
                    </p>
                </div>
                <div className="glass-card bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/20">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Auctions Won</p>
                    <p className="text-4xl font-bold text-purple-400 font-['Space_Grotesk']">
                        {bids.filter(b => b.isWinning && b.isEnded).length}
                    </p>
                </div>
            </div>

            {/* Bids List */}
            {bids.length === 0 ? (
                <div className="glass-card text-center py-16">
                    <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    </div>
                    <p className="text-slate-400 text-lg mb-4">You haven't placed any bids yet</p>
                    <Link to="/" className="text-cyan-400 hover:text-cyan-300 font-medium">
                        Browse auctions →
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bids.map((item, index) => (
                        <Link
                            key={item.auction._id || index}
                            to={`/auction/${item.auction._id}`}
                            className="glass-card flex flex-col md:flex-row gap-6 hover:border-cyan-500/30 transition-all group"
                        >
                            {/* Image */}
                            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                    src={item.auction.imageUrl || 'https://via.placeholder.com/200x150?text=No+Image'}
                                    alt={item.auction.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                            {item.auction.title}
                                        </h3>
                                        <AuctionStatusBadge status={item.auction.status} endTime={item.auction.endTime} />
                                    </div>
                                    <p className="text-slate-400 text-sm line-clamp-1 mb-3">{item.auction.description}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-6">
                                    {/* Your Highest Bid */}
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Your Highest Bid</p>
                                        <p className="text-xl font-bold text-cyan-400 font-['Space_Grotesk']">
                                            ${item.highestUserBid.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Current Highest */}
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Current Highest</p>
                                        <p className="text-xl font-bold text-white font-['Space_Grotesk']">
                                            ${item.auction.currentBid.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
                                        {item.isEnded ? (
                                            item.isWinning ? (
                                                <span className="flex items-center gap-2 text-green-400 font-bold">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    WON
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-red-400 font-bold">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    OUTBID
                                                </span>
                                            )
                                        ) : (
                                            item.isWinning ? (
                                                <span className="flex items-center gap-2 text-green-400 font-bold">
                                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                                    WINNING
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-yellow-400 font-bold">
                                                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                                    OUTBID
                                                </span>
                                            )
                                        )}
                                    </div>

                                    {/* Time Left */}
                                    {!item.isEnded && (
                                        <div className="ml-auto">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time Left</p>
                                            <Countdown endTime={item.auction.endTime} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBids;
