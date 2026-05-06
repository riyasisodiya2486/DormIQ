import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useSystemStore } from '../store/systemStore';
import { Card } from '../components/ui/Card';
import { ChartSkeleton, StatCardSkeleton } from '../components/ui/Skeleton';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { Zap, TrendingUp, ArrowUpRight, Leaf, Battery, FlaskConical, BarChart3 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';

const COLORS = ['#3B82F6', '#22C55E', '#FACC15', '#EF4444', '#8B5CF6'];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.07 },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const CustomTooltipStyle = {
    contentStyle: {
        backgroundColor: '#111827',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        fontSize: '12px',
        color: '#fff',
    },
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <BarChart3 size={28} className="text-white/20" />
        </div>
        <h3 className="text-lg font-bold text-white/40 mb-2">No Data Yet</h3>
        <p className="text-sm text-white/20 max-w-xs leading-relaxed">
            Run your system to start generating energy insights, or enable{' '}
            <span className="text-warning font-bold">Demo Mode</span> for a live preview.
        </p>
    </div>
);

// ─── Analytics Page ───────────────────────────────────────────────────────────
const Analytics: React.FC = () => {
    const { data: analytics, isLoading } = useAnalytics();
    const demoMode = useSystemStore((s) => s.demoMode);

    const hasData = analytics &&
        (analytics.dailyEnergyUsage?.length > 0 ||
            analytics.deviceConsumption?.length > 0 ||
            analytics.peakUsageHours?.length > 0);

    // Compute efficiency/wastage stat (% of device consumption from AC vs total)
    const totalConsumption = analytics?.deviceConsumption?.reduce((sum, d) => sum + d.units, 0) ?? 0;
    const acConsumption = analytics?.deviceConsumption?.find(d => d.device.toLowerCase().includes('ac'))?.units ?? 0;
    const efficiencyScore = totalConsumption > 0
        ? Math.max(0, Math.round(100 - (acConsumption / totalConsumption) * 100))
        : 94;

    const stats = [
        { label: 'CO2 Offset', value: '1.2 tons', icon: Leaf, variant: 'bg-accent/20 text-accent' },
        { label: 'Avg Efficiency', value: `${efficiencyScore}%`, icon: TrendingUp, variant: 'bg-primary/20 text-primary' },
        { label: 'Peak Load', value: `${Math.max(...(analytics?.peakUsageHours?.map(h => h.units) ?? [0]))} W`, icon: Zap, variant: 'bg-warning/20 text-warning' },
        {
            label: 'Total Units',
            value: `${(totalConsumption / 1000).toFixed(1)} kWh`,
            icon: Battery,
            variant: 'bg-danger/20 text-danger',
        },
    ];

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
                        ENERGY <span className="text-primary not-italic">INTELLIGENCE</span>
                    </h1>
                    <p className="text-white/40 font-medium mt-1">
                        Deep analysis of historical power consumption and efficiency scores.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {demoMode && (
                        <div className="flex items-center space-x-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-full">
                            <FlaskConical size={12} className="text-warning" />
                            <span className="text-[10px] font-bold text-warning uppercase tracking-widest">Demo Data</span>
                        </div>
                    )}
                    <Badge variant="neutral">Last 30 Days</Badge>
                    <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm">
                        Export Report
                    </button>
                </div>
            </motion.header>

            {/* Stat Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                    : stats.map((stat, i) => (
                        <motion.div key={i} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                            <Card hover={false} className="border-white/5 py-5">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2.5 rounded-xl ${stat.variant}`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <ArrowUpRight size={16} className="text-accent" />
                                </div>
                                <div className="mt-4">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-white/30">{stat.label}</p>
                                    <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                }
            </motion.div>

            {/* Main charts — only show when we have data, else empty state */}
            {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card title="Daily Energy Usage" description="Loading...">
                            <ChartSkeleton height={320} />
                        </Card>
                    </div>
                    <Card title="Device Footprint" description="Loading...">
                        <ChartSkeleton height={260} />
                    </Card>
                </div>
            ) : !hasData ? (
                <EmptyState />
            ) : (
                <>
                    {/* Row 1: Area Chart + Pie Chart */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Daily Energy Area Chart */}
                        <Card
                            title="Daily Energy Usage"
                            description="Derived from device ON durations across all rooms"
                            className="lg:col-span-2"
                        >
                            <div className="h-80 w-full mt-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analytics.dailyEnergyUsage}>
                                        <defs>
                                            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="date" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => `${v}Wh`} />
                                        <Tooltip {...CustomTooltipStyle} formatter={(v) => [`${v} Wh`, 'Energy']} />
                                        <Area
                                            type="monotone"
                                            dataKey="units"
                                            stroke="#3B82F6"
                                            fill="url(#energyGradient)"
                                            strokeWidth={2.5}
                                            dot={false}
                                            activeDot={{ r: 5, fill: '#3B82F6' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Device Consumption Pie Chart */}
                        <Card title="Device Footprint" description="Power contribution by appliance category">
                            <div className="h-52 w-full mt-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.deviceConsumption}
                                            cx="50%" cy="50%"
                                            innerRadius={52} outerRadius={78}
                                            paddingAngle={6}
                                            dataKey="units"
                                            nameKey="device"
                                        >
                                            {analytics.deviceConsumption.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                    stroke="rgba(255,255,255,0.05)"
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip {...CustomTooltipStyle} formatter={(v) => [`${v} Wh`, 'Consumption']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2.5">
                                {analytics.deviceConsumption.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-xs text-white/40 font-bold uppercase tracking-widest flex items-center">
                                            <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            {item.device}
                                        </span>
                                        <span className="text-sm font-black text-white">{item.units} Wh</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Row 2: Peak Hours Bar Chart */}
                    <motion.div variants={itemVariants}>
                        <Card title="Peak Usage Hours" description="ON events distribution across hours of the day">
                            <div className="h-64 mt-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analytics.peakUsageHours} barSize={18}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="hour" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                        <Tooltip {...CustomTooltipStyle} formatter={(v) => [v, 'Events']} />
                                        <Bar dataKey="units" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                                            {analytics.peakUsageHours.map((entry, index) => (
                                                <Cell
                                                    key={`bar-${index}`}
                                                    fill={entry.units > 150 ? '#EF4444' : entry.units > 100 ? '#FACC15' : '#3B82F6'}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                {[
                                    { color: '#3B82F6', label: 'Low' },
                                    { color: '#FACC15', label: 'Medium' },
                                    { color: '#EF4444', label: 'High' },
                                ].map(({ color, label }) => (
                                    <div key={label} className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Row 3: Efficiency / Wastage Card */}
                    <motion.div variants={itemVariants}>
                        <Card title="Efficiency & Wastage" description="Estimated energy efficiency across all devices">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <div className="p-5 bg-accent/5 border border-accent/10 rounded-2xl flex flex-col gap-2">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-white/30">Efficiency Score</p>
                                    <p className="text-3xl font-black text-accent">{efficiencyScore}<span className="text-sm text-white/30">%</span></p>
                                    <p className="text-xs text-white/30">Devices operating optimally</p>
                                </div>
                                <div className="p-5 bg-warning/5 border border-warning/10 rounded-2xl flex flex-col gap-2">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-white/30">Wastage Risk</p>
                                    <p className="text-3xl font-black text-warning">{100 - efficiencyScore}<span className="text-sm text-white/30">%</span></p>
                                    <p className="text-xs text-white/30">High-load devices (AC) vs total</p>
                                </div>
                                <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl flex flex-col gap-2">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-white/30">Total Tracked</p>
                                    <p className="text-3xl font-black text-primary">{(totalConsumption / 1000).toFixed(2)}<span className="text-sm text-white/30"> kWh</span></p>
                                    <p className="text-xs text-white/30">All devices combined</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
};

export default Analytics;
