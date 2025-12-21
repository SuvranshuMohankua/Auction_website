import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { LuMail, LuLock, LuUser, LuArrowRight, LuLoader } from 'react-icons/lu';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(formData.username, formData.email, formData.password);
            showToast('Account created successfully!', 'success');
            navigate("/");
        } catch (err) {
            console.error("Registration error:", err);
            const message = err.response?.data?.error || err.message || "Registration failed";
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">


            {/* Right Side - Form */}
            <div className="w-full flex items-center justify-center p-6 bg-slate-900 light-mode:bg-white relative">
                <div className="w-full max-w-md relative z-10">
                    <div className="lg:hidden text-center mb-10">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 font-['Outfit'] mb-2">
                            LUXBID
                        </h1>
                        <p className="text-slate-400 light-mode:text-slate-600">Create your account</p>
                    </div>

                    <div className="mb-8 hidden lg:block">
                        <h2 className="text-3xl font-bold text-white light-mode:text-slate-900 font-['Outfit']">Create Account</h2>
                        <p className="text-slate-400 light-mode:text-slate-600 mt-2">Join the future of auctions today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 light-mode:text-slate-700 mb-2">Username</label>
                            <div className="relative group">
                                <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="text"
                                    className="input-primary pl-12 focus:border-purple-400 focus:ring-purple-400"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 light-mode:text-slate-700 mb-2">Email Address</label>
                            <div className="relative group">
                                <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="email"
                                    className="input-primary pl-12 focus:border-purple-400 focus:ring-purple-400"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 light-mode:text-slate-700 mb-2">Password</label>
                            <div className="relative group">
                                <LuLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="password"
                                    className="input-primary pl-12 focus:border-purple-400 focus:ring-purple-400"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <LuLoader className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <LuArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 light-mode:text-slate-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
