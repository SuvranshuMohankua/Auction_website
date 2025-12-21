import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';
import { useToast } from '../../context/ToastContext';

const SellerProfile = () => {
    const { seller, updateSellerProfile, logoutSeller } = useSellerAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        sellername: seller?.sellername || '',
        email: seller?.email || '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        setLoading(true);

        try {
            const updates = {};
            if (formData.sellername !== seller.sellername) updates.sellername = formData.sellername;
            if (formData.email !== seller.email) updates.email = formData.email;
            if (formData.password) updates.password = formData.password;

            if (Object.keys(updates).length === 0) {
                showToast('No changes to save', 'info');
                setLoading(false);
                return;
            }

            await updateSellerProfile(updates);
            showToast('Profile updated successfully', 'success');
            setFormData({ ...formData, password: '', confirmPassword: '' });
        } catch (err) {
            console.error('Profile update error:', err);
            showToast(err.response?.data?.error || 'Failed to update profile', 'error');
        }

        setLoading(false);
    };

    const handleLogout = () => {
        logoutSeller();
        showToast('Logged out successfully', 'success');
        navigate('/seller/login');
    };

    return (
        <div className="pt-24 pb-12 max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Seller
                    </span>
                </div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-['Outfit']">
                    Edit Profile
                </h1>
                <p className="text-slate-400 font-light mt-2">Update your seller account information</p>
            </div>

            {/* Profile Card */}
            <div className="glass-premium rounded-2xl p-8 border border-purple-500/20">
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                        {seller?.sellername?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white font-['Outfit']">{seller?.sellername}</h2>
                        <p className="text-purple-400 text-sm font-['Space_Grotesk']">VERIFIED SELLER</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-2">
                            Seller Name
                        </label>
                        <input
                            type="text"
                            value={formData.sellername}
                            onChange={(e) => setFormData({ ...formData, sellername: e.target.value })}
                            className="input-primary focus:border-purple-400 focus:ring-purple-400"
                            placeholder="Your Business Name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="input-primary focus:border-purple-400 focus:ring-purple-400"
                            placeholder="seller@example.com"
                            required
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <p className="text-slate-400 text-sm mb-4">Change Password (leave blank to keep current)</p>

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-2">
                                    New Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input-primary focus:border-purple-400 focus:ring-purple-400 pr-12"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-9 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div>
                                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="input-primary focus:border-purple-400 focus:ring-purple-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </form>

                {/* Danger Zone */}
                <div className="mt-8 pt-8 border-t border-red-500/20">
                    <h3 className="text-red-400 text-sm font-semibold uppercase tracking-wider mb-4">Account Actions</h3>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-all text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;
