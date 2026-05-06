import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, type Toast } from '../../hooks/useToast';

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const colors = {
    success: {
        bg: 'bg-accent/10 border-accent/20',
        icon: 'text-accent',
        bar: 'bg-accent',
    },
    error: {
        bg: 'bg-danger/10 border-danger/20',
        icon: 'text-danger',
        bar: 'bg-danger',
    },
    warning: {
        bg: 'bg-warning/10 border-warning/20',
        icon: 'text-warning',
        bar: 'bg-warning',
    },
    info: {
        bg: 'bg-primary/10 border-primary/20',
        icon: 'text-primary',
        bar: 'bg-primary',
    },
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
    const removeToast = useToastStore((s) => s.removeToast);
    const Icon = icons[toast.type];
    const c = colors[toast.type];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`relative flex items-start gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl max-w-sm overflow-hidden ${c.bg}`}
        >
            {/* Progress bar */}
            <motion.div
                className={`absolute bottom-0 left-0 h-0.5 ${c.bar}`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: (toast.duration ?? 4000) / 1000, ease: 'linear' }}
            />

            <Icon className={`${c.icon} shrink-0 mt-0.5`} size={18} />
            <p className="text-sm text-white/90 font-medium leading-snug flex-1">{toast.message}</p>
            <button
                onClick={() => removeToast(toast.id)}
                className="text-white/30 hover:text-white/70 transition-colors shrink-0 ml-2 mt-0.5"
            >
                <X size={14} />
            </button>
        </motion.div>
    );
};

export const ToastContainer: React.FC = () => {
    const toasts = useToastStore((s) => s.toasts);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};
