import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';
import { useToast } from '../../context/ToastContext';

const SellerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginSeller } = useSellerAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await loginSeller(email, password);
            showToast('Seller logged in successfully', 'success');
            navigate('/seller/dashboard');
        } catch (err) {
            console.error('Seller login error:', err);
            setError(err.response?.data?.error || 'Failed to log in');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="w-full max-w-md glass-premium relative z-10 p-10 rounded-2xl border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)]">

                {/* Seller Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                        Seller Portal
                    </span>
                </div>

                {/* Header */}
                <div className="text-center mb-10 mt-4">
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-3 font-['Outfit']">
                        Seller Login
                    </h2>
                    <p className="text-slate-400 font-light">
                        Access your seller dashboard
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl mb-8 text-sm flex items-center gap-3 backdrop-blur-sm">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                            </path>
                        </svg>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-2 ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-primary focus:border-purple-400 focus:ring-purple-400"
                            placeholder="seller@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-2 ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-primary focus:border-purple-400 focus:ring-purple-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-['Outfit'] uppercase tracking-wide text-sm flex justify-center items-center"
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12" cy="12" r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                                    1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        ) : (
                            'Sign In as Seller'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-10 text-center border-t border-white/10 pt-6">
                    <p className="text-slate-400 font-light text-sm">
                        Don't have a seller account?{' '}
                        <Link
                            to="/seller/register"
                            className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline decoration-purple-400/30 underline-offset-4"
                        >
                            Register now
                        </Link>
                    </p>
                    <p className="text-slate-500 text-xs mt-4">
                        <Link to="/login" className="hover:text-slate-300 transition-colors">
                            ← Back to Buyer Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SellerLogin;
