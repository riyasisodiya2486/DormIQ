import React from 'react';

interface SkeletonProps {
    className?: string;
    height?: number | string;
    width?: number | string;
    rounded?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    height,
    width,
    rounded = 'rounded-xl',
}) => {
    return (
        <div
            className={`skeleton-shimmer ${rounded} ${className}`}
            style={{ height, width }}
        />
    );
};

export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 320 }) => (
    <div className="w-full space-y-3" style={{ height }}>
        <div className="flex items-end gap-2 h-full">
            {Array.from({ length: 14 }).map((_, i) => (
                <Skeleton
                    key={i}
                    className="flex-1"
                    height={`${30 + Math.random() * 60}%`}
                    rounded="rounded-t-lg"
                />
            ))}
        </div>
    </div>
);

export const StatCardSkeleton: React.FC = () => (
    <div className="glass-card p-6 space-y-4">
        <div className="flex justify-between">
            <Skeleton height={40} width={40} rounded="rounded-xl" />
            <Skeleton height={16} width={40} rounded="rounded-full" />
        </div>
        <div className="space-y-2">
            <Skeleton height={10} width="60%" />
            <Skeleton height={28} width="80%" />
        </div>
    </div>
);
