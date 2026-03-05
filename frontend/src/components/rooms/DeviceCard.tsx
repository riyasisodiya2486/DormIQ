import React from 'react';
import { Card } from '../ui/Card';
import { Toggle } from '../ui/Toggle';
import type { Device } from '../../types';
import { useUpdateDevice } from '../../hooks/useDevices';
import {
    Lightbulb,
    Wind,
    Monitor,
    Shield,
    Cpu,
    Zap,
    AlertCircle
} from 'lucide-react';

interface DeviceCardProps {
    device: Device;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
    const updateDevice = useUpdateDevice();

    const getIcon = () => {
        switch (device.type?.toLowerCase()) {
            case 'light': return Lightbulb;
            case 'fan': return Wind;
            case 'ac': return Wind;
            case 'socket': return PlugZap;
            default: return Monitor;
        }
    };

    const Icon = getIcon();

    const handleToggle = () => {
        updateDevice.mutate({
            deviceId: device._id,
            updates: { status: !device.status }
        });
    };

    const handleModeChange = () => {
        updateDevice.mutate({
            deviceId: device._id,
            updates: { mode: device.mode === 'Auto' ? 'Manual' : 'Auto' }
        });
    };

    return (
        <Card hover={false} className="border-white/[0.03] flex flex-col h-full bg-gradient-to-br from-white/[0.03] to-transparent">
            <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl border transition-all duration-500
                    ${device.status ? 'bg-primary/20 text-primary border-primary/20 neon-glow-primary' : 'bg-white/5 text-white/20 border-white/5'}`}>
                    <Icon size={28} className={device.status ? 'animate-pulse' : ''} />
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <button
                        onClick={handleModeChange}
                        className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all
                        ${device.mode === 'Auto' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-warning/10 border-warning/20 text-warning'}`}
                    >
                        {device.mode === 'Auto' ? <Cpu size={12} /> : <div className="w-1 h-1 rounded-full bg-warning" />}
                        <span>{device.mode}</span>
                    </button>
                    {device.protectedLoad && (
                        <div className="flex items-center space-x-1 text-danger">
                            <Shield size={10} fill="currentColor" opacity={0.5} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Protected</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{device.name}</h4>
                <div className="flex items-center space-x-2 text-white/30 text-xs font-medium">
                    <Zap size={12} />
                    <span>{device.powerRating}W Rating</span>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-1 leading-none">Status</span>
                    <span className={`text-sm font-bold ${device.status ? 'text-accent' : 'text-white/20'}`}>
                        {device.status ? 'ACTIVE' : 'STANDBY'}
                    </span>
                </div>
                <Toggle enabled={device.status} onChange={handleToggle} disabled={updateDevice.isPending} />
            </div>

            {device.autoDisabled && (
                <div className="mt-4 flex items-center space-x-2 px-3 py-2 bg-danger/5 border border-danger/10 rounded-xl text-danger/60 text-[10px] font-bold uppercase tracking-tight">
                    <AlertCircle size={14} />
                    <span>Automation Suspended</span>
                </div>
            )}
        </Card>
    );
};

const PlugZap = ({ size, className }: { size: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2v2" /><path d="m19 8-2 2" /><path d="m5 8 2 2" /><path d="M15 3.75 14.5 7h-5l-.5-3.25" /><path d="m13 12-1 4h4l-3 6" /><path d="M8 12h8" /><path d="M10.5 20H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4" /><path d="M15 12h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
    </svg>
)
