import React from 'react';

export const Loader: React.FC<{ fullPage?: boolean }> = ({ fullPage }) => {
    const spinner = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-12 h-12">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/20 rounded-full" />
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full border-t-transparent animate-spin" />
            </div>
            <p className="text-white/50 animate-pulse font-medium">Synchronizing systems...</p>
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-background flex items-center justify-center z-50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5" />
                {spinner}
            </div>
        );
    }

    return <div className="p-12 flex justify-center">{spinner}</div>;
};
