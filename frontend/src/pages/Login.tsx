import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { Zap, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const setAuth = useAuthStore((s) => s.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setAuth(data.token, data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background overflow-hidden">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 relative z-10">
                <div className="max-w-md w-full py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 text-center lg:text-left"
                    >
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 neon-glow-primary mx-auto lg:mx-0">
                            <Zap className="text-white w-6 h-6 fill-current" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">Welcome Back</h1>
                        <p className="text-white/50 text-lg">Enter your credentials to access the optimization dashboard.</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white/70 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors h-5 w-5" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@dormiq.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white/70 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors h-5 w-5" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-1">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded-md border-white/10 bg-white/5 checked:bg-primary transition-all cursor-pointer" />
                                <span className="text-sm text-white/50 group-hover:text-white transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-medium text-primary hover:text-white transition-colors">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Log In to Dashboard</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-white/30 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-bold hover:underline">Get started for free</Link>
                    </p>
                </div>
            </div>

            {/* Right Side: Visuals */}
            <div className="hidden lg:block lg:w-1/2 bg-panel relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 z-10" />

                {/* Animated Background Grid */}
                <div className="absolute inset-0 z-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-20 z-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <div className="glass-panel p-8 rounded-[2.5rem] relative">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
                            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-accent/20 blur-[80px] rounded-full" />

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                                    <span className="text-accent font-bold text-xs uppercase tracking-[0.2em]">System Insight</span>
                                </div>
                                <h2 className="text-4xl font-bold font-sans">Effortless energy monitoring in real-time.</h2>
                                <p className="text-white/60 text-lg leading-relaxed">
                                    DormIQ uses advanced sensor patterns to optimize occupancy and reduce wastage by up to 40% automatically.
                                </p>

                                <div className="pt-8 border-t border-white/10 flex items-center space-x-12">
                                    <div>
                                        <p className="text-2xl font-bold text-white">4.2kW</p>
                                        <p className="text-xs text-white/30 uppercase mt-1">Live Load</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-accent">98.2%</p>
                                        <p className="text-xs text-white/30 uppercase mt-1">Efficiency Score</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
