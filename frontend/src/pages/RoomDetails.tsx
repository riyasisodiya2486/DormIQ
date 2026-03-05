import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomDetails } from '../hooks/useRooms';
import { DeviceCard } from '../components/rooms/DeviceCard';
import { Loader } from '../components/ui/Loader';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import {
    ChevronLeft,
    Activity,
    Plus,
    BarChart3,
    History,
    ShieldCheck
} from 'lucide-react';

const RoomDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: details, isLoading } = useRoomDetails(id!);

    if (isLoading) return <Loader fullPage />;
    if (!details) return <div>Room not found</div>;

    const { room, devices } = details;

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'Occupied': return { variant: 'success' as const, icon: Activity };
            case 'Idle': return { variant: 'warning' as const, icon: History };
            case 'Sleeping': return { variant: 'info' as const, icon: History };
            default: return { variant: 'neutral' as const, icon: History };
        }
    };

    const statusInfo = getStatusInfo(room.occupancyStatus);

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/rooms')}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-primary/50 transition-all group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-4xl font-black text-white italic">ROOM <span className="text-primary not-italic">{room.roomNumber}</span></h1>
                            <Badge variant={statusInfo.variant}>
                                <div className="flex items-center space-x-1.5 py-0.5 px-1 uppercase tracking-[0.1em] font-black text-[10px]">
                                    <statusInfo.icon size={12} />
                                    <span>{room.occupancyStatus}</span>
                                </div>
                            </Badge>
                        </div>
                        <p className="text-white/40 font-medium mt-1">Infrastructure signature: {room._id.slice(-8)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all">
                        <BarChart3 size={20} />
                    </button>
                    <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-7 rounded-2xl flex items-center space-x-2 transition-all transform active:scale-[0.98] neon-glow-primary">
                        <Plus size={18} />
                        <span>Provision Device</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Status Overview Card */}
                    <Card title="Operational Status" description="Real-time occupancy and load analysis">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 leading-none">Power Load</p>
                                <p className="text-2xl font-black text-white">{room.currentPower} <span className="text-xs text-white/30 tracking-normal">W</span></p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 leading-none">Energy Spend</p>
                                <p className="text-2xl font-black text-accent">{room.energyToday.toFixed(1)} <span className="text-xs text-white/30 tracking-normal">Wh</span></p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 leading-none">Devices</p>
                                <p className="text-2xl font-black text-white">{devices.length}<span className="text-xs text-white/30 tracking-normal ml-1">#</span></p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 leading-none">Uptime</p>
                                <p className="text-2xl font-black text-primary">100<span className="text-xs text-white/30 tracking-normal">%</span></p>
                            </div>
                        </div>
                    </Card>

                    {/* Devices Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white tracking-tight">Connected Peripherals</h3>
                            <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest">
                                {devices.filter(d => d.status).length} Active
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {devices.map((device) => (
                                <DeviceCard key={device._id} device={device} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card title="Environment Logs" description="Recent occupancy events">
                        <div className="mt-6 space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                            {[
                                { event: 'Occupancy Detected', time: '10:42 AM', type: 'Occupied' },
                                { event: 'Standby Mode Engaged', time: '09:15 AM', type: 'Idle' },
                                { event: 'Deep Sleep Optimization', time: '01:00 AM', type: 'Sleeping' }
                            ].map((log, i) => (
                                <div key={i} className="flex items-start space-x-6 relative">
                                    <div className={`w-6 h-6 rounded-full border-4 border-background shrink-0 z-10 
                                        ${log.type === 'Occupied' ? 'bg-accent' : log.type === 'Idle' ? 'bg-warning' : 'bg-primary'}`}
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white leading-tight">{log.event}</p>
                                        <p className="text-xs text-white/30 mt-1 flex items-center">
                                            <History size={10} className="mr-1" />
                                            {log.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 text-xs font-bold text-primary border border-primary/20 bg-primary/5 rounded-xl hover:bg-primary/10 transition-all uppercase tracking-[0.1em]">
                            View Entire History
                        </button>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/20">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                                <ShieldCheck size={20} className="text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Authority Engine</h4>
                                <p className="text-[10px] text-white/50 uppercase font-black tracking-widest">Active Protection</p>
                            </div>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">
                            Automation is currently authoritative. Devices will transition to ECO mode 15 minutes after last motion detection.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
