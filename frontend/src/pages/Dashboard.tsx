import React, { useMemo } from 'react';
import { Users, Zap, Activity, Clock, Radio, FlaskConical } from 'lucide-react';
import { useDashboardStats } from '../hooks/useAnalytics';
import { useRooms } from '../hooks/useRooms';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Card } from '../components/ui/Card';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import { useSystemStore } from '../store/systemStore';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const colors = {
    primary: '#3B82F6',
    accent: '#22C55E',
    warning: '#FACC15',
    danger: '#EF4444',
    sleeping: '#8B5CF6',
};

function formatLastActivity(isoString: string): string {
    if (!isoString) return 'N/A';
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

const Dashboard: React.FC = () => {
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
    const { data: rooms } = useRooms();
    const demoMode = useSystemStore((s) => s.demoMode);
    const socketConnected = useSystemStore((s) => s.socketConnected);

    // Compute last activity from rooms (client-side)
    const lastActivity = useMemo(() => {
        if (!rooms || rooms.length === 0) return null;
        const latest = rooms
            .map(r => new Date(r.lastMotionAt).getTime())
            .filter(t => !isNaN(t))
            .sort((a, b) => b - a)[0];
        return latest ? new Date(latest).toISOString() : null;
    }, [rooms]);

    // System Status: Active if any room has motion in last 60 seconds
    const isActive = useMemo(() => {
        if (!rooms || rooms.length === 0) return false;
        const cutoff = Date.now() - 60 * 1000;
        return rooms.some(r => new Date(r.lastMotionAt).getTime() > cutoff);
    }, [rooms]);

    // Rooms with recent activity (last 60s)
    const activeRoomCount = useMemo(() => {
        if (!rooms) return 0;
        const cutoff = Date.now() - 60 * 1000;
        return rooms.filter(r => new Date(r.lastMotionAt).getTime() > cutoff).length;
    }, [rooms]);

    const occupancyPie = [
        { name: 'Occupied', value: stats?.occupiedRooms || 0, color: colors.accent },
        { name: 'Idle', value: stats?.idleRooms || 0, color: colors.warning },
        { name: 'Sleeping', value: stats?.sleepingRooms || 0, color: colors.sleeping },
    ].filter(v => v.value > 0);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Header */}
            <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white italic">
                        OPERATIONS <span className="text-primary not-italic">HUB</span>
                    </h1>
                    <p className="text-white/40 font-medium mt-1">
                        Real-time status of your smart hostel infrastructure.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Demo mode badge */}
                    {demoMode && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-full">
                            <FlaskConical size={12} className="text-warning" />
                            <span className="text-[10px] font-bold text-warning uppercase tracking-widest">Demo Live</span>
                        </div>
                    )}

                    {/* System Status */}
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border backdrop-blur-sm transition-all duration-500
                        ${isActive
                            ? 'bg-accent/10 border-accent/20'
                            : 'bg-white/5 border-white/10'
                        }`}
                    >
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent animate-pulse' : 'bg-white/20'}`} />
                        <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-accent' : 'text-white/30'}`}>
                            System {isActive ? 'Active' : 'Idle'}
                        </span>
                    </div>

                    {/* Socket / Active Devices */}
                    <div className={`flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm
                        ${!socketConnected ? 'border-danger/20' : ''}`}
                    >
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">System Load</p>
                            <p className="text-lg font-black text-accent">
                                {stats?.activeDevices || 0}{' '}
                                <span className="text-xs text-white/30">Active</span>
                            </p>
                        </div>
                        <Activity className="text-accent h-8 w-8 ml-2 opacity-50" />
                    </div>
                </div>
            </motion.header>

            {/* KPI Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    <>
                        <StatsCard title="Total Capacity" value={stats?.totalRooms || 0} icon={Users} subtitle="Guest Rooms" variant="primary" />
                        <StatsCard title="Live Occupancy" value={stats?.occupiedRooms || 0} icon={Activity} variant="accent" trend={{ value: '+12%', positive: true }} />
                        <StatsCard title="Energy Today" value={(stats?.energyToday || 0).toFixed(1)} icon={Zap} subtitle="Watt-hours" variant="warning" />
                        <StatsCard title="System Idle" value={stats?.idleRooms || 0} icon={Users} variant="danger" subtitle="Potential Savings" />
                    </>
                )}
            </motion.div>

            {/* Last Activity + Active Rooms bar */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-4 px-5 py-4 glass-card">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                        <Clock size={18} className="text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-white/30">Last Activity</p>
                        <p className="text-base font-bold text-white mt-0.5">
                            {lastActivity ? formatLastActivity(lastActivity) : '—'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-4 px-5 py-4 glass-card">
                    <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
                        <Radio size={18} className="text-accent" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-white/30">Rooms w/ Recent Activity</p>
                        <p className="text-base font-bold text-white mt-0.5">
                            <span className="text-accent">{activeRoomCount}</span>
                            <span className="text-white/30 text-xs ml-1">/ {rooms?.length ?? 0} in last minute</span>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Charts */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Energy Trend */}
                <Card className="lg:col-span-2" title="Daily Energy Usage" description="Total Wh consumption — last 24 hours">
                    <div className="h-80 w-full mt-4">
                        {analyticsLoading ? (
                            <div className="h-full flex items-end gap-2">
                                {Array.from({ length: 14 }).map((_, i) => (
                                    <div key={i} className="skeleton-shimmer flex-1 rounded-t-lg" style={{ height: `${30 + Math.random() * 60}%` }} />
                                ))}
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics?.dailyEnergyUsage || []}>
                                    <defs>
                                        <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="date" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                        itemStyle={{ color: colors.primary }}
                                    />
                                    <Area type="monotone" dataKey="units" stroke={colors.primary} fillOpacity={1} fill="url(#colorUnits)" strokeWidth={3} dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>

                {/* Occupancy Pie */}
                <Card title="Live Distribution" description="Current status breakdown">
                    <div className="h-64 w-full mt-4 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={occupancyPie.length > 0 ? occupancyPie : [{ name: 'No Data', value: 1, color: '#ffffff10' }]}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(occupancyPie.length > 0 ? occupancyPie : [{ color: '#ffffff10' }]).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <p className="text-2xl font-black text-white">{stats?.totalRooms || 0}</p>
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Total</p>
                        </div>
                    </div>
                    <div className="space-y-3 mt-4">
                        {occupancyPie.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-sm text-white/50">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span>{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
