import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { Zap, Mail, Lock, Loader2, ArrowRight, Home, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        hostelName: '',
        email: '',
        password: '',
        totalRooms: '10'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const setAuth = useAuthStore((s) => s.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/register', {
                ...formData,
                passwordRaw: formData.password,
                totalRooms: parseInt(formData.totalRooms)
            });
            setAuth(data.token, data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background overflow-hidden font-sans">
            {/* Left Side: Visuals */}
            <div className="hidden lg:block lg:w-5/12 bg-panel relative overflow-hidden border-r border-white/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-accent/10 z-10" />
                <div className="absolute inset-0 z-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(#3B82F6 0.5px, transparent 0.5px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="h-full flex flex-col justify-center px-16 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-10 border border-primary/30 neon-glow-primary">
                            <Zap className="text-primary w-8 h-8 fill-current" />
                        </div>
                        <h2 className="text-5xl font-black text-white leading-tight mb-8">
                            Scale your <br />
                            <span className="text-primary">smart infrastructure.</span>
                        </h2>
                        <ul className="space-y-6">
                            {[
                                'Real-time occupancy monitoring',
                                'Automated device control rules',
                                'AI-driven energy optimization',
                                'Secure multi-admin management'
                            ].map((text, i) => (
                                <li key={i} className="flex items-center space-x-4 text-white/70">
                                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
                                        <div className="w-2 h-2 rounded-full bg-accent" />
                                    </div>
                                    <span className="text-lg font-medium">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center px-8 relative overflow-y-auto py-12">
                <div className="max-w-md w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Administrator Account</h1>
                        <p className="text-white/50">Join hundreds of hostel owners optimizing their grids.</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl text-sm font-medium animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Hostel Name</label>
                                <div className="relative group">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors h-4 w-4" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.hostelName}
                                        onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                                        placeholder="Green Dorms"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all overflow-hidden text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Capacity (Rooms)</label>
                                <div className="relative group">
                                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors h-4 w-4" />
                                    <input
                                        type="number"
                                        required
                                        value={formData.totalRooms}
                                        onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors h-4 w-4" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@hostel.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors h-4 w-4" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Minimum 8 characters"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Management Account</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-center text-white/30 px-6">
                            By clicking register, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </form>

                    <p className="mt-8 text-center text-white/30 text-sm">
                        Already managing a hostel?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">Sign in instead</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
