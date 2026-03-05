import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, disabled }) => {
    return (
        <button
            onClick={() => !disabled && onChange(!enabled)}
            className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                ${enabled ? 'bg-primary' : 'bg-white/10'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            <motion.span
                animate={{ x: enabled ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            />
        </button>
    );
};
