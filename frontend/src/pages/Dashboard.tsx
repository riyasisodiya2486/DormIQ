import React from 'react';
import {
    Users,
    Zap,
    Activity,
} from 'lucide-react';
import { useDashboardStats } from '../hooks/useAnalytics';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';

const Dashboard: React.FC = () => {
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

    if (statsLoading || analyticsLoading) return <Loader fullPage />;

    const colors = {
        primary: '#3B82F6',
        accent: '#22C55E',
        warning: '#FACC15',
        danger: '#EF4444',
        sleeping: '#8B5CF6'
    };

    const occupancyPie = [
        { name: 'Occupied', value: stats?.occupiedRooms || 0, color: colors.accent },
        { name: 'Idle', value: stats?.idleRooms || 0, color: colors.warning },
        { name: 'Sleeping', value: stats?.sleepingRooms || 0, color: colors.sleeping },
    ].filter(v => v.value > 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white italic">OPERATIONS <span className="text-primary not-italic">HUB</span></h1>
                    <p className="text-white/40 font-medium mt-1">Real-time status of your smart hostel infrastructure.</p>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm">
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">System Load</p>
                        <p className="text-lg font-black text-accent">{stats?.activeDevices || 0} <span className="text-xs text-white/30">Active</span></p>
                    </div>
                    <Activity className="text-accent h-8 w-8 ml-2 opacity-50" />
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Capacity"
                    value={stats?.totalRooms || 0}
                    icon={Users}
                    subtitle="Guest Rooms"
                    variant="primary"
                />
                <StatsCard
                    title="Live Occupancy"
                    value={stats?.occupiedRooms || 0}
                    icon={Activity}
                    variant="accent"
                    trend={{ value: "+12%", positive: true }}
                />
                <StatsCard
                    title="Energy Today"
                    value={(stats?.energyToday || 0).toFixed(1)}
                    icon={Zap}
                    subtitle="Watt-hours"
                    variant="warning"
                />
                <StatsCard
                    title="System Idle"
                    value={stats?.idleRooms || 0}
                    icon={Users}
                    variant="danger"
                    subtitle="Potential Savings"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Energy Trend */}
                <Card className="lg:col-span-2" title="Daily Energy Usage" description="Total kWh consumption over the past 24 hours">
                    <div className="h-80 w-full mt-4">
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
                                <Area
                                    type="monotone"
                                    dataKey="units"
                                    stroke={colors.primary}
                                    fillOpacity={1}
                                    fill="url(#colorUnits)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Occupancy Distribution */}
                <Card title="Live Distribution" description="Current status breakdown">
                    <div className="h-64 w-full mt-4 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={occupancyPie}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {occupancyPie.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                />
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
            </div>
        </div>
    );
};

export default Dashboard;
