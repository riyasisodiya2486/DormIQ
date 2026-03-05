import React from 'react';
import { Bell, Search, User, Wifi } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSystemStore } from '../../store/systemStore';

export const Topbar: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const sidebarCollapsed = useSystemStore((s) => s.sidebarCollapsed);

    return (
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

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
                    <Wifi className="text-accent h-4 w-4 animate-pulse" />
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Live Online</span>
                </div>

                <div className="flex items-center space-x-4 border-l border-white/10 pl-6">
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
    );
};
