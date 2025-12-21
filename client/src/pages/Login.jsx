import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LuMail, LuLock, LuArrowRight, LuLoader } from 'react-icons/lu';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            showToast('Welcome back!', 'success');
            navigate('/');
        } catch (err) {
            showToast(
                err?.response?.data?.error || 'Login failed',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">


            {/* RIGHT SIDE – LOGIN FORM */}
            <div className="w-full flex items-center justify-center p-6 bg-slate-900 light-mode:bg-white relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl lg:hidden"></div>

                <div className="w-full max-w-md relative z-10">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-10">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 font-['Outfit'] mb-2">
                            LUXBID
                        </h1>
                        <p className="text-slate-400 light-mode:text-slate-600">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Desktop Header */}
                    <div className="mb-8 hidden lg:block">
                        <h2 className="text-3xl font-bold text-white light-mode:text-slate-900 font-['Outfit']">
                            Sign In
                        </h2>
                        <p className="text-slate-400 light-mode:text-slate-600 mt-2">
                            Please enter your details to continue
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 light-mode:text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="email"
                                    className="input-primary pl-12"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 light-mode:text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <LuLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="password"
                                    className="input-primary pl-12"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <LuLoader className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <LuArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 light-mode:text-slate-600">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
