import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import {
    User,
    LogOut,
    AtSign,
    Building2,
    Palette
} from 'lucide-react';

const Settings: React.FC = () => {
    const { user, logout } = useAuthStore();

    const sections = [
        {
            title: 'Account Identity',
            icon: User,
            fields: [
                { label: 'Hostel Identifier', value: user?.hostelName, sub: 'Publicly visible to students', icon: Building2 },
                { label: 'Primary Contact', value: user?.email, sub: 'System notifications endpoint', icon: AtSign }
            ]
        },
        {
            title: 'System Preferences',
            icon: Palette,
            items: ['Experimental Glass Design', 'Automatic High-Contrast Charts', 'Compact Grid Layout']
        }
    ];

    return (
        <div className="space-y-8 pb-20 max-w-5xl">
            <header>
                <h1 className="text-4xl font-black tracking-tight text-white italic">SYSTEM <span className="text-primary not-italic">SETTINGS</span></h1>
                <p className="text-white/40 font-medium mt-1">Configure your administrative profile and UI preferences.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Navigation */}
                <div className="space-y-3">
                    {['Profile Information', 'Security & Password', 'Notification Rules', 'API Integration', 'Data Management'].map((nav, i) => (
                        <button
                            key={i}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border transition-all
                            ${i === 0 ? 'bg-primary/20 border-primary/20 text-primary' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10 hover:text-white'}`}
                        >
                            <span className="font-bold text-sm">{nav}</span>
                            {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary neon-glow-primary" />}
                        </button>
                    ))}

                    <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl bg-danger/5 border border-danger/10 text-danger hover:bg-danger/10 transition-all mt-8 group"
                    >
                        <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                        <span className="font-bold text-sm uppercase tracking-widest italic">Terminate Session</span>
                    </button>
                </div>

                {/* Right: Content */}
                <div className="lg:col-span-2 space-y-8">
                    {sections.map((section, idx) => (
                        <Card key={idx} hover={false} className="border-white/5">
                            <div className="flex items-center space-x-3 mb-8">
                                <section.icon size={20} className="text-primary" />
                                <h3 className="font-bold text-white text-lg tracking-tight">{section.title}</h3>
                            </div>

                            {section.fields && (
                                <div className="space-y-6">
                                    {section.fields.map((field, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all">
                                            <div className="flex items-center space-x-5">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                                                    <field.icon size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 leading-none mb-1.5">{field.label}</p>
                                                    <p className="font-bold text-white">{field.value}</p>
                                                    <p className="text-xs text-white/30 mt-0.5">{field.sub}</p>
                                                </div>
                                            </div>
                                            <button className="text-xs font-black text-primary uppercase tracking-widest hover:text-white transition-colors">Edit</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {section.items && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <span className="text-xs font-medium text-white/60">{item}</span>
                                            <div className="w-8 h-4 bg-primary/20 rounded-full relative">
                                                <div className="absolute right-1 top-1 w-2 h-2 rounded-full bg-primary" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    ))}

                    <Card title="Danger Zone" className="border-danger/20">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-bold text-white">Wipe Hostel Account</h4>
                                <p className="text-xs text-white/40 mt-1 max-w-sm">
                                    Permanently reset all room configurations, devices, and historical signature data. This cannot be undone.
                                </p>
                            </div>
                            <button className="px-6 py-2.5 rounded-xl border border-danger/40 text-danger text-xs font-bold hover:bg-danger/10 transition-all">
                                Request Purge
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
