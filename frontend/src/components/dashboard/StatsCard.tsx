import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    subtitle?: string;
    variant?: 'primary' | 'accent' | 'warning' | 'danger';
    trend?: {
        value: string;
        positive: boolean;
    };
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    subtitle,
    variant = 'primary',
    trend
}) => {
    const variants = {
        primary: 'text-primary bg-primary/10 border-primary/20 neon-glow-primary',
        accent: 'text-accent bg-accent/10 border-accent/20 neon-glow-accent',
        warning: 'text-warning bg-warning/10 border-warning/20',
        danger: 'text-danger bg-danger/10 border-danger/20'
    };

    return (
        <Card hover className="relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 opacity-5 rounded-full transition-transform duration-700 group-hover:scale-125
                ${variant === 'primary' ? 'bg-primary' : variant === 'accent' ? 'bg-accent' : variant === 'warning' ? 'bg-warning' : 'bg-danger'}`}
            />

            <div className="flex items-start justify-between relative z-10">
                <div className={`p-3 rounded-xl border ${variants[variant]}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <Badge variant={trend.positive ? 'success' : 'danger'}>
                        {trend.value}
                    </Badge>
                )}
            </div>

            <div className="mt-6 relative z-10">
                <p className="text-sm font-medium text-white/40 uppercase tracking-widest">{title}</p>
                <div className="flex items-baseline mt-1 space-x-2">
                    <h2 className="text-3xl font-black text-white">{value}</h2>
                    {subtitle && <span className="text-xs text-white/30 font-medium">{subtitle}</span>}
                </div>
            </div>
        </Card>
    );
};
