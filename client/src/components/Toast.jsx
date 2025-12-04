import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

let toastId = 0;

const toastTypes = {
    success: {
        icon: CheckCircle,
        className: 'bg-green-500',
        iconColor: 'text-white'
    },
    error: {
        icon: XCircle,
        className: 'bg-red-500',
        iconColor: 'text-white'
    },
    warning: {
        icon: AlertCircle,
        className: 'bg-yellow-500',
        iconColor: 'text-white'
    },
    info: {
        icon: Info,
        className: 'bg-blue-500',
        iconColor: 'text-white'
    }
};

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info', duration = 3000) => {
        const id = toastId++;
        const toast = { id, message, type, duration };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return {
        toasts,
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        warning: (message, duration) => addToast(message, 'warning', duration),
        info: (message, duration) => addToast(message, 'info', duration),
        removeToast
    };
};

export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => {
                    const config = toastTypes[toast.type];
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.8 }}
                            className={`${config.className} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md pointer-events-auto`}
                        >
                            <Icon className={config.iconColor} size={20} />
                            <p className="flex-1 text-sm font-medium">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="hover:bg-white/20 rounded p-1 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
