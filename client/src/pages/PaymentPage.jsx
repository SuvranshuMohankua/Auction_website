import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
    LuCreditCard,
    LuShield,
    LuCheck,
    LuClock,
    LuPackage,
    LuArrowLeft
} from 'react-icons/lu';

const PaymentPage = () => {
    const { user, token } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [wonAuctions, setWonAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [buyerDetails, setBuyerDetails] = useState({
        name: '',
        email: '',
        address: '',
        phone: ''
    });

    useEffect(() => {
        fetchWonAuctions();
    }, []);

    const fetchWonAuctions = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/payments/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWonAuctions(res.data);
        } catch (error) {
            console.error('Error fetching won auctions:', error);
            showToast('Failed to load won auctions', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (auction) => {
        setProcessing(true);
        try {
            // Step 1: Initiate payment
            const initRes = await axios.post('http://localhost:3001/api/payments/initiate', {
                auctionId: auction._id,
                buyerDetails
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Step 2: Complete payment (simulated)
            const completeRes = await axios.post('http://localhost:3001/api/payments/complete', {
                paymentId: initRes.data.payment._id,
                paymentMethod: 'card',
                buyerDetails
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            showToast('Payment successful!', 'success');
            setSelectedAuction(null);
            setBuyerDetails({ name: '', email: '', address: '', phone: '' });
            fetchWonAuctions();
        } catch (error) {
            console.error('Payment error:', error);
            showToast(error.response?.data?.error || 'Payment failed', 'error');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
                >
                    <LuArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold text-white font-['Outfit']">
                    My Won Auctions
                </h1>
                <p className="text-slate-400 mt-2">Complete payment for auctions you've won</p>
            </div>

            {/* Won Auctions List */}
            {wonAuctions.length === 0 ? (
                <div className="glass-card text-center py-16">
                    <LuPackage className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No auctions won yet</p>
                    <button
                        onClick={() => navigate('/auctions')}
                        className="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        Browse auctions →
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {wonAuctions.map(auction => (
                        <div key={auction._id} className="glass-card">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Image */}
                                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={auction.imageUrl || 'https://via.placeholder.com/200x150'}
                                        alt={auction.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-grow">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-xl font-bold text-white">{auction.title}</h3>
                                        <PaymentStatusBadge status={auction.paymentStatus} />
                                    </div>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{auction.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider">Winning Bid</p>
                                            <p className="text-2xl font-bold text-cyan-400 font-['Space_Grotesk']">
                                                ${auction.currentBid.toLocaleString()}
                                            </p>
                                        </div>

                                        {auction.paymentStatus !== 'completed' && (
                                            <button
                                                onClick={() => setSelectedAuction(auction)}
                                                className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
                                            >
                                                <LuCreditCard className="w-5 h-5" />
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payment Modal */}
            {selectedAuction && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-premium w-full max-w-lg p-8 rounded-2xl border border-cyan-500/20 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white font-['Outfit']">Complete Payment</h3>
                            <button
                                onClick={() => setSelectedAuction(null)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Auction Summary */}
                        <div className="bg-white/5 p-4 rounded-xl mb-6">
                            <p className="text-white font-medium">{selectedAuction.title}</p>
                            <p className="text-2xl font-bold text-cyan-400 mt-1">
                                ${selectedAuction.currentBid.toLocaleString()}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={(e) => { e.preventDefault(); handlePayment(selectedAuction); }} className="space-y-4">
                            <div>
                                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={buyerDetails.name}
                                    onChange={(e) => setBuyerDetails({ ...buyerDetails, name: e.target.value })}
                                    className="input-primary"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={buyerDetails.email}
                                    onChange={(e) => setBuyerDetails({ ...buyerDetails, email: e.target.value })}
                                    className="input-primary"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-2">
                                    Shipping Address
                                </label>
                                <input
                                    type="text"
                                    value={buyerDetails.address}
                                    onChange={(e) => setBuyerDetails({ ...buyerDetails, address: e.target.value })}
                                    className="input-primary"
                                    placeholder="123 Main St, City, Country"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={buyerDetails.phone}
                                    onChange={(e) => setBuyerDetails({ ...buyerDetails, phone: e.target.value })}
                                    className="input-primary"
                                    placeholder="+1 234 567 890"
                                    required
                                />
                            </div>

                            {/* Security Notice */}
                            <div className="flex items-center gap-2 text-sm text-slate-400 bg-green-500/10 p-3 rounded-lg">
                                <LuShield className="w-5 h-5 text-green-400" />
                                <span>Your payment is secured with encryption</span>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    <>
                                        <LuCreditCard className="w-5 h-5" />
                                        Complete Payment - ${selectedAuction.currentBid.toLocaleString()}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const PaymentStatusBadge = ({ status }) => {
    const config = {
    not_initiated: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: LuClock, label: 'Awaiting Payment' },
    pending: { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: LuClock, label: 'Processing' },
    completed: { bg: 'bg-green-500/20', text: 'text-green-400', icon: LuCheck, label: 'Paid' }
};

    const { bg, text, icon: Icon, label } = config[status] || config.not_initiated;

    return (
        <span className={`${bg} ${text} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
};

export default PaymentPage;
