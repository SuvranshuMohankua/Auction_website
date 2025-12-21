import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LuGavel, LuTrophy, LuClock, LuTrendingUp, LuArrowRight } from 'react-icons/lu';

const Dashboard = () => {
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeBids: 0,
        auctionsWon: 0,
        totalSpent: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [bidsRes, paymentsRes] = await Promise.all([
                axios.get('http://localhost:3001/api/bids/my-bids'),
                axios.get('http://localhost:3001/api/payments/pending')
            ]);

            const bids = bidsRes.data;
            const payments = paymentsRes.data || [];

            // Calculate stats
            const activeBids = bids.filter(b => !b.isEnded).length;
            const auctionsWon = bids.filter(b => b.isEnded && b.isWinning).length;

            setStats({
                activeBids,
                auctionsWon
            });

            setRecentActivity(bids);
            setPendingPayments(payments);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (profileData.password && profileData.password !== profileData.confirmPassword) {
            // using window.alert or toast if valid
            alert('Passwords do not match');
            return;
        }

        setUpdating(true);
        try {
            const updates = {};
            if (profileData.username !== user.username) updates.username = profileData.username;
            if (profileData.email !== user.email) updates.email = profileData.email;
            if (profileData.password) updates.password = profileData.password;

            if (Object.keys(updates).length === 0) {
                setUpdating(false);
                setShowProfileModal(false);
                return;
            }

            await axios.put('http://localhost:3001/api/auth/me', updates);

            // Reload page to reflect changes (simple way) or update context
            window.location.reload();
        } catch (error) {
            console.error('Update profile error:', error);
            alert(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const openProfileModal = () => {
        setProfileData({
            username: user?.username || '',
            email: user?.email || '',
            password: '',
            confirmPassword: ''
        });
        setShowProfileModal(true);
    };

    return (
        <div className="pt-24 pb-12">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3 font-['Outfit']">My Dashboard</h1>
                <p className="text-slate-400 font-light text-lg">Manage your profile and track your bids</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Profile Card */}
                <div className="glass-premium rounded-2xl p-8 lg:col-span-1 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-[60px] rounded-full -mr-10 -mt-10"></div>

                    <div className="flex items-center gap-6 mb-8 relative z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border-2 border-white/20">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white font-['Outfit']">{user?.username}</h2>
                            <p className="text-sm text-cyan-400 font-['Space_Grotesk'] tracking-wide">ELITE MEMBER</p>
                        </div>
                    </div>

                    <div className="space-y-6 border-t border-white/10 pt-6 relative z-10">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-semibold">Email</p>
                            <p className="text-slate-200 font-medium truncate font-['Space_Grotesk'] tracking-wide">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-semibold">Member Since</p>
                            <p className="text-slate-200 font-medium font-['Space_Grotesk']">{new Date(user?.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-3">
                            <Link to="/payments" className="block w-full text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20">
                                Go to Payments
                            </Link>
                            <button
                                onClick={openProfileModal}
                                className="block w-full text-center border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white font-medium py-3 rounded-xl transition-all"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats / Activity Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* ... (Rest of stats code same as before, preserving it via context or just replacing Profile Card section if I could targeting smaller chunk... but targeting the whole return is safer to inject modal at end) */}
                    {/* Pending Payments / Won Auctions */}
                    {pendingPayments.length > 0 && (
                        <div className="glass-premium rounded-2xl p-6 border border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-4 text-emerald-400">
                                <LuTrophy className="w-6 h-6" />
                                <h3 className="text-xl font-bold font-['Outfit']">Auctions Won ({pendingPayments.length})</h3>
                            </div>

                            <div className="space-y-3">
                                {pendingPayments.map((item) => (
                                    <div key={item._id} className="bg-black/20 p-4 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800">
                                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{item.title}</p>
                                                <p className="text-xs text-emerald-400 font-medium">Winning Bid: ${item.currentBid}</p>
                                            </div>
                                        </div>

                                        {item.paymentStatus === 'completed' ? (
                                            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">PAID</span>
                                        ) : (
                                            <Link
                                                to="/payments"
                                                className="text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                                            >
                                                Pay Now
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="glass-card bg-gradient-to-br from-slate-900/50 to-slate-900/80 border border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2 text-slate-400">
                                    <LuGavel className="w-4 h-4" />
                                    <span className="uppercase tracking-wider text-xs font-semibold">Active Bids</span>
                                </div>
                                <p className="text-5xl font-bold text-white group-hover:text-cyan-400 transition-colors font-['Space_Grotesk']">
                                    {stats.activeBids}
                                </p>
                            </div>
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
                        </div>

                        <div className="glass-card bg-gradient-to-br from-slate-900/50 to-slate-900/80 border border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2 text-slate-400">
                                    <LuTrophy className="w-4 h-4" />
                                    <span className="uppercase tracking-wider text-xs font-semibold">Auctions Won</span>
                                </div>
                                <p className="text-5xl font-bold text-white group-hover:text-purple-400 transition-colors font-['Space_Grotesk']">
                                    {stats.auctionsWon}
                                </p>
                            </div>
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-premium rounded-2xl p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                            <h3 className="text-lg font-bold text-white font-['Outfit']">Recent Activity</h3>
                            <Link to="/my-bids" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                                View All <LuArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {recentActivity.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <LuTrendingUp className="w-8 h-8 text-slate-600" />
                                </div>
                                <p className="font-light text-lg mb-2">You haven't placed any bids yet.</p>
                                <Link to="/auctions" className="inline-block mt-4 text-cyan-400 hover:text-cyan-300 font-medium text-sm border-b border-cyan-400/30 hover:border-cyan-400 pb-0.5 transition-all">Start Bidding →</Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.slice(0, 3).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.auction.imageUrl || 'https://via.placeholder.com/100'}
                                                    alt={item.auction.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium truncate max-w-[150px] sm:max-w-xs">{item.auction.title}</h4>
                                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                                    <LuClock className="w-3 h-3" />
                                                    {new Date(item.lastBidTime).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-cyan-400 font-['Space_Grotesk']">${item.highestUserBid.toLocaleString()}</p>
                                            <StatusBadge item={item} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-premium w-full max-w-lg p-8 rounded-2xl border border-white/10 animate-scale-in">
                        <h3 className="text-2xl font-bold text-white mb-6 font-['Outfit']">Edit Profile</h3>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-2">Username</label>
                                <input
                                    type="text"
                                    value={profileData.username}
                                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                    className="input-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="input-primary"
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <p className="text-sm text-slate-400 mb-2">Change Password (optional)</p>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={profileData.password}
                                    onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                                    className="input-primary mb-3"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={profileData.confirmPassword}
                                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                                    className="input-primary"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileModal(false)}
                                    className="flex-1 py-3 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50"
                                >
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ item }) => {
    if (item.isEnded) {
        if (item.isWinning) return <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">WON</span>;
        return <span className="text-xs font-bold text-slate-400 bg-slate-400/10 px-2 py-1 rounded-full">ENDED</span>;
    }
    if (item.isWinning) return <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full">WINNING</span>;
    return <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full">OUTBID</span>;
};

export default Dashboard;
