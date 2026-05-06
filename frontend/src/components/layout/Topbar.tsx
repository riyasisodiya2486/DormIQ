import React from 'react';
import { Bell, Search, User, Wifi, WifiOff, FlaskConical } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSystemStore } from '../../store/systemStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Topbar: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const sidebarCollapsed = useSystemStore((s) => s.sidebarCollapsed);
    const demoMode = useSystemStore((s) => s.demoMode);
    const toggleDemoMode = useSystemStore((s) => s.toggleDemoMode);
    const socketConnected = useSystemStore((s) => s.socketConnected);

    return (
        <>
            <header
                className={`fixed top-0 right-0 h-16 glass-panel z-30 transition-all duration-300 border-b border-white/5 px-8 flex items-center justify-between
                ${sidebarCollapsed ? 'left-20' : 'left-64'}`}
            >
                <div className="flex-1 max-w-xl">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search rooms, analytical data..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Demo Mode Toggle */}
                    <motion.button
                        onClick={toggleDemoMode}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all duration-300
                            ${demoMode
                                ? 'bg-warning/15 border-warning/30 text-warning shadow-[0_0_15px_-3px_rgba(250,204,21,0.4)]'
                                : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                            }`}
                    >
                        <FlaskConical size={13} />
                        <span>{demoMode ? 'Demo Live' : 'Demo Mode'}</span>
                        {demoMode && (
                            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-warning rounded-full animate-pulse" />
                        )}
                    </motion.button>

                    {/* Socket Status */}
                    <div className={`flex items-center space-x-2 px-3 py-1.5 border rounded-full transition-all duration-500
                        ${socketConnected
                            ? 'bg-accent/10 border-accent/20'
                            : 'bg-danger/10 border-danger/20'
                        }`}
                    >
                        <AnimatePresence mode="wait">
                            {socketConnected ? (
                                <motion.div
                                    key="connected"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex items-center space-x-2"
                                >
                                    <Wifi className="text-accent h-4 w-4 animate-pulse" />
                                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Live Online</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="disconnected"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex items-center space-x-2"
                                >
                                    <WifiOff className="text-danger h-4 w-4" />
                                    <span className="text-[10px] font-bold text-danger uppercase tracking-widest">Reconnecting</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center space-x-4 border-l border-white/10 pl-4">
                        <button className="relative p-2 text-white/50 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-panel" />
                        </button>

                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors leading-none">
                                    {user?.hostelName || 'Hostel Admin'}
                                </p>
                                <p className="text-[10px] text-white/40 font-medium mt-1 uppercase tracking-tighter">
                                    {user?.email}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all overflow-hidden relative">
                                <User className="text-white/50 group-hover:text-primary transition-colors" />
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Disconnect Banner */}
            <AnimatePresence>
                {!socketConnected && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 36, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed top-16 right-0 z-20 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'left-20' : 'left-64'}`}
                    >
                        <div className="h-full bg-danger/10 border-b border-danger/20 flex items-center justify-center">
                            <WifiOff size={12} className="text-danger mr-2" />
                            <p className="text-xs font-bold text-danger uppercase tracking-widest">
                                Live connection lost — attempting to reconnect…
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
