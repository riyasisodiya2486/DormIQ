import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Room } from '../../types';
import { motion } from 'framer-motion';
import {
    Zap,
    Activity,
    Clock,
    Moon,
    ChevronRight,
    Wifi
} from 'lucide-react';

interface RoomCardProps {
    room: Room;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
    const navigate = useNavigate();

    const getStatusConfig = (status: Room['occupancyStatus']) => {
        switch (status) {
            case 'Occupied': return { icon: Activity, variant: 'success' as const, label: 'Occupied' };
            case 'Idle': return { icon: Clock, variant: 'warning' as const, label: 'Idle' };
            case 'Sleeping': return { icon: Moon, variant: 'info' as const, label: 'Sleeping' };
            default: return { icon: Wifi, variant: 'neutral' as const, label: 'Offline' };
        }
    };

    const config = getStatusConfig(room.occupancyStatus);

    return (
        <Card
            hover
            onClick={() => navigate(`/rooms/${room._id}`)}
            className="group relative overflow-hidden flex flex-col h-full border-white/[0.03] hover:border-primary/30 transition-all duration-500"
        >
            <div className={`absolute top-0 left-0 w-1.5 h-full 
                ${config.variant === 'success' ? 'bg-accent shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                    config.variant === 'warning' ? 'bg-warning shadow-[0_0_10px_rgba(250,204,21,0.5)]' :
                        config.variant === 'info' ? 'bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`}
            />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-lg border border-white/5 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
                        {room.roomNumber}
                    </div>
                    <Badge variant={config.variant}>
                        <div className="flex items-center space-x-1.5">
                            <config.icon size={12} className={room.occupancyStatus === 'Occupied' ? 'animate-pulse' : ''} />
                            <span>{config.label}</span>
                        </div>
                    </Badge>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-white/30 group-hover:text-white transition-colors">
                    <ChevronRight size={16} />
                </div>
            </div>

            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between text-white/40">
                    <span className="text-xs uppercase tracking-widest font-bold">Active Load</span>
                    <div className="flex items-center space-x-2 text-white">
                        <Zap size={14} className="text-warning fill-warning/20" />
                        <span className="font-mono font-bold">{room.currentPower}W</span>
                    </div>
                </div>

                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((room.currentPower / 2000) * 100, 100)}%` }}
                        className={`h-full ${room.currentPower > 1500 ? 'bg-danger' : 'bg-primary'}`}
                    />
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="text-xs text-white/30 font-medium">
                    Spent Today: <span className="text-white/60 font-bold ml-1">{room.energyToday.toFixed(1)} Wh</span>
                </div>
                <div className="text-[10px] text-white/20 uppercase tracking-tighter">
                    Updated 2m ago
                </div>
            </div>
        </Card>
    );
};
