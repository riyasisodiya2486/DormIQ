import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    DoorOpen,
    BarChart3,
    Cpu,
    ShieldCheck,
    Settings,
    ChevronLeft,
    ChevronRight,
    Zap
} from 'lucide-react';
import { useSystemStore } from '../../store/systemStore';
import { motion } from 'framer-motion';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: DoorOpen, label: 'Rooms', path: '/rooms' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Cpu, label: 'Automation', path: '/automation' },
    { icon: ShieldCheck, label: 'Admin', path: '/admin' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC = () => {
    const { sidebarCollapsed, toggleSidebar } = useSystemStore();

    return (
        <motion.aside
            animate={{ width: sidebarCollapsed ? 80 : 256 }}
            className="fixed left-0 top-0 h-screen glass-panel z-40 border-r border-white/5 flex flex-col"
        >
            <div className="p-6 flex items-center justify-between">
                {!sidebarCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center space-x-3"
                    >
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center neon-glow-primary">
                            <Zap className="text-white w-5 h-5 fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">DormIQ</span>
                    </motion.div>
                )}
                {sidebarCollapsed && (
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                        <Zap className="text-primary w-5 h-5" />
                    </div>
                )}
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                            ${isActive
                                ? 'bg-primary/20 text-primary border border-primary/20'
                                : 'text-white/50 hover:bg-white/5 hover:text-white'}
                        `}
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!sidebarCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="ml-4 font-medium"
                            >
                                {item.label}
                            </motion.span>
                        )}
                        {!sidebarCollapsed && (
                            <div className="ml-auto w-1 h-1 rounded-full bg-primary opacity-0 group-[.active]:opacity-100" />
                        )}
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={toggleSidebar}
                className="p-4 border-t border-white/5 text-white/30 hover:text-white transition-colors flex justify-center"
            >
                {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
        </motion.aside>
    );
};
