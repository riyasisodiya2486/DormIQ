import React from 'react';
import { useAutomationConfig, useUpdateAutomationConfig } from '../hooks/useAutomation';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { Toggle } from '../components/ui/Toggle';
import {
    Moon,
    Power,
    Zap,
    ShieldAlert,
    Settings,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Automation: React.FC = () => {
    const { data: config, isLoading } = useAutomationConfig();
    const updateConfig = useUpdateAutomationConfig();

    if (isLoading) return <Loader fullPage />;

    const handleToggleAutomation = (enabled: boolean) => {
        updateConfig.mutate({ automationEnabled: enabled });
    };

    const handleUpdateField = (field: string, value: any) => {
        updateConfig.mutate({ [field]: value });
    };

    const thresholds = [30, 60, 120, 300, 600, 900, 1800];

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white italic">AUTONOMY <span className="text-primary not-italic">ENGINE</span></h1>
                    <p className="text-white/40 font-medium mt-1">Configure logic thresholds for the authoritative occupancy engine.</p>
                </div>
                <div className={`flex items-center space-x-4 px-6 py-3 rounded-2xl border transition-all
                    ${config?.automationEnabled ? 'bg-primary/20 border-primary/20 text-primary neon-glow-primary' : 'bg-white/5 border-white/10 text-white/30'}`}>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] uppercase font-black tracking-widest leading-none mb-1">Engine Status</span>
                        <span className="text-sm font-black">{config?.automationEnabled ? 'AUTHORITATIVE' : 'SUSPENDED'}</span>
                    </div>
                    <Toggle enabled={config?.automationEnabled || false} onChange={handleToggleAutomation} />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Critical Controls */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Idle Threshold Selector */}
                    <Card title="Occupancy Cutoff" description="How long to wait before declaring a room idle after motion stops.">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                            {thresholds.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => handleUpdateField('idleThresholdSeconds', t)}
                                    className={`px-4 py-3 rounded-xl border font-bold text-sm transition-all
                                    ${config?.idleThresholdSeconds === t
                                            ? 'bg-primary border-primary text-white shadow-lg'
                                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                                >
                                    {t >= 60 ? `${t / 60}m` : `${t}s`}
                                </button>
                            ))}
                            <div className="bg-white/2 inset-0 flex items-center justify-center p-3 text-[10px] font-black uppercase text-white/20 text-center leading-tight">
                                Custom Value Available in API
                            </div>
                        </div>
                    </Card>

                    {/* Night Mode Schedule */}
                    <Card title="Night Mode Intelligence" description="Automatically transition to Sleeping state during these hours.">
                        <div className="mt-6 flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <Moon size={20} />
                                    </div>
                                    <Toggle
                                        enabled={config?.sleepModeEnabled || false}
                                        onChange={(e) => handleUpdateField('sleepModeEnabled', e)}
                                    />
                                    <span className="text-sm font-bold text-white">Enable Scheduling</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Start Hour</label>
                                        <input
                                            type="time"
                                            value={config?.nightModeStart}
                                            onChange={(e) => handleUpdateField('nightModeStart', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">End Hour</label>
                                        <input
                                            type="time"
                                            value={config?.nightModeEnd}
                                            onChange={(e) => handleUpdateField('nightModeEnd', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-8 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center max-w-[200px]">
                                <p className="text-3xl font-black text-white italic">ECO</p>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">Optimization Active</p>
                            </div>
                        </div>
                    </Card>

                    {/* Logic Rules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'Auto-Shutdown', icon: Power, desc: 'Kill all unprotected loads when idle.', active: true },
                            { title: 'Dimming Rules', icon: Zap, desc: 'Reduce current to 30% for lights on Idle.', active: false },
                            { title: 'Probabilistic Sleep', icon: Zap, desc: 'Infer sleep based on movement history.', active: true },
                            { title: 'Safety Override', icon: ShieldAlert, desc: 'Never disable medical or critical devices.', active: true }
                        ].map((rule, i) => (
                            <div key={i} className="glass-card p-5 group hover:border-primary/30">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl border transition-all ${rule.active ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/5 text-white/20'}`}>
                                        <rule.icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-white text-sm tracking-tight">{rule.title}</h4>
                                            {rule.active && <div className="w-1.5 h-1.5 rounded-full bg-accent neon-glow-accent" />}
                                        </div>
                                        <p className="text-[11px] text-white/40 mt-1 leading-tight">{rule.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Automation Logs & Stats */}
                <div className="space-y-6">
                    <Card title="Efficiency Impact" className="bg-gradient-to-br from-accent/20 to-primary/10">
                        <div className="flex items-baseline space-x-2">
                            <h2 className="text-4xl font-black text-white">42%</h2>
                            <span className="text-xs text-white/50 font-medium">Energy Savings</span>
                        </div>
                        <div className="mt-4 space-y-4">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/30">
                                <span>Automation Reliability</span>
                                <span>99.9%</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '99.9%' }} transition={{ duration: 1 }} className="h-full bg-accent" />
                            </div>
                        </div>
                    </Card>

                    <Card title="Operational Logic">
                        <div className="space-y-5">
                            <div className="flex items-start space-x-4">
                                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/30 text-xs font-bold mt-1">1</div>
                                <p className="text-xs text-white/60 leading-relaxed">
                                    Motion data is polled every 5s from room sensors.
                                </p>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/30 text-xs font-bold mt-1">2</div>
                                <p className="text-xs text-white/60 leading-relaxed">
                                    If no motion for <b>{config?.idleThresholdSeconds}s</b>, room state transitions to <b>Idle</b>.
                                </p>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/30 text-xs font-bold mt-1">3</div>
                                <p className="text-xs text-white/60 leading-relaxed">
                                    Authoritative engine triggers <b>OFF</b> signals for all non-protected load groups.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <button className="w-full flex items-center justify-between p-5 glass-card group hover:bg-white/[0.08] transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                                <Settings size={18} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-white">Advanced Config</p>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">JSON Schema Mode</p>
                            </div>
                        </div>
                        <ArrowRight size={18} className="text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Automation;
