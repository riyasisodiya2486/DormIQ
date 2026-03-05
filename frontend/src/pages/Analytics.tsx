import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
    Zap,
    TrendingUp,
    ArrowUpRight,
    Leaf,
    Battery
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const Analytics: React.FC = () => {
    const { data: analytics, isLoading } = useAnalytics();

    if (isLoading) return <Loader fullPage />;

    const colors = ['#3B82F6', '#22C55E', '#FACC15', '#EF4444', '#8B5CF6'];

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white italic">ENERGY <span className="text-primary not-italic">INTELLIGENCE</span></h1>
                    <p className="text-white/40 font-medium mt-1">Deep analysis of historical power consumption and efficiency scores.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="neutral">Last 30 Days</Badge>
                    <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm">
                        Export Report
                    </button>
                </div>
            </header>

            {/* Insight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'CO2 Offset', value: '1.2 tons', icon: Leaf, variant: 'bg-accent/20 text-accent' },
                    { label: 'Avg Efficiency', value: '94.8%', icon: TrendingUp, variant: 'bg-primary/20 text-primary' },
                    { label: 'Peak Load', value: '6.4 kW', icon: Zap, variant: 'bg-warning/20 text-warning' },
                    { label: 'Total Units', value: '1,420 kWh', icon: Battery, variant: 'bg-danger/20 text-danger' }
                ].map((stat, i) => (
                    <Card key={i} hover={false} className="border-white/5 py-5">
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
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Consumption Trend */}
                <Card title="Consumption Velocity" description="Hourly monitoring of active grid load" className="lg:col-span-2">
                    <div className="h-80 w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.dailyEnergyUsage || []}>
                                <defs>
                                    <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="date" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                />
                                <Area type="step" dataKey="units" stroke="#3B82F6" fill="url(#velocityGradient)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Device Distribution */}
                <Card title="Device Footprint" description="Power contribution by appliance category">
                    <div className="h-64 w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics?.deviceConsumption || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="units"
                                    nameKey="device"
                                >
                                    {(analytics?.deviceConsumption || []).map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="rgba(255,255,255,0.05)" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 space-y-3">
                        {(analytics?.deviceConsumption || []).map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-xs text-white/40 font-bold uppercase tracking-widest flex items-center">
                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors[i % colors.length] }} />
                                    {item.device}
                                </span>
                                <span className="text-sm font-black text-white">{item.units} Wh</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Peak Hours Histogram */}
                <Card title="Peak Grid Load" description="Load probability by hour of day" className="lg:col-span-2">
                    <div className="h-64 mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics?.weeklyEnergyUsage || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="week" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                />
                                <Line type="monotone" dataKey="units" stroke="#FACC15" strokeWidth={3} dot={{ fill: '#FACC15', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
