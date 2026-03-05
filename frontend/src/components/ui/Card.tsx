import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, title, description, className = '', onClick, hover = true }) => {
    return (
        <motion.div
            whileHover={hover ? { y: -4, scale: 1.01 } : {}}
            onClick={onClick}
            className={`glass-card p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {title && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
                    {description && <p className="text-sm text-white/50">{description}</p>}
                </div>
            )}
            {children}
        </motion.div>
    );
};
