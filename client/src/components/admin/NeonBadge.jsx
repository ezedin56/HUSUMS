import React from 'react';
import { motion } from 'framer-motion';

const NeonBadge = ({
    children,
    variant = 'success',
    pulse = false,
    size = 'md',
    className = ''
}) => {
    const variants = {
        success: {
            bg: 'rgba(0, 255, 85, 0.1)',
            border: 'rgba(0, 255, 85, 0.4)',
            color: '#00ff55',
            glow: '0 0 10px rgba(0, 255, 85, 0.3)',
        },
        warning: {
            bg: 'rgba(251, 146, 60, 0.1)',
            border: 'rgba(251, 146, 60, 0.4)',
            color: '#fb923c',
            glow: '0 0 10px rgba(251, 146, 60, 0.3)',
        },
        info: {
            bg: 'rgba(0, 217, 255, 0.1)',
            border: 'rgba(0, 217, 255, 0.4)',
            color: '#00d9ff',
            glow: '0 0 10px rgba(0, 217, 255, 0.3)',
        },
        danger: {
            bg: 'rgba(255, 0, 85, 0.1)',
            border: 'rgba(255, 0, 85, 0.4)',
            color: '#ff0055',
            glow: '0 0 10px rgba(255, 0, 85, 0.3)',
        },
        neutral: {
            bg: 'rgba(255, 255, 255, 0.05)',
            border: 'rgba(255, 255, 255, 0.2)',
            color: 'rgba(255, 255, 255, 0.8)',
            glow: '0 0 10px rgba(255, 255, 255, 0.1)',
        }
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base'
    };

    const style = variants[variant];
    const sizeClass = sizes[size];

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: 1,
                scale: 1,
                boxShadow: pulse ? [style.glow, `0 0 20px ${style.border}`, style.glow] : style.glow
            }}
            transition={{
                duration: 0.3,
                boxShadow: {
                    duration: 2,
                    repeat: pulse ? Infinity : 0,
                    ease: 'easeInOut'
                }
            }}
            className={`
                ${sizeClass}
                rounded-full
                font-semibold
                inline-flex
                items-center
                gap-1
                backdrop-blur-sm
                ${className}
            `}
            style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                color: style.color,
                boxShadow: style.glow,
            }}
        >
            {pulse && (
                <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: style.color }}
                />
            )}
            {children}
        </motion.span>
    );
};

export default NeonBadge;
